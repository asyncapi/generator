import React from 'react';
import { IndentationTypes } from '../../utils';
import { Text, render } from "../..";

describe('<Text />', () => {
  test('Should always render as is text with default props', () => {
    const defaultProps = {};
    const wrapper = render(<Text {...defaultProps}>Test</Text>);
    expect(wrapper).toEqual('Test\n');
  });

  test('Should always render indentation with spaces', () => {
    const defaultProps = {
      indent: 4,
      type: IndentationTypes.SPACES
    };
    const wrapper = render(<Text {...defaultProps}>Test</Text>);
    expect(wrapper).toEqual('    Test\n');
  });

  test('Should always render indentation with tabs', () => {
    const defaultProps = {
      indent: 2,
      type: IndentationTypes.TABS
    };
    const wrapper = render(<Text {...defaultProps}>Test</Text>);
    expect(wrapper).toEqual('		Test\n');
  });

  test('Should be able to render nest texts', () => {
    const defaultProps = {};
    const wrapper = render(<Text {...defaultProps}><Text {...defaultProps}>Test</Text></Text>);
    expect(wrapper).toEqual('Test\n\n');
  });
});
