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

        // Regular expressions to match describe and it blocks
        const describeRegex = /^\s*(fdescribe|describe|ddescribe)\s*\(['"`]([^'"`]+)['"`]\s*,/;
        const itRegex = /^\s*(fit|it|xit)\s*\(['"`]([^'"`]+)['"`]\s*,/;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lineNumber = i;
            const range = new vscode.Range(lineNumber, 0, lineNumber, line.length);

            // Check for describe blocks
            const describeMatch = line.match(describeRegex);
            if (describeMatch) {
                const testName = describeMatch[2];
                const fullTestName = this.getFullTestName(lines, lineNumber, testName);
                
                const codeLens = new vscode.CodeLens(range, {
                    title: `▶ Run: ${testName}`,
                    command: 'runSingleTest.runTest',
                    arguments: [fullTestName, document.fileName, lineNumber]
                });
                codeLenses.push(codeLens);
            }

            // Check for it blocks
            const itMatch = line.match(itRegex);
            if (itMatch) {
                const testName = itMatch[2];
                const fullTestName = this.getFullTestName(lines, lineNumber, testName);
                
                const codeLens = new vscode.CodeLens(range, {
                    title: `▶ Run: ${testName}`,
                    command: 'runSingleTest.runTest',
                    arguments: [fullTestName, document.fileName, lineNumber]
                });
                codeLenses.push(codeLens);
            }
        }

        return codeLenses;
    }

    /**
     * Builds the full test name including parent describe blocks
     */
    private getFullTestName(lines: string[], currentLine: number, testName: string): string {
        const describeStack: string[] = [];
        const describeRegex = /^\s*(?:fdescribe|describe|ddescribe)\s*\(['"`]([^'"`]+)['"`]\s*,/;
        
        // Find all parent describe blocks
        for (let i = 0; i < currentLine; i++) {
            const match = lines[i].match(describeRegex);
            if (match) {
                describeStack.push(match[1]);
            }
        }

        // Build full test name: "Parent Describe > Child Describe > Test Name"
        if (describeStack.length > 0) {
            return `${describeStack.join(' > ')} > ${testName}`;
        }
        return testName;
    }
}

