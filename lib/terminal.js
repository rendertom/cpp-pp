const ide = require('./ide.js');
const vscode = require('vscode');

let _terminal;

const terminal = {
	clearConsole() {
		const platform = process.platform;
		const command = platform === 'win32' ? 'cls' : 'clear';
		const terminal = this.getTerminal();

		terminal.sendText(command, true);
	},
	createNewTerminal() {
		return vscode.window.createTerminal();
	},
	getActiveTerminal() {
		return vscode.window.activeTerminal;
	},
	getTerminal() {
		if (!_terminal) {
			_terminal = this.getActiveTerminal() || this.createNewTerminal();
		}

		return _terminal;
	},
	sendText(string) {
		const settings = ide.config.get();
		const terminal = this.getTerminal();

		terminal.show();
		terminal.sendText(string, settings.autoRun);
	},
};

module.exports = terminal;