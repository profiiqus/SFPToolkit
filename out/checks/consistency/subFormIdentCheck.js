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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubFormIdentCheck = void 0;
const vscode = __importStar(require("vscode"));
const baseCheck_1 = require("../baseCheck");
class SubFormIdentCheck extends baseCheck_1.BaseCheck {
    check(document) {
        const diagnostics = [];
        const text = document.getText();
        const isSubFormRegex = /<Form[^>]*\bIsSubForm="true"[^>]*>/;
        const isSubFormMatch = isSubFormRegex.exec(text);
        if (!isSubFormMatch)
            return diagnostics; // No root element with IsSubForm="true" attribute found
        const identRegex = /<Form[^>]*\bIdent="([^"]+)"[^>]*>/;
        const identMatch = identRegex.exec(text);
        if (!identMatch)
            return diagnostics; // No Ident attribute found
        const ident = identMatch[1];
        if (!ident.endsWith("SubForm")) {
            const startPos = document.positionAt(identMatch.index);
            const endPos = document.positionAt(identMatch.index + identMatch[0].length);
            const range = new vscode.Range(startPos, endPos);
            const diagnostic = new vscode.Diagnostic(range, `CST-004: The Ident attribute '${ident}' must end with 'SubForm' when IsSubForm="true".`, vscode.DiagnosticSeverity.Warning);
            const relatedInformation = new vscode.DiagnosticRelatedInformation(new vscode.Location(vscode.Uri.parse('https://github.com/profiiqus/SFPToolkit/blob/main/docs/diagnostics/CST-004.md'), range), `More information at: https://github.com/profiiqus/SFPToolkit/blob/main/docs/diagnostics/CST-004.md`);
            diagnostic.relatedInformation = [relatedInformation];
            diagnostic.code = 'CST-004';
            diagnostic.source = 'SmartFP Toolkit';
            diagnostics.push(diagnostic);
        }
        return diagnostics;
    }
}
exports.SubFormIdentCheck = SubFormIdentCheck;
//# sourceMappingURL=subFormIdentCheck.js.map