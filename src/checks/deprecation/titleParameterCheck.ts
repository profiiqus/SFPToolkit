import * as vscode from 'vscode';
import { BaseCheck } from '../baseCheck';

export class TitleParameterCheck extends BaseCheck {
    check(document: vscode.TextDocument): vscode.Diagnostic[] {
        const diagnostics: vscode.Diagnostic[] = [];
        const text = document.getText();
        const titleParameterRegex = /Title="[^"]*"/g;
        let match: RegExpExecArray | null;

        while ((match = titleParameterRegex.exec(text)) !== null) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);
            const range = new vscode.Range(startPos, endPos);

            const diagnostic = new vscode.Diagnostic(
                range,
                `DPR-001: The parameter 'Title' is deprecated and should be replaced with 'TitleResourceKey'.`,
                vscode.DiagnosticSeverity.Error
            );

            const relatedInformation = new vscode.DiagnosticRelatedInformation(
                new vscode.Location(vscode.Uri.parse('https://github.com/profiiqus/SFPToolkit/blob/main/docs/diagnostics/DPR-001.md'), range),
                `GitHub Docs`
            );

            diagnostic.relatedInformation = [relatedInformation];
            diagnostic.code = 'DPR-001';
            diagnostic.source = 'SmartFP Toolkit';
            diagnostics.push(diagnostic);
        }

        return diagnostics;
    }
}