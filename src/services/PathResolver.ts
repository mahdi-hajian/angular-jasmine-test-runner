import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';

export class PathResolver {
    public static isDirectory(resourceUri: vscode.Uri): boolean {
        const stat = fs.statSync(resourceUri.fsPath);
        return stat.isDirectory();
    }

    public static getRelativePath(workspaceFolder: vscode.WorkspaceFolder, resourceUri: vscode.Uri): string {
        return path.relative(workspaceFolder.uri.fsPath, resourceUri.fsPath);
    }

    public static getRelativeFilePath(workspaceFolder: vscode.WorkspaceFolder, filePath: string): string {
        return path.relative(workspaceFolder.uri.fsPath, filePath);
    }

    public static buildIncludePattern(relativePath: string, isDirectory: boolean): string {
        if (isDirectory) {
            return `${relativePath}/**/*.spec.ts`;
        }
        return relativePath;
    }
}

