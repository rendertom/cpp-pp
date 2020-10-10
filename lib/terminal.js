const os = require('./os.js');
const vscode = require('vscode');

let _terminal;

const terminal = {
	clearConsole() {
		const command = os.isWindows() ? 'cls' : 'clear';
		const terminal = this.getTerminal();

		terminal.sendText(command);
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
		const autoRun = true;
		const terminal = this.getTerminal();

		terminal.show();
		terminal.sendText(string, autoRun);
	},
};

module.exports = terminal;