import * as vscode from 'vscode';

export class OutputChannelManager {
    private outputChannel: vscode.OutputChannel;

    constructor(channelName: string) {
        this.outputChannel = vscode.window.createOutputChannel(channelName);
    }

    public clear(): void {
        this.outputChannel.clear();
    }

    public show(): void {
        this.outputChannel.show(true);
    }

    public appendLine(line: string): void {
        this.outputChannel.appendLine(line);
    }

    public logTestExecution(isDirectory: boolean, relativePath: string, command: string): void {
        this.appendLine(`Running tests from: ${isDirectory ? 'folder' : 'file'}`);
        this.appendLine(`Path: ${relativePath}`);
        this.appendLine(`Command: ${command}`);
        this.appendLine('');
    }

    public logError(errorMessage: string): void {
        this.appendLine(`ERROR: ${errorMessage}`);
    }

    public logCommandExecuted(): void {
        this.appendLine('Command executed in terminal. You can stop it with Ctrl+C in the terminal.');
    }
}

