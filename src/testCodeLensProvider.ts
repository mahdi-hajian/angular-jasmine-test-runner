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
        
        // Optimized: Only check first 200 lines (describe is usually at the top)
        const maxLinesToCheck = 50;
        const lineCount = Math.min(document.lineCount, maxLinesToCheck);
        
        // Pre-compiled regex for better performance
        const describeRegex = /^\s*(?:fdescribe|describe|ddescribe)\s*\(['"`]([^'"`]+)['"`]\s*,/;

        // Find only the first (main) describe block in the file
        for (let i = 0; i < lineCount; i++) {
            const line = document.lineAt(i);
            const lineText = line.text;
            
            // Quick check: skip if line doesn't contain "describe"
            if (!lineText.includes('describe')) {
                continue;
            }
            
            const describeMatch = lineText.match(describeRegex);
            
            if (describeMatch) {
                // Found the first describe block - add code lens only for this one
                const testName = describeMatch[1];
                const range = new vscode.Range(i, 0, i, lineText.length);
                
                // Add Run Test File code lens
                const runCodeLens = new vscode.CodeLens(range, {
                    title: `▶ Run Test File`,
                    command: 'runSingleTest.runTest',
                    arguments: [testName, document.fileName, i]
                });
                codeLenses.push(runCodeLens);
                
                // Only show code lens for the first describe, so break after finding it
                break;
            }
        }

        return codeLenses;
    }

}

