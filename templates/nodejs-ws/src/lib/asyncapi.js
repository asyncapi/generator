const fs = require('fs');
const path = require('path');
const { parse } = require('asyncapi-parser');

let cached;

module.exports.init = async () => {
  if (cached) return;

  let content;

  try {
    content = fs.readFileSync(path.resolve(__dirname, '../../asyncapi.yaml'), { encoding: 'utf8' });
  } catch (e) {
    try {
      content = fs.readFileSync(path.resolve(__dirname, '../../asyncapi.json'), { encoding: 'utf8' });
    } catch (err) {
      throw new Error('Coud not find asyncapi.yaml or asyncapi.json file in the root directory of the project.');
    }
  }

  try {
    cached = await parse(content);
  } catch (e) {
    throw e;
  }

  return cached;
};

module.exports.get = () => cached;
