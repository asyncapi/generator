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
    let doc = {}
    doc.spring = {}
    doc.spring.cloud = {}
    doc.spring.cloud.stream = {}
    let scs = doc.spring.cloud.stream
    scs.function = {}
    scs.function.definition = getFunctionDefinitions(asyncapi)
    scs.bindings = getBindings(asyncapi)

    let additionalSubs = getAdditionalSubs(asyncapi)

    if (additionalSubs) {
      scs.solace = additionalSubs
    }

    let type = params.artifactType
    if (type && type === "application") {
      doc.solace = getSolace(params)
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
    if (params['artifact-id']) {
      ret = params['artifact-id']
    } else if (info.extensions()['x-artifact-id']) {
      ret = info.extensions()['x-artifact-id']
    } else if (info.title()) {
      ret = _.kebabCase(info.title())
    } else {
      throw new Error("Can't determine the artifact id. Please set the param artifact-id, or element info.title or info.x-artifact-id.")
    }
    return ret
  })

  Nunjucks.addFilter('bindingClassName', ([channelName, channel]) => {
    let className = channel.json()['x-java-class']
    if (!className) {
      throw new Error("Please set the x-java-class property on the channel " + channelName);
    }

    return _.upperFirst(className) + "Binding";
  })

  Nunjucks.addFilter('camelCase', (str) => {
    return _.camelCase(str)
  })

  Nunjucks.addFilter('contentType', (channel) => {
    let ret;

    if (channel.hasPublish()) {
      ret = contentType(channel.publish())
    }
    if (!ret && channel.hasSubscribe()) {
      ret = contentType(channel.subscribe())
    }

    return ret
  })

  Nunjucks.addFilter('deliveryMode', (channel) => {
    let val = channel.publish()._json.bindings.solace.deliveryMode
    if (!val) {
      ret = 'DIRECT'
    } else {
      ret = _.upperCase(val)
      if (ret != 'DIRECT' && ret != 'PERSISTENT') {
        throw new Error("delivery mode must be direct or persistent. Found: " + val)
      }
    }

    return ret;
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
    if (params['group-id']) {
      ret = params['group-id']
    } else if (info.extensions()['x-group-id']) {
      ret = info.extensions()['x-group-id']
    } else {
      throw new Error("Can't determine the group id. Please set the param group-id or element info.x-group-id.")
    }
    return ret
  })

  Nunjucks.addFilter('kebabCase', (str) => {
    return _.kebabCase(str)
  })

  Nunjucks.addFilter('lowerFirst', (str) => {
    return _.lowerFirst(str)
  })

  Nunjucks.addFilter('messageClass', ([channelName, channel]) => {
    let ret = messageClass(channel.publish())
    if (!ret) {
      ret = messageClass(channel.subscribe())
    }
    if (!ret) {
      throw new Error("Channel " + channelName + ": no message class has been defined.")
    }
    return ret
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

  Nunjucks.addFilter('subscribeDestination', ([channelName, channel]) => {
    let queue = channel.json()['x-scs-queue']
    if (!queue) {
      queue = channelName
    }
    return queue
  })

  Nunjucks.addFilter('queueInfo', ([channelName, channel, subscribeTopic]) => {
    let ret = {}
    ret.isQueue = false;
    const bindings = channel._json.bindings
    if (bindings) {
      //console.log("bindings: " + JSON.stringify(bindings))
      const solaceBinding = bindings.solace
      if (solaceBinding) {
        ret.isQueue = bindings.is === 'queue'
        if (!ret.isQueue && bindings.queue && !bindings.queue.name) {
          throw new Exception("Channel " + channelName + " please provide a queue name.");
        }
        ret.needQueue = ret.isQueue || bindings.queue.name
        ret.queueName = bindings.queue && bindings.queue.name ? bindings.queue.name : channelName
        ret.accessType = bindings.queue && bindings.queue.exclusive ? "ACCESSTYPE_EXCLUSIVE" : "ACCESSTYPE_NONEXCLUSIVE"
        if (bindings.queue && bindings.queue.subscription) {
          ret.subscription = bindings.queue.subscription
        } else if (!ret.isQueue) {
          ret.subscription = subscribeTopic
        }
      }
    }
    //console.log("queueInfo: " + JSON.stringify(ret))
    return ret;
  })

  Nunjucks.addFilter('seeProp', ([name, prop]) => {
    //if (name == 'account') {
    //console.log("prop: " + name + " " + dump(prop) + "|" + prop.title() + " " + dump(prop._json))
    console.log("prop: " + name + " type: " + prop.type() + " title: " + prop.title())
    //}
  })

  Nunjucks.addFilter('springCloudStreamVersion', ([info, params]) => {
    let ret = ''
    if (params['spring-cloud-stream-version']) {
      ret = params['spring-cloud-stream-version']
    } else if (info.extensions()['x-spring-cloud-stream-version']) {
      ret = info.extensions()['x-spring-cloud-stream-version']
    } else {
      throw new Error("Can't determine the Spring Cloud Stream version. Please set the param spring-cloud-stream-version or info.x-spring-cloud-stream-version.")
    }
    return ret
  })

  Nunjucks.addFilter('toJson', (object) => {
    return JSON.stringify(object)
  })

  Nunjucks.addFilter('topicInfo', ([channelName, channel]) => {
    let p = channel.parameters()
    return getTopicInfo(channelName, channel)
  })

  Nunjucks.addFilter('upperFirst', (str) => {
    return _.upperFirst(str)
  })

  function contentType(pubOrSub) {
    return pubOrSub._json.message.contentType
  }

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
        if (topicInfo.hasParams) {
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

  function getBindings(asyncapi) {
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
        let subDestination
        const channelBindings = channelJson.bindings
        let groupId
        if (channelBindings) {
          //console.log("bindings: " + JSON.stringify(channelBindings))
          const scsBinding = channelBindings.scs
          if (scsBinding) {
            const queueName = scsBinding.queue
            if (queueName) {
              subDestination = queueName
            }
            groupId = scsBinding.groupId
          }          
        }

        if (topicInfo.hasParams && !subDestination) {
          throw new Error("channel " + channelName + " has parameters but no queue has been specified. A queue is required when a topic has parameters.");
        }
        subDestination = subDestination || topicInfo.subscribeTopic
        bindingName = functionName + "Consumer-in-0"
        ret[bindingName] = {}
        ret[bindingName].destination = subDestination
        if (groupId) {
          ret[bindingName].group = groupId
        }
     }
    }

    return ret
  }

  function getFunctionName(channelName, channel) {
    let ret = _.camelCase(channelName)
    let channelJson = channel._json
    const channelBindings = channelJson.bindings
    if (channelBindings) {
      //console.log("bindings: " + JSON.stringify(channelBindings))
      const scsBinding = channelBindings.scs
      if (scsBinding) {
        const functionName = scsBinding.functionName
        if (functionName) {
          ret = functionName
        }
      }
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
    ret.java.clientUsername = getParamOrXs(params, 'clientUsername')
    ret.java.clientPassword = getParamOrXs(params, 'clientPassword')
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

    if (pubOrSub && pubOrSub._json && pubOrSub._json.message) {
      ret = _.upperFirst(pubOrSub._json.message.name)
    }

    return ret
  }

  function payloadClass(pubOrSub) {
    let ret

    if (pubOrSub && pubOrSub._json && pubOrSub._json.message && pubOrSub._json.message.payload) {
      ret = _.upperFirst(pubOrSub._json.message.payload.title)
    }

    return ret
  }

}
