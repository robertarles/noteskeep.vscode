
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    const fold = (editor: vscode.TextEditor, ranges: vscode.Range[]) => {
        editor.selections = ranges.map(range => new vscode.Selection(range.start, range.end));
        vscode.commands.executeCommand('editor.fold');
    };

    const unfold = (editor: vscode.TextEditor, ranges: vscode.Range[]) => {
        editor.selections = ranges.map(range => new vscode.Selection(range.start, range.end));
        vscode.commands.executeCommand('editor.unfold');
    };

    const findHtmlComments = (doc: vscode.TextDocument): vscode.Range[] => {
        const ranges: vscode.Range[] = [];
        const commentRegex = /<!--[\s\S]*?-->/g;
        for (let i = 0; i < doc.lineCount; i++) {
            const line = doc.lineAt(i);
            let match;
            while ((match = commentRegex.exec(line.text)) !== null) {
                const start = new vscode.Position(i, match.index);
                const end = new vscode.Position(i, match.index + match[0].length);
                ranges.push(new vscode.Range(start, end));
            }
        }
        return ranges;
    };

    const foldAll = () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'markdown') {
            const ranges = findHtmlComments(editor.document);
            if (ranges.length) {
                fold(editor, ranges);
            }
        }
    };

    const unfoldAll = () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'markdown') {
            const ranges = findHtmlComments(editor.document);
            if (ranges.length) {
                unfold(editor, ranges);
            }
        }
    };

    const toggleFold = () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'markdown') {
            const ranges = findHtmlComments(editor.document);
            const selection = editor.selection;
            const selectedRange = ranges.find(range => selection.active.isAfterOrEqual(range.start) && selection.active.isBeforeOrEqual(range.end));
            if (selectedRange) {
                editor.selections = [new vscode.Selection(selectedRange.start, selectedRange.end)];
                vscode.commands.executeCommand('editor.toggleFold');
            }
        }
    };

    context.subscriptions.push(
        vscode.commands.registerCommand('noteskeep.foldAll', foldAll),
        vscode.commands.registerCommand('noteskeep.unfoldAll', unfoldAll),
        vscode.commands.registerCommand('noteskeep.toggleFold', toggleFold)
    );

    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor && editor.document.languageId === 'markdown') {
            foldAll();
        }
    });

    if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.languageId === 'markdown') {
        foldAll();
    }
}

export function deactivate() {}
