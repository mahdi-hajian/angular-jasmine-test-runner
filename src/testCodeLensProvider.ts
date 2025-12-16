import * as vscode from 'vscode';
import { TestRunner } from './testRunner';

export class TestCodeLensProvider implements vscode.CodeLensProvider {
    private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
    public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;

    constructor(private testRunner: TestRunner) {
        // Refresh code lenses when document changes
        vscode.workspace.onDidChangeTextDocument(() => {
            this._onDidChangeCodeLenses.fire();
        });
    }

    provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeLens[]> {
        const codeLenses: vscode.CodeLens[] = [];
        const text = document.getText();
        const lines = text.split('\n');

        // Regular expression to match describe blocks (only top-level/main describe)
        const describeRegex = /^\s*(fdescribe|describe|ddescribe)\s*\(['"`]([^'"`]+)['"`]\s*,/;

        // Find only the first (main) describe block in the file
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const describeMatch = line.match(describeRegex);
            
            if (describeMatch) {
                // Found the first describe block - add code lens only for this one
                const testName = describeMatch[2];
                const lineNumber = i;
                const range = new vscode.Range(lineNumber, 0, lineNumber, line.length);
                
                // Add Run Test File code lens
                const runCodeLens = new vscode.CodeLens(range, {
                    title: `▶ Run Test File`,
                    command: 'runSingleTest.runTest',
                    arguments: [testName, document.fileName, lineNumber]
                });
                codeLenses.push(runCodeLens);
                
                // Only show code lens for the first describe, so break after finding it
                break;
            }
        }

        return codeLenses;
    }

}

