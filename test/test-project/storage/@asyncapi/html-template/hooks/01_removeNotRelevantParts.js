const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

module.exports = {
    'generate:after': generator => {

        const params = generator.templateParams;
        const singleFile = params.singleFile === 'true';
        
        if (singleFile) {

            const jsDir = path.resolve(generator.targetDir, 'js');
            const cssDir = path.resolve(generator.targetDir, 'css');

            const callback = (error) => {
                if (error) {
                    throw error;
                }
            };

            const opts = {
                disableGlob: true,
                maxBusyTries: 3
            };

            rimraf(jsDir, opts, callback);
            rimraf(cssDir, opts, callback);
        }
    }
};
