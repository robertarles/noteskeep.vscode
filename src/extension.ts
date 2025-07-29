
import * as vscode from 'vscode';
import { HtmlCommentFoldingProvider } from './foldingProvider';

export function activate(context: vscode.ExtensionContext) {

    // Register the folding range provider for markdown files
    context.subscriptions.push(
        vscode.languages.registerFoldingRangeProvider(
            { scheme: 'file', language: 'markdown' },
            new HtmlCommentFoldingProvider()
        )
    );

    // Correctly finds HTML comments, including multi-line ones.
    const findHtmlComments = (doc: vscode.TextDocument): vscode.Range[] => {
        const text = doc.getText();
        const ranges: vscode.Range[] = [];
        const commentRegex = /<!--[\s\S]*?-->/g;
        let match;
        while ((match = commentRegex.exec(text)) !== null) {
            const start = doc.positionAt(match.index);
            const end = doc.positionAt(match.index + match[0].length);
            ranges.push(new vscode.Range(start, end));
        }
        return ranges;
    };

    // Higher-order function to wrap commands that operate on a markdown editor.
    const withMarkdownEditor = (command: (editor: vscode.TextEditor) => void) => {
        return () => {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'markdown') {
                command(editor);
            }
        };
    };

    const foldAll = withMarkdownEditor(editor => {
        // Use the built-in fold command, which will now respect our folding ranges
        vscode.commands.executeCommand('editor.foldAllMarkerRegions');
    });

    const unfoldAll = withMarkdownEditor(editor => {
        // Use the built-in unfold command, which will now respect our folding ranges
        vscode.commands.executeCommand('editor.unfoldAllMarkerRegions');
    });

    const toggleFold = withMarkdownEditor(editor => {
        const ranges = findHtmlComments(editor.document);
        const selection = editor.selection;
        const selectedRange = ranges.find(range => selection.active.isAfterOrEqual(range.start) && selection.active.isBeforeOrEqual(range.end));
        if (selectedRange) {
            editor.selections = [new vscode.Selection(selectedRange.start, selectedRange.end)];
            vscode.commands.executeCommand('editor.toggleFold');
        }
    });

    context.subscriptions.push(
        vscode.commands.registerCommand('noteskeep.foldAll', foldAll),
        vscode.commands.registerCommand('noteskeep.unfoldAll', unfoldAll),
        vscode.commands.registerCommand('noteskeep.toggleFold', toggleFold)
    );

    // Auto-fold comments on activation and when the active editor changes.
    const autoFoldOnMarkdown = (editor: vscode.TextEditor | undefined) => {
        if (editor && editor.document.languageId === 'markdown') {
            foldAll();
        }
    };

    vscode.window.onDidChangeActiveTextEditor(autoFoldOnMarkdown);
    autoFoldOnMarkdown(vscode.window.activeTextEditor);
}

export function deactivate() {}
