# Angular Jasmine Test Runner

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/mahdi-hajian/vscode-run-single-test)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-%3E%3D1.74.0-blue.svg)](https://code.visualstudio.com/)

A VS Code extension for running individual Angular/Jasmine/Karma tests with a single click.

## ✨ Features

- 🚀 **Quick Test Execution**: Run test files or folders with a single click
- 📝 **CodeLens Integration**: Display "Run Test File" link above `describe` blocks
- 📂 **File Explorer Support**: Run tests from the right-click context menu in File Explorer
- ⚙️ **Flexible Configuration**: Support for npm scripts and direct `ng test` commands
- 🔍 **Auto-detection**: Automatically detect library name from test file path
- 📊 **Clear Output**: Display results in Output Panel and Terminal

## 🚀 Installation

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X` or `Cmd+Shift+X`)
3. Search for "Angular Jasmine Test Runner"
4. Click Install

## 🎯 Usage

### Running Tests from Editor

1. Open a test file (`.spec.ts` or `.test.ts`) in VS Code
2. You will see a **"▶ Run Test File"** link above the first `describe` block
3. Click the link to run the test file

### Running Tests from File Explorer

1. Right-click on a test file (`.spec.ts` or `.test.ts`)
2. Select **"Run Tests"** from the context menu
3. You can also right-click on a folder to run all tests within that folder

### Example

```typescript
describe('MyComponent', () => {
  // ▶ Run Test File  <-- Click here
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  describe('nested suite', () => {
    it('should do something', () => {
      // ...
    });
  });
});
```

## ⚙️ Configuration

You can configure the extension through VS Code Settings (`Ctrl+,` or `Cmd+,`). Search for `runSingleTest` to find all available settings.

### Option 1: Using npm Scripts

If you use npm scripts in your `package.json`:

```json
{
  "runSingleTest.usePackageJsonScript": true,
  "runSingleTest.packageJsonScript": "test"
}
```

This configuration will execute:
```bash
npm run test -- --include <filePath>
```

**Settings:**
- `runSingleTest.usePackageJsonScript`: Set to `true` to use npm script (default: `false`)
- `runSingleTest.packageJsonScript`: Name of the script in package.json (default: `test`)

### Option 2: Using Direct ng test Command (Default)

```json
{
  "runSingleTest.usePackageJsonScript": false,
  "runSingleTest.ngTestCommand": "node --max_old_space_size=15360 node_modules/@angular/cli/bin/ng test",
  "runSingleTest.libraryName": "my-library",
  "runSingleTest.ngTestArgs": "--configuration=withConfig --browsers=ChromeDebug",
  "runSingleTest.autoDetectLibraryName": false
}
```

**Settings:**

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `runSingleTest.usePackageJsonScript` | boolean | `false` | Use npm script instead of direct command |
| `runSingleTest.ngTestCommand` | string | `node --max_old_space_size=15360 node_modules/@angular/cli/bin/ng test` | Full command to run ng test |
| `runSingleTest.libraryName` | string | `""` | Library/project name for ng test (e.g., `bdmp`) |
| `runSingleTest.autoDetectLibraryName` | boolean | `false` | Automatically detect library name from file path |
| `runSingleTest.ngTestArgs` | string | `--configuration=withConfig --browsers=ChromeDebug` | Additional arguments for ng test |

### Auto-detect Library Name

If you set `autoDetectLibraryName` to `true`, the library name will be automatically extracted from the first folder in the test file path:

**Example:**
- Test file: `termeh-patterns/src/lib/search/trp-search.component.spec.ts`
- Library name: `termeh-patterns` (automatically detected)

## 🔧 How It Works

The extension uses CodeLens to display test run links above test blocks. When you click the link:

1. The test file path is extracted
2. The `ng test` command is built with `--include` filter to run only that test file
3. The command is executed in Terminal and output is displayed in the Output Panel

### Example Generated Command

For a test file `my-component.spec.ts`, the following command will be executed:

```bash
node --max_old_space_size=15360 node_modules/@angular/cli/bin/ng test my-library --configuration=withConfig --browsers=ChromeDebug --include path/to/my-component.spec.ts
```

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Mahdi Hajian**

- GitHub: [@mahdi-hajian](https://github.com/mahdi-hajian)
