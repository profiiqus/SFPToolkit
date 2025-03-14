import * as vscode from 'vscode';
import { BaseCheck } from '../baseCheck';

export class SubFormIdentCheck extends BaseCheck {
    check(document: vscode.TextDocument): vscode.Diagnostic[] {
        const diagnostics: vscode.Diagnostic[] = [];
        const text = document.getText();
        const isSubFormRegex = /<Form[^>]*\bIsSubForm="true"[^>]*>/;
        const isSubFormMatch = isSubFormRegex.exec(text);

        if (!isSubFormMatch) return diagnostics; // No root element with IsSubForm="true" attribute found

        const identRegex = /<Form[^>]*\bIdent="([^"]+)"[^>]*>/;
        const identMatch = identRegex.exec(text);

        if (!identMatch) return diagnostics; // No Ident attribute found

        const ident = identMatch[1];

        if (!ident.endsWith("SubForm")) {
            const startPos = document.positionAt(identMatch.index);
            const endPos = document.positionAt(identMatch.index + identMatch[0].length);
            const range = new vscode.Range(startPos, endPos);

            const diagnostic = new vscode.Diagnostic(
                range,
                `CST-004: The Ident attribute '${ident}' must end with 'SubForm' when IsSubForm="true".`,
                vscode.DiagnosticSeverity.Warning
            );

            const relatedInformation = new vscode.DiagnosticRelatedInformation(
                new vscode.Location(vscode.Uri.parse('https://github.com/profiiqus/SFPToolkit/blob/main/docs/diagnostics/CST-004.md'), range),
                `More information at: https://github.com/profiiqus/SFPToolkit/blob/main/docs/diagnostics/CST-004.md`
            );

            diagnostic.relatedInformation = [relatedInformation];
            diagnostic.code = 'CST-004';
            diagnostic.source = 'SmartFP Toolkit';
            diagnostics.push(diagnostic);
        }

        return diagnostics;
    }
}