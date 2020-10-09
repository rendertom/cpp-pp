const cp = require('child_process');
const getScriptFile = require('./getScriptFile.js');
const file = require('./file.js');
const ide = require('./ide.js');
const terminal = require('./terminal.js');

const main = {
	build() {
		ensureCompilerIsInstalled(function() {
			const sourceFile = getScriptFile();
			const buildCommand = getBuildCommand(sourceFile);

			terminal.sendText(buildCommand);
		});
	},
	buildAndRun() {
		ensureCompilerIsInstalled(function() {
			const sourceFile = getScriptFile();
			const buildCommand = getBuildCommand(sourceFile);
			const runCommand = getRunCommand(sourceFile);
			const commands = [buildCommand, '&&', runCommand];
			const command = commands.join(' ');

			terminal.sendText(command);
		});
	},
	run() {
		const sourceFile = getScriptFile();
		const runCommand = getRunCommand(sourceFile);

		terminal.sendText(runCommand);
	}
};

module.exports = main;


function ensureCompilerIsInstalled(callback) {
	cp.exec('gcc -v', (error /*, stdout, stderr */) => {
		if (error) {
			console.error(`exec error: ${error}`);
			ide.showErrorMessage('gcc compiler not installed');
		} else {
			// console.log(stdout);
			// console.log(stderr);
			callback();
		}
	});
}

function getBuildCommand(sourceFile) {
	const executable = 'g++';
	const flags = ide.config.get().flags;
	const outputFile = file.removeExtension(sourceFile);
	const commands = [
		executable,
		flags,
		quote(sourceFile),
		'-o',
		quote(outputFile)
	];

	const buildCommand = commands.join(' ');

	return buildCommand;
}

function getRunCommand(sourceFile) {
	const outputFile = file.removeExtension(sourceFile);
	const runCommand = quote(outputFile);

	return runCommand;
}

function quote(string) {
	return `'${string}'`;
}