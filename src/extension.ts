import * as vscode from 'vscode';
import { TestRunner } from './testRunner';

export function activate(context: vscode.ExtensionContext) {
    const testRunner = new TestRunner();

    // Register command to run test from explorer (right-click)
    const runTestFromExplorerCommand = vscode.commands.registerCommand(
        'runSingleTest.runTestFromExplorer',
        async (resourceUri: vscode.Uri) => {
            await testRunner.runTestFromExplorer(resourceUri);
        }
    );

    // Register command to run test from editor tab
    const runTestFromEditorCommand = vscode.commands.registerCommand(
        'runSingleTest.runTestFromEditor',
        async () => {
            const activeEditor = vscode.window.activeTextEditor;
            if (!activeEditor) {
                vscode.window.showWarningMessage('No active editor found.');
                return;
            }

            const document = activeEditor.document;
            const fileName = document.fileName;
            
            // Check if file is a test file
            if (!fileName.match(/\.(spec|test)\.(ts|js)$/)) {
                vscode.window.showWarningMessage('This is not a test file.');
                return;
            }

            const resourceUri = vscode.Uri.file(fileName);
            await testRunner.runTestFromExplorer(resourceUri);
        }
    );

    context.subscriptions.push(runTestFromExplorerCommand, runTestFromEditorCommand);
}

export function deactivate() {}

