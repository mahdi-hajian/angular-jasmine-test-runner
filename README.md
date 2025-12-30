# Angular Jasmine Test Runner

[![Version](https://img.shields.io/badge/version-1.0.1-blue.svg)](https://github.com/mahdi-hajian/vscode-run-single-test)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-%3E%3D1.74.0-blue.svg)](https://code.visualstudio.com/)

A VS Code extension that lets you run individual Angular/Jasmine/Karma test files with a single click - no need to run the entire test suite!

## ✨ Features

- 🚀 **One-Click Test Execution**: Run test files or entire folders instantly
- 📂 **Right-Click Menu**: Run tests from File Explorer context menu
- 🎯 **Editor Title Bar**: Run tests directly from the editor using the beaker icon button
- ⚙️ **Flexible Setup**: Works with npm scripts or direct Angular CLI commands
- 🔍 **Smart Detection**: Automatically detects library name from file path
- 📊 **Clear Output**: View results in Output Panel and Terminal

## 🚀 Quick Start

### Step 1: Install the Extension

1. Open VS Code
2. Press `Ctrl+Shift+X` (or `Cmd+Shift+X` on Mac) to open Extensions
3. Search for **"Angular Jasmine Test Runner"**
4. Click **Install**

### Step 2: Configure (Choose One Method)

#### Method A: Using npm Scripts (Easiest)

If you already have a test script in your `package.json`:

1. Open VS Code Settings (`Ctrl+,` or `Cmd+,`)
2. Search for `runSingleTest`
3. Set these values:
   - ✅ `runSingleTest.usePackageJsonScript`: `true`
   - `runSingleTest.packageJsonScript`: `test` (or your script name)

**That's it!** You're ready to use the extension.

#### Method B: Using Direct Angular CLI Command

1. Open VS Code Settings (`Ctrl+,` or `Cmd+,`)
2. Search for `runSingleTest`
3. Configure one of these options:

**Option 1: Auto-detect Library Name (Recommended)**
- ✅ `runSingleTest.autoDetectLibraryName`: `true`
- `runSingleTest.usePackageJsonScript`: `false`

**Option 2: Manual Library Name**
- `runSingleTest.libraryName`: `your-library-name` (e.g., `my-app`, `shared-lib`)
- `runSingleTest.autoDetectLibraryName`: `false`
- `runSingleTest.usePackageJsonScript`: `false`

### Step 3: Run Your Tests!

#### Method 1: From File Explorer (Right-Click)

1. Open File Explorer in VS Code (`Ctrl+Shift+E` or `Cmd+Shift+E`)
2. Right-click on a test file (`.spec.ts` or `.test.ts`)
3. Select **"Run Tests"** from the context menu
4. Or right-click on a folder to run all tests in that folder

#### Method 2: From Editor Title Bar

1. Open any test file (`.spec.ts` or `.test.ts`) in the editor
2. Look for the **"Run Tests"** button (beaker icon) in the editor title bar
3. Click it!

## 📖 Detailed Usage Guide

### Running a Single Test File

**From File Explorer:**
- Right-click on the test file
- Click "Run Tests"

**From Editor:**
- Open the test file
- Click the "Run Tests" button in the editor title bar

### Running All Tests in a Folder

1. Right-click on a folder in File Explorer
2. Select "Run Tests"
3. All `.spec.ts` files in that folder will run

## ⚙️ Configuration Reference

### All Available Settings

Open VS Code Settings (`Ctrl+,`) and search for `runSingleTest`:

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `runSingleTest.usePackageJsonScript` | boolean | `false` | Use npm script instead of direct ng test command |
| `runSingleTest.packageJsonScript` | string | `"test"` | Name of the npm script in package.json |
| `runSingleTest.ngTestCommand` | string | `"node --max_old_space_size=15360 node_modules/@angular/cli/bin/ng test"` | Full command to run ng test |
| `runSingleTest.libraryName` | string | `""` | Library/project name for ng test (e.g., `my-app`) |
| `runSingleTest.autoDetectLibraryName` | boolean | `false` | Automatically detect library name from file path |
| `runSingleTest.ngTestArgs` | string | `"--configuration=withConfig --browsers=ChromeDebug"` | Additional arguments for ng test |

### Configuration Examples

#### Example 1: Simple npm Script Setup

```json
{
  "runSingleTest.usePackageJsonScript": true,
  "runSingleTest.packageJsonScript": "test"
}
```

This runs: `npm run test -- --include <filePath>`

#### Example 2: Auto-detect Library Name

```json
{
  "runSingleTest.usePackageJsonScript": false,
  "runSingleTest.autoDetectLibraryName": true,
  "runSingleTest.ngTestCommand": "node --max_old_space_size=15360 node_modules/@angular/cli/bin/ng test",
  "runSingleTest.ngTestArgs": "--configuration=withConfig --browsers=ChromeDebug"
}
```

**How it works:**
- Test file: `termeh-patterns/src/lib/search/trp-search.component.spec.ts`
- Detected library: `termeh-patterns` (first folder in path)

#### Example 3: Manual Library Name

```json
{
  "runSingleTest.usePackageJsonScript": false,
  "runSingleTest.autoDetectLibraryName": false,
  "runSingleTest.libraryName": "my-library",
  "runSingleTest.ngTestCommand": "node --max_old_space_size=15360 node_modules/@angular/cli/bin/ng test",
  "runSingleTest.ngTestArgs": "--configuration=withConfig --browsers=ChromeDebug"
}
```

### Important Notes

⚠️ **Required Configuration:**
- If `usePackageJsonScript` is `false`, you **must** configure either:
  - `autoDetectLibraryName: true`, OR
  - `libraryName: "your-library-name"`

If neither is configured, you'll see an error message asking you to set one of them.

## 🔧 How It Works

1. **File Detection**: The extension detects test files (`.spec.ts` or `.test.ts`)
2. **Command Building**: It constructs the appropriate test command based on your configuration
3. **Execution**: The command runs in VS Code's integrated terminal
4. **Output**: Results appear in both the Terminal and Output Panel

### Example Generated Command

For a test file at `src/app/components/my-component.spec.ts` with library name `my-app`:

```bash
node --max_old_space_size=15360 node_modules/@angular/cli/bin/ng test my-app --configuration=withConfig --browsers=ChromeDebug --include src/app/components/my-component.spec.ts
```

## 🐛 Troubleshooting

### "Please configure either autoDetectLibraryName or libraryName"

**Problem:** You're using direct ng test command but haven't configured library name detection.

**Solution:** 
- Set `runSingleTest.autoDetectLibraryName` to `true`, OR
- Set `runSingleTest.libraryName` to your library name

### "Cannot extract library name from path"

**Problem:** Auto-detection is enabled but couldn't find a library name in the file path.

**Solution:** 
- Set `runSingleTest.libraryName` manually, OR
- Ensure your test files are in a folder structure like `library-name/src/...`

### Tests Not Running

**Check:**
1. Is the file a test file? (must end with `.spec.ts` or `.test.ts`)
2. Are your configuration settings correct?
3. Check the Output Panel for error messages
4. Make sure you're right-clicking on the file/folder in File Explorer, or using the button in the editor title bar

### "Run Tests" Button Not Showing in Editor

**Solution:**
- Make sure the file is a test file (`.spec.ts` or `.test.ts`)
- The button appears in the editor title bar when a test file is open
- Try closing and reopening the file

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Mahdi Hajian**

- GitHub: [@mahdi-hajian](https://github.com/mahdi-hajian)

---

**Enjoy faster test development! 🚀**
