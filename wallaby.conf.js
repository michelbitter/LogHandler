module.exports = function(w) {
  return {
    files: [
      './package.json',
      {pattern: 'src/**/**.ts', instrument: true},
      {pattern: 'src/tests/**/**.test.ts', ignore: true},
    ],
    tests: ['src/tests/**/*.test.ts'],
    env: {
      type: 'node',
      NODE_ENV: 'testing',
    },
    testFramework: 'mocha',
    debug: true,
    setup: function(wallaby) {
      var mocha = wallaby.testFramework
      mocha.ui('tdd')
    },
    localProjectDir: __dirname,
    filesWithNoCoverageCalculated: ['src/tests/testFiles/**/**.ts'],
  }
}
