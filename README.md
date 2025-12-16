# Run Single Test - VS Code Extension

A VS Code extension for running individual Angular/Jasmine/Karma tests.

## Features

- Display "▶ Run Test File" icon above the main `describe` block
- Run specific test files with a single click
- Support for `describe`, `fdescribe`
- Display test output in the Output panel

## Installation

1. Clone or download this repository
2. Run in terminal:
   ```bash
   npm install
   npm run compile
   ```
3. In VS Code, press `F5` to open the extension in Extension Development Host window

## Usage

1. Open an Angular/Jasmine test file
2. A "▶ Run Test File" link will appear above the first `describe` block
3. Click the link to run the test file
4. Output will be displayed in the Output panel named "Run Single Test"

## Configuration

In VS Code settings you can change the following:

### Option 1: Use npm script from package.json

- `runSingleTest.usePackageJsonScript`: Set to `true` to use npm script (default: `false`)
- `runSingleTest.packageJsonScript`: Name of the script in package.json (default: `test`)

Example:
```json
{
  "runSingleTest.usePackageJsonScript": true,
  "runSingleTest.packageJsonScript": "test"
}
```

This will execute: `npm run test -- --include <filePath>`

### Option 2: Use direct ng test command (default)

- `runSingleTest.usePackageJsonScript`: Set to `false` (default)
- `runSingleTest.ngTestCommand`: Full command to run ng test (default: `node --max_old_space_size=15360 node_modules/@angular/cli/bin/ng test`)
- `runSingleTest.libraryName`: Library/project name for ng test (example: `bdmp`)
- `runSingleTest.ngTestArgs`: Additional arguments for ng test (default: `--configuration=withConfig --browsers=ChromeDebug`)

Example:
```json
{
  "runSingleTest.usePackageJsonScript": false,
  "runSingleTest.ngTestCommand": "node --max_old_space_size=15360 node_modules/@angular/cli/bin/ng test",
  "runSingleTest.libraryName": "bdmp",
  "runSingleTest.ngTestArgs": "--configuration=withConfig --browsers=ChromeDebug"
}
```

### How to Configure:

1. In VS Code, press `Ctrl+,` (or `Cmd+,` on Mac)
2. Search for: `runSingleTest`
3. Choose one of the options above and set the values accordingly

## How It Works

The extension uses CodeLens to display test run links above test blocks. When you click the link, the extension:

1. Extracts the test file path
2. Builds the `ng test` command with `--include` filter to run only that test file
3. Executes the command and displays output in the Output panel

### Example Generated Command:

For a test file `my-component.spec.ts`, the following command will be executed:
```bash
node --max_old_space_size=15360 node_modules/@angular/cli/bin/ng test bdmp --configuration=withConfig --browsers=ChromeDebug --include path/to/my-component.spec.ts
```

## Example

```typescript
describe('MyComponent', () => {
  // ▶ Run Test File  <-- Click here
  
  it('should create', () => {
    // ...
  });
  
  describe('nested suite', () => {
    it('should do something', () => {
      // ...
    });
  });
});
```

## Development

```bash
# Compile
npm run compile

# Compile with watch mode
npm run watch

# Build for publishing
npm run vscode:prepublish
```

## License

MIT
