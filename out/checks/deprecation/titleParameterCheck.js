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
exports.TitleParameterCheck = void 0;
const vscode = __importStar(require("vscode"));
const baseCheck_1 = require("../baseCheck");
class TitleParameterCheck extends baseCheck_1.BaseCheck {
    check(document) {
        const diagnostics = [];
        const text = document.getText();
        const titleParameterRegex = /Title="[^"]*"/g;
        let match;
        while ((match = titleParameterRegex.exec(text)) !== null) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);
            const range = new vscode.Range(startPos, endPos);
            const diagnostic = new vscode.Diagnostic(range, `DPR-001: The parameter 'Title' is deprecated and should be replaced with 'TitleResourceKey'.`, vscode.DiagnosticSeverity.Error);
            const relatedInformation = new vscode.DiagnosticRelatedInformation(new vscode.Location(vscode.Uri.parse('https://github.com/profiiqus/SFPToolkit/blob/main/docs/diagnostics/DPR-001.md'), range), `GitHub Docs`);
            diagnostic.relatedInformation = [relatedInformation];
            diagnostic.code = 'DPR-001';
            diagnostic.source = 'SmartFP Toolkit';
            diagnostics.push(diagnostic);
        }
        return diagnostics;
    }
}
exports.TitleParameterCheck = TitleParameterCheck;
//# sourceMappingURL=titleParameterCheck.js.map