import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { spawn } from 'child_process';

export class TestRunner {
    private outputChannel: vscode.OutputChannel;

    constructor() {
        this.outputChannel = vscode.window.createOutputChannel('Run Single Test');
    }

    async runTest(testName: string, filePath: string, lineNumber: number): Promise<void> {
        try {
            this.outputChannel.clear();
            this.outputChannel.show(true);
            this.outputChannel.appendLine(`Running test: ${testName}`);
            this.outputChannel.appendLine(`File: ${filePath}`);
            this.outputChannel.appendLine(`Line: ${lineNumber + 1}`);
            this.outputChannel.appendLine('');

            const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(filePath));
            if (!workspaceFolder) {
                vscode.window.showErrorMessage('No workspace folder found');
                return;
            }

            const config = vscode.workspace.getConfiguration('runSingleTest');
            const ngTestCommand = config.get<string>('ngTestCommand', 'node --max_old_space_size=15360 node_modules/@angular/cli/bin/ng test');
            let libraryName = config.get<string>('libraryName', '');
            const ngTestArgs = config.get<string>('ngTestArgs', '--configuration=withConfig --browsers=ChromeDebug');

            // If library name is not set, ask user for it
            if (!libraryName || libraryName.trim() === '') {
                const input = await vscode.window.showInputBox({
                    prompt: 'نام کتابخانه را وارد کنید (Library Name)',
                    placeHolder: 'مثال: bdmp',
                    ignoreFocusOut: true
                });

                if (!input || input.trim() === '') {
                    vscode.window.showWarningMessage('اجرای تست لغو شد. نام کتابخانه الزامی است.');
                    return;
                }

                libraryName = input.trim();
                
                // Save to settings for future use
                await config.update('libraryName', libraryName, vscode.ConfigurationTarget.Workspace);
                vscode.window.showInformationMessage(`نام کتابخانه "${libraryName}" ذخیره شد.`);
            }

            // Escape test name for grep pattern
            const escapedTestName = this.escapeTestName(testName);
            
            // Build ng test command with grep filter
            const commandArgs = this.buildNgTestArgs(ngTestCommand, libraryName, ngTestArgs, escapedTestName);
            
            this.outputChannel.appendLine(`Command: ${commandArgs.command} ${commandArgs.args.join(' ')}`);
            this.outputChannel.appendLine('');

            // Show progress
            vscode.window.showInformationMessage(`Running test: ${testName}...`);

            // Execute ng test
            await this.executeCommand(
                commandArgs.command,
                commandArgs.args,
                workspaceFolder.uri.fsPath
            );

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            vscode.window.showErrorMessage(`Error running test: ${errorMessage}`);
            this.outputChannel.appendLine(`ERROR: ${errorMessage}`);
        }
    }

    private escapeTestName(testName: string): string {
        // Escape special regex characters
        return testName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    private buildNgTestArgs(ngTestCommand: string, libraryName: string, ngTestArgs: string, testName: string): { command: string; args: string[] } {
        // Parse the ng test command
        // Example: "node --max_old_space_size=15360 node_modules/@angular/cli/bin/ng test"
        const parts = ngTestCommand.trim().split(/\s+/);
        const command = parts[0]; // "node"
        const commandParts = parts.slice(1); // ["--max_old_space_size=15360", "node_modules/@angular/cli/bin/ng", "test"]

        // Find the index of "test" in the command parts
        const testIndex = commandParts.indexOf('test');
        
        // Build arguments array
        const args: string[] = [];

        if (testIndex >= 0) {
            // Add everything before "test" (node args + ng path)
            args.push(...commandParts.slice(0, testIndex + 1)); // includes "test"
            
            // Add library name right after "test" if specified
            if (libraryName) {
                args.push(libraryName);
            }
        } else {
            // "test" not found, add all parts and append "test"
            args.push(...commandParts);
            args.push('test');
            
            // Add library name if specified
            if (libraryName) {
                args.push(libraryName);
            }
        }

        // Parse and add additional ng test arguments
        if (ngTestArgs && ngTestArgs.trim()) {
            const additionalArgs = ngTestArgs.trim().split(/\s+/).filter(arg => arg.length > 0);
            args.push(...additionalArgs);
        }

        // Add --grep to filter the specific test
        // This tells karma-jasmine to only run tests matching this pattern
        args.push('--grep', testName);

        return { command, args };
    }

    private executeCommand(command: string, args: string[], cwd: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.outputChannel.appendLine(`Executing in: ${cwd}`);
            this.outputChannel.appendLine('');

            const process = spawn(command, args, {
                cwd,
                shell: true,
                stdio: 'pipe'
            });

            let hasError = false;

            process.stdout?.on('data', (data) => {
                const output = data.toString();
                this.outputChannel.append(output);
            });

            process.stderr?.on('data', (data) => {
                const output = data.toString();
                this.outputChannel.append(output);
            });

            process.on('error', (error) => {
                hasError = true;
                this.outputChannel.appendLine(`Process error: ${error.message}`);
                reject(error);
            });

            process.on('close', (code) => {
                if (hasError) {
                    return;
                }

                this.outputChannel.appendLine('');
                this.outputChannel.appendLine(`Process exited with code ${code}`);

                if (code === 0) {
                    vscode.window.showInformationMessage('Test completed successfully!');
                } else {
                    vscode.window.showWarningMessage(`Test exited with code ${code}`);
                }

                resolve();
            });
        });
    }
}

