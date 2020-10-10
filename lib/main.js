const cp = require('child_process');
const getScriptFile = require('./getScriptFile.js');
const file = require('./file.js');
const ide = require('./ide.js');
const os = require('./os.js');
const path = require('path');
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



function appendExtension(string) {
	const extension = 'exe';
	return string + '.' + extension;
}

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
	const executable = 'g++';
	const flags = ide.config.get().flags.split(',').join(' ');
	const quotedInputFile = getQuotedInputFile(sourceFile);
	const quotedOutputFile = getQuotedOutputFile(sourceFile);

	const commands = [
		executable,
		flags,
		quotedInputFile,
		'-o',
		quotedOutputFile
	];

	const buildCommand = commands.join(' ');

	return buildCommand;
}

function getQuotedInputFile(sourceFile) {
	const buildAll = ide.config.get().buildAll;
	const extension = 'cpp';
	let inputFile;

	if (buildAll) {
		inputFile = '*.' + extension;
		if (!useRelativePath()) {
			const dirname = file.dirname(sourceFile);
			const quotedDirname = quote(dirname);
			inputFile = path.join(quotedDirname, '*.' + extension);
		}
	} else {
		inputFile = useRelativePath() ? file.basename(sourceFile) : sourceFile;
		inputFile = quote(inputFile);
	}

	return inputFile;
}

function getQuotedOutputFile(sourceFile) {
	let outputFile = file.removeExtension(sourceFile);
	if (useRelativePath()) {
		outputFile = file.basename(outputFile);
	}

	if (os.isWindows()) {
		outputFile = appendExtension(outputFile);
	}

	outputFile = quote(outputFile);

	return outputFile;
}

function getRunCommand(sourceFile) {
	let outputFile = file.removeExtension(sourceFile);

	if (useRelativePath()) {
		const basename = file.basename(outputFile);
		outputFile = './' + basename;
	}

	if (os.isWindows()) {
		outputFile = appendExtension(outputFile);
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