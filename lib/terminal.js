const ide = require('./ide.js');
const vscode = require('vscode');

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
		const terminal = this.getActiveTerminal() || this.createNewTerminal();
		return terminal;
	},
	sendText(string) {
		const settings = ide.config.get();
		const terminal = this.getTerminal();

		terminal.show();
		if (settings.clearConsole) {
			this.clearConsole();
		}
		terminal.sendText(string, settings.autoRun);
	},
}

module.exports = terminal;