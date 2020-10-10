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
    const editor = ide.editor;
    const settings = ide.config.get();

    if (editor.isDirty() && settings.saveFileBeforeExecution) {
        editor.save();
    }

    const scriptFile = getScriptFileFromEditor();

    return scriptFile;
}

module.exports = getScriptFile;



function getScriptFileFromEditor() {
    let scriptFile = ide.editor.getPath();
    const editor = ide.editor;
    const settings = ide.config.get();
    const text = editor.ensureHasText();

    if (!editor.hasPath()) {
        scriptFile = file.saveFile(text, settings.temporaryFile);
    }

    return scriptFile;
}