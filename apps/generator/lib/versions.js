const https = require('https');

async function getVersionsList() {
  try {
    const versions = await fetchNpmVersions('@asyncapi/generator');
    return versions;
  } catch (error) {
    const { getGeneratorVersion } = require('./utils');
    return [getGeneratorVersion()];
  }
}

function fetchNpmVersions(packageName) {
  return new Promise((resolve, reject) => {
    https.get(`https://registry.npmjs.org/${packageName}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const versions = Object.keys(JSON.parse(data).versions);
          resolve(versions);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

module.exports = {
  getVersionsList
};