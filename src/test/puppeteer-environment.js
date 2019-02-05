const fs = require('fs')
const puppeteer = require('puppeteer')
const NodeEnvironment = require('jest-environment-node')

// puppeteer_environment.js
class PuppeteerEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    await super.setup();
    // get the wsEndpoint
    const wsEndpoint = fs.readFileSync('./.puppeteer-ws-endpoint', 'utf8');
    if (!wsEndpoint) {
      throw new Error('.puppeteer-ws-endpoint not found');
    }

    // connect to puppeteer
    this.global.__BROWSER__ = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint,
      // slowMo: 300,
    });
    this.global.db = require('./db')
  }

  async teardown() {
    this.global.db.close()
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = PuppeteerEnvironment
