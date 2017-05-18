'use strict';

/* eslint no-console:0 */

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const tools = require('./tools');
// const tools = require('./tools');
const execSync = require('child_process').execSync;

// config is result reutrned by getImageList
function exp(_configs, targetPath) {
  if (!targetPath) {
    targetPath = `images-${Date.now()}`;
  }

  targetPath = path.isAbsolute(targetPath) ? targetPath : path.join(process.cwd(), targetPath);
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath);
  }

  const configs = _.clone(_configs);
  configs.forEach(item => {
    item.filename = `${item.name}-${tools.random()}.image`;
  });

  console.log('target path is', targetPath);

  configs.forEach(item => {
    console.log(`exporting ${item.repo}:${item.tag}(${item.size})...`);
    execSync(`docker image save ${item.imageId} -o ${targetPath}/${item.filename}`);
  });

  console.log('write meta data to docker-meta.json..');

  fs.writeFileSync(path.join(targetPath, 'docker-meta.json'), JSON.stringify(configs, null, 2));

  console.log('all done!');
}

module.exports = exp;
