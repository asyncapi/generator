const TEMPLATE_INSTALL_FLAG_MSG = 'because you passed --install flag';

const TEMPLATE_INSTALL_DISK_MSG = 'because the template cannot be found on disk';

const NODE_MODULES_INSTALL = 'Remember that your local template must have its own node_modules installed first, "npm install" is not triggered by the generator.';

const NPM_INSTALL_TRIGGER = 'Installation of template located on disk technically means symlink creation betweed node_modules of the generator and template sources. Your local template must have its own node_modules, "npm install" is not triggered.';

function templateVersion(ver) {
  return `Version of used template is ${ver}.`;
}

function templateSource(localHtmlTemplate) {
  return `Template sources taken from ${localHtmlTemplate}.`;
}

function templateNotFound(templateName) {
  return `${templateName} not found in local dependencies but found it installed as a global package.`;
}

function packageNotAvailable(packageDetails) {
  if (packageDetails?.pkgPath) {
    return `Unable to resolve template location at ${packageDetails.pkgPath}. Package is not available locally.`;
  }
  return `Template is not available locally and expected location is undefined. Known details are: ${JSON.stringify(packageDetails, null, 2)}`;
}

function installationDebugMessage(debugMessage) {
  return `Template installation started ${debugMessage}.`;
}

function templateSuccessfullyInstalled(packageName, packagePath) {
  return `Template ${packageName} successfully installed in ${packagePath}.`;
}

function relativeSourceFileNotGenerated(relativeSourceFile , subject) {
  return `${relativeSourceFile} was not generated because ${subject} specified in template configuration in conditionalFiles was not found in provided AsyncAPI specification file.`;
}

function invalidParameter(matchedConditionPath, parameter) {
  return `[Warning] Skipping Generation for : "${matchedConditionPath}". This file was not generated because the parameter "${parameter}" defined in 'conditionalGeneration' was not valid.`;
}

function skipOverwrite(testFilePath) {
  return `Skipping overwrite for: ${testFilePath}`;
}

function conditionalGenerationMatched(conditionalPath) {
  return `${conditionalPath} was not generated because condition specified for this location in template configuration in conditionalGeneration matched.`;
}
// conditionalFiles becomes deprecated with this PR, and soon will be removed.
// TODO: https://github.com/asyncapi/generator/issues/1553
function conditionalFilesMatched(relativeSourceFile) {
  return `${relativeSourceFile} was not generated because condition specified for this file in template configuration in conditionalFiles matched.`;
}

function compileEnabled(dir, output_dir) {
  return `Transpilation of files ${dir} into ${output_dir} started.`;
}

module.exports = {
  TEMPLATE_INSTALL_FLAG_MSG,
  TEMPLATE_INSTALL_DISK_MSG,
  NODE_MODULES_INSTALL,
  NPM_INSTALL_TRIGGER,
  templateVersion,
  templateSource,
  templateNotFound,
  packageNotAvailable,
  installationDebugMessage,
  templateSuccessfullyInstalled,
  relativeSourceFileNotGenerated,
  invalidParameter,
  conditionalGenerationMatched,
  conditionalFilesMatched,
  compileEnabled,
  skipOverwrite
};
