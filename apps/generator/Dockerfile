FROM node:18-alpine

ARG ASYNCAPI_GENERATOR_VERSION=1.10.9

WORKDIR /app

# Since 0.14.0 release of html-template chromium is needed for pdf generation
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Since 0.30.0 release Git is supported and required as a dependency
# Since 0.14.0 release of html-template chromium is needed for pdf generation.
# More custom packages for specific template should not be added to this dockerfile. Instead, we should come up with some extensibility solution.
# Installing latest released npm package
RUN apk --update add git chromium && \
    rm /var/cache/apk/* && \
    npm install --ignore-scripts -g @asyncapi/generator@$ASYNCAPI_GENERATOR_VERSION


ENTRYPOINT [ "ag" ]
