'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const visualPackFolder = "source";

module.exports = class extends Generator {
    prompting() {
        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the cat\'s meow ' + chalk.red('generator-giant-visual-sandbox') + ' generator!'
        ));

        const prompts = [{

            name: 'visualPackName',
            message: 'Give a name to your visual pack (camel case)',
            default: 'sampleVisualPack'
        }];

        return this.prompt(prompts).then(props => {
            // To access props later use this.props.someAnswer;
            this.props = props;
        });
    }

    writing() {
        var justCopy = [
            'package.json',
            'dependencies',
            'packs/.gitkeep',
        ];
        var copyWithRender = [
            'index.html',
            'packer.js',
            'config.json',
            'source/config.json',
            'source/{{visualName}}.css',
            'source/{{visualName}}.js',
            'source/quadrant-properties-{{visualName}}.html',
            'source/quadrant-properties-{{visualName}}.js'
        ];

        var visualName = this.props.visualPackName;
        var templateValues = {
            visualName: visualName
        };
        for (var i = 0; i < justCopy.length; i++) {
            var file = justCopy[i];
            this.fs.copy(
                this.templatePath(file),
                this.destinationPath(visualName + "/" + file)
            )
        }
        for (var i = 0; i < copyWithRender.length; i++) {
            var file = copyWithRender[i];
            this.fs.copyTpl(
                this.templatePath(file),
                this.destinationPath(visualName + '/' + file).replace(new RegExp('{{visualName}}', 'g'), visualName),
                templateValues
            );
        }
    }

    install() {

    }
};
