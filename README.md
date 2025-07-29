# Noteskeep VS Code Extension

A collection of tools for managing notes within VS Code, with a focus on Markdown files.

This extension is designed to be extensible with new features over time.

## Features

- **Fold HTML Comments:** Automatically folds all HTML comments (`<!-- ... -->`) in Markdown files by default to keep your documents clean and readable.

## Commands

- `noteskeep.foldAll`: Folds all HTML comments in the active Markdown editor.
- `noteskeep.unfoldAll`: Unfolds all HTML comments in the active Markdown editor.
- `noteskeep.toggleFold`: Toggles the fold state of the HTML comment under the cursor.

## Contributions

Contributions are welcome!

### Developer Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/robertarles/noteskeep.vscode.git
   ```
2. Navigate to the project directory:
   ```bash
   cd noteskeep.vscode
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Open the project in VS Code.
5. Press `F5` to open a new Extension Development Host window with the extension running.

### Manual Installation for Local Testing

To test the extension locally without launching a separate development host, you can package it and install it manually.

1. **Package the extension:**
   First, you need to install the `vsce` packaging tool globally:
   ```bash
   npm install -g @vscode/vsce
   ```
   Then, run the packaging command in the project root:
   ```bash
   vsce package
   ```
   This will create a `.vsix` file (e.g., `noteskeep.vscode-0.0.1.vsix`).

2. **Install the VSIX file:**
   In VS Code, open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and run the **"Extensions: Install from VSIX..."** command. Select the `.vsix` file you just created.

3. **Reload VS Code:**
   After installation, you will be prompted to reload VS Code to activate the extension.
