import { GenerateReadMe } from '../../../../../components/src/components/readme/Readme';
import { AvailableOperations } from '../components/AvailableOperations';

export default function({ asyncapi, params }) {
  return GenerateReadMe({asyncapi, params, language:'javascript', AvailableOperations });
}