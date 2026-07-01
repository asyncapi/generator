import { getSafeJSName } from '../../components/getSafeJsName.js';

describe('getSafeJSName', () => {
  test('converts standard names to camelCase', () => {
    expect(getSafeJSName('my-param')).toBe('myParam');
    expect(getSafeJSName('some_other_param')).toBe('someOtherParam');
  });

  test('prefixes names starting with a digit with an underscore', () => {
    expect(getSafeJSName('1st')).toBe('_1st');
    expect(getSafeJSName('2nd-param')).toBe('_2ndParam');
  });

  test('replaces invalid javascript identifier characters with an underscore', () => {
    // toCamelCase usually handles most punctuation by removing it and camelCasing,
    // but if any invalid characters slip through (e.g. non-ASCII or specific symbols that toCamelCase doesn't touch),
    // they should be replaced.
    // For testing, we ensure that the resulting string only contains valid characters.
    const result = getSafeJSName('my@param!');
    expect(result).toMatch(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/);
  });

  test('prefixes reserved words to avoid collisions', () => {
    expect(getSafeJSName('url')).toBe('_url');
    expect(getSafeJSName('throwSendErrors')).toBe('_throwSendErrors');
    expect(getSafeJSName('class')).toBe('_class');
    expect(getSafeJSName('return')).toBe('_return');
    expect(getSafeJSName('true')).toBe('_true');
  });

  test('does not prefix non-reserved words', () => {
    expect(getSafeJSName('urlValue')).toBe('urlValue');
    expect(getSafeJSName('classic')).toBe('classic');
  });
});
