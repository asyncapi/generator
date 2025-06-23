// import { JavaGenerator } from '@asyncapi/modelina';
// import { getServer } from '@asyncapi/generator-helpers';

// export default async function({ asyncapi, params }) {

//    asyncapi.channels().forEach((channel, channelName) => {
//         console.log("DEBUG CHANNEL NAME: " + channelName);
//         console.log("DEBUG CHANNEL OBJECT: " + JSON.stringify(channel)); // this what I should be doing then look at java spring - make modular later!!!
//         // need the attribute now the model!!
//         console.log("\n");
//         }
//     );
//     const server = getServer(asyncapi.servers(), params.server);
//     const channels = asyncapi.channels();

//     console.log("DEBUG ASYNCAPI Channel from config: \n " + channels );

//     const generator = new JavaGenerator();
//     const models = await generator.generate(asyncapi);

//     // console.log("DEBUG MDOEL GENERATED" + models);
//     // for (const model of models) {
//     //     // const fileName = formatHelper(model.name) + '.' + extension;
//     //     const fileContent = model.result;
//     //     console.log("DEBUG MODEL FILE CONTENT: " + fileContent);

//     //     // Create a File component for each model
//     //     const fileComponent = {
//     //         content: fileContent
//     //     };
//     //     console.log("DEBUG MODEL FILE COMPONENT: " + JSON.stringify(fileComponent));
//     //     return <File name={model.modelName + '.java'}>{fileComponent.content}</File>;
//     // }


// }