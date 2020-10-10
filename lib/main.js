const cp = require('child_process');
const getScriptFile = require('./getScriptFile.js');
const file = require('./file.js');
const ide = require('./ide.js');
const terminal = require('./terminal.js');

let _dirname;

const main = {
	build() {
		ensureCompilerIsInstalled(function() {
			const sourceFile = getScriptFile();

			clearConsoleIfNeeded();
			changeDirectoryIfNeeded(sourceFile);

			const buildCommand = getBuildCommand(sourceFile);

			terminal.sendText(buildCommand);
		});
	},
	buildAndRun() {
		ensureCompilerIsInstalled(function() {
			const sourceFile = getScriptFile();

			clearConsoleIfNeeded();
			changeDirectoryIfNeeded(sourceFile);

			const buildCommand = getBuildCommand(sourceFile);
			const runCommand = getRunCommand(sourceFile);

			const command = buildCommand + ' && ' + runCommand;

			terminal.sendText(command);
		});
	},
	run() {
		const sourceFile = getScriptFile();

		clearConsoleIfNeeded();
		changeDirectoryIfNeeded(sourceFile);

		const runCommand = getRunCommand(sourceFile);

		terminal.sendText(runCommand);
	}
};

module.exports = main;


function changeDirectoryIfNeeded(sourceFile) {
	if (useRelativePath()) {
		const dirname = file.dirname(sourceFile);
		if (_dirname !== dirname) {
			_dirname = dirname;

			const cdCommand = 'cd ' + quote(dirname);
			terminal.sendText(cdCommand);
		}
	}
}

function clearConsoleIfNeeded() {
	const settings = ide.config.get();
	if (settings.clearConsole) {
		terminal.clearConsole();
	}
}

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
	const inputFile = getInputFile(sourceFile);
	const outputFile = getOutputFile(sourceFile);

	const executable = 'g++';
	const flags = ide.config.get().flags.split(',').join(' ');
	const commands = [
		executable,
		flags,
		quote(inputFile),
		'-o',
		quote(outputFile)
	];

	const buildCommand = commands.join(' ');

	return buildCommand;
}

function getInputFile(sourceFile) {
	let inputFile = sourceFile;
	if (useRelativePath()) {
		inputFile = file.basename(sourceFile);
	}

	return inputFile;
}

function getOutputFile(sourceFile) {
	let outputFile = file.removeExtension(sourceFile);
	if (useRelativePath()) {
		outputFile = file.basename(outputFile);
	}

	return outputFile;
}

function getRunCommand(sourceFile) {
	let outputFile = file.removeExtension(sourceFile);

	if (useRelativePath()) {
		const basename = file.basename(outputFile);
		outputFile = './' + basename;
	}

	const runCommand = quote(outputFile);

	return runCommand;
}

function quote(string) {
	return `'${string}'`;
}

function useRelativePath() {
	const settings = ide.config.get();
	return settings.useRelativePath;
}