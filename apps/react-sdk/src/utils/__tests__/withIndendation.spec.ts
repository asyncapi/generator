import { withIndendation, IndentationTypes } from '../withIndendation';

describe('withIndendation', () => {
  it('should return content unchanged when size is 0 or negative', () => {
    expect(withIndendation('hello', 0)).toBe('hello');
    expect(withIndendation('hello', -2)).toBe('hello');
  });

  it('should indent single line with spaces by default', () => {
    expect(withIndendation('hello', 2)).toBe('  hello');
    expect(withIndendation('hello', 4, IndentationTypes.SPACES)).toBe('    hello');
  });

  it('should indent single line with tabs when specified', () => {
    expect(withIndendation('hello', 2, IndentationTypes.TABS)).toBe('\t\thello');
  });

  it('should indent multi-line content correctly', () => {
    const input = 'line1\nline2\nline3';
    const expected = '  line1\n  line2\n  line3';
    expect(withIndendation(input, 2, IndentationTypes.SPACES)).toBe(expected);
  });

  it('should not add indentation to empty/blank lines within multi-line content', () => {
    const input = 'line1\n\nline2';
    const expected = '  line1\n\n  line2';
    expect(withIndendation(input, 2, IndentationTypes.SPACES)).toBe(expected);
  });
});
