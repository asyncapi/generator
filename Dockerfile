FROM node:11

WORKDIR /usr/src/app

# Putting the old one in here until the new one supports node
RUN npm install -g asyncapi-node-codegen

# install dependencies
COPY package*.json ./
RUN npm install


# copy code
COPY . .

EXPOSE 8080
CMD [ "node", "cli.js" ]
