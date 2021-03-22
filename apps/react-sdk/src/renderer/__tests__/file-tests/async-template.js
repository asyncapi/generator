/* eslint-disable */

const React = require('react');
const { File } = require('../../../components');

module.exports = async function() {
  return React.createElement(File, { name: 'file.html' }, ['Content']);
};
