import { Text } from '@asyncapi/generator-react-sdk';
import { toCamelCase } from '@asyncapi/generator-helpers/src/utils';

export default function URIParams({ queryParamsArray, pathName }) {
    if (!queryParamsArray || queryParamsArray.length === 0) {
        return null; // Return null if no query params
    }

    return (
    <>
        <Text newLines={1}>
            {`
            // URI parameters
            String query = "";
            `}
        </Text>
        {queryParamsArray.map((param, idx) => {
            const paramName = toCamelCase(param[0]);
            const variableDefinition = `String ${paramName} = System.getenv("${paramName.toUpperCase()}");`;

            let additionalQuery = '';
            if (idx === 0) {
                additionalQuery = `query += "${param[0]}=" + URLEncoder.encode(${paramName}, StandardCharsets.UTF_8);`;
            } else {
                additionalQuery = `query += "&${param[0]}=" + URLEncoder.encode(${paramName}, StandardCharsets.UTF_8);`;
            }

            return (
                <>
                <Text indent={12}>
                    {variableDefinition}
                </Text>
                <Text indent={12} newLines={1}>
                    {additionalQuery}
                </Text>
                </>
            );
        })}
        <Text>
            {`
            String queryUri = baseURI + "${pathName}" + "?" + query;
            WebSocketClientConnection connection = connector.baseUri(queryUri).connectAndAwait();
            Thread.sleep(100000); // Keep the connection open for 2 minutes
            `}
        </Text>
    </>
    );
}