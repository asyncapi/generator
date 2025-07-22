// This script traverse packages/templates and as a result updates template's .ageneratorrc with metadata and their package.json with proper name, then generate lib/templatesInfo.js
// Run with: `npm run build` always as pretest script

const { readdir, readFile, writeFile } = require('fs/promises');
const path = require('path');
const yaml = require('js-yaml');

const templatesRoot = path.resolve(__dirname, '../../../packages/templates');
const generatorLibDir = path.resolve(__dirname, '../lib');
const outputTemplatesInfoFile = path.join(generatorLibDir, 'templatesInfo.js');

// No need to add dirs that start with `.`
const IGNORED_DIRS = ['test', '__tests__', '__fixtures__', '__snapshots__', 'components', 'helpers', 'node_modules', 'coverage', '__transpiled', ];

function isIgnored(name) {
  return IGNORED_DIRS.includes(name) || name.startsWith('.');
}

/**
 * Extracts template metadata from the path segments.
 * The segments should be in the order of [type, protocol, target, stack].
 * If stack is not provided, it will return an object without the stack property.
 * @param {string[]} segments - The path segments of the template.
 *
 * @returns {Object} An object containing the template metadata.
 * @property {string} type - The type of the template (e.g., 'clients', 'servers').
 * @property {string} protocol - The protocol of the template (e.g., 'websocket', 'http').
 * @property {string} target - The target language or framework of the template (e.g., 'javascript', 'python').
 * @property {string} stack - The stack of the template, if provided (e.g., 'quarkus', 'express').
 */
function getTemplateMeta(segments) {
  const [type, protocol, target, stack] = segments;
  if (segments.length === 4) {
    return { type, protocol, target, stack };
  }
  if (segments.length === 3) {
    return { type, protocol, target };
  }
  return {};
}

/**
 * Generates a template name based on the metadata.
 * The name is constructed in the format: `@asyncapi/core-template-{type}-{protocol}-{target}-{stack}`.
 * If stack is not provided, it will be omitted from the name.
 * @param {Object} meta - The metadata of the template.
 * @param {string} meta.type - The type of the template (e.g., 'clients', 'servers').
 * @param {string} meta.protocol - The protocol of the template (e.g., 'websocket', 'http').
 * @param {string} meta.target - The target language or framework of the template (e.g., 'javascript', 'python').
 * @param {string} [meta.stack] - The stack of the template, if provided (e.g., 'quarkus', 'express').
 * @returns {string|undefined} The generated template name in the format `@asyncapi/core-template-{type}-{protocol}-{target}-{stack}`, or undefined if type, protocol, or target is missing.
 */
function getTemplateName(meta) {
  const { type, protocol, target, stack } = meta;

  let name = [type, protocol, target, stack]
    .filter(Boolean)
    .map(s => String(s).toLowerCase())
    .join('-');
  return name ? `@asyncapi/core-template-${name}` : undefined;
}

/**
 * Generates a template path based on the package name.
 * The path is constructed in the format: `node_modules/{pkgName}`.
 * @param {string} pkgName - The name of the package.
 * @returns {string} The generated template path.
 */
function getTemplatePath(pkgName) {
  return `node_modules/${pkgName}`;
}

/**
 * Recursively collects templates from the given directory.
 * A template is considered valid if it contains both 'package.json' and '.ageneratorrc' files.
 * The function returns an array of objects, each containing the directory path and relative path
 * from the templates root.
 * @param {string} dir - The directory to search for templates.
 * @param {string[]} [relPath=[]] - The relative path from the templates root.
 * @param {Object[]} [result=[]] - The accumulated results containing valid templates.
 * @returns {Promise<Object[]>} A promise that resolves to an array of objects, each containing the directory path and relative path of a valid template.
 * 
 * @example
 * // Example of returned object:
 * [
 *   {
 *     dir: '/path/to/template/dir',
 *     relPath: ['clients', 'websocket', 'javascript']
 *   },
 *   {
 *     dir: '/path/to/another/template/dir',
 *     relPath: ['docs', 'html']
 *   }
 * ]
 */
