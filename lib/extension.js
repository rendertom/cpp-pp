const main = require('./main.js');
const vscode = require('vscode');

/**
 * @description Method is called when extension is activated.
 * Extension is activated the very first time the command is executed.
 * @return {void}
 */
function activate(context) {
	const build = vscode.commands.registerCommand('cpp-pp.build', main.build);
	const buildAndRun = vscode.commands.registerCommand('cpp-pp.buildAndRun', main.buildAndRun);
	const run = vscode.commands.registerCommand('cpp-pp.run', main.run);

	context.subscriptions.push(build);
	context.subscriptions.push(buildAndRun);
	context.subscriptions.push(run);
}

exports.activate = activate;