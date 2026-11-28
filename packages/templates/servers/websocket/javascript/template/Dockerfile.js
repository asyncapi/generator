import { File } from '@asyncapi/generator-react-sdk';

/**
 * Generates the Dockerfile of the generated WebSocket server.
 *
 * @returns {JSX.Element} A `File` component containing the Dockerfile.
 */
export default function () {
  return (
    <File name="Dockerfile">
      {`FROM node:24-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install --omit=dev

# Copy app source
COPY . /usr/src/app

CMD [ "npm", "start" ]
`}
    </File>
  );
}
