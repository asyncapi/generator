/* istanbul ignore file */
const fetch = require('node-fetch');

/**
 * Polls the Microcks API every 2 seconds until a test with the given ID reports success.
 *
 * @param {string} url - link to endpoint providing info on particular test
 * @returns {Promise<boolean>} Resolves with `true` when the test is marked as successful.
 */
async function waitForTestSuccess(url) {
  while (true) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        console.error(`Request failed with status: ${response.status}`);
        break;
      }

      const data = await response.json();

      if (data.success) {
        return true;
      }
    } catch (err) {
      break;
    }

    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
  }

  return false;
}

/**
 * Wait for a specific message to appear in the spy's log calls.
 * @param {array} a - array with messages
 * @param {string} expectedMessage - The message to look for in logs.
 * @param {number} timeout - Maximum time (in ms) to wait. Default is 3000ms.
 * @param {number} interval - How long to wait (in ms) until next check. Default is 10ms.
 * @returns {Promise<void>} Resolves if the message is found, otherwise rejects.
 */
async function waitForMessage(a, expectedMessage, timeout = 3000, interval = 10) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (a.some(message => message.includes(expectedMessage))) {
      return;
    }
    await delay(interval);
  }
  throw new Error(`Expected message "${expectedMessage}" not found within timeout`);
}
  
/**
   * Delay execution by a specified time.
   * @param {number} time - Delay duration in milliseconds. Default is 1000ms.
   * @returns {Promise<void>} Resolves after the specified delay.
   */
async function delay(time = 1000) {
  return new Promise(resolve => setTimeout(resolve, time));
}
  
module.exports = {
  waitForMessage,
  delay,
  waitForTestSuccess
};