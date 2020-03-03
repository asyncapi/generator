// vim: set ts=2 sw=2 sts=2 expandtab :
module.exports = ({ Nunjucks }) => {

  var yaml = require('js-yaml')
  var _ = require('lodash')

  // This maps json schema types to Java format strings.
  const formatMap = new Map()
  formatMap.set('boolean', '%s')
  formatMap.set('enum', '%s')
  formatMap.set('integer', '%d')
  formatMap.set('number', '%f')
  formatMap.set('string', '%s')

  // This maps json schema types to examples of values.
  const sampleMap = new Map()
  sampleMap.set('boolean', 'true')
  sampleMap.set('integer', '1')
  sampleMap.set('number', '1.1')
  sampleMap.set('string', '"string"')

  // This maps json schema types to Java types.
  const typeMap = new Map()
  typeMap.set('boolean', 'Boolean')
  typeMap.set('integer', 'Integer')
  typeMap.set('number', 'Double')
  typeMap.set('string', 'String')

  // This generates the object that gets rendered in the application.yaml file.
  Nunjucks.addFilter('appProperties', ([asyncapi, params]) => {
    params.binder = params.binder || 'kafka'
    if (params.binder != 'kafka' && params.binder != 'rabbit' && params.binder != 'solace') {
      throw new Error("Please provide a parameter named 'binder' with the value kafka, rabbit or solace.")
    }

    let doc = {}
    doc.spring = {}
    doc.spring.cloud = {}
    doc.spring.cloud.stream = {}
    let scs = doc.spring.cloud.stream
    scs.function = {}
    scs.function.definition = getFunctionDefinitions(asyncapi)
    scs.bindings = getBindings(asyncapi, params)

    if (params.binder === 'solace') {
      let additionalSubs = getAdditionalSubs(asyncapi)

      if (additionalSubs) {
        scs.solace = additionalSubs
      }
    }

    let type = params.artifactType
    if (type && type === 'application') {
      if (params.binder === 'solace') {
        doc.solace = getSolace(params)
      }

      doc.logging = {}
      doc.logging.level = {}
      doc.logging.level.root = 'info'
      doc.logging.level.org = {}
      doc.logging.level.org.springframework = 'info'

      if (params.actuator === 'true') {
        doc.server = {}
        doc.server.port = 8080
        doc.management = {}
        doc.management.endpoints = {}
        doc.management.endpoints.web = {}
        doc.management.endpoints.web.exposure = {}
        doc.management.endpoints.web.exposure.include = '*'
      }
    }
    let ym = yaml.safeDump(doc, { lineWidth: 200 } )
    //console.log(ym)
    return ym
  })

  Nunjucks.addFilter('artifactId', ([info, params]) => {
    return getParamOrExtension(info, params, 'artifactId', 'x-artifact-id', 'Maven artifact ID', 'my-application')
  })

  Nunjucks.addFilter('camelCase', (str) => {
    return _.camelCase(str)
  })

  // This determines the base function name that we will use for the SCSt mapping between functions and bindings.
  Nunjucks.addFilter('functionName', ([channelName, channel]) => {
    return getFunctionName(channelName, channel)
  })

  Nunjucks.addFilter('indent1', (numTabs) => {
    return indent(numTabs)
  })

  Nunjucks.addFilter('indent2', (numTabs) => {
    return indent(numTabs + 1)
  })

  Nunjucks.addFilter('indent3', (numTabs) => {
    return indent(numTabs + 2)
  })

  // This returns the proper Java type for a schema property.
  Nunjucks.addFilter('fixType', ([name, property]) => {

    // For message headers, type is a property.
    // For schema properties, type is a function.
    let type = property.type

    if (typeof type == "function") {
      type = property.type()
    }

    // console.log('fixType: ' + name + ' ' + type + ' ' + dump(property._json) + ' ' )

    // If a schema has a property that is a ref to another schema,
    // the type is undefined, and the title gives the title of the referenced schema.
    let ret
    if (type === undefined) {
      if (property._json.enum) {
        ret = _.upperFirst(name)
      } else {
        ret = property.title()
      }
    } else if (type === 'array') {
      let itemsType = property._json.items.type
      if (itemsType) {
        itemsType = typeMap.get(itemsType)
        if (!itemsType) {
          throw new Error("Can't determine the type of the array property " + name)
        }
      }
      if (!itemsType) {
        itemsType = property._json.items.title
        if (!itemsType) {
          throw new Error("Can't determine the type of the array property " + name)
        }
      }
      //console.log('array: ' + title)
      ret = _.upperFirst(itemsType) + "[]"
    } else if (type === 'object') {
      ret = _.upperFirst(name)
    } else {
      ret = typeMap.get(type)
      if (!ret) {
        ret = type
      }
    }
    return ret
  })

  Nunjucks.addFilter('groupId', ([info, params]) => {
    return getParamOrExtension(info, params, 'groupId', 'x-group-id', 'Maven group ID.', 'com.company')
  })

  Nunjucks.addFilter('lowerFirst', (str) => {
    return _.lowerFirst(str)
  })

  // This returns the Java class name of the payload.
  Nunjucks.addFilter('payloadClass', ([channelName, channel]) => {
    let ret = getPayloadClass(channel.publish())
    if (!ret) {
      ret = getPayloadClass(channel.subscribe())
    }
    if (!ret) {
      throw new Error("Channel " + channelName + ": no payload class has been defined.")
    }
    return ret
  })

  Nunjucks.addFilter('solaceSpringCloudVersion', ([info, params]) => {
    return getParamOrExtension(info, params, 'solaceSpringCloudVersion', 'x-solace-spring-cloud-version', 'Solace Spring Cloud version', '1.0.0-SNAPSHOT')
  })

  Nunjucks.addFilter('springCloudStreamVersion', ([info, params]) => {
    return getParamOrExtension(info, params, 'springCloudStreamVersion', 'x-spring-cloud-stream-version', 'Spring Cloud Stream version', '3.0.1.RELEASE')
  })

  Nunjucks.addFilter('springCloudVersion', ([info, params]) => {
    return getParamOrExtension(info, params, 'springCloudVersion', 'x-spring-cloud-version', 'Spring Cloud version', 'Hoxton.SR1')
  })

  // This returns an object containing information the template needs to render topic strings.
  Nunjucks.addFilter('topicInfo', ([channelName, channel]) => {
    let p = channel.parameters()
    return getTopicInfo(channelName, channel)
  })

  Nunjucks.addFilter('upperFirst', (str) => {
    return _.upperFirst(str)
  })

  function dump(obj) {
    let s = typeof obj
    for (let p in obj) {
      s += " "
      s += p
    }
    return s
  }

  // For the Solace binder. This determines the topic that must be subscribed to on a queue, when the x-scs-destination is given (which is the queue name.)
  function getAdditionalSubs(asyncapi) {
    let ret

    for (let channelName in asyncapi.channels()) {
      let channel = asyncapi.channels()[channelName]
      let channelJson = channel._json
      
      if (channelJson.subscribe) {
        let functionName = getFunctionName(channelName, channel)
        let topicInfo = getTopicInfo(channelName, channel)
        let queue = channelJson.subscribe['x-scs-destination']
        if (topicInfo.hasParams || queue) {
          if (!ret) {
            ret = {}
            ret.bindings = {}
          }
          let bindingName = functionName + "Consumer-in-0"
          ret.bindings[bindingName] = {}
          ret.bindings[bindingName].consumer = {}
          ret.bindings[bindingName].consumer.queueAdditionalSubscriptions = topicInfo.subscribeTopic
        }
      }
    } 

    return ret
  }

  // This returns the SCSt bindings config that will appear in application.yaml.
  function getBindings(asyncapi, params) {
    let ret = {}

    for (let channelName in asyncapi.channels()) {
      let channel = asyncapi.channels()[channelName]
      let channelJson = channel._json
      let functionName = getFunctionName(channelName, channel)
      //console.log("topicFunc: " + topicFunc)
      //console.log("channelName: " + channelName)
      //console.log("channelJson: " + channelJson)
      let topicInfo = getTopicInfo(channelName, channel)
      // if there are topic parameters, it doesn't make sense to include the publish destination.
      if (channelJson.publish && !topicInfo.hasParams) {
        bindingName = functionName + "Supplier-out-0"
        ret[bindingName] = {}
        ret[bindingName].destination = channelName
      }
      if (channelJson.subscribe) {
        //console.log("sub: " + JSON.stringify(channelJson.subscribe))
        let subDestination
        let group = channelJson.subscribe['x-scs-group']
        let queue = channelJson.subscribe['x-scs-destination']
        //console.log('channel ' + channelName + ' group: ' + group + ' queue: ' + queue  );

        if (queue && params.binder === 'solace') {
          subDestination = queue
        }

        if (topicInfo.hasParams && !subDestination) {
          throw new Error("channel " + channelName + " has parameters but no queue has been specified. A queue is required when a topic has parameters. Add a value: channel.subscribe.x-scs-destination");
        }

        subDestination = subDestination || topicInfo.subscribeTopic
        bindingName = functionName + "Consumer-in-0"
        ret[bindingName] = {}
        ret[bindingName].destination = subDestination
        if (group) {
          ret[bindingName].group = group
        }
      }
    }

    return ret
  }

  // This returns the base function name that SCSt will use to map functions with bindings.
  function getFunctionName(channelName, channel) {
    let ret = _.camelCase(channelName)
    let channelJson = channel._json
    //console.log('functionName channel: ' + JSON.stringify(channelJson))
    let functionName = channelJson['x-scs-function-name']
    //console.log('function name for channel ' + channelName + ': ' + functionName);
    if (functionName) {
      ret = functionName
    }
    return ret
  }

  // This returns the string that gets rendered in the function.definition part of application.yaml.
  function getFunctionDefinitions(asyncapi) {
    let ret = ""

    for (let channelName in asyncapi.channels()) {
      let channel = asyncapi.channels()[channelName]
      let channelJson = channel._json
      let functionName = getFunctionName(channelName, channel)
      if (channelJson.publish) {
        ret += functionName + "Supplier;"
      }
      if (channelJson.subscribe) {
        ret += functionName + "Consumer;"
      }
    }
    return ret
  }

  // This returns the value of a param, or specification extention if the param isn't set. If neither are set it throws an error.
  function getParamOrExtension(info, params, paramName, extensionName, description, example) {
    let ret = ''
    if (params[paramName]) {
      ret = params[paramName]
    } else if (info.extensions()[extensionName]) {
      ret = info.extensions()[extensionName]
    } else {
      throw new Error(`Can't determine the ${description}. Please set the param ${paramName} or info.${extensionName}. Example: ${example}`)
    }
    return ret
  }

  // This returns the value of a param, or 'xxxxx' if not found. This is for generating connection string placeholders in application.yaml.
  function getParamOrXs(params, param) {
    let ret = params[param]
    if (!ret) {
      ret = "xxxxx"
    }

    return ret
  }

  function getPayloadClass(pubOrSub) {
    let ret

    //console.log("getPayloadClass: "  + JSON.stringify(pubOrSub._json.message))
    if (pubOrSub && pubOrSub._json && pubOrSub._json.message && pubOrSub._json.message.payload) {
      ret = _.upperFirst(pubOrSub._json.message.payload.title)
    }

    return ret
  }

  // This returns the connection properties for a solace binder, for application.yaml.
  function getSolace(params) {
    let ret = {}
    ret.java = {}
    ret.java.host = getParamOrXs(params, 'host')
    ret.java.msgVpn = getParamOrXs(params, 'msgVpn')
    ret.java.clientUsername = getParamOrXs(params, 'username')
    ret.java.clientPassword = getParamOrXs(params, 'password')
    return ret;
  }

  // This returns an object containing information the template needs to render topic strings.
  function getTopicInfo(channelName, channel) {
    const ret = {}
    let publishTopic = String(channelName)
    let subscribeTopic = String(channelName)
    const params = []
    let functionParamList = ""
    let functionArgList = ""
    let sampleArgList = ""
    let first = true

    //console.log("params: " + JSON.stringify(channel.parameters()))
    for (let name in channel.parameters()) {
      const nameWithBrackets = "{" + name + "}"
      const schema = channel.parameter(name)['_json']['schema']
      //console.log("schema: " + dump(schema))
      const type = schema.type
      const param = { "name": _.lowerFirst(name) }
      let sampleArg = 1

      if (first) {
        first = false
      } else {
        functionParamList += ", "
        functionArgList += ", "
      }

      sampleArgList += ", "

      if (type) {
        //console.log("It's a type: " + type)
        const javaType = typeMap.get(type)
        if (!javaType) throw new Error("topicInfo filter: type not found in typeMap: " + type)
        param.type = javaType
        const printfArg = formatMap.get(type)
        //console.log("printf: " + printfArg)
        if (!printfArg) throw new Error("topicInfo filter: type not found in formatMap: " + type)
        //console.log("Replacing " + nameWithBrackets)
        publishTopic = publishTopic.replace(nameWithBrackets, printfArg)
        sampleArg = sampleMap.get(type)
      } else {
        const en = schema.enum
        if (en) {
          //console.log("It's an enum: " + en)
          param.type = _.upperFirst(name)
          param.enum = en
          sampleArg = "Messaging." + param.type + "." + en[0]
          //console.log("Replacing " + nameWithBrackets)
          publishTopic = publishTopic.replace(nameWithBrackets, "%s")
        } else {
          throw new Error("topicInfo filter: Unknown parameter type: " + JSON.stringify(schema))
        }
      }

      subscribeTopic = subscribeTopic.replace(nameWithBrackets, "*")
      functionParamList += param.type + " " + param.name
      functionArgList += param.name
      sampleArgList += sampleArg
      params.push(param)
    }
    ret.functionArgList = functionArgList
    ret.functionParamList = functionParamList
    ret.sampleArgList = sampleArgList
    ret.channelName = channelName
    ret.params = params
    ret.publishTopic = publishTopic
    ret.subscribeTopic = subscribeTopic
    ret.hasParams = params.length > 0
    return ret
  }

  function indent(numTabs) {
    return "\t".repeat(numTabs)
  }

}
