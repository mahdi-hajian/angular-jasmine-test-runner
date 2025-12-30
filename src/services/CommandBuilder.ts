import { TestConfig } from './ConfigService';

export interface CommandResult {
    command: string;
    args: string[];
}

export class CommandBuilder {
    public static buildPackageJsonScriptCommand(scriptName: string, filePath: string): string {
        return `npm run ${scriptName} -- --include ${filePath}`;
    }

    public static buildNgTestCommand(config: TestConfig, libraryName: string, filePath: string): CommandResult {
        const parts = config.ngTestCommand.trim().split(/\s+/);
        const command = parts[0];
        const commandParts = parts.slice(1);
        const testIndex = commandParts.indexOf('test');
        
        const args: string[] = [];

        if (testIndex >= 0) {
            args.push(...commandParts.slice(0, testIndex + 1));
            if (libraryName) {
                args.push(libraryName);
            }
        } else {
            args.push(...commandParts);
            args.push('test');
            if (libraryName) {
                args.push(libraryName);
            }
        }

        if (config.ngTestArgs && config.ngTestArgs.trim()) {
            const additionalArgs = config.ngTestArgs.trim().split(/\s+/).filter(arg => arg.length > 0);
            args.push(...additionalArgs);
        }

        args.push('--include', filePath);

        return { command, args };
    }

    public static buildFullCommand(config: TestConfig, libraryName: string, filePath: string): string {
        if (config.usePackageJsonScript) {
            return this.buildPackageJsonScriptCommand(config.packageJsonScript, filePath);
        } else {
            const commandArgs = this.buildNgTestCommand(config, libraryName, filePath);
            return `${commandArgs.command} ${commandArgs.args.join(' ')}`;
        }
    }
}

