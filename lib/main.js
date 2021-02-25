const cp = require('child_process');
const getScriptFile = require('./getScriptFile.js');
const file = require('./file.js');
const ide = require('./ide.js');
const os = require('./os.js');
const path = require('path');
const terminal = require('./terminal.js');

const main = {
	build() {
		const filePath = getSettingsFile();
		if (filePath) {
			runFromFileByKey(filePath, "build");
		} else {
			ensureCompilerIsInstalled(function () {
				const sourceFile = getScriptFile();

				clearConsoleIfNeeded();
				changeDirectoryIfNeeded(sourceFile);

				const buildCommand = getBuildCommand(sourceFile);

				terminal.sendText(buildCommand);
			});
		}
	},
	buildAndRun() {
		const filePath = getSettingsFile();
		if (filePath) {
			runFromFileByKey(filePath, "buildAndRun");
		} else {
			ensureCompilerIsInstalled(function () {
				const sourceFile = getScriptFile();

				clearConsoleIfNeeded();
				changeDirectoryIfNeeded(sourceFile);

				const buildCommand = getBuildCommand(sourceFile);
				const runCommand = getRunCommand(sourceFile);

				const command = joinCommands([buildCommand, runCommand]);

				terminal.sendText(command);
			});
		}
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
		if (terminal.getDirname() !== dirname) {
			terminal.setDirname(dirname);
			const command = getCDCommand() + ' ' + quote(dirname);
			terminal.sendText(command);
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
	const cppStandard = getCppStandard();
	const flags = getFlags();
	const quotedInputFile = getQuotedInputFile(sourceFile);
	const quotedOutputFile = getQuotedOutputFile(sourceFile);

	let commands = [
		executable,
		cppStandard,
		flags,
		quotedInputFile,
		'-o',
		quotedOutputFile
	];

	commands = removeEmptyStrings(commands);

	const buildCommand = commands.join(' ');

	return buildCommand;
}

function getCDCommand() {
	let cd = 'cd';
	if (os.isWindows() && terminal.isCommandPrompt()) {
		cd = 'cd /d';
	}

	return cd;
}

function getCppStandard() {
	const settings = ide.config.get();
	const cppStandard = settings.cppStandard.toLowerCase();
	const standard = cppStandard === 'default' ? '' : '-std=' + cppStandard;

	return standard;
}

function getFlags() {
	let flags = '';
	const settings = ide.config.get();
	if (settings.flagsEnabled) {
		flags = settings.flags.split(',').join(' ');
	}

	return flags;
}

function getParameterCaseInsensitive(object, key) {
	return object[
		Object.keys(object).filter(function (k) {
			return k.toLowerCase() === key.toLowerCase();
		})[0]
	];
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

	let runCommand = quote(outputFile);
	if (os.isWindows() && terminal.isPowerShell()) {
		runCommand = '& ' + runCommand;
	}

	return runCommand;
}

function getSettingsFile() {
	const workspaceFolder = ide.config.getWorkspaceFolder();
	if (workspaceFolder) {
		const filePath = workspaceFolder.uri.path + "/.cpp-pp.json";
		if (file.exists(filePath)) {
			return filePath;
		}
	}
}

function joinCommands(commands) {
	let joiner = ' && ';
	if (os.isWindows() && terminal.isPowerShell()) {
		joiner = '; ';
	}

	return commands.join(joiner);
}

function quote(string) {
	const quotationMark = os.isWindows() ? `"` : `'`;
	return quotationMark + string + quotationMark;
}

function removeEmptyStrings(array) {
	return array.filter(string => {
		if (typeof string === 'string') {
			string = string.trim();
			return string !== '';
		}
	});
}

function runFromFileByKey(filePath, key) {
	const data = file.readFileSync(filePath);
	const json = JSON.parse(data);
	let commands = getParameterCaseInsensitive(json, key);
	if (commands) {
		if (!Array.isArray(commands)) {
			commands = [commands];
		}
		const command = joinCommands(commands);
		terminal.sendText(command);
	}
}

function useRelativePath() {
	const settings = ide.config.get();
	return settings.useRelativePath;
}