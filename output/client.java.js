import { getInfo, getServer } from '@asyncapi/generator-helpers';
import { File } from '@asyncapi/generator-react-sdk';


export default async function ({ asyncapi, params }) {

  // call models here and get things you need cuz you have the asyncapi object above 
  // e.g. asyncapi.channels, asyncapi.components, etc.
  // const generator = new JavaGenerator();
  // const models = generate(asyncapi, generator);
  const server = getServer(asyncapi.servers(), params.server);
  const info = getInfo(asyncapi);

  return (  
    // The clientFileName default values can be found and modified under the package.json
    <File name={params.clientFileName}>
     // final output will be here
     // use the extracted model components
     <FileHeaderInfo info={info} server={server}/>
    </File>
  );
}








