import * as vscode from 'vscode';
import { exec } from 'child_process';

let isExtensionEnabled = false;

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, extension "auto-dot-clean-macos" is now active!');

	const disposableToggle = vscode.commands.registerCommand('auto-dot-clean-macos.toggleExtension', () => {
		isExtensionEnabled = !isExtensionEnabled;
		const status = isExtensionEnabled ? 'enabled' : 'disabled';
		vscode.window.showInformationMessage(`Auto Dot Clean is now ${status}.`);
	});

	const disposableCommand = vscode.commands.registerCommand('auto-dot-clean-macos.runDotClean', () => {
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (workspaceFolders && workspaceFolders.length > 0) {
			const workspaceRoot = workspaceFolders[0].uri.fsPath;
			runDotClean(workspaceRoot);
		} else {
			vscode.window.showWarningMessage('No workspace folder found to run dot_clean.');
		}
	});

	const disposableOnSave = vscode.workspace.onDidSaveTextDocument((document) => {
		if (isExtensionEnabled) {
			const workspaceFolders = vscode.workspace.workspaceFolders;
			if (workspaceFolders && workspaceFolders.length > 0) {
				const workspaceRoot = workspaceFolders[0].uri.fsPath;
				runDotClean(workspaceRoot);
			}
		}
	});

	context.subscriptions.push(disposableToggle);
	context.subscriptions.push(disposableCommand);
	context.subscriptions.push(disposableOnSave);
}

function runDotClean(workspaceRoot: string) {
	let cmd = `dot_clean "${workspaceRoot}"`;
	exec(cmd, (error, stdout, stderr) => {
		if (error) {
			console.error(`Error running dot_clean: ${error.message}`);
			vscode.window.showErrorMessage(`Error running dot_clean: ${error.message}`);
			return;
		}
		if (stderr) {
			console.warn(`dot_clean stderr: ${stderr}`);
		}
		console.log(`dot_clean stdout: ${stdout}`);
		vscode.window.showInformationMessage(`dot_clean ran successfully: cmd = ${cmd}`);
	});
}

export function deactivate() { }