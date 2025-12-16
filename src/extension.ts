import * as vscode from 'vscode';
import { TestCodeLensProvider } from './testCodeLensProvider';
import { TestRunner } from './testRunner';

export function activate(context: vscode.ExtensionContext) {
    const testRunner = new TestRunner();
    const codeLensProvider = new TestCodeLensProvider(testRunner);
    
    // Register CodeLens provider for TypeScript and JavaScript files
    const codeLensProviderDisposable = vscode.languages.registerCodeLensProvider(
        [
            { scheme: 'file', language: 'typescript' },
            { scheme: 'file', language: 'javascript' }
        ],
        codeLensProvider
    );

    // Register command to run test
    const runTestCommand = vscode.commands.registerCommand(
        'runSingleTest.runTest',
        async (testName: string, filePath: string, lineNumber: number) => {
            await testRunner.runTest(testName, filePath, lineNumber);
        }
    );

    // Register command to run test from explorer (right-click)
    const runTestFromExplorerCommand = vscode.commands.registerCommand(
        'runSingleTest.runTestFromExplorer',
        async (resourceUri: vscode.Uri) => {
            await testRunner.runTestFromExplorer(resourceUri);
        }
    );

    context.subscriptions.push(codeLensProviderDisposable, runTestCommand, runTestFromExplorerCommand);
}

export function deactivate() {}

