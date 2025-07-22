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

// Templates structure inside generator/packages/templates must follow this opinionated naming convention:
const ALLOWED_TYPE_PATHS = ['docs', 'clients', 'sdks', 'configs'];

/**
 * Maps plural path type to singular for metadata and templatesInfo.
 */
function normalizeType(type) {
  if (type === 'clients') return 'client';
  if (type === 'configs') return 'config';
  return type;
}

function isIgnored(name) {
  return IGNORED_DIRS.includes(name) || name.startsWith('.');
}

/**
 * Extracts template metadata from the path segments and normalizes the type.
 * @param {string[]} segments - The path segments of the template.
 * @returns {Object} The metadata object.
 */
function getTemplateMeta(segments) {
  if (!segments.length) return {};

  const typePath = segments[0];
  if (!ALLOWED_TYPE_PATHS.includes(typePath)) throw new Error(`Invalid template type path: ${typePath}. Allowed paths are: ${ALLOWED_TYPE_PATHS.join(', ')}`);

  const type = normalizeType(typePath);

  // docs/html or configs/yaml
  // assumption is that these two types have only one segment after the type that always describes the target
  if ((typePath === 'docs' || typePath === 'configs') && segments.length === 2) {
    const [, target] = segments;
    return { type, target };
  }
  else {
    const [, protocol, target, stack] = segments;
    return stack
      ? { type, protocol, target, stack }
      : { type, protocol, target };
  }
}

/**
 * Generates a template name based on the metadata.
 * Format: `@asyncapi/core-template-{type}-{protocol}-{target}-{stack}`.
 * If protocol/stack are not provided, they're omitted.
 * @param {Object} meta - The metadata of the template.
 * @returns {string|undefined} The generated template name, or undefined if not enough info.
 */
function getTemplateName(meta) {
  const { type, protocol, target, stack } = meta;
  let parts = [type, protocol, target, stack]
    .filter(Boolean)
    .map(s => String(s).toLowerCase());
  let name = parts.join('-');
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
    ...(meta.protocol && { protocol: meta.protocol }),
    target: meta.target,
    ...(meta.stack && { stack: meta.stack }),
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

    // For docs and configs: require type and target and no others
    if ((meta.type === 'docs' || meta.type === 'config') && (!meta.type || !meta.target || meta.protocol)) {
      console.warn(`⚠️ Skipping template at ${dir}, wrong metadata for docs/config: ${relPath.join('/')}`);
      continue;
    }
    // For clients and sdks: require type, protocol, and target.
    if ((meta.type === 'client' || meta.type === 'sdk') && (!meta.type || !meta.protocol || !meta.target)) {
      console.warn(`⚠️ Skipping template at ${dir}, not enough metadata for client/sdk: ${relPath.join('/')}`);
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
    const templateInfo = {
      name: pkgName,
      path: getTemplatePath(pkgName),
      type: meta.type,
      ...(meta.protocol && { protocol: meta.protocol }),
      target: meta.target,
      ...(meta.stack && { stack: meta.stack }),
    };
    allTemplatesInfo.push(templateInfo);
  }

  await updateTemplatesInfoFile(allTemplatesInfo);

  console.log(`Updated ${allTemplatesInfo.length} templates and generated ${outputTemplatesInfoFile}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});