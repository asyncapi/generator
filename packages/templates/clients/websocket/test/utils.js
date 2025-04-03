/**
 * Wait for a specific message to appear in the spy's log calls.
 * @param {object} spy - The jest spy object on console.log.
 * @param {string} expectedMessage - The message to look for in logs.
 * @param {number} timeout - Maximum time (in ms) to wait. Default is 3000ms.
 * @param {number} interval - How long to wait (in ms) until next check. Default is 10ms.
 * @returns {Promise<void>} Resolves if the message is found, otherwise rejects.
 */
async function waitForMessageLog(spy, expectedMessage, timeout = 3000, interval = 10) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const calls = spy.mock.calls;
    if (calls.some(args => args.some(arg => arg.includes(expectedMessage)))) {
      return;
    }
    await delay(interval);
  }
  throw new Error(`Expected log message "${expectedMessage}" not found within timeout`);
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
  waitForMessageLog,
  delay
};