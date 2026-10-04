const fs = require('node:fs');
const path = require('node:path');

// Only dispose the Chrome process and profile created by the current test.
exports.disposeBrowser = async (chrome, profile) => {
  const parent = path.resolve(__dirname, '..', '.browser-profile');
  const target = path.resolve(profile);
  if (!target.startsWith(parent + path.sep)) throw Error('Profile outside test directory');
  if (chrome && chrome.exitCode === null && chrome.signalCode === null) {
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(Error('Test Chrome did not exit')), 5000);
      chrome.once('exit', () => { clearTimeout(timeout); resolve(); });
      chrome.kill();
    });
  }
  fs.rmSync(target, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
};
