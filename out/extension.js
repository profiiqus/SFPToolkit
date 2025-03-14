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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
// DPR
const titleParameterCheck_1 = require("./checks/deprecation/titleParameterCheck");
const hardcodedDLLPathCheck_1 = require("./checks/deprecation/hardcodedDLLPathCheck");
// CST
const titleResourceKeyEmptyCheck_1 = require("./checks/consistency/titleResourceKeyEmptyCheck");
function activate(context) {
    let diagnosticCollection = vscode.languages.createDiagnosticCollection('xmlChecker');
    vscode.workspace.onDidOpenTextDocument(checkDocument);
    vscode.workspace.onDidChangeTextDocument(event => checkDocument(event.document));
    function checkDocument(document) {
        if (document.languageId !== "xml")
            return; // Only process XML files
        const text = document.getText();
        const rootElementRegex = /<(\w+)[\s>]/;
        const match = rootElementRegex.exec(text);
        if (!match)
            return; // No root element found
        const rootElement = match[1];
        const validRootElements = [
            'Form', 'WorkFlow', 'DataView', 'Filter', 'Configuration',
            'Dashboard', 'Report', 'AutomaticOperation', 'Library', 'PartialRender'
        ];
        if (!validRootElements.includes(rootElement))
            return; // Root element is not valid
        const diagnostics = [];
        const checks = [
            new titleParameterCheck_1.TitleParameterCheck(),
            new hardcodedDLLPathCheck_1.HardcodedDLLPathCheck(),
            new titleResourceKeyEmptyCheck_1.TitleResourceKeyEmptyCheck()
        ]; // Add new checks here
        for (const check of checks) {
            diagnostics.push(...check.check(document));
        }
        diagnosticCollection.set(document.uri, diagnostics);
    }
    context.subscriptions.push(diagnosticCollection);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map