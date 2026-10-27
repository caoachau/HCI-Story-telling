const fs = require('node:fs');
const path = require('node:path');

// Only dispose the Chrome process and profile created by the current test.
exports.disposeBrowser = async (chrome, profile) => {
  const parent = path.resolve(__dirname, '..', '.browser-profile');
  const target = path.resolve(profile);
  if (!target.startsWith(parent + path.sep)) throw Error('Profile outside test directory');
  if (chrome && chrome.exitCode === null && chrome.signalCode === null) {
    await new Promise((resolve, reject) => {
      // Large 4K screenshot suites can take longer to flush and exit on Windows.
      const timeout = setTimeout(() => {
        if (chrome.exitCode !== null || chrome.signalCode !== null) resolve();
        else reject(Error('Test Chrome did not exit'));
      }, 15000);
      chrome.once('exit', () => { clearTimeout(timeout); resolve(); });
      chrome.kill();
    });
  }
  fs.rmSync(target, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
};
