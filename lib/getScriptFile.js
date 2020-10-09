const file = require('./file.js');
const ide = require('./ide.js');

/**
 * Gets a path to a script file that has to be executed.
 * If document is undefined, then saves it into temp file,
 * defined in 'extension.temporaryFile'
 *
 * @returns {String} A path to a file.
 */

function getScriptFile() {
    const settings = ide.config.get();
    if (ide.editor.isDirty() && settings.saveFileBeforeExecution) {
        ide.editor.save();
    }

    let scriptFile = getScriptFileFromEditor();

    return scriptFile;
}

module.exports = getScriptFile;



function getScriptFileFromEditor() {
    let scriptFile = ide.editor.getPath();
    const settings = ide.config.get();
    const text = ide.editor.ensureHasText();

    if (!ide.editor.hasPath()) {
        scriptFile = file.saveFile(text, settings.temporaryFile);
    }

    return scriptFile;
}