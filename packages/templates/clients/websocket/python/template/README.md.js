import { GenerateReadMe } from '../../../../../components/src/components/readme/Readme';

export default function({ asyncapi, params }) {
  return GenerateReadMe({ asyncapi, params, language: 'python' });
}
