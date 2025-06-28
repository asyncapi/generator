import structuredClone from '@ungap/structured-clone';

if (typeof global.structuredClone !== 'function') {
  global.structuredClone = structuredClone;
}
