const TEMPLATE_INSTALL_FLAG_MSG = 'because you passed --install flag';

const TEMPLATE_INSTALL_DISK_MSG = 'because the template cannot be found on disk';

const NODE_MODULES_INSTALL ='Remember that your local template must have its own node_modules installed first, \"npm install\" is not triggered by the generator.';

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
  if (packageDetails && packageDetails.pkgPath) {
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

function conditionalFilesMatched(relativeSourceFile) {
  return `${relativeSourceFile} was not generated because condition specified for this file in template configuration in conditionalFiles matched.`;
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
  conditionalFilesMatched

};