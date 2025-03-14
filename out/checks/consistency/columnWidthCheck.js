"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnWidthCheck = void 0;
const vscode = __importStar(require("vscode"));
const baseCheck_1 = require("../baseCheck");
class ColumnWidthCheck extends baseCheck_1.BaseCheck {
    check(document) {
        const diagnostics = [];
        const text = document.getText();
        const rootElementRegex = /<(\w+)[\s>]/;
        const match = rootElementRegex.exec(text);
        if (!match)
            return diagnostics; // No root element found
        const rootElement = match[1];
        if (rootElement !== 'DataView' && rootElement !== 'Report')
            return diagnostics; // Only process DataView or Report root elements
        const isCheckBox = rootElement === 'DataView' && /IsCheckBox="true"/.test(text);
        const columnsRegex = /<Columns>([\s\S]*?)<\/Columns>/g;
        let columnsMatch;
        while ((columnsMatch = columnsRegex.exec(text)) !== null) {
            const columnsText = columnsMatch[1];
            const columnRegex = /<Column[^>]*>/g;
            let columnMatch;
            let totalWidth = 0;
            while ((columnMatch = columnRegex.exec(columnsText)) !== null) {
                const columnText = columnMatch[0];
                const isOptional = /IsOptional="true"/.test(columnText);
                const isVisible = /IsVisible="false"/.test(columnText);
                const widthMatch = /Width="(\d+)"/.exec(columnText);
                if (isOptional || isVisible) {
                    continue; // Skip optional or invisible columns
                }
                if (!widthMatch) {
                    const startPos = document.positionAt(columnsMatch.index + columnMatch.index);
                    const endPos = document.positionAt(columnsMatch.index + columnMatch.index + columnText.length);
                    const range = new vscode.Range(startPos, endPos);
                    const diagnostic = new vscode.Diagnostic(range, `Warning: Column element is missing the Width attribute.`, vscode.DiagnosticSeverity.Warning);
                    diagnostics.push(diagnostic);
                }
                else {
                    const width = parseInt(widthMatch[1], 10);
                    totalWidth += width;
                    if (width !== 100) {
                        const startPos = document.positionAt(columnsMatch.index + columnMatch.index);
                        const endPos = document.positionAt(columnsMatch.index + columnMatch.index + columnText.length);
                        const range = new vscode.Range(startPos, endPos);
                        const diagnostic = new vscode.Diagnostic(range, `Warning: Column element has a Width attribute that does not match 100.`, vscode.DiagnosticSeverity.Warning);
                        diagnostics.push(diagnostic);
                    }
                }
            }
            if (isCheckBox && totalWidth !== 95) {
                const startPos = document.positionAt(columnsMatch.index);
                const endPos = document.positionAt(columnsMatch.index + columnsMatch[0].length);
                const range = new vscode.Range(startPos, endPos);
                const diagnostic = new vscode.Diagnostic(range, `Warning: The sum of the Width attributes of all Column elements should be 95 when IsCheckBox="true". Current sum is ${totalWidth}.`, vscode.DiagnosticSeverity.Warning);
                diagnostics.push(diagnostic);
            }
            else if (!isCheckBox && totalWidth !== 100) {
                const startPos = document.positionAt(columnsMatch.index);
                const endPos = document.positionAt(columnsMatch.index + columnsMatch[0].length);
                const range = new vscode.Range(startPos, endPos);
                const diagnostic = new vscode.Diagnostic(range, `Warning: The sum of the Width attributes of all Column elements should be 100. Current sum is ${totalWidth}.`, vscode.DiagnosticSeverity.Warning);
                diagnostics.push(diagnostic);
            }
        }
        return diagnostics;
    }
}
exports.ColumnWidthCheck = ColumnWidthCheck;
//# sourceMappingURL=columnWidthCheck.js.map