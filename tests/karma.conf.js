// Karma configuration
// Generated on Tue Jul 21 2015 22:34:30 GMT-0400 (EDT)
var browsers, selected_browsers;

browsers = require('./browsers.conf');
selected_browsers = [];

for (var browser in browsers) {
    selected_browsers.push(browser);
}

module.exports = function(config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../',

        browserStack: {
            username: 'Nickersoft',
            accessKey: 'peTScQRRBpSkOGjybGpd'
        },

        coverageReporter: {
            // specify a common output directory
            dir: 'coverage',
            reporters: [
                {
                    type: 'lcov',
                    subdir: '.'
                }
            ]
        },

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        plugins: [
            'karma-jasmine',
            'karma-mocha-reporter',
            'karma-coverage',
            'karma-sourcemap-loader',
            'karma-browserstack-launcher'
        ],

        // list of files / patterns to load in the browser
        files: [
            './node_modules/platform/platform.js',
            './node_modules/@babel/polyfill/dist/polyfill.min.js',
            './bin/push.min.js',
            './tests/push.tests.js',
            './src/serviceWorker.min.js'
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            './bin/push.js': ['sourcemap', 'coverage']
        },

        // src results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['mocha', 'coverage'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing src whenever any file changes
        autoWatch: false,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: selected_browsers,

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the src and exits
        singleRun: true,

        // custom browser launchers for BrowserStack
        customLaunchers: browsers
    });
};
