const os = {
	isMac() {
		return !this.isWindows();
	},
	isWindows() {
		return process.platform === 'win32';
	},
};

module.exports = os;