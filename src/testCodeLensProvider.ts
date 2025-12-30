import * as vscode from 'vscode';
import { TestRunner } from './testRunner';

export class TestCodeLensProvider implements vscode.CodeLensProvider {
    private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
    public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;

    constructor(private testRunner: TestRunner) {
        this.setupDocumentChangeListener();
    }

    public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeLens[]> {
        const codeLenses: vscode.CodeLens[] = [];
        const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('runSingleTest');
        const maxLinesToCheck: number = config.get<number>('maxLinesToCheck', 100);
        const lineCount: number = Math.min(document.lineCount, maxLinesToCheck);
        const describeRegex: RegExp = /^\s*(?:fdescribe|describe|xdescribe)\s*\(['"`]([^'"`]+)['"`]\s*,/;

        for (let i = 0; i < lineCount; i++) {
            const line: vscode.TextLine = document.lineAt(i);
            const lineText: string = line.text;
            
            if (!lineText.includes('describe')) {
                continue;
            }
            
            const describeMatch: RegExpMatchArray | null = lineText.match(describeRegex);
            
            if (describeMatch) {
                const testName: string = describeMatch[1];
                const range: vscode.Range = new vscode.Range(i, 0, i, lineText.length);
                const runCodeLens: vscode.CodeLens = new vscode.CodeLens(range, {
                    title: `▶ Run Test File`,
                    command: 'runSingleTest.runTest',
                    arguments: [testName, document.fileName, i]
                });
                codeLenses.push(runCodeLens);
                break;
            }
        }

        return codeLenses;
    }

    private setupDocumentChangeListener(): void {
        vscode.workspace.onDidChangeTextDocument(() => {
            this._onDidChangeCodeLenses.fire();
        });
    }
}
