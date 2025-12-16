import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { spawn } from 'child_process';

export class TestRunner {
    private outputChannel: vscode.OutputChannel;
    private currentProcess: any = null;

    constructor() {
        this.outputChannel = vscode.window.createOutputChannel('Run Single Test');
    }

    stopTest(): void {
        if (this.currentProcess) {
            this.outputChannel.appendLine('');
            this.outputChannel.appendLine('Stopping test execution...');
            this.currentProcess.kill();
            this.currentProcess = null;
            vscode.window.showInformationMessage('Test execution stopped.');
        }
    }

    async runTest(testName: string, filePath: string, lineNumber: number): Promise<void> {
        try {
            this.outputChannel.clear();
            this.outputChannel.show(true);
            this.outputChannel.appendLine(`Running test file: ${testName}`);
            this.outputChannel.appendLine(`File: ${filePath}`);
            this.outputChannel.appendLine('');

            const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(filePath));
            if (!workspaceFolder) {
                vscode.window.showErrorMessage('No workspace folder found');
                return;
            }

            const config = vscode.workspace.getConfiguration('runSingleTest');
            const ngTestCommand = config.get<string>('ngTestCommand', 'node --max_old_space_size=15360 node_modules/@angular/cli/bin/ng test');
            const libraryName = config.get<string>('libraryName', ''); // Use empty string if not set, don't ask user
            const ngTestArgs = config.get<string>('ngTestArgs', '--configuration=withConfig --browsers=ChromeDebug');

            // Get relative file path for --include
            const relativeFilePath = path.relative(workspaceFolder.uri.fsPath, filePath);
            
            // Build ng test command with --include filter
            const commandArgs = this.buildNgTestArgs(ngTestCommand, libraryName, ngTestArgs, relativeFilePath);
            
            this.outputChannel.appendLine(`Command: ${commandArgs.command} ${commandArgs.args.join(' ')}`);
            this.outputChannel.appendLine('');

            // Show progress
            vscode.window.showInformationMessage(`Running test file: ${relativeFilePath}...`);

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

    private buildNgTestArgs(ngTestCommand: string, libraryName: string, ngTestArgs: string, filePath: string): { command: string; args: string[] } {
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

        // Add --include to filter the specific test file
        // This tells Angular CLI to only run tests from this file
        args.push('--include', filePath);

        return { command, args };
    }

    private executeCommand(command: string, args: string[], cwd: string): Promise<void> {
        return new Promise((resolve, reject) => {
            // Stop any existing process
            if (this.currentProcess) {
                this.currentProcess.kill();
            }

            this.outputChannel.appendLine(`Executing in: ${cwd}`);
            this.outputChannel.appendLine('');

            const process = spawn(command, args, {
                cwd,
                shell: true,
                stdio: 'pipe'
            });

            this.currentProcess = process;

            let hasError = false;
            let wasStopped = false;

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
                this.currentProcess = null;
                reject(error);
            });

            process.on('close', (code, signal) => {
                this.currentProcess = null;

                if (hasError) {
                    return;
                }

                // Check if process was killed
                if (signal === 'SIGTERM' || signal === 'SIGKILL') {
                    wasStopped = true;
                    this.outputChannel.appendLine('');
                    this.outputChannel.appendLine('Test execution stopped by user.');
                    resolve();
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

