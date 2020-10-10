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
		const addNewLine = true;
		const preserveFocus = true;
		const terminal = this.getTerminal();
		
		terminal.show(preserveFocus);
		terminal.sendText(string, addNewLine);
	},
};

module.exports = terminal;