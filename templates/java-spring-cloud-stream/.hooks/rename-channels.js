const fs = require('fs')
const path = require('path')

const sourceHead = '/src/main/java/'

module.exports = register => {
  register('generate:after', generator => {
    const asyncapi = generator.asyncapi
    let sourcePath = generator.targetDir + sourceHead
    const info = asyncapi.info()
    let package = generator.templateParams['java-package']

    if (!package && info) {
        const extensions = info.extensions()
        if (extensions) {
            package =  extensions['x-java-package']
        }
    }

    if (package) {
        //console.log("package: " + package)
        const overridePath = generator.targetDir + sourceHead + package.replace(/\./g, '/') + '/'
        console.log("Moving files from " + sourcePath + " to " + overridePath)
        let first = true
        fs.readdirSync(sourcePath).forEach( file => {
            if (first) {
                first = false
                fs.mkdirSync(overridePath, { recursive: true })
            }
            //console.log("file: " + file)
            fs.copyFileSync(path.resolve(sourcePath, file), path.resolve(overridePath, file))
            fs.unlinkSync(path.resolve(sourcePath, file))
        })
        sourcePath = overridePath
    }

    for (name in asyncapi.channels()) {
        const chan = asyncapi.channel(name)
        const extensions = chan.extensions()
        const className = extensions['x-java-class']
        const newName = name.replace(/\//g, "-")
        console.log("Renaming " + newName + " to " + className)
        fs.renameSync(path.resolve(sourcePath, newName), path.resolve(sourcePath, className + ".java"))
    }
  })
}

function dump(obj) {
    for (p in obj) {
        console.log(p)
    }
}
