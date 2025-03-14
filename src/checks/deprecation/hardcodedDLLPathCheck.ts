import * as vscode from 'vscode';
import { BaseCheck } from '../baseCheck';

export class HardcodedDLLPathCheck extends BaseCheck {
    check(document: vscode.TextDocument): vscode.Diagnostic[] {
        const diagnostics: vscode.Diagnostic[] = [];
        const text = document.getText();
        const rootElementRegex = /<(\w+)[\s>]/;
        const match = rootElementRegex.exec(text);

        if (!match) return diagnostics; // No root element found

        const rootElement = match[1];
        if (rootElement === 'Configuration') return diagnostics; // Skip if root element is Configuration

        const parameterRegex = /(?:DLLPath|ClassType)="[^"]*"/g;
        let paramMatch: RegExpExecArray | null;

        while ((paramMatch = parameterRegex.exec(text)) !== null) {
            const startPos = document.positionAt(paramMatch.index);
            const endPos = document.positionAt(paramMatch.index + paramMatch[0].length);
            const range = new vscode.Range(startPos, endPos);

            const diagnostic = new vscode.Diagnostic(
                range,
                `DPR-002: This parameter should not be used outside of 'Configuration' elements. Please refactor the configuration to use 'DLLIdent'.`,
                vscode.DiagnosticSeverity.Error
            );

            const relatedInformation = new vscode.DiagnosticRelatedInformation(
                new vscode.Location(vscode.Uri.parse('https://github.com/profiiqus/SFPToolkit/blob/main/docs/diagnostics/DPR-002.md'), range),
                `GitHub Docs`
            );

            diagnostic.relatedInformation = [relatedInformation];
            diagnostic.code = 'DPR-002';
            diagnostic.source = 'SmartFP Toolkit';
            diagnostics.push(diagnostic);
        }

        return diagnostics;
    }
}