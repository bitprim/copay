// https://www.npmjs.com/package/node-sass

module.exports = {
  /**
   * outputFilename: The filename of the saved CSS file
   * from the sass build. The directory which it is saved in
   * is set within the "buildDir" config options.
   */
  outputFilename: process.env.IONIC_OUTPUT_CSS_FILE_NAME,

  /**
   * sourceMap: If source map should be built or not.
   */
  sourceMap: false,

  /**
   * outputStyle: How node-sass should output the css file.
   */
  outputStyle: 'expanded',

  /**
   * autoprefixer: The config options for autoprefixer.
   * Excluding this config will skip applying autoprefixer.
   * https://www.npmjs.com/package/autoprefixer
   */
  autoprefixer: {
    browsers: [
      'last 2 versions',
      'iOS >= 8',
      'Android >= 4.4',
      'Explorer >= 11',
      'ExplorerMobile >= 11'
    ],
    cascade: false
  },

  /**
   * includePaths: Used by node-sass for additional
   * paths to search for sass imports by just name.
   */
  includePaths: [
    'node_modules/ionic-angular/themes',
    'node_modules/ionicons/dist/scss',
    'node_modules/ionic-angular/fonts'
  ],

  /**
   * includeFiles: An array of regex patterns to search for
   * sass files in the same directory as the component module.
   * If a file matches both include and exclude patterns, then
   * the file will be excluded.
   */
  includeFiles: [/\.(s(c|a)ss)$/i],

  /**
   * excludeFiles: An array of regex patterns for files which
   * should be excluded. If a file matches both include and exclude
   * patterns, then the file will be excluded.
   */
  excludeFiles: [
    /*  /\.(wp).(scss)$/i  */
  ],

  /**
   * variableSassFiles: Lists out the files which include
   * only sass variables. These variables are the first sass files
   * to be imported so their values override default variables.
   */
  variableSassFiles: ['{{SRC}}/theme/variables.scss'],

  /**
   * directoryMaps: Compiled JS modules may be within a different
   * directory than its source file and sibling component sass files.
   * For example, NGC places it's files within the .tmp directory
   * but doesn't copy over its sass files. This is useful so sass
   * also checks the JavaScript's source directory for sass files.
   */
  directoryMaps: {
    '{{TMP}}': '{{SRC}}'
  },

  /**
   * excludeModules: Used just as a way to skip over
   * modules which we know wouldn't have any sass to be
   * bundled. "excludeModules" isn't necessary, but is a
   * good way to speed up build times by skipping modules.
   */
  excludeModules: [
    '@angular',
    'commonjs-proxy',
    'core-js',
    'ionic-native',
    'rxjs',
    'zone.js'
  ]
};

// Custom step: get config values and inject them in build files
console.log('Injecting configurable values in build files...');
let fileConfig = require('config');
let fileReplacer = require('replace-in-file');
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
  console.log('Modified files:', changedFiles.join(', '));
} catch (error) {
  console.error('Error occurred:', error);
}
console.log('Configurable values injected!');
