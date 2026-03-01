// This script traverses packages/templates and updates template's .ageneratorrc with metadata,
// updates their package.json with proper name,
// then generates lib/templates/BakedInTemplatesList.json
// Run with: `npm run build` always as pretest script

const { readdir, readFile, writeFile, cp } = require('fs/promises');
const path = require('path');
const yaml = require('js-yaml');
const { transpileFiles } = require('@asyncapi/generator-react-sdk');

const MONOREPO_ROOT = path.resolve(__dirname, '../../../');
const GENERATOR_LIB_DIR = path.resolve(__dirname, '../lib');
const OUTPUT_TEMPLATES_INFO_FILE = path.join(
  GENERATOR_LIB_DIR,
  'templates/BakedInTemplatesList.json'
);
const TEMPLATES_ROOT = path.join(MONOREPO_ROOT, 'packages/templates');

const IGNORED_DIRS = [
  'test',
  '__tests__',
  '__fixtures__',
  '__snapshots__',
  'components',
  'helpers',
  'node_modules',
  'coverage',
  '__transpiled'
];

const ALLOWED_TYPE_PATHS = ['docs', 'clients', 'sdks', 'configs'];

async function main() {
  const allTemplatesInfo = [];

  const templates = await collectTemplates(TEMPLATES_ROOT);

  for (const { dir, relPath } of templates) {
    const meta = getTemplateMeta(relPath);

    // Validation
    if (
      (meta.type === 'docs' || meta.type === 'config') &&
      (!meta.target || meta.protocol)
    ) {
      console.warn(`⚠️ Skipping template at ${dir}, wrong metadata.`);
      continue;
    }

    if (
      (meta.type === 'client' || meta.type === 'sdk') &&
      (!meta.protocol || !meta.target)
    ) {
      console.warn(`⚠️ Skipping template at ${dir}, missing metadata.`);
      continue;
    }

    await updateAGeneratorRc(path.join(dir, '.ageneratorrc'), meta);

    const pkgName = await updatePackageJson(
      path.join(dir, 'package.json'),
      meta
    );

    if (!pkgName) continue;

    await transpileTemplate(
      dir,
      path.join(
        GENERATOR_LIB_DIR,
        'templates',
        getTranspiledGeneratorTemplatePath(pkgName)
      )
    );

    allTemplatesInfo.push(getTranspiledTemplateInfo(meta, pkgName));
  }

  await updateTemplatesInfoFile(allTemplatesInfo);

  console.log(
    `Updated ${allTemplatesInfo.length} templates and generated ${OUTPUT_TEMPLATES_INFO_FILE}`
  );
}

/* -----------------------------
   Template Processing Helpers
----------------------------- */

function getTranspiledTemplateInfo(meta, pkgName) {
  return {
    name: pkgName,
    type: meta.type,
    ...(meta.protocol && { protocol: meta.protocol }),
    target: meta.target,
    ...(meta.stack && { stack: meta.stack })
  };
}

async function transpileTemplate(templatePath, outputDir) {
  try {
    await transpileFiles(
      templatePath,
      path.join(outputDir, '__transpiled'),
      { recursive: true }
    );

    const shouldCopy = (src) => {
      const base = path.basename(src);
      return (
        base !== '__transpiled' &&
        base !== 'node_modules' &&
        base !== 'test'
      );
    };

    await cp(templatePath, outputDir, {
      filter: shouldCopy,
      recursive: true
    });
  } catch (error) {
    throw new Error(
      `Error during template transpilation at ${templatePath}: ${error.message}`
    );
  }
}

/* -----------------------------
   Metadata Logic
----------------------------- */

function normalizeType(type) {
  if (type === 'clients') return 'client';
  if (type === 'sdks') return 'sdk';
  if (type === 'configs') return 'config';
  return type;
}

function getTemplateMeta(segments) {
  if (!segments.length) return {};

  const typePath = segments[0];

  if (!ALLOWED_TYPE_PATHS.includes(typePath)) {
    throw new Error(
      `Invalid template type path: ${typePath}. Allowed: ${ALLOWED_TYPE_PATHS.join(', ')}`
    );
  }

  const type = normalizeType(typePath);

  // docs/html or configs/yaml
  if ((type === 'docs' || type === 'config') && segments.length === 2) {
    return {
      type,
      target: segments[1]
    };
  }

  if (segments.length < 3 || segments.length > 4) {
    throw new Error(`Invalid template structure: ${segments.join('/')}`);
  }

  const [, protocol, target, stack] = segments;

  return stack
    ? { type, protocol, target, stack }
    : { type, protocol, target };
}

function getTemplateName(meta) {
  const parts = [meta.type, meta.protocol, meta.target, meta.stack]
    .filter(Boolean)
    .map((s) => String(s).toLowerCase());

  return parts.length ? `core-template-${parts.join('-')}` : undefined;
}

function getTranspiledGeneratorTemplatePath(pkgName) {
  return path.join('bakedInTemplates', pkgName);
}

/* -----------------------------
   Filesystem Helpers
----------------------------- */

function isIgnored(name) {
  return IGNORED_DIRS.includes(name) || name.startsWith('.');
}

async function collectTemplates(dir, relPath = [], result = []) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (isIgnored(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const subEntries = await readdir(fullPath);
      const isTemplate =
        subEntries.includes('package.json') &&
        subEntries.includes('.ageneratorrc');

      if (isTemplate) {
        result.push({
          dir: fullPath,
          relPath: [...relPath, entry.name]
        });
      } else {
        await collectTemplates(
          fullPath,
          [...relPath, entry.name],
          result
        );
      }
    }
  }

  return result;
}

async function updateAGeneratorRc(ageneratorrcPath, meta) {
  let ageneratorrc = {};

  try {
    const content = await readFile(ageneratorrcPath, 'utf-8');
    ageneratorrc = yaml.load(content) || {};
  } catch (e) {
    throw new Error(
      `Error reading .ageneratorrc at ${ageneratorrcPath}: ${e.message}`
    );
  }

  ageneratorrc.metadata = {
    type: meta.type,
    ...(meta.protocol && { protocol: meta.protocol }),
    target: meta.target,
    ...(meta.stack && { stack: meta.stack })
  };

  await writeFile(
    ageneratorrcPath,
    yaml.dump(ageneratorrc, { lineWidth: 120 })
  );
}

async function updatePackageJson(pkgPath, meta) {
  let pkg;

  try {
    pkg = JSON.parse(await readFile(pkgPath, 'utf-8'));
  } catch (e) {
    throw new Error(
      `Error reading package.json at ${pkgPath}: ${e.message}`
    );
  }

  const expectedName = getTemplateName(meta);
  if (!expectedName) return;

  if (pkg.name !== expectedName) {
    pkg.name = expectedName;
    await writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  }

  return pkg.name;
}

async function updateTemplatesInfoFile(allTemplatesInfo) {
  allTemplatesInfo.sort((a, b) => a.name.localeCompare(b.name));

  await writeFile(
    OUTPUT_TEMPLATES_INFO_FILE,
    JSON.stringify(allTemplatesInfo, null, 2)
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
