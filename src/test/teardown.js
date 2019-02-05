const fs = require('fs')

// teardown.js
module.exports = async function() {
  // close the browser instance
  await global.__BROWSER__.close();

  fs.unlinkSync('./.puppeteer-ws-endpoint')
};
