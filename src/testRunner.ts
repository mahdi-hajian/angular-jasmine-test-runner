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
            const karmaConfigPath = config.get<string>('karmaConfigPath', 'karma.conf.js');
            const karmaCommand = config.get<string>('karmaCommand', 'npm test');

            const fullKarmaConfigPath = path.join(workspaceFolder.uri.fsPath, karmaConfigPath);
            
            // Check if karma config exists
            if (!fs.existsSync(fullKarmaConfigPath)) {
                vscode.window.showWarningMessage(
                    `Karma config not found at ${karmaConfigPath}. Using default configuration.`
                );
            }

            // Escape test name for grep pattern
            const escapedTestName = this.escapeTestName(testName);
            
            // Build karma command with grep filter
            // Karma supports --grep option to filter tests
            const relativeFilePath = path.relative(workspaceFolder.uri.fsPath, filePath);
            
            // Try different approaches to run the specific test
            // Method 1: Use karma --grep option
            const karmaArgs = this.buildKarmaArgs(karmaCommand, escapedTestName, relativeFilePath);
            
            this.outputChannel.appendLine(`Command: ${karmaArgs.command} ${karmaArgs.args.join(' ')}`);
            this.outputChannel.appendLine('');

            // Show progress
            vscode.window.showInformationMessage(`Running test: ${testName}...`);

            // Execute karma
            await this.executeCommand(
                karmaArgs.command,
                karmaArgs.args,
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

    private buildKarmaArgs(karmaCommand: string, testName: string, filePath: string): { command: string; args: string[] } {
        // Parse the karma command (could be "npm test", "npx karma", "ng test", etc.)
        const parts = karmaCommand.split(/\s+/);
        const command = parts[0];
        const existingArgs = parts.slice(1);

        // Build arguments
        const args = [...existingArgs];

        // Handle different command types
        if (command === 'ng') {
            // Angular CLI: ng test --include='**/file.spec.ts' --grep='test name'
            // Note: Angular CLI might need different approach
            // For now, we'll use --grep which should work with karma-jasmine
            if (!args.includes('--grep')) {
                args.push('--grep', testName);
            }
        } else if (command === 'npm' || command === 'yarn') {
            // npm/yarn: need to pass -- to forward arguments
            if (!args.includes('--')) {
                args.push('--');
            }
            // Add karma-specific arguments after --
            args.push('--grep', testName);
        } else if (command === 'npx') {
            // npx karma --grep='test name'
            if (existingArgs.length === 0 || !existingArgs[0].includes('karma')) {
                // If karma is not in args, assume it's 'npx karma'
                args.push('karma');
            }
            args.push('--grep', testName);
        } else {
            // Direct karma command or custom script
            // Try to add --grep
            args.push('--grep', testName);
        }

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

