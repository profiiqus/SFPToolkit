import * as vscode from 'vscode';
import { BaseCheck } from '../baseCheck';
import * as path from 'path';

export class FileNameRootElementCheck extends BaseCheck {
    check(document: vscode.TextDocument): vscode.Diagnostic[] {
        const diagnostics: vscode.Diagnostic[] = [];
        const text = document.getText();
        const rootElementRegex = /<(\w+)[^>]*\bIdent="([^"]+)"[^>]*>/;
        const match = rootElementRegex.exec(text);

        if (!match) return diagnostics; // No root element with Ident attribute found

        const rootElement = match[1];
        const ident = match[2];
        const excludedRootElements = ['Form', 'Configuration', 'AutomaticOperation', 'Library', 'PartialRender'];

        if (excludedRootElements.includes(rootElement)) return diagnostics; // Skip excluded root elements

        if (!ident.endsWith(rootElement)) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);
            const range = new vscode.Range(startPos, endPos);

            const diagnostic = new vscode.Diagnostic(
                range,
                `CST-003: The Ident attribute '${ident}' must end with the root element name '${rootElement}'.`,
                vscode.DiagnosticSeverity.Warning
            );

            const relatedInformation = new vscode.DiagnosticRelatedInformation(
                new vscode.Location(vscode.Uri.parse('https://github.com/profiiqus/SFPToolkit/blob/main/docs/diagnostics/CST-003.md'), range),
                `GitHub Docs`
            );

            diagnostic.relatedInformation = [relatedInformation];
            diagnostic.code = 'CST-003';
            diagnostic.source = 'SmartFP Toolkit';
            diagnostics.push(diagnostic);
        }

        return diagnostics;
    }
}