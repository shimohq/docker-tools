#!/usr/bin/env node

'use strict';

/**
 * Module dependencies.
 */

const fs = require('fs');
const pkg = require('./package.json');
const program = require('commander');
const path = require('path');
const tools = require('./lib/tools');
const chalk = require('chalk');
const assert = tools.assert;
const CWD = process.cwd();
const execSync = require('child_process').execSync;
const match = require('wildstring').match;

const imp = require('./lib/import');
const exp = require('./lib/export');

program
  .version(pkg.version)
;

// config json/js file format:
// [
//  {
//    repo: 'xxx',
//    tag: ''
//  },
//  ...
// ]
program
  .version(pkg.version)
  .command('export [jsonConfigFilePath]')
  .description(`
      save docker images to a folder via a json file you privide,
      the format of the json like [{ repo: '', tag: '' }], after export, 
      you can copy the folder to another machine and restore them
        with repo & tag by using import cmd`)
  .option('-d, --dir <dir>', 'target dir, default is images-XXX')
  .action(wrap(function (jsonConfigFilePath, options) {
    const cfgPath = path.isAbsolute(jsonConfigFilePath) ? jsonConfigFilePath : path.join(CWD, jsonConfigFilePath);

    assert(fs.existsSync(cfgPath), `config file path '${cfgPath}'' not exists!`);
    assert(cfgPath.endsWith('.json') || cfgPath.endsWith('.js'), 'config file must be json/js file!');

    const targets = require(cfgPath);

    const images = tools.getImageList()
      .filter(item => targets.find(j => item.repo === j.repo && item.tag === j.tag))
    ;

    exp(images, options.dir);
  }));

program
  .command('import [targetDirPath]')
  .description(`
      docker image restore from folder created by export,
      you can keep images' repo & tag info with this cmd`)
  .action(wrap(function (targetDirPath) {
    imp(targetDirPath);
  }));

program
  .command('image [action] [arg]')
  .description(`
      docker image quick cmds,
      available cmd:
      1. image remove <pattern in wildstring>
        e.g. dtool image remove 'my-company*'`)
  .action(wrap(function (action, arg) {
    if (action === 'remove') {
      const list = tools.getImageList().filter(item => {
        return match(arg, item.repo);
      });

      if (list.length === 0) {
        tools.warn('no image match pattern', arg);
      }

      list.forEach(item => {
        console.log(execSync(`docker image rm ${item.imageId}`).toString());
      });
    }
  }));

program
  .arguments('')
  .action(function () {
    program.outputHelp();
  });

function wrap(fn) {
  return function () {
    try {
      fn.apply(null, arguments);
    } catch (e) {
      if (e.expose) {
        return console.log(chalk.red(e.message));
      }

      console.log(chalk.red('Uncaught exception: \n', e.message, e.stack));
    }
  };
}

program.parse(process.argv);
