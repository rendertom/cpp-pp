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
		})
	},
	buildAndRun() {
		ensureCompilerIsInstalled(function() {
			const sourceFile = getScriptFile();
			const buildCommand = getBuildCommand(sourceFile);
			const runCommand = getRunCommand(sourceFile);

			terminal.sendText(buildCommand + ' && ' + runCommand);
		});
	},
	run() {
		const sourceFile = getScriptFile();
		const runCommand = getRunCommand(sourceFile);

		terminal.sendText(runCommand);
	}
}

module.exports = main;


function ensureCompilerIsInstalled(callback) {
	cp.exec('gcc -v', (error, stdout, stderr) => {
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
	const outputFile = file.removeExtension(sourceFile);
	const buildCommand = executable + " '" + sourceFile + "' -o '" + outputFile + "'";

	return buildCommand;
}

function getRunCommand(sourceFile) {
	const outputFile = file.removeExtension(sourceFile);
	const runCommand = "'" + outputFile + "'";

	return runCommand;
}