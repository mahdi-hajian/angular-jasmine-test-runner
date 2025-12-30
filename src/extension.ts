import * as vscode from 'vscode';
import { TestRunner } from './testRunner';
import { TestCodeLensProvider } from './testCodeLensProvider';

export function activate(context: vscode.ExtensionContext): void {
    const testRunner: TestRunner = new TestRunner();
    const codeLensProvider: TestCodeLensProvider = new TestCodeLensProvider(testRunner);

    context.subscriptions.push(
        vscode.languages.registerCodeLensProvider(
            { pattern: '**/*.{spec,test}.{ts,js}' },
            codeLensProvider
        )
    );

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

    const runTestCommand: vscode.Disposable = vscode.commands.registerCommand(
        'runSingleTest.runTest',
        async (testName: string, filePath: string, lineNumber: number): Promise<void> => {
            await testRunner.runTest(testName, filePath, lineNumber);
        }
    );

    context.subscriptions.push(
        runTestFromExplorerCommand,
        runTestFromEditorCommand,
        runTestCommand
    );
}

export function deactivate(): void {
    // Cleanup if needed
}
