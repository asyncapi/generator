import React from 'react';
import { IndentationTypes } from '../../utils';
import { Indent, render, Text } from "../..";

describe('<Indent />', () => {
  test('Should always render as is with default props', () => {
    const defaultProps = {};
    const wrapper = render(<Indent {...defaultProps}>Test</Indent>);
    expect(wrapper).toEqual('Test');
  });

  test('Should always render indentation with spaces', () => {
    const defaultProps = {
      size: 4,
      type: IndentationTypes.SPACES
    };
    const wrapper = render(<Indent {...defaultProps}>Test</Indent>);
    expect(wrapper).toEqual('    Test');
  });

  test('Should always render indentation with tabs', () => {
    const defaultProps = {
      size: 2,
      type: IndentationTypes.TABS
    };
    const wrapper = render(<Indent {...defaultProps}>Test</Indent>);
    expect(wrapper).toEqual('		Test');
  });

  test('Should be able to make nest indentation', () => {
    const defaultProps = {
      size: 4,
      type: IndentationTypes.SPACES
    };
    const wrapper = render(<Indent {...defaultProps}><Indent {...defaultProps} size={2}>Test</Indent></Indent>);
    expect(wrapper).toEqual('      Test');
  });

  test('Should be able contain text component', () => {
    const defaultProps = {
      size: 4,
      type: IndentationTypes.SPACES
    };
    const defaultTextProps = {
      indent: 4,
      type: IndentationTypes.SPACES
    };
    const wrapper = render(<Indent {...defaultProps}><Text {...defaultTextProps}>Test</Text></Indent>);
    expect(wrapper).toEqual('        Test\n');
  });
});
