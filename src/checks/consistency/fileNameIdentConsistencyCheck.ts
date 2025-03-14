import * as vscode from 'vscode';
import { BaseCheck } from '../baseCheck';
import * as path from 'path';

export class FileNameIdentConsistencyCheck extends BaseCheck {
    check(document: vscode.TextDocument): vscode.Diagnostic[] {
        const diagnostics: vscode.Diagnostic[] = [];
        const text = document.getText();
        const rootElementRegex = /<(\w+)[^>]*\bIdent="([^"]+)"[^>]*>/;
        const match = rootElementRegex.exec(text);

        if (!match) return diagnostics; // No root element with Ident attribute found

        const ident = match[2];
        const fileName = path.basename(document.uri.fsPath, '.xml');

        if (ident !== fileName) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);
            const range = new vscode.Range(startPos, endPos);

            const diagnostic = new vscode.Diagnostic(
                range,
                `CST-002: The Ident attribute '${ident}' does not match the file name '${fileName}.xml'.`,
                vscode.DiagnosticSeverity.Warning
            );

            const relatedInformation = new vscode.DiagnosticRelatedInformation(
                new vscode.Location(vscode.Uri.parse('https://github.com/profiiqus/SFPToolkit/blob/main/docs/diagnostics/CST-002.md'), range),
                `GitHub Docs`
            );

            diagnostic.relatedInformation = [relatedInformation];
            diagnostic.code = 'CST-002';
            diagnostic.source = 'SmartFP Toolkit';
            diagnostics.push(diagnostic);
        }

        return diagnostics;
    }
}