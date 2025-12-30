import * as vscode from 'vscode';
import { TestConfig } from './ConfigService';

export class ConfigValidator {
    public static validateForDirectNgTest(config: TestConfig, libraryName: string): boolean {
        if (!config.usePackageJsonScript && !config.autoDetectLibraryName && !libraryName) {
            vscode.window.showErrorMessage('Please configure either autoDetectLibraryName or libraryName.');
            return false;
        }

        if (!config.usePackageJsonScript && config.autoDetectLibraryName && !libraryName) {
            vscode.window.showErrorMessage('Cannot extract library name from path. Please configure libraryName manually.');
            return false;
        }

        return true;
    }

    public static validatePackageJsonScript(config: TestConfig): boolean {
        if (config.usePackageJsonScript && !config.packageJsonScript) {
            vscode.window.showErrorMessage('Please configure the npm script to run in package.json.');
            return false;
        }

        return true;
    }
}

