// filepath: c:\Users\pavel\repos\personal\SFPToolkit\src\checks\baseCheck.ts
import * as vscode from 'vscode';

export abstract class BaseCheck {
    abstract check(document: vscode.TextDocument): vscode.Diagnostic[];
}