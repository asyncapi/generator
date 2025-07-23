// This script traverse packages/templates and as a result updates template's .ageneratorrc with metadata and their package.json with proper name, then generate lib/templatesInfo.js
// Run with: `npm run build` always as pretest script

const { readdir, readFile, writeFile } = require('fs/promises');
const path = require('path');
const yaml = require('js-yaml');
const { transpileFiles } = require('@asyncapi/generator-react-sdk');

const GENERATOR_LIB_DIR = path.resolve(__dirname, '../lib');
const OUTPUT_TEMPLATES_INFO_FILE = path.join(GENERATOR_LIB_DIR, 'templates/BakedInTemplatesList.json');
const TEMPLATES_ROOT = '../../../packages/templates';
// No need to add dirs that start with `.`
const IGNORED_DIRS = ['test', '__tests__', '__fixtures__', '__snapshots__', 'components', 'helpers', 'node_modules', 'coverage', '__transpiled'];

// Templates structure inside generator/packages/templates must follow this opinionated naming convention:
const ALLOWED_TYPE_PATHS = ['docs', 'clients', 'sdks', 'configs'];

/**
 * Transpiles the template files from the given template path to the output directory.
 * This function makes sure that bundled templates are already transpiled with react engine,
 * so they can be used directly without further processing.
 * 
 * @param {string} templatePath - The path to the template directory.
 * @param {string} outputDir - The directory where the transpiled files will be written.
 * @returns {Promise<void>} A promise that resolves when the transpilation is complete.
 */
async function transpileTemplate(templatePath, outputDir) {
  try {
    await transpileFiles(templatePath, outputDir, { recursive: true });
  } catch (error) {
    console.log(`Error during template transpilation at ${templatePath}:`, error);
  }
}

/**
 * Maps plural path type to singular for metadata and templatesInfo.
 */
function normalizeType(type) {
  if (type === 'clients') return 'client';
  if (type === 'sdks') return 'sdk';
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
  
  const [, protocol, target, stack] = segments;
  return stack
    ? { type, protocol, target, stack }
    : { type, protocol, target };
}

/**
 * Generates a template name based on the metadata.
 * Format: `core-template-{type}-{protocol}-{target}-{stack}`.
 * If protocol/stack are not provided, they're omitted.
 * @param {Object} meta - The metadata of the template.
 * @returns {string|undefined} The generated template name, or undefined if not enough info.
 */
function getTemplateName(meta) {
  const { type, protocol, target, stack } = meta;
  const parts = [type, protocol, target, stack]
    .filter(Boolean)
    .map(s => String(s).toLowerCase());
  const name = parts.join('-');
  return name ? `core-template-${name}` : undefined;
}

/**
 * Generates a template path based on the package name.
 * The path is constructed in the format: `../../node_modules/{pkgName}`.
 * @param {string} pkgName - The name of the package.
 * @returns {string} The generated template path.
 */
function getTemplatePath(pkgName) {
  return `bakedInTemplates/${pkgName}`;
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
  const fullTemplatesDir = path.resolve(__dirname, dir);
  const entries = await readdir(fullTemplatesDir, { withFileTypes: true });

  for (const entry of entries) {
    if (isIgnored(entry.name)) continue;

    const fullPath = path.join(fullTemplatesDir, entry.name);
    if (entry.isDirectory()) {
      const subEntries = await readdir(fullPath);
      if (subEntries.includes('package.json') && subEntries.includes('.ageneratorrc')) {
        const relPathToTemplateSegments = [...relPath, entry.name];
        const repPathToTemplateInMonorepo = path.relative(GENERATOR_LIB_DIR, fullPath);

        result.push({ dir: fullPath, relPath: relPathToTemplateSegments, sourceRelPath: repPathToTemplateInMonorepo });
      } else {
        const relPathSegments = [...relPath, entry.name];
        await collectTemplates(fullPath, relPathSegments, result);
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
    await writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)  }\n`);
  }
  return pkg.name;
}

/**
 * Writes the collected templates info into BakedInTemplatesList.json, but only includes templates
 * that are already defined in dependencies or devDependencies of the generator's package.json.
 * @param {Array} allTemplatesInfo - Array of template info objects.
 */
async function updateTemplatesInfoFile(allTemplatesInfo) {
  allTemplatesInfo.sort((a, b) => a.name.localeCompare(b.name));
  const body = JSON.stringify(allTemplatesInfo, null, 2);
  await writeFile(outputTemplatesInfoFile, body);
}

async function main() {
  const allTemplatesInfo = [];
  const templates = await collectTemplates(TEMPLATES_ROOT);

  for (const { dir, relPath, sourceRelPath } of templates) {
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

    // Update YAML .ageneratorrc with metadata config object
    const ageneratorrcPath = path.join(dir, '.ageneratorrc');
    await updateAGeneratorRc(ageneratorrcPath, meta);

    // Update package.json with the proper template name
    const pkgPath = path.join(dir, 'package.json');
    const pkgName = await updatePackageJson(pkgPath, meta);
    if (!pkgName) continue;

    // Gather info for index
    const templateInfo = {
      name: pkgName,
      path: getTemplatePath(pkgName),
      templateSourceRelPath: sourceRelPath,
      type: meta.type,
      ...(meta.protocol && { protocol: meta.protocol }),
      target: meta.target,
      ...(meta.stack && { stack: meta.stack }),
    };
    allTemplatesInfo.push(templateInfo);
  }

  await updateTemplatesInfoFile(allTemplatesInfo);

  console.log(`Updated ${allTemplatesInfo.length} templates and generated ${OUTPUT_TEMPLATES_INFO_FILE}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});