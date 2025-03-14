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
exports.FormCheck = void 0;
const vscode = __importStar(require("vscode"));
const baseCheck_1 = require("./baseCheck");
class FormCheck extends baseCheck_1.BaseCheck {
    check(document) {
        const diagnostics = [];
        const text = document.getText();
        const formRegex = /Form/g;
        let match;
        while ((match = formRegex.exec(text)) !== null) {
            const lineNumber = document.positionAt(match.index).line;
            const range = new vscode.Range(lineNumber, match.index, lineNumber, match.index + match[0].length);
            diagnostics.push(new vscode.Diagnostic(range, `Warning: The text 'Form' is present.`, vscode.DiagnosticSeverity.Warning));
        }
        return diagnostics;
    }
}
exports.FormCheck = FormCheck;
//# sourceMappingURL=formCheck.js.map