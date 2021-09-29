const fs = require('fs');

module.exports = {
    'generate:after': generator => {
        if(generator.templateParams.outFilename !== 'index.html') {
            fs.renameSync(`${generator.targetDir}/index.html`,
                `${generator.targetDir}/${generator.templateParams.outFilename}`);
        }
    }
}
