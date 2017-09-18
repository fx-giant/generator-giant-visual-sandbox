'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the cat\'s meow ' + chalk.red('generator-giant-visual-sandbox') + ' generator!'
    ));


    const prompts = [{

      name: 'visualPackName',
      message: 'Give a name to your visual pack (camel case)',
      default: "sampleVisualPack"
    }];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    var base = ["bower.json", "package.json", "src", "index.html", "gulpfile.js"];
    var visualPackTemplates = ["{{visualName}}/config.json", "{{visualName}}/{{visualName}}.css", "{{visualName}}/{{visualName}}.js", "{{visualName}}/quadrant-properties-{{visualName}}.html", "{{visualName}}/quadrant-properties-{{visualName}}.js"];
    var files = base.concat(visualPackTemplates);

    var visualName = this.props.visualPackName;
    var templateValues = {
      visualName: visualName
    }

    for (var i = 0; i < files.length; i++)
      this.fs.copyTpl(
        this.templatePath(files[i]),
        this.destinationPath(files[i]).replace(new RegExp("{{visualName}}", "g"), visualName),
        templateValues
      );


  }


  install() {
    this.installDependencies();
  }
};
