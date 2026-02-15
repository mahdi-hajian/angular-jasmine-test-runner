# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.6] - 2026-02-15

### Changed
- Bump version to 1.0.6
- Updated repository URL, bugs URL, and homepage in package.json to reflect the project name `angular-jasmine-test-runner`

## [1.0.5] - 2025-01-27

### Removed
- Removed `runSingleTest.reuseTerminal` configuration option
- Removed dynamic terminal reuse logic - extension now always creates a new terminal for each test run

## [1.0.4] - 2025-01-27

### Changed
- Updated dependencies to latest compatible versions
- Optimized package size and reduced extension bundle volume

## [1.0.3] - 2025-01-27

### Added
- Expanded keywords list for better discoverability in VS Code Marketplace
- Added comprehensive tags including: typescript, spec-file, test-file, angular-cli, tdd, bdd, vscode-extension, productivity, workflow, debugging, and many more related terms

## [1.0.2] - 2024-XX-XX

### Removed
- CodeLens "Run Test File" button above describe blocks
- `runSingleTest.runTest` command (previously used by CodeLens)

## [1.0.1] - 2024-XX-XX

### Added
- Validation to ensure either `autoDetectLibraryName` or `libraryName` is configured when using direct ng test commands
- Error messages to guide users when configuration is missing

## [1.0.0] - 2024-XX-XX

### Added
- Initial release of Angular Jasmine Test Runner extension
- CodeLens integration for running tests directly from editor
- Support for running tests from File Explorer context menu
- Support for running test directories
- Configuration options for npm scripts and direct ng test commands
- Auto-detection of library name from test file path
- Output panel integration for test results
- Terminal integration for executing test commands

### Changed
- Renamed extension from "Run Single Test" to "Angular Jasmine Test Runner" to better reflect its purpose
- Updated package name from `vscode-run-single-test` to `angular-jasmine-test-runner`
- Improved documentation and README

### Features
- Run individual test files with a single click
- Support for Angular/Jasmine/Karma test frameworks
- Flexible configuration system
- Support for custom npm scripts
- Support for custom ng test command and arguments
