FROM node:11

WORKDIR /app

# Putting the old one in here until the new one supports node
RUN npm install -g asyncapi-node-codegen

# install dependencies
COPY package*.json ./
RUN npm install

# copy code
COPY . .
# RUN chmod a+x /app/dockerboot.sh

# CMD [ "node", "cli.js" ]
ENTRYPOINT [ "/app/dockerboot.sh" ]
