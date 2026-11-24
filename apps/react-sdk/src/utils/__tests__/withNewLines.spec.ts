import { withNewLines } from '../withNewLines';

describe('withNewLines', () => {
  it('should return empty string with default parameters', () => {
    expect(withNewLines()).toBe('');
  });

  it('should return content unchanged when number of newlines is 0', () => {
    expect(withNewLines('test', 0)).toBe('test');
  });

  it('should append a single newline when number is 1', () => {
    expect(withNewLines('test', 1)).toBe('test\n');
  });

  it('should append multiple newlines when specified', () => {
    expect(withNewLines('test', 3)).toBe('test\n\n\n');
  });

  it('should handle empty content with newlines', () => {
    expect(withNewLines('', 2)).toBe('\n\n');
  });
});
