import structuredClone from '@ungap/structured-clone';

if (typeof global.structuredClone !== 'function') {
  globalThis.structuredClone = structuredClone;
}