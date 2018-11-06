let chalk = require('chalk');
let fileConfig = require('config');
let fileReplacer = require('replace-in-file');

function timestamp() {
  return (
    '[' +
    new Date()
      .toLocaleTimeString()
      .replace(' AM', '')
      .replace(' PM', '') +
    ']'
  );
}

function logError(msg) {
  console.error(chalk.dim(timestamp()) + '  ' + msg);
}

function logProgress(msg) {
  console.log(chalk.dim(timestamp()) + '  ' + msg);
}

module.exports = {
  injectConfigValues: function() {
    logProgress('injecting configurable values in build files...');
    let bwsUrl = fileConfig.get('bws.url');
    const options = {
      //Single file
      files: 'www/build/main.js',

      //Replacement to make (string or regex)
      from: /__BWS_URL_PLACEHOLDER__/g,
      to: bwsUrl
    };
    try {
      let changedFiles = fileReplacer.sync(options);
      logProgress('modified files: ' + changedFiles.join(', '));
    } catch (error) {
      logError('error occurred:' + error);
    }
    logProgress('configurable values injected');
  }
};
