---
title: "Creating a template - Python"
weight: 170
---

This tutorial teaches you how to create a simple generator template using a Python MQTT client. You'll use the AsyncAPI document and the template you develop to generate Python code. Additionally, you'll create template code with a reusable component to reuse the custom functionality you create and test your code using an MQTT client.

Suppose you can only sleep when the AC in your bedroom is set to 22 °C, and you can't sleep when the temperature drops or rises above that. You can install a smart monitor in your bedroom that keeps track of the temperature and notifies you to adjust it to your optimum temperature when it fluctuates. You will create a template to alert you when the bedroom's temperature fluctuates from 22 °C.

In this tutorial:

- You'll use the [Eclipse Mosquito](https://test.mosquitto.org) **MQTT broker**, which you'll connect to subscribe and publish messages using an MQTT client.
- You'll use [Python Paho-MQTT](https://pypi.org/project/paho-mqtt/) as the **MQTT client** in this project.
- You'll create a React template that will use the MQTT broker to allow you to monitor your bedroom's temperature and notify you when the temperature drops or rises above 22 °C.
- Lastly, create a reusable component for the output code's `sendTemperatureDrop` and `sendTemperatureRise` functions.

## Prerequisites

Before you begin, make sure you have the following set up:

- **Basic Programming Knowledge** – Familiarity with JavaScript and Python.
- **NPM & PIP** – Required for installing dependencies. Install NPM from the [official guide](https://nodejs.org/en/download) and PIP from the [official guide](https://pip.pypa.io/en/stable/installation).
- **AsyncAPI CLI** – Used for code generation, install using [CLI installation guide](https://www.asyncapi.com/docs/tools/cli/installation).
- **Docker** - Required for running MQTT CLI. Install it from the official [Docker](https://docs.docker.com/) website.
- **Code Editor (VS Code recommended)** – A good code editor is essential for development and debugging.
- **Knowledge of Template Development** – Review the [Template Development Guide](template-development) to understand the structure and minimum requirements for templates.

> **Note:** In this tutorial, we are using `test.mosquitto.org` as the public broker. However, sometimes it may not be reachable. If you experience any difficulty connecting to it, you can run a broker on your localhost instead.  
>  
> If you choose to run the broker on localhost, then in the further steps, replace all occurrences of `test.mosquitto.org` with `localhost` and run the following Docker command:  
>  
> ```sh
> docker run -d --name mosquitto -p 1883:1883 eclipse-mosquitto
> ```
>  
> This starts an Eclipse Mosquitto broker locally on your machine, listening on port 1883.  
>  
> If you don’t want to use Docker, you can install Mosquitto manually. Follow the [official installation guide](https://mosquitto.org/download/) for your operating system.

## Background context

There is a list of [community maintained templates](https://www.asyncapi.com/docs/tools/generator/template#generator-templates-list), but what if you do not find what you need? In that case, you'll create a user-defined template that generates custom output from the generator.
Before you create the template, you'll need to have an [AsyncAPI document](https://www.asyncapi.com/docs/tools/generator/asyncapi-document) that defines the properties you want to use in your template to test against. In this tutorial, you'll use the following template saved in the **test/fixtures/asyncapi.yml** file in your template project directory.

``` yml

asyncapi: 2.6.0

info:
  title: Temperature Service
  version: 1.0.0
  description: This service is in charge of processing all the events related to temperature.

servers:
  dev:
    url: test.mosquitto.org #in case you're using local mosquitto instance, change this value to localhost.
    protocol: mqtt

channels:
  temperature/changed:
    description: Updates the bedroom temperature in the database when the temperatures drops or goes up.
    publish:
      operationId: temperatureChange
      message:
        description: Message that is being sent when the temperature in the bedroom changes.
        payload:
          type: object
          additionalProperties: false
          properties:
            temperatureId:
              type: string
components:
  schemas:
    temperatureId:
      type: object
      additionalProperties: false
      properties:
        temperatureId:
          type: string
```

## Overview of steps

1. Create a new directory for your template named **python-mqtt-client-template**.
2. Install the AsyncAPI CLI using the command `npm install -g @asyncapi/cli`.
3. Create a new folder **test/fixtures** with a file named **asyncapi.yml** in your fixtures directory. This file is used to define the **structure** of your template. You can copy the above example and paste it in your **asyncapi.yml** document.
4. Create a new file named **package.json** in your **python-mqtt-client-template** directory. This file is used to define the **dependencies** for your template.
5. Create a new folder **python-mqtt-client-template/template**. Create a new file named **index.js** in your **template** directory. This file is used to define the **logic** for your template.
6. Create a **test.py** file to validate the logic of your application. Don't worry about this file for now. The tutorial will tell you how to create it later.

Now your directory should look like this:

```
python-mqtt-client-template 
├── template
│   └── index.js
├── test
│   └── fixtures
│       └── asyncapi.yml
└── package.json
```

Lets break it down:

### package.json file

The **package.json** file is used to define the dependencies for your template. Add the following code snippet to your **package.json** file:

``` json
{
  "name": "python-mqtt-client-template",
  "version": "0.0.1",
  "description": "A template that generates a Python MQTT client using MQTT.",
  "generator": {
    "renderer": "react",
    "apiVersion": "v1",
    "generator": ">=1.10.0 <2.0.0",
    "supportedProtocols": ["mqtt"]
  },
  "dependencies": {
    "@asyncapi/generator-react-sdk": "^0.2.25"
  },
  "devDependencies": {
    "rimraf": "^5.0.0"
  }
}
```

Here's what is contained in the code snippet above:

- **name** -the name of your template.
- **version** - the current version of your template.
- **description** - a description of what your template does.
- **generator** - specify generator [specific configuration](https://www.asyncapi.com/docs/tools/generator/configuration-file).
  - **renderer** - can either be [`react`](https://www.asyncapi.com/docs/tools/generator/react-render-engine) or [`nunjucks`](https://www.asyncapi.com/docs/tools/generator/nunjucks-render-engine). In this case the generator will pass your template to the react render engine to generate the output.
  - **apiVersion** - specifies which major version of the [Parser-API](https://github.com/asyncapi/parser-api) your template will use.
  - **generator** - a string representing the generator version-range your template is compatible with.
  - **supportedProtocols** - A list that specifies which protocols are supported by your template.
- **dependencies** - specifies which version of [`@asyncapi/generator-react-sdk`](https://github.com/asyncapi/generator-react-sdk) should be used.

Navigate to the **python-mqtt-client-template** directory. Run the command `npm install` on your terminal to install the dependencies specified in **package.json**.

### index.js file

The **index.js** file is used to define the logic for your template. Inside the template folder, create an **index.js** file and add the code snippet below:

```js
//1
import { File } from '@asyncapi/generator-react-sdk'
//2
export default function ({ asyncapi }) {
//3
  return <File name="client.py">{asyncapi.info().title()}</File>
}
```

The code snippet above does the following:

1. Import the `generator-react-sdk` dependency.
2. The `asyncapi` argument is an instance of the [AsyncAPI Parser](https://www.asyncapi.com/docs/tools/generator/parser). It will allow you to access the content of the AsyncAPI document in your template using helper functions.
3. The `asyncapi.info().title()` is using the info() helper function to return the info object from the AsyncAPI document illustrated in the code snippet below:

``` json
info:
  title: Temperature Service
  version: 1.0.0
  description: This service is in charge of processing all the events related to temperature.
```

The `asyncapi.info().title()` returns `Temperature Service`.

### Test using AsyncAPI CLI

To see this in action, navigate to the **python-mqtt-client-template** directory. Then, run `asyncapi generate fromTemplate test/fixtures/asyncapi.yml ./ -o test/project` command on your terminal. If successful, you'll see the message below on your terminal:

``` cmd
Generation in progress. Keep calm and wait a bit... done
Check out your shiny new generated files at test/project.
```

Navigating to the **test/project** directory. You should see a **client.py** file; the only content is `Temperature Service`.

Let's break down the previous command:

- `asyncapi generate fromTemplate` is how you use AsyncAPI generator via the AsyncAPI CLI.
- `test/fixtures/asyncapi.yml` points to your AsyncAPI document.
- `./` specifies the location of your template.
- `-o` specifies where to output the result.

## Creating a template

You will create an MQTT-supported template that will generate a Python client from the template and the AsyncAPI document above.

In this section, you'll:

1. Write the MQTT client code.
2. Write code to test the client works.
3. Update the template to use the client code.
4. Setup a script to help you run this code.
5. Template your code.

### 1. Create the client

Here is the sample code to be pasted in the client.py you generated above running the `asyncapi generate fromTemplate test/fixtures/asyncapi.yml ./ -o test/project` command. It uses the `paho-mqtt` package.

``` python
# 1
import paho.mqtt.client as mqtt
# 2
mqttBroker = "test.mosquitto.org"

class TemperatureServiceClient:
    def __init__(self):
      # 3 
        self.client = mqtt.Client()
      # 4
        self.client.connect(mqttBroker)


    def sendTemperatureChange(self, id):
      # 5
        topic = "temperature/changed"
      # 6 
        self.client.publish(topic, id)
```

Make sure you have the Paho-MQTT library installed. You can install it using pip with the `pip install paho-mqtt==1.6.1` command. Please note that this tutorial is based on Paho-MQTT version 1.6.1. The Paho-MQTT library has since been updated to version 2.0.0, which includes changes that are not covered in this tutorial. To ensure compatibility and to follow along without any issues, please install version 1.6.1 of the Paho-MQTT library.

Let's break down the previous code snippet:

1. Imports the MQTT module from the Paho package, which provides the MQTT client functionality.
2. Assigns the MQTT broker address `test.mosquitto.org` to the variable MQTT broker. This specifies the location where the MQTT client will connect to.
3. Defines an instance of the MQTT client object. This object will be used to establish a connection with the MQTT broker and perform MQTT operations.
4. Defines that on client instance creation, it connects to the broker.
5. The `sendTemperatureChange` is a function the client user invokes to publish a message to the broker, and its specific topic.

In summary, this code sets up an MQTT client using the Paho-MQTT library. It connects to the `test.mosquitto.org` MQTT broker, and the `sendTemperatureChange()` method publishes temperature change information to the `temperature/changed` topic whenever called.

### 2. Test the client

You'll interact with the Temperature Service using the client module you created above. You'll create an instance of the client using `client = TemperatureServiceClient()` and then use `client.sendTemperatureChange` function to publish messages that Temperature Service is subscribed to.
Create a **test/project/test.py** file in your project and add the code snippet below:

Now your directory should look like this:

```
python-mqtt-client-template
├── template
│   └── index.js
└── test
    ├── fixtures
    │   └── asyncapi.yml
    └── project
        ├── client.py
        └── test.py
```

``` python
from client import TemperatureServiceClient
from random import randrange
import time

client = TemperatureServiceClient()

id_length = 8
min_value = 10**(id_length-1)  # Minimum value with 8 digits (e.g., 10000000)
max_value = 10**id_length - 1  # Maximum value with 8 digits (e.g., 99999999)

while True:
    randomId = randrange(min_value, max_value + 1)
    client.sendTemperatureChange(randomId)
    print("New temperature detected " + str(randomId) + " sent to temperature/changed")
    time.sleep(1)

```

Navigate to the **python-mqtt-client-template/test/project** directory. Run the command `python test.py` on your terminal. You should see output similar to the snippet below logged on your terminal:

``` cmd
New temperature detected 64250266 sent to temperature/changed
New temperature detected 36947728 sent to temperature/changed
New temperature detected 72955029 sent to temperature/changed
```

To make sure your **test.py** and client code works check if the broker really receives temperature-related messages. You can do it using an [MQTT CLI](https://hivemq.github.io/mqtt-cli/) using docker. Run the command `docker run hivemq/mqtt-cli sub -t temperature/changed -h test.mosquitto.org` in your terminal. It will download the image if you don't have it locally, then the CLI will connect to the broker, subscribe to the `temperature/changed` topic and then output the temperature ids on the terminal.

### 3. Update the template with client code

Open [**index.js**](#indexjs-file) and copy the content of [**client.py**](#1-create-the-client) and replace `{asyncapi.info().title()}` with it. It should look like the code snippet below now:

``` js
import { File } from '@asyncapi/generator-react-sdk';

export default function ({ asyncapi }) {
  return (
    <File name="client.py">
      {`import paho.mqtt.client as mqtt

mqttBroker = "test.mosquitto.org"

class TemperatureServiceClient:
    def __init__(self):
        self.client = mqtt.Client()
        self.client.connect(mqttBroker)


    def sendTemperatureChange(self, id):
        topic = "temperature/changed"
        self.client.publish(topic, id)`}
    </File>
  )
}
```

### 4. Write script to run the test code

In **package.json** you can have the scripts property that you invoke by calling `npm run <your_script>`. After adding these scripts in **package.json**, it will look like the following code snippet:

``` json
    {
      "name": "python-mqtt-client-template",
      "version": "0.0.1",
      "description": "A template that generates a Python MQTT client using MQTT.",
      "scripts": {
        "test:clean": "rimraf test/project/client.py",
        "test:generate": "asyncapi generate fromTemplate test/fixtures/asyncapi.yml ./ --output test/project --force-write",
        "test:start": "python test/project/test.py",
        "test": "npm run test:clean && npm run test:generate && npm run test:start"
      },
      "generator": {
        "renderer": "react",
        "apiVersion": "v1",
        "generator": ">=1.10.0 <2.0.0",
        "supportedProtocols": ["mqtt"]
      },
      "dependencies": {
        "@asyncapi/generator-react-sdk": "^0.2.25"
      },
      "devDependencies": {
        "rimraf": "^5.0.0"
      }
    }
```

The 4 scripts added in **package.json** do the following:

1. `test:clean`: This script uses the `rimraf` package to remove the old version of the file **test/project/client.py** every time you run your test.
2. `test:generate`: This script uses the AsyncAPI CLI to generate a new version of **client.py**.
3. `test:start`: This script runs the python code using **client.py**.
4. `test`: This script runs all the other scripts in proper order.

Run `npm test` on your terminal to ensure everything works as expected.

### 5. Template your code

#### 5a. Add parameters to the configuration file

You often have different runtime environments in programming, e.g., development and production. You will use different servers to spin both of these instances. You'll have two broker versions, one for production and the other for development. You have defined a dev server in the AsyncAPI document:

```yml
servers:
  dev:
    url: test.mosquitto.org
    protocol: mqtt
```

This will allow you to also define the broker you will use in production in the servers section above.
Therefore, we can template the code `mqttBroker = 'test.mosquitto.org'` in **index.js** so the value is populated dynamically at runtime depending on the specified server environment.

The generator has a **parameters** object used to define parameters you use to dynamically modify your template code at runtime. It also supports the **server** parameter that defines the server configuration value. Navigate to **package.json** and add the snippet below:

```json
    "generator": {
        # ...(redacted for brevity)
        "parameters": {
            "server": {
              "description": "The server you want to use in the code.",
              "required": true
            }
        }
    }
```

`"required": true`: makes the parameter mandatory and once user forgets to add it to the cli command, a proper error message is yielded.
You'll pass the server to be used to generate your code using `--param server=dev` in the AsyncAPI CLI command. Failure to which you'll get an error:

```cmd
Generator Error: This template requires the following missing params: server.
```

Update your `test:generate` script in **package.json** to include the server param

```json
"test:generate": "asyncapi generate fromTemplate test/fixtures/asyncapi.yml ./ --output test/project --force-write --param server=dev"
```

You can now replace the static broker from `mqttBroker = 'test.mosquitto.org'` to `mqttBroker = "${asyncapi.servers().get(params.server).url()}"` in **index.js**.

Now the template code looks like this:

``` js
import { File } from '@asyncapi/generator-react-sdk';

// notice that now the template not only gets the instance of parsed AsyncAPI document but also the parameters
export default function ({ asyncapi, params }) {
 
  return (
    <File name="client.py">
      {`import paho.mqtt.client as mqtt

mqttBroker = "${asyncapi.servers().get(params.server).url()}"

class TemperatureServiceClient:
    def __init__(self):
        self.client = mqtt.Client()
        self.client.connect(mqttBroker)


    def sendTemperatureChange(self, id):
        topic = "temperature/changed"
        self.client.publish(topic, id)`}
    </File>
  )
}
```

Run `npm test` to validate that your code still works as expected.

#### 5b. Templating index.js with React

Python takes indentation very seriously, and our generated output will be Python code. We, therefore, need to make sure the indentation in **index.js** looks right so the generated code is indented correctly. After templating the code in **index.js**, it will look like the following code snippet:

```js
// 1
import { File, Text } from '@asyncapi/generator-react-sdk'
export default function ({ asyncapi, params }) {
  return (
    <File name="client.py">
    // 2
      <Text newLines={2}>import paho.mqtt.client as mqtt</Text>
    // 3
      <Text newLines={2}>mqttBroker = "{asyncapi.servers().get(params.server).url()}"</Text>
    // 4
      <Text newLines={2}>class {asyncapi.info().title().replaceAll(' ', '')}Client:</Text>
    // 5
      <Text indent={2} newLines={2}>
        {`def __init__(self):
            self.client = mqtt.Client()
            self.client.connect(mqttBroker)`}
      </Text>
      </File>
  )
}
```

1. Import the **Text** component that will wrap strings so they are indented properly in the output. Your import statement should now look like this: `import { File, Text } from '@asyncapi/generator-react-sdk'`.
2. When the Paho module import is rendered in **client.py** file, it will add two extra new lines.
3. The broker url is templated in a `Text` component removing the `$` from the string template.
4. Dynamically get the class name **TemperatureServiceClient** from the AsyncAPI document from the **info** object using the Parser API using the code: `asyncapi.info().title()` . It will return `Temperature Service`, then remove the spaces and add `Client` as a suffix.
5. There is no templating needed in the `__init__` function, there is only hardcoded information.

> If you're on the fence about which templating engine you should use in your template, check out the [React render engine](https://www.asyncapi.com/docs/tools/generator/react-render-engine) and [nunjucks render engine](https://www.asyncapi.com/docs/tools/generator/nunjucks-render-engine) documentation.
In the next section, you'll refactor your template to use React.

#### 5c. Creating a reusable component

Suppose you have two [channels](https://www.asyncapi.com/docs/concepts/channel), one to watch if the temperature drop below 22 °C and one to check if the temperature is above 22 °C, the generated output code would look like this:

```python
import paho.mqtt.client as mqtt

mqttBroker = "test.mosquitto.org"

class TemperatureServiceClient:

  def __init__(self):
              self.client = mqtt.Client()
              self.client.connect(mqttBroker)

  def sendTemperatureDrop(self, id):
          topic = "temperature/dropped"
          self.client.publish(topic, id)
  def sendTemperatureRise(self, id):
          topic = "temperature/risen"
          self.client.publish(topic, id)

```

You'll then need to template to dynamically generate `sendTemperatureDrop` and `sendTemperatureRise` functions in the generated code based off the AsyncAPI document content. The goal is to write template code that returns functions for channels that the Temperature Service application is subscribed to. The template code to generate these functions will look like this:

```js
<Text indent={2} newLines={2}>
  <TopicFunction channels={asyncapi.channels().filterByReceive()} />
</Text>
```

It's recommended to put reusable components outside the template directory in a new directory called components. You'll create a component that will dynamically generate functions in the output for as many channels as there are in your AsyncAPI document that contains a `publish` operation. Add the following code in the **python-mqtt-client-template/components/TopicFunction.js** file, after creating the **python-mqtt-client-template/components/** directory:

```js
/*
 * This component returns a block of functions that user can use to send messages to specific topic.
 * As input it requires a list of Channel models from the parsed AsyncAPI document
 */
export function TopicFunction({ channels }) {
  const topicsDetails = getTopics(channels);
  let functions = '';

  topicsDetails.forEach((t) => {
    functions += `def send${t.name}(self, id):
        topic = "${t.topic}"
        self.client.publish(topic, id)\n`
  });

  return functions;
}

/*
 * This function returns a list of objects, one for each channel with two properties, name and topic
 * name - holds information about the operationId provided in the AsyncAPI document
 * topic - holds information about the address of the topic
 *
 * As input it requires a list of Channel models from the parsed AsyncAPI document
 */
function getTopics(channels) {
  const channelsCanSendTo = channels;
  let topicsDetails = [];

  channelsCanSendTo.forEach((ch) => {
    const topic = {};
    const operationId = ch.operations().filterByReceive()[0].id();
    topic.name = operationId.charAt(0).toUpperCase() + operationId.slice(1);
    topic.topic = ch.address();

    topicsDetails.push(topic);
  })

  return topicsDetails;
}
```

`{ channels }`: the `TopicFunction` component accepts a custom prop called channels and in your template code
`getTopics(channels)`: Returns a list of objects, one for each channel with two properties; name and topic. The **name** holds information about the `operationId` provided in the AsyncAPI document while the **topic** holds information about the address of the topic.

Import the `TopicFunction` component in your template code in **index.js** and add the template code to generate the functions to topics that the `Temperature Service` application is subscribed to. In your case, the final version of your template code should look like this:

```js
import { File, Text } from '@asyncapi/generator-react-sdk'
import { TopicFunction } from '../components/TopicFunction'

export default function ({ asyncapi, params }) {
  return (
    <File name="client.py">
      <Text newLines={2}>import paho.mqtt.client as mqtt</Text>

      <Text newLines={2}>mqttBroker = "{asyncapi.servers().get(params.server).url()}"</Text>

      <Text newLines={2}>class {asyncapi.info().title().replaceAll(' ', '')}Client:</Text>

      <Text indent={2} newLines={2}>
        {`def __init__(self):
            self.client = mqtt.Client()
            self.client.connect(mqttBroker)`}
      </Text>

      <Text indent={2} newLines={2}>
        <TopicFunction channels={asyncapi.channels().filterByReceive()} />
      </Text>
    </File>
  )
}

```

Now your directory should look like this:

```
python-mqtt-client-template
├── components
│   └── TopicFunction.js
├── template
│   └── index.js
└── test
    ├── fixtures
    │   └── asyncapi.yml
    └── project
        ├── client.py
        └── test.py
```


Run `npm test` on your terminal to ensure everything works as expected.

In the next section, you'll add another channel to **asyncapi.yml** file called `temperature/dropped` and `temperature/risen` then run the template again to make sure it still works as expected.

#### 5d. Update AsyncAPI document

Update the AsyncAPI document to use two channels:

```yml
channels:
  temperature/dropped:
    description:  Notifies the user when the temperature drops past a certain point.
    publish:
      operationId: temperatureDrop
      message:
        description: Message that is being sent when the temperature drops past a certain point.
        payload:
          type: object
          additionalProperties: false
          properties:
            temperatureId:
              type: string

  temperature/risen:
    description: Notifies the user when the temperature rises past a certain point.
    publish:
      operationId: temperatureRise
      message:
        description: Message that is being sent when the temperature rises past a certain point.
        payload:
          type: object
          additionalProperties: false
          properties:
            temperatureId:
              type: string
```

And update your test script in test.py to test the two functions as below:

```py
    client.sendTemperatureDrop(randomId)
    print("Temperature drop detected " + str(randomId) + " sent to temperature/dropped")
    client.sendTemperatureRise(randomId)
    print("Temperature rise detected " + str(randomId) + " sent to temperature/risen")
```

Run `npm test` to validate that everything works as expected. You should see logs similar to the snippet below in your terminal:

```cmd
Temperature drop detected 49040460 sent to temperature/dropped
Temperature rise detected 49040460 sent to temperature/risen
Temperature drop detected 66943992 sent to temperature/dropped
Temperature rise detected 66943992 sent to temperature/risen
```

## Where to go from here?

Great job completing this tutorial! You have learnt how to use an AsyncAPI file to create a Python MQTT template and used it with the Paho-MQTT library in Python to connect to an MQTT broker and publish messages.😃

If you want to tinker with a completed template and see what it would look like in production, check out the [Paho-MQTT template](https://github.com/derberg/python-mqtt-client-template/tree/v1.0.0). You can also check out the accompanying [article about creating MQTT client code](https://www.brainfart.dev/blog/asyncapi-codegen-python).

You can also check out the [MQTT beginners guide](https://medium.com/python-point/mqtt-basics-with-python-examples-7c758e605d4) tutorial to learn more about asynchronous messaging using MQTT.