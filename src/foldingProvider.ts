import * as vscode from 'vscode';

export class HtmlCommentFoldingProvider implements vscode.FoldingRangeProvider {

    public provideFoldingRanges(document: vscode.TextDocument, context: vscode.FoldingContext, token: vscode.CancellationToken): vscode.ProviderResult<vscode.FoldingRange[]> {
        const ranges: vscode.FoldingRange[] = [];
        const text = document.getText();
        const commentRegex = /<!--[\s\S]*?-->/g;
        let match;

        while ((match = commentRegex.exec(text)) !== null) {
            const startLine = document.positionAt(match.index).line;
            const endLine = document.positionAt(match.index + match[0].length).line;

            // Only create a folding range if it spans more than one line
            if (startLine < endLine) {
                ranges.push(new vscode.FoldingRange(startLine, endLine, vscode.FoldingRangeKind.Comment));
            }
        }
        return ranges;
    }
}
