const main = require('./main.js');
const vscode = require('vscode');

/**
 * @description Method is called when extension is activated.
 * Extension is activated the very first time the command is executed.
 * @return {void}
 */
function activate() {
	vscode.commands.registerCommand('cpp-pp.build', main.build);
	vscode.commands.registerCommand('cpp-pp.buildAndRun', main.buildAndRun);
	vscode.commands.registerCommand('cpp-pp.run', main.run);
}

exports.activate = activate;