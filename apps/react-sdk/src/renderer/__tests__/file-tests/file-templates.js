/* eslint-disable */

const React = require('react');
const { File } = require('../../../components');

module.exports = function() {
  return [
    React.createElement(File, { name: 'file1.html' }, ['Content1']),
    undefined,
    React.createElement(File, { name: 'file2.html' }, ['Content2'])
  ];
};
