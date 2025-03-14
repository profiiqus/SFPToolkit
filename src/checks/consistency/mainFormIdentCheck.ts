import * as vscode from 'vscode';
import { BaseCheck } from '../baseCheck';

export class MainFormIdentCheck extends BaseCheck {
    check(document: vscode.TextDocument): vscode.Diagnostic[] {
        const diagnostics: vscode.Diagnostic[] = [];
        const text = document.getText();
        const mainFormRegex = /<Form[^>]*\bMainForm="[^"]*"[^>]*>/;
        const mainFormMatch = mainFormRegex.exec(text);

        if (!mainFormMatch) return diagnostics; // No root element with MainForm attribute found

        const identRegex = /<Form[^>]*\bIdent="([^"]+)"[^>]*>/;
        const identMatch = identRegex.exec(text);

        if (!identMatch) return diagnostics; // No Ident attribute found

        const ident = identMatch[1];

        if (!ident.endsWith("Fake")) {
            const startPos = document.positionAt(identMatch.index);
            const endPos = document.positionAt(identMatch.index + identMatch[0].length);
            const range = new vscode.Range(startPos, endPos);

            const diagnostic = new vscode.Diagnostic(
                range,
                `CST-005: The Ident attribute '${ident}' must end with 'Fake' when MainForm attribute is present.`,
                vscode.DiagnosticSeverity.Warning
            );

            const relatedInformation = new vscode.DiagnosticRelatedInformation(
                new vscode.Location(vscode.Uri.parse('https://github.com/profiiqus/SFPToolkit/blob/main/docs/diagnostics/CST-005.md'), range),
                `More information at: https://github.com/profiiqus/SFPToolkit/blob/main/docs/diagnostics/CST-005.md`
            );

            diagnostic.relatedInformation = [relatedInformation];
            diagnostic.code = 'CST-005';
            diagnostic.source = 'SmartFP Toolkit';
            diagnostics.push(diagnostic);
        }

        return diagnostics;
    }
}