importance is that I use AsyncAPI v3 support
what version of modelina must I use??


Need to use the application.properties file nicely!!!!!!


Next step:

How to properly use modelina

When you start asyncapi generate how does it start and how can I pass the models that I aprse

Ensure you use websockets-next and properly use the sending of websocket

make simple test first then add complexity




use the slack example for reall good

for simple producer and consumer use the hopsotch






Goal 1:

get to the point where if I do generator command it give the correct file based on the asyncapi document + strcutre


Goal 2:
add websocket quakrkus functionalityy



command: /apps/generator/cli.js /packages/templates/clients/websocket/java/quarkus/test/modeltest.yml /packages/templates/clients/websocket/java/quarkus/template  -o output-model --force-write










// if using models correct
// if have document for websocket
// create a temnplate direcotry 

// modelina can define presets to influnece and add some additional annotation then you just need to define a preset, a customer js function that should be injested in the model 

// so when copying code for python, except passing in the language arg, must pass the customer preset. 

// put models in right directory



/**
 * 
 * Old code
 * 
 * export async function generate(asyncapi, generator) {
  const models = await generator.generate(asyncapi);
  for (const model of models) {
    console.log(model.result);
  }
  return models;
}
 */