import * as vscode from 'vscode';
import { BaseCheck } from '../baseCheck';

export class TitleResourceKeyEmptyCheck extends BaseCheck {
    check(document: vscode.TextDocument): vscode.Diagnostic[] {
        const diagnostics: vscode.Diagnostic[] = [];
        const text = document.getText();
        const titleResourceKeyRegex = /TitleResourceKey=""/g;
        let match: RegExpExecArray | null;

        while ((match = titleResourceKeyRegex.exec(text)) !== null) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);
            const range = new vscode.Range(startPos, endPos);

            const diagnostic = new vscode.Diagnostic(
                range,
                `The parameter 'TitleResourceKey' is empty and should be assigned a value.`,
                vscode.DiagnosticSeverity.Warning
            );

            const relatedInformation = new vscode.DiagnosticRelatedInformation(
                new vscode.Location(vscode.Uri.parse('https://github.com/profiiqus/SFPToolkit/blob/main/docs/diagnostics/CST-001.md'), range),
                `GitHub Docs`
            );

            diagnostic.relatedInformation = [relatedInformation];
            diagnostic.code = 'CST-001';
            diagnostic.source = 'SmartFP Toolkit';
            diagnostics.push(diagnostic);
        }

        return diagnostics;
    }
}