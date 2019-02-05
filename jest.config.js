
module.exports = {
  globalSetup: './src/test/setup.js',
  globalTeardown: './src/test/teardown.js',
  testEnvironment: './src/test/puppeteer-environment.js',
  reporters: ['./src/test/custom-reporter.js'],
}
