import { getClientName, getInfo, getQueryParams, getServer, getServerUrl } from '@asyncapi/generator-helpers';
import { File } from '@asyncapi/generator-react-sdk';
import { FileHeaderInfo } from '../../../components/FileHeaderInfo.js';
import { Requires } from '../../../components/Requires.js';
import { EchoWebSocket } from '../../../components/EchoWebSocket.js';


export default async function ({ asyncapi, params }) {


  const server = getServer(asyncapi.servers(), params.server);
  const info = getInfo(asyncapi);
  const title = info.title();
  const queryParams = getQueryParams(asyncapi.channels());
  const clientName = getClientName(info, params.appendClientSuffix, params.customClientName);
  const serverUrl = getServerUrl(server);
  const operations = asyncapi.operations();
  const clientJavaName = clientName + ".java";
  const pathName = server.pathname();



  const clientFileName = params.clientFileName || 'failedName.java';
  console.log('DEBUG ClientFileName:\n', clientFileName);
  console.log('DEBUG Channels: from client\n', asyncapi.channels());
  // const clientName = getClientName(info, params.appendClientSuffix, params.customClientName);
  console.log('DEBUG Client Name:\n', clientName);
  // const queryParams = getQueryParams(asyncapi.channels());
  console.log('DEBUG Query Params:\n', queryParams);
  // const operations = asyncapi.operations();
  console.log('DEBUG Operations:\n', operations);
  const filterOps = operations.filterBySend();

  console.log('DEBUG Filtered Operations:\n', filterOps);
  console.log('DEBUG id:\n', filterOps[0].id());
  console.log('Done\n');
  [...operations].map((operation, idx) => {
    console.log(`DEBUG Operation ${idx}:\n`, operation);
  });
  
  console.log("DEBUG SERver URL OG:\n", serverUrl);

  
  return (
    <File name={clientJavaName}>
      <FileHeaderInfo
        info={info}
        server={server}
      />
      <Requires/>
      <EchoWebSocket clientName={clientName} pathName={pathName} title={title} operations={operations} />
    </File>
    
);
}

// ask Lukasz why I can't loop over all the operations in the asyncapi object???!!?!?!?








/**
 * My first attempt
 * 
 * 
 * 
 * 
 * 
 * May need to do the looping for each model!!!!!!
 *      --> but that is smt I can add ontop of the code.
 * 
 * Idea:
 *      filterOps.map((operation) => {
      const id = `${operation.id()}`; 
      const fileName = `${id}EchoWebSocket.java`; // or use any format you want
 * 
 * 
 * 
 * 
 * 
 * 
 * // 'idx' is the index of the current element in the .map() iteration.
  // It's used as the unique 'key' prop for each <File> component in the list.
  // React requires a unique 'key' for each element in a list to optimize rendering.
 * <>
    {[...operations].map((operationz, idx) => { 
      const operationId = operationz.id?.() || `operation${idx}`;
      const fileName = `${operationId}.java`; // or use any format you want

      return (
        <File key={fileName} name={fileName}>
          <EchoWebSocket clientName={clientName} operation={operationz} />
          <FileHeaderInfo info={info} server={server} />
        </File>
      );
    })}
  </>
  // issue with how I am looping, maybe try just with one parameter and see if it works



    // call models here and get things you need cuz you have the asyncapi object above 
  // e.g. asyncapi.channels, asyncapi.components, etc.
  // const generator = new JavaGenerator();
  // const models = generate(asyncapi, generator);
    // console.log('DEBUG PARAMS:', params);
 */