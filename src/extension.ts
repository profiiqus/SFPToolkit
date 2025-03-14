import * as vscode from 'vscode';

// DPR
import { TitleParameterCheck } from './checks/deprecation/titleParameterCheck';
import { HardcodedDLLPathCheck } from './checks/deprecation/hardcodedDLLPathCheck';

// CST
import { TitleResourceKeyEmptyCheck } from './checks/consistency/titleResourceKeyEmptyCheck';
import { FileNameIdentConsistencyCheck } from './checks/consistency/fileNameIdentConsistencyCheck';
import { FileNameRootElementCheck } from './checks/consistency/fileNameRootElementCheck';
import { SubFormIdentCheck } from './checks/consistency/subFormIdentCheck';
import { MainFormIdentCheck } from './checks/consistency/mainFormIdentCheck';

export function activate(context: vscode.ExtensionContext) {
    let diagnosticCollection = vscode.languages.createDiagnosticCollection('xmlChecker');

    vscode.workspace.onDidOpenTextDocument(checkDocument);
    vscode.workspace.onDidChangeTextDocument(event => checkDocument(event.document));

    function checkDocument(document: vscode.TextDocument) {
        if (document.languageId !== "xml") return; // Only process XML files

        const text = document.getText();
        const rootElementRegex = /<(\w+)[\s>]/;
        const match = rootElementRegex.exec(text);

        if (!match) return; // No root element found

        const rootElement = match[1];
        const validRootElements = [
            'Form', 'WorkFlow', 'DataView', 'Filter', 'Configuration',
            'Dashboard', 'Report', 'AutomaticOperation', 'Library', 'PartialRender'
        ];

        if (!validRootElements.includes(rootElement)) return; // Root element is not valid

        const diagnostics: vscode.Diagnostic[] = [];
        const checks = [
            new TitleParameterCheck(),
            new HardcodedDLLPathCheck(),
            new TitleResourceKeyEmptyCheck(),
            new FileNameIdentConsistencyCheck(),
            new FileNameRootElementCheck(),
            new SubFormIdentCheck(),
            new MainFormIdentCheck()
        ]; // Add new checks here

        for (const check of checks) {
            diagnostics.push(...check.check(document));
        }

        diagnosticCollection.set(document.uri, diagnostics);
    }

    context.subscriptions.push(diagnosticCollection);
}

export function deactivate() {}