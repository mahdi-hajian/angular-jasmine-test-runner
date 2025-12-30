import * as vscode from 'vscode';

export interface TestConfig {
    usePackageJsonScript: boolean;
    packageJsonScript: string;
    ngTestCommand: string;
    autoDetectLibraryName: boolean;
    libraryName: string;
    ngTestArgs: string;
}

export class ConfigService {
    public static getConfig(): TestConfig {
        const config = vscode.workspace.getConfiguration('runSingleTest');
        
        return {
            usePackageJsonScript: config.get<boolean>('usePackageJsonScript', false),
            packageJsonScript: config.get<string>('packageJsonScript', 'test'),
            ngTestCommand: config.get<string>('ngTestCommand', 'node --max_old_space_size=15360 node_modules/@angular/cli/bin/ng test'),
            autoDetectLibraryName: config.get<boolean>('autoDetectLibraryName', false),
            libraryName: config.get<string>('libraryName', ''),
            ngTestArgs: config.get<string>('ngTestArgs', '--configuration=withConfig --browsers=ChromeDebug')
        };
    }
}

