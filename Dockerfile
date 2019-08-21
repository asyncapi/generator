FROM node:11

WORKDIR /asyncapi

# install dependencies
COPY package*.json ./
RUN npm install

# copy code
COPY . .

ENTRYPOINT [ "/asyncapi/dockerboot.sh" ]
