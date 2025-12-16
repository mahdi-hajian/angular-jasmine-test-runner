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

    context.subscriptions.push(runTestFromExplorerCommand);
}

export function deactivate() {}

