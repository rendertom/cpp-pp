const ide = require('./ide.js');
const os = require('./os.js');
const vscode = require('vscode');

const terminal = {
	dirname: undefined,
	terminal: undefined,
	clearConsole() {
		const command = os.isWindows() ? 'cls' : 'tput reset';
		this.sendText(command);
	},
	createNewTerminal() {
		return vscode.window.createTerminal();
	},
	createTerminal() {
		const terminal = this.getActiveTerminal() || this.createNewTerminal();
		this.setTerminal(terminal);
		return terminal;
	},
	getActiveTerminal() {
		return vscode.window.activeTerminal;
	},
	getDirname() {
		return this.dirname;
	},
	getWindowsShellPath() {
		return vscode.workspace.getConfiguration('terminal').get('integrated.shell.windows');
	},
	getTerminal() {
		return this.terminal;
	},
	isCommandPrompt() {
		return /cmd.exe/i.test(this.getWindowsShellPath());
	},
	isPowerShell() {
		return /powershell.exe/i.test(this.getWindowsShellPath());
	},
	killTerminal() {
		this.setTerminal(undefined);
		this.setDirname(undefined);
	},
	sendText(string) {
		const addNewLine = true;
		const settings = ide.config.get();
		const terminal = this.getTerminal() || this.createTerminal();

		terminal.show(settings.preserveFocus);
		terminal.sendText(string, addNewLine);
	},
	setDirname(dirname) {
		this.dirname = dirname;
	},
	setTerminal(terminal) {
		this.terminal = terminal;
	},
};

module.exports = terminal;