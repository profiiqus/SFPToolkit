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
exports.HardcodedDLLPathCheck = void 0;
const vscode = __importStar(require("vscode"));
const baseCheck_1 = require("../baseCheck");
class HardcodedDLLPathCheck extends baseCheck_1.BaseCheck {
    check(document) {
        const diagnostics = [];
        const text = document.getText();
        const rootElementRegex = /<(\w+)[\s>]/;
        const match = rootElementRegex.exec(text);
        if (!match)
            return diagnostics; // No root element found
        const rootElement = match[1];
        if (rootElement === 'Configuration')
            return diagnostics; // Skip if root element is Configuration
        const parameterRegex = /(?:DLLPath|ClassType)="[^"]*"/g;
        let paramMatch;
        while ((paramMatch = parameterRegex.exec(text)) !== null) {
            const startPos = document.positionAt(paramMatch.index);
            const endPos = document.positionAt(paramMatch.index + paramMatch[0].length);
            const range = new vscode.Range(startPos, endPos);
            const diagnostic = new vscode.Diagnostic(range, `This parameter should not be used outside of 'Configuration' elements. Please refactor the configuration to use 'DLLIdent'.`, vscode.DiagnosticSeverity.Error);
            const relatedInformation = new vscode.DiagnosticRelatedInformation(new vscode.Location(vscode.Uri.parse('https://github.com/profiiqus/SFPToolkit/blob/main/docs/diagnostics/DPR-002.md'), range), `GitHub Docs`);
            diagnostic.relatedInformation = [relatedInformation];
            diagnostics.push(diagnostic);
        }
        return diagnostics;
    }
}
exports.HardcodedDLLPathCheck = HardcodedDLLPathCheck;
//# sourceMappingURL=hardcodedDLLPathCheck.js.map