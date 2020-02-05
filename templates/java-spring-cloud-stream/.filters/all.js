// vim: set ts=2 sw=2 sts=2 expandtab :
module.exports = ({ Nunjucks, _ }) => {

  var yaml = require('js-yaml')

  // This maps json schema types to Java format strings.
  const formatMap = new Map()
  formatMap.set('boolean', '%s')
  formatMap.set('enum', '%s')
  formatMap.set('integer', '%d')
  formatMap.set('number', '%f')
  formatMap.set('string', '%s')

  // This maps json schema types to Java format strings.
  const sampleMap = new Map()
  sampleMap.set('boolean', 'true')
  sampleMap.set('integer', '1')
  sampleMap.set('number', '1.1')
  sampleMap.set('string', '"string"')

  const typeMap = new Map()
  typeMap.set('boolean', 'Boolean')
  typeMap.set('integer', 'Integer')
  typeMap.set('number', 'Double')
  typeMap.set('string', 'String')

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
    let ret = ''
    if (params['artifactId']) {
      ret = params['artifactId']
    } else if (info.extensions()['x-artifact-id']) {
      ret = info.extensions()['x-artifact-id']
    } else if (info.title()) {
      ret = _.kebabCase(info.title())
    } else {
      throw new Error("Can't determine the artifact id. Please set the param artifact-id, or element info.title or info.x-artifact-id.")
    }
    return ret
  })

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
    let ret = ''
    if (params['groupId']) {
      ret = params['groupId']
    } else if (info.extensions()['x-group-id']) {
      ret = info.extensions()['x-group-id']
    } else {
      throw new Error("Can't determine the group id. Please set the param groupId or element info.x-group-id.")
    }
    return ret
  })

  Nunjucks.addFilter('lowerFirst', (str) => {
    return _.lowerFirst(str)
  })

  Nunjucks.addFilter('payloadClass', ([channelName, channel]) => {
    let ret = payloadClass(channel.publish())
    if (!ret) {
      ret = payloadClass(channel.subscribe())
    }
    if (!ret) {
      throw new Error("Channel " + channelName + ": no payload class has been defined.")
    }
    return ret
  })

  Nunjucks.addFilter('solaceSpringCloudVersion', ([info, params]) => {
    let ret = ''
    if (params['solaceSpringCloudVersion']) {
      ret = params['solaceSpringCloudVersion']
    } else if (info.extensions()['x-solace-spring-cloud-version']) {
      ret = info.extensions()['x-solace-spring-cloud-version']
    } else {
      throw new Error("Can't determine the Solace Spring Cloud version. Please set the param solaceSpringCloudVersion or info.x-solace-spring-cloud-version. Example: 1.0.0.RELEASE")
    }
    return ret
  })

  Nunjucks.addFilter('springCloudStreamVersion', ([info, params]) => {
    let ret = ''
    if (params['springCloudStreamVersion']) {
      ret = params['springCloudStreamVersion']
    } else if (info.extensions()['x-spring-cloud-stream-version']) {
      ret = info.extensions()['x-spring-cloud-stream-version']
    } else {
      throw new Error("Can't determine the Spring Cloud Stream version. Please set the param springCloudStreamVersion or info.x-spring-cloud-stream-version. Example: 3.0.1.RELEASE")
    }
    return ret
  })

  Nunjucks.addFilter('springCloudVersion', ([info, params]) => {
    let ret = ''
    if (params['springCloudVersion']) {
      ret = params['springCloudVersion']
    } else if (info.extensions()['x-spring-cloud-version']) {
      ret = info.extensions()['x-spring-cloud-version']
    } else {
      throw new Error("Can't determine the Spring Cloud version. Please set the param springCloudVersion or info.x-spring-cloud-version. Example: Hoxton.RELEASE")
    }
    return ret
  })

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

  function getFunctionDefinitions(asyncapi) {
    let ret = ""

    for (let channelName in asyncapi.channels()) {
      let channel = asyncapi.channels()[channelName]
      let channelJson = channel._json
      let functionName = getFunctionName(channelName, channel)
      if (channel.publish) {
        ret += functionName + "Supplier;"
      }
      if (channel.subscribe) {
        ret += functionName + "Consumer;"
      }
    }
    return ret
  }

  function getParamOrXs(params, param) {
    let ret = params[param]
    if (!ret) {
      ret = "xxxxx"
    }

    return ret
  }

  function getSolace(params) {
    let ret = {}
    ret.java = {}
    ret.java.host = getParamOrXs(params, 'host')
    ret.java.msgVpn = getParamOrXs(params, 'msgVpn')
    ret.java.clientUsername = getParamOrXs(params, 'username')
    ret.java.clientPassword = getParamOrXs(params, 'password')
    return ret;
  }

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

  function messageClass(pubOrSub) {
    let ret

    //console.log("messageClass : " + JSON.stringify(pubOrSub))
    if (pubOrSub && pubOrSub._json && pubOrSub._json.message) {
      ret = _.upperFirst(pubOrSub._json.message.name)
    }

    console.log("messageClass : " + ret)
    return ret
  }

  function payloadClass(pubOrSub) {
    let ret

    //console.log("payloadClass: "  + JSON.stringify(pubOrSub._json.message))
    if (pubOrSub && pubOrSub._json && pubOrSub._json.message && pubOrSub._json.message.payload) {
      ret = _.upperFirst(pubOrSub._json.message.payload.title)
    }

    return ret
  }

}
