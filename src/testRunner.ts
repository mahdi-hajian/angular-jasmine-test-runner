import * as vscode from 'vscode';
import { ConfigService, TestConfig } from './services/ConfigService';
import { ConfigValidator } from './services/ConfigValidator';
import { LibraryNameExtractor } from './services/LibraryNameExtractor';
import { CommandBuilder } from './services/CommandBuilder';
import { TerminalExecutor } from './services/TerminalExecutor';
import { OutputChannelManager } from './services/OutputChannelManager';
import { PathResolver } from './services/PathResolver';

export class TestRunner {
    private outputChannelManager: OutputChannelManager;
    private terminalExecutor: TerminalExecutor;

    constructor() {
        this.outputChannelManager = new OutputChannelManager('Angular Jasmine Test Runner');
        this.terminalExecutor = new TerminalExecutor();
    }

    public async runTestFromExplorer(resourceUri: vscode.Uri): Promise<void> {
        try {
            const isDirectory: boolean = PathResolver.isDirectory(resourceUri);
            const workspaceFolder: vscode.WorkspaceFolder | undefined = vscode.workspace.getWorkspaceFolder(resourceUri);
            
            if (!workspaceFolder) {
                vscode.window.showErrorMessage('No workspace folder found');
                return;
            }

            const config: TestConfig = ConfigService.getConfig();
            const relativePath: string = PathResolver.getRelativePath(workspaceFolder, resourceUri);
            
            let libraryName: string = config.libraryName;
            
            if (config.autoDetectLibraryName && !libraryName) {
                libraryName = LibraryNameExtractor.extractFromPath(relativePath);
            }

            if (!ConfigValidator.validateForDirectNgTest(config, libraryName)) {
                return;
            }

            if (!ConfigValidator.validatePackageJsonScript(config)) {
                return;
            }

            const includePattern: string = PathResolver.buildIncludePattern(relativePath, isDirectory);
            const fullCommand: string = CommandBuilder.buildFullCommand(config, libraryName, includePattern);

            this.outputChannelManager.clear();
            this.outputChannelManager.show();
            this.outputChannelManager.logTestExecution(isDirectory, relativePath, fullCommand);

            vscode.window.showInformationMessage(`Running tests from ${relativePath}...`);

            await this.terminalExecutor.execute(fullCommand, workspaceFolder.uri.fsPath);
            this.outputChannelManager.logCommandExecuted();

        } catch (error) {
            this.handleError(error);
        }
    }

    public async runTest(testName: string, filePath: string, lineNumber: number): Promise<void> {
        try {
            this.outputChannelManager.clear();
            this.outputChannelManager.show();
            this.outputChannelManager.appendLine(`Running test file: ${testName}`);
            this.outputChannelManager.appendLine(`File: ${filePath}`);
            this.outputChannelManager.appendLine('');

            const workspaceFolder: vscode.WorkspaceFolder | undefined = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(filePath));
            
            if (!workspaceFolder) {
                vscode.window.showErrorMessage('No workspace folder found');
                return;
            }

            const config: TestConfig = ConfigService.getConfig();
            const relativeFilePath: string = PathResolver.getRelativeFilePath(workspaceFolder, filePath);
            
            let libraryName: string = config.libraryName;
            
            if (config.autoDetectLibraryName && !libraryName) {
                libraryName = LibraryNameExtractor.extractFromPath(relativeFilePath);
            }

            if (!ConfigValidator.validateForDirectNgTest(config, libraryName)) {
                return;
            }

            const fullCommand: string = CommandBuilder.buildFullCommand(config, libraryName, relativeFilePath);
            
            this.outputChannelManager.appendLine(`Command: ${fullCommand}`);
            this.outputChannelManager.appendLine('');

            vscode.window.showInformationMessage(`Running test file: ${relativeFilePath}...`);

            await this.terminalExecutor.execute(fullCommand, workspaceFolder.uri.fsPath);
            this.outputChannelManager.logCommandExecuted();

        } catch (error) {
            this.handleError(error);
        }
    }

    private handleError(error: unknown): void {
        const errorMessage: string = error instanceof Error ? error.message : String(error);
        vscode.window.showErrorMessage(`Error running test: ${errorMessage}`);
        this.outputChannelManager.logError(errorMessage);
    }
}
