import * as vscode from 'vscode';
import { TestRunner } from './testRunner';

export function activate(context: vscode.ExtensionContext): void {
    const testRunner: TestRunner = new TestRunner();

    const runTestFromExplorerCommand: vscode.Disposable = vscode.commands.registerCommand(
        'runSingleTest.runTestFromExplorer',
        async (resourceUri: vscode.Uri): Promise<void> => {
            await testRunner.runTestFromExplorer(resourceUri);
        }
    );

    const runTestFromEditorCommand: vscode.Disposable = vscode.commands.registerCommand(
        'runSingleTest.runTestFromEditor',
        async (): Promise<void> => {
            const activeEditor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
            
            if (!activeEditor) {
                vscode.window.showWarningMessage('No active editor found.');
                return;
            }

            const document: vscode.TextDocument = activeEditor.document;
            const fileName: string = document.fileName;
            
            if (!fileName.match(/\.(spec|test)\.(ts|js)$/)) {
                vscode.window.showWarningMessage('This is not a test file.');
                return;
            }

            const resourceUri: vscode.Uri = vscode.Uri.file(fileName);
            await testRunner.runTestFromExplorer(resourceUri);
        }
    );

    context.subscriptions.push(
        runTestFromExplorerCommand,
        runTestFromEditorCommand
    );
}

export function deactivate(): void {
    // Cleanup if needed
}
