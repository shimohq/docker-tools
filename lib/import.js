'use strict';

const fs = require('fs');
const path = require('path');
const tools = require('./tools');
const execSync = require('child_process').execSync;

function imp(targetPath) {
  targetPath = path.isAbsolute(targetPath) ? targetPath : path.join(process.cwd(), targetPath);
  tools.assert(fs.existsSync(targetPath), `target dir path '${targetPath}' not found!`);
  const configPath = path.join(targetPath, 'docker-meta.json');
  tools.assert(fs.existsSync(configPath), 'docker-meta.json file not found!');
  const configs = require(configPath);

  configs.forEach(item => {
    const imagePath = path.join(targetPath, item.filename);

    if (!fs.existsSync(imagePath)) {
      tools.warn(`image '${imagePath}' not exists!`);
      return;
    }

    console.log(`importing ${item.repo}:${item.repo}...`);

    const result = execSync(`docker image load -i ${imagePath}`).toString();
    console.log(result);
    if (result.indexOf('Loaded') === -1) {
      console.warn('load error', item.name);
      return;
    }

    execSync(`docker tag ${item.imageId} ${item.repo}:${item.tag}`);
  });
}

module.exports = imp;
