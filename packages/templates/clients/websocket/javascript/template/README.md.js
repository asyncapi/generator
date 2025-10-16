import { GenerateReadMe } from '../../../../../components/src/components/readme/Readme';
import { AvailableOperations } from '../components/AvailableOperations';

export default function({ asyncapi, params }) {
  const readme = <GenerateReadMe asyncapi={asyncapi} params={params} language="javascript" />;

  const operations = asyncapi.operations().all();

  return (
    <>
      {readme}
      <AvailableOperations operations={operations} />
    </>
  );
}

