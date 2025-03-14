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
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
// DPR
const titleParameterCheck_1 = require("./checks/deprecation/titleParameterCheck");
const hardcodedDLLPathCheck_1 = require("./checks/deprecation/hardcodedDLLPathCheck");
// CST
const titleResourceKeyEmptyCheck_1 = require("./checks/consistency/titleResourceKeyEmptyCheck");
const fileNameIdentConsistencyCheck_1 = require("./checks/consistency/fileNameIdentConsistencyCheck");
const fileNameRootElementCheck_1 = require("./checks/consistency/fileNameRootElementCheck");
const subFormIdentCheck_1 = require("./checks/consistency/subFormIdentCheck");
const mainFormIdentCheck_1 = require("./checks/consistency/mainFormIdentCheck");
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
            new titleResourceKeyEmptyCheck_1.TitleResourceKeyEmptyCheck(),
            new fileNameIdentConsistencyCheck_1.FileNameIdentConsistencyCheck(),
            new fileNameRootElementCheck_1.FileNameRootElementCheck(),
            new subFormIdentCheck_1.SubFormIdentCheck(),
            new mainFormIdentCheck_1.MainFormIdentCheck()
        ]; // Add new checks here
        for (const check of checks) {
            diagnostics.push(...check.check(document));
        }
        diagnosticCollection.set(document.uri, diagnostics);
    }
    context.subscriptions.push(diagnosticCollection);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map