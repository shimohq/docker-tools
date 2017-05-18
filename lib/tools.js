'use strict';

const chalk = require('chalk');
const execSync = require('child_process').execSync;

function getImageList() {
  const results = execSync('docker image ls')
    .toString()
    .split('\n')
    .slice(1, -1)
    .map(i => i.split(/\s\s+/g))
    .map(i => {
      return {
        name: i[0].split('/').pop(),
        repo: i[0],
        tag: i[1] === '<none>' ? '' : i[1],
        imageId: i[2],
        created: i[3],
        size: i[4]
      };
    })
  ;

  return results;
}

function assert(condition) {
  if (!condition) {
    const error = new Error(chalk.red(['Error:'].concat([].slice.call(arguments, 1)).join(' ')));
    error.expose = true;
    throw error;
  }
}

function random() {
  return Math.random().toString(36).slice(2);
}

function warn() {
  console.log(chalk.yellow(['WARN:'].concat([].slice.call(arguments)).join(' ')));
}

exports.getImageList = getImageList;
exports.assert = assert;
exports.random = random;
exports.warn = warn;
