import * as vscode from 'vscode';
import { BaseCheck } from '../baseCheck';

export class EmailBodyParameterCheck extends BaseCheck {
    check(document: vscode.TextDocument): vscode.Diagnostic[] {
        const diagnostics: vscode.Diagnostic[] = [];
        const text = document.getText();
        const bodyParameterRegex = /Body=""/g;
        let match: RegExpExecArray | null;

        while ((match = bodyParameterRegex.exec(text)) !== null) {
            const lineNumber = document.positionAt(match.index).line;
            const range = new vscode.Range(lineNumber, match.index, lineNumber, match.index + match[0].length);
            diagnostics.push(new vscode.Diagnostic(
                range,
                `Error: The parameter 'Body' is deprecated and should be replaced with BodyResourceKey.`,
                vscode.DiagnosticSeverity.Error
            ));
        }

        return diagnostics;
    }
}