
# Cpp-pp

Build and run the C++ code using the GCC compiler inside VSCode.

![cpp-pp](resources/cpp-pp.gif)

## Features

* **Build**, **Run**, or **Build and Run** in one go.
* Works with single unsaved documents.
* Supports MacOS (bash, zsh) and Windows (Command Prompt, Windows PowerShell).
* Option to work with relative or absolute paths.
* Builds file in active viewer or all `*.cpp` files in current folder.
* Option to clear console before running new command.
* Accepts custom build flags.

## Requirements

* GCC compiler. For windows, use [minGW](http://www.mingw.org/) (here's a [tutorial](https://www.youtube.com/watch?v=sXW2VLrQ3Bs) about how to install it).

## Installation

The extension is not available on the Visual Studio Marketplace, so the only way to install it is to follow these 2 steps:

1. Download the latest `vsix` file from the [releases](https://github.com/rendertom/cpp-pp/releases) section.
2. In VSCode, use the **Install from VSIX...** command in the Extensions view (`View -> Extensions`) command drop-down, or the **Extensions: Install from VSIX...** command in the Command Palette, point to the .vsix file.

## How to use

Load or type-in any valid C++ code and open Command Pallete (`cmd + shift + P`) and type one of the following commands:

* `cpp-pp: build` to build an executable file.
* `cpp-pp: build and run` to build and run code in the active viewer.
* `cpp-pp: run` to execute code, that was built previously.

The keyboard shortcut `shift + cmd + R` is assigned to `cpp-pp: build and run` command.

**Note:** in **building** process the extension will create the executable file in the same folder as the file that's in the active viewer, and will have the same name (but without extension) as the source file.

The extension can also execute the above commands on an unsaved (untitled) document. In this case the *.cpp file will get saved in `~/.vscode/snippet.cpp` location (defined in Preferences) and executed from there. This feature is useful for quick test runs.

## Key bindings

Keyboard shortcut `shift + cmd + R` is mapped to `cpp-pp.buildAndRun` command, which will build and run the file in the active viewer. To change the command or assign a different shortcut, do the following:

* Open the **Keyboard Shortcuts** editor window by clicking `cmd + K` followed by `cmd + S`, or by navigating to `Preferences > Keyboard Shortcuts`.
* In the input text field start typing `cpp-pp`. This will filter all the available commands for the extension.
* Select a command from the list and modify or assign a keybinding.

For more information about keybinding check official [Key Bindings for Visual Studio Code](https://code.visualstudio.com/docs/getstarted/keybindings).

## Settings

This extension contributes the following settings:

* `cpp-pp.buildAll`: Whether to build all *.cpp files in current folder.
* `cpp-pp.clearConsole`: Whether to clear the console before executing the command.
* `cpp-pp.cppStandard`: The C++ ISO standard to use for the compiler.
* `cpp-pp.flags`: Additional g++ flags, such as `-Wall`, `-Werror`, etc, separated by comma. Applies only if `Flags Enabled` is checked.
* `cpp-pp.flagsEnabled`: Whether `Flags` should be processed.
* `cpp-pp.preserveFocus`: When `true` the terminal will not take focus.
* `cpp-pp.saveFileBeforeExecution`: Whether to save a dirty file before execution.
* `cpp-pp.temporaryFile`: A path to a temporary file where Untitled document gets saved before execution.
* `cpp-pp.useRelativePath`: Whether to use relative paths instead of absolute.

### Similar extensions

Other extensions that can execute C/C++ code:

* [Code Runner](https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner)
* [C/C++ Compile Run](https://marketplace.visualstudio.com/items?itemName=danielpinto8zz6.c-cpp-compile-run)
* [cpp-compile](https://marketplace.visualstudio.com/items?itemName=tchojnacki.cpp-compile)
* [c-cpp-compile-run-windows](https://marketplace.visualstudio.com/items?itemName=BDZNH.c-cpp-compile-run-windows)

**Enjoy!**