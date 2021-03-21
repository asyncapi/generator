const template_Install_Started_Msg ='Template installation started because you passed --install flag';

const node_modules_Install ='Remember that your local template must have its own node_modules installed first, \"npm install\" is not triggered by the generator.';

const npm_Install_Trigger = 'Installation of template located on disk technically means symlink creation betweed node_modules of the generator and template sources. Your local template must have its own node_modules, "npm install" is not triggered.';

function templateVersion(ver) {  
  return `Version of used template is ${ver}.`;
} 

function templateSource(localHtmlTemplate) {
  return `Template sources taken from ${localHtmlTemplate}.`;
} 

function templateNotFound(templateName) {
  return `${templateName} not found in local dependencies but found it installed as a global package.`;
} 

function packageNotAvailable(pkgPath) {
  return `Unable to resolve template location at ${pkgPath}. Package is not available locally`;
}

function installationDebugMessage(debugMessage) {
  return `Template installation started ${debugMessage}`;
}

function templateSuccessfullyInstalled(packageName, packagePath) {
  return `Template ${packageName} successfully installed in ${packagePath}`;
}

function relativeSourceFileNotGenerated(relativeSourceFile , subject) {
  return `${relativeSourceFile} was not generated because ${subject} specified in template configuration in conditionalFiles was not found in provided AsyncAPI specification file`;
}

function conditionalFilesMatched(relativeSourceFile) {
  return `${relativeSourceFile} was not generated because condition specified for this file in template configuration in conditionalFiles matched`;
}

module.exports = {
  template_Install_Started_Msg ,
  node_modules_Install,
  npm_Install_Trigger,
  templateVersion ,
  templateSource,
  templateNotFound,
  packageNotAvailable,
  installationDebugMessage,
  templateSuccessfullyInstalled,
  relativeSourceFileNotGenerated,
  conditionalFilesMatched

};