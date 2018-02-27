module.exports = function(w) {
  return {
    files: [
      './package.json',
      { pattern: 'src/**/**.ts', instrument: true },
      { pattern: 'src/Tests/**/**.test.ts', ignore: true },
    ],
    tests: ['src/Tests/**/*.test.ts'],
    env: {
      type: 'node',
      NODE_ENV: 'testing',
    },
    testFramework: 'mocha',
    debug: true,
    setup: function(wallaby) {
      var mocha = wallaby.testFramework;
      mocha.ui('tdd');
    },
    localProjectDir: __dirname,
    filesWithNoCoverageCalculated: ['src/Tests/testFiles/**/**.ts'],
  };
};