async function collectTemplates(dir, relPath = [], result = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (isIgnored(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const subEntries = await readdir(fullPath);
      if (subEntries.includes('package.json') && subEntries.includes('.ageneratorrc')) {
        result.push({ dir: fullPath, relPath: [...relPath, entry.name] });
      } else {
        await collectTemplates(fullPath, [...relPath, entry.name], result);
      }
    }
  }
  return result;
}

/**
 * Reads, updates, and writes the .ageneratorrc YAML file with the new metadata.
 * @param {string} ageneratorrcPath - Path to the .ageneratorrc file.
 * @param {Object} meta - Metadata object to set.
 */
async function updateAGeneratorRc(ageneratorrcPath, meta) {
  let ageneratorrc;
  try {
    const ageneratorrcContent = await readFile(ageneratorrcPath, 'utf-8');
    ageneratorrc = yaml.load(ageneratorrcContent) || {};
  } catch (e) {
    throw new Error(`Error reading .ageneratorrc at ${ageneratorrcPath}: ${e.message}`);
  }
  ageneratorrc.metadata = {
    type: meta.type,
    protocol: meta.protocol,
    target: meta.target,
    ...(meta.stack && { stack: meta.stack })
  };
  const newAgeneratorrcContent = yaml.dump(ageneratorrc, { lineWidth: 120 });
  await writeFile(ageneratorrcPath, newAgeneratorrcContent);
}

/**
 * Reads, updates, and writes the package.json file with the proper name.
 * @param {string} pkgPath - Path to the package.json file.
 * @param {Object} meta - Metadata object used to generate the package name.
 * @returns {Promise<string|undefined>} The new (or unchanged) package name, or undefined if error.
 */
async function updatePackageJson(pkgPath, meta) {
  let pkg;
  try {
    pkg = JSON.parse(await readFile(pkgPath, 'utf-8'));
  } catch (e) {
    throw new Error(`Error reading package.json at ${pkgPath}: ${e.message}`);
  }
  const expectedName = getTemplateName(meta);
  if (!expectedName) return undefined;
  if (pkg.name !== expectedName) {
    pkg.name = expectedName;
    await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  }
  return pkg.name;
}

/**
 * Writes the collected templates info into templatesInfo.js.
 * @param {Array} allTemplatesInfo - Array of template info objects.
 */
async function updateTemplatesInfoFile(allTemplatesInfo) {
  allTemplatesInfo.sort((a, b) => a.name.localeCompare(b.name));
  const banner = `// This file is auto-generated by script triggered by "npm run build".\n// DO NOT EDIT MANUALLY!\n\n`;
  const body = `module.exports = ${JSON.stringify(allTemplatesInfo, null, 2)};\n`;
  await writeFile(outputTemplatesInfoFile, banner + body);
}

async function main() {
  const allTemplatesInfo = [];

  const templates = await collectTemplates(templatesRoot);

  for (const { dir, relPath } of templates) {
    const meta = getTemplateMeta(relPath);

    if (!meta.type || !meta.protocol || !meta.target) {
      console.warn(`⚠️ Skipping template at ${dir}, could not detect [type/protocol/target] from path: ${relPath.join('/')}`);
      continue;
    }

    // Update YAML .ageneratorrc
    const ageneratorrcPath = path.join(dir, '.ageneratorrc');
    await updateAGeneratorRc(ageneratorrcPath, meta);

    // Update package.json
    const pkgPath = path.join(dir, 'package.json');
    const pkgName = await updatePackageJson(pkgPath, meta);
    if (!pkgName) continue;

    // Gather info for index
    allTemplatesInfo.push({
      name: pkgName,
      path: getTemplatePath(pkgName),
      type: meta.type,
      protocol: meta.protocol,
      ...(meta.stack && { stack: meta.stack }),
      target: meta.target,
    });
  }

  await updateTemplatesInfoFile(allTemplatesInfo);

  console.log(`Updated ${allTemplatesInfo.length} templates and generated ${outputTemplatesInfoFile}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});