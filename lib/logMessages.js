const templateInstallStartedMsg ='Template installation started because you passed --install flag'

const node_modulesInstall ='Remember that your local template must have its own node_modules installed first, \"npm install\" is not triggered by the generator.'

const npmInstallTrigger = 'Installation of template located on disk technically means symlink creation betweed node_modules of the generator and template sources. Your local template must have its own node_modules, "npm install" is not triggered.'

function templateVersion(ver){
   
    return `Version of used template is ${ver}.` ;
} 


function templateSource(localHtmlTemplate){
   
    return `Template sources taken from ${localHtmlTemplate}.` ;
} 

function templateNotFound(templateName){
   
    return `${templateName} not found in local dependencies but found it installed as a global package.` ;
} 

function packageNotAvailable(pkgPath){
    return `Unable to resolve template location at ${pkgPath}. Package is not available locally`;
}

function InstallationDebugMessage(debugMessage){
   return `Template installation started ${debugMessage}`
}

function TemplateSuccessfullyInstalled(packageName, packagePath){
    return `Template ${packageName} successfully installed in ${packagePath}`
}


function RelativeSourceFileNotGenerated(relativeSourceFile , subject){
   return `${relativeSourceFile} was not generated because ${subject} specified in template configuration in conditionalFiles was not found in provided AsyncAPI specification file`
}

function conditionalFilesMatched(relativeSourceFile)
{return `${relativeSourceFile} was not generated because condition specified for this file in template configuration in conditionalFiles matched`}

module = module.exports = {
    templateInstallStartedMsg ,
    node_modulesInstall,
    npmInstallTrigger,
    templateVersion ,
    templateSource,
    templateNotFound,
    packageNotAvailable,
    InstallationDebugMessage,
    TemplateSuccessfullyInstalled,
    RelativeSourceFileNotGenerated,
    conditionalFilesMatched

}