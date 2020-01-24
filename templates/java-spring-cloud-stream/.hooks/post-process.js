const fs = require('fs')
const path = require('path')

const sourceHead = '/src/main/java/'

module.exports = register => {
  register('generate:after', generator => {
    const asyncapi = generator.asyncapi
    let sourcePath = generator.targetDir + sourceHead
    const info = asyncapi.info()
    let package = generator.templateParams['javaPackage']

    if (!package && info) {
      const extensions = info.extensions()
      if (extensions) {
        package = extensions['x-java-package']
      }
    }

    if (package) {
      //console.log("package: " + package)
      const overridePath = generator.targetDir + sourceHead + package.replace(/\./g, '/') + '/'
      //console.log("Moving files from " + sourcePath + " to " + overridePath)
      let first = true
      fs.readdirSync(sourcePath).forEach(file => {
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

    // Rename the pom file if necessary, and only include Application.java when an app is requested.
    let artifactType = generator.templateParams['artifactType']

    if (!artifactType || artifactType === "library") {
      fs.renameSync(path.resolve(generator.targetDir, "pom.lib"), path.resolve(generator.targetDir, "pom.xml"))
      fs.unlinkSync(path.resolve(generator.targetDir, "pom.app"))
      fs.unlinkSync(path.resolve(sourcePath, "Application.java"))
    } else {
      fs.renameSync(path.resolve(generator.targetDir, "pom.app"), path.resolve(generator.targetDir, "pom.xml"))
      fs.unlinkSync(path.resolve(generator.targetDir, "pom.lib"))
    }
  })
}

function dump(obj) {
  for (p in obj) {
    console.log(p)
  }
}
