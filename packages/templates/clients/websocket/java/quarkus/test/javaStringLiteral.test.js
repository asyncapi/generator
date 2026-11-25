import { toJavaStringLiteral } from '../components/javaStringLiteral.js';

describe('toJavaStringLiteral', () => {
  test('wraps a plain value in double quotes', () => {
    expect(toJavaStringLiteral('/ws/btcusd')).toBe('"/ws/btcusd"');
  });

  test('escapes double quotes and backslashes', () => {
    expect(toJavaStringLiteral('/ws/btc"usd\\raw')).toBe('"/ws/btc\\"usd\\\\raw"');
  });

  test('escapes line breaks and tabs', () => {
    expect(toJavaStringLiteral('a\nb\tc')).toBe('"a\\nb\\tc"');
  });

  test('escapes remaining control characters as unicode escapes', () => {
    expect(toJavaStringLiteral('a\u0000b')).toBe('"a\\u0000b"');
  });

  test('serializes a missing value as an empty literal', () => {
    expect(toJavaStringLiteral(undefined)).toBe('""');
  });
});
