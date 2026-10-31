/**
 * @jest-environment node
 */
const { TEMPLATE_TYPES, getTemplateMeta, isValidTemplateMeta, getTemplateName } = require('../scripts/build-templates');

// One valid path per shape variant of every registered type. A new TEMPLATE_TYPES row needs entries here
// and in INVALID_SHAPE_PATHS, or the coverage test below fails.
const VALID_PATHS = [
  { path: 'clients/websocket/javascript', meta: { type: 'client', protocol: 'websocket', target: 'javascript' }, name: 'core-template-client-websocket-javascript' },
  { path: 'clients/kafka/java/quarkus', meta: { type: 'client', protocol: 'kafka', target: 'java', stack: 'quarkus' }, name: 'core-template-client-kafka-java-quarkus' },
  { path: 'sdks/kafka/java', meta: { type: 'sdk', protocol: 'kafka', target: 'java' }, name: 'core-template-sdk-kafka-java' },
  { path: 'sdks/kafka/java/spring', meta: { type: 'sdk', protocol: 'kafka', target: 'java', stack: 'spring' }, name: 'core-template-sdk-kafka-java-spring' },
  { path: 'docs/html', meta: { type: 'docs', target: 'html' }, name: 'core-template-docs-html' },
  { path: 'configs/yaml', meta: { type: 'config', target: 'yaml' }, name: 'core-template-config-yaml' },
];

// Paths whose shape doesn't match their type: the build warns and skips them.
const INVALID_SHAPE_PATHS = [
  'clients',
  'clients/websocket',
  'sdks',
  'sdks/kafka',
  'docs',
  'docs/html/extra',
  'configs',
  'configs/yaml/extra',
];

const typeDirOf = (templatePath) => templatePath.split('/')[0];

describe('build-templates', () => {
  describe('TEMPLATE_TYPES', () => {
    it('has unique dir and type values', () => {
      const dirs = TEMPLATE_TYPES.map(t => t.dir);
      const types = TEMPLATE_TYPES.map(t => t.type);
      expect(new Set(dirs).size).toBe(dirs.length);
      expect(new Set(types).size).toBe(types.length);
    });

    it.each(TEMPLATE_TYPES.map(t => [t.dir]))('%s has valid and invalid path cases in this file', (dir) => {
      expect(VALID_PATHS.some(c => typeDirOf(c.path) === dir)).toBe(true);
      expect(INVALID_SHAPE_PATHS.some(p => typeDirOf(p) === dir)).toBe(true);
    });
  });

  describe.each(VALID_PATHS)('valid path $path', ({ path: templatePath, meta, name }) => {
    it('produces the expected metadata', () => {
      expect(getTemplateMeta(templatePath.split('/'))).toEqual(meta);
    });

    it('passes validation', () => {
      expect(isValidTemplateMeta(meta)).toBe(true);
    });

    it('produces the expected package name', () => {
      expect(getTemplateName(meta)).toBe(name);
    });
  });

  it.each(INVALID_SHAPE_PATHS)('rejects wrong-shape path %s', (templatePath) => {
    expect(isValidTemplateMeta(getTemplateMeta(templatePath.split('/')))).toBe(false);
  });

  it('throws on an unregistered type folder', () => {
    expect(() => getTemplateMeta(['not-a-type', 'websocket', 'javascript'])).toThrow('Invalid template type path: not-a-type');
  });
});
