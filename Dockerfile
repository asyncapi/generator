FROM node:11

WORKDIR /app

# Putting the old one in here until the new one supports node
RUN npm install -g asyncapi-node-codegen

# install dependencies
COPY package*.json ./
RUN npm install

# copy code
COPY . .

ENTRYPOINT [ "/app/dockerboot.sh" ]
