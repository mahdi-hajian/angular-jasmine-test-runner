import * as vscode from 'vscode';

export class TerminalExecutor {
    private currentTerminal: vscode.Terminal | null = null;

    public async execute(command: string, cwd: string): Promise<void> {
        this.disposeCurrentTerminal();
        this.createAndShowTerminal(cwd);
        this.sendCommand(command);
    }

    private disposeCurrentTerminal(): void {
        if (this.currentTerminal) {
            this.currentTerminal.dispose();
            this.currentTerminal = null;
        }
    }

    private createAndShowTerminal(cwd: string): void {
        this.currentTerminal = vscode.window.createTerminal({
            name: 'Angular Jasmine Test Runner',
            cwd: cwd
        });
        this.currentTerminal.show();
    }

    private sendCommand(command: string): void {
        if (this.currentTerminal) {
            this.currentTerminal.sendText(command, true);
        }
    }
}

