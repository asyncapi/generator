ARG ASYNCAPI_GENERATOR_VERSION=1.10.9

FROM node:18-alpine

WORKDIR /app

# Since 0.14.0 release of html-template chromium is needed for pdf generation
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Since 0.30.0 release Git is supported and required as a dependency
# Since 0.14.0 release of html-template chromium is needed for pdf generation.
# More custom packages for specific template should not be added to this dockerfile. Instead, we should come up with some extensibility solution.
# The --no-cache prevents from caching of the package index which saves space by not storing the APK cache files.
# Combining these commands reduces the number of layers created in the docker image which result better performance and smaller image sizes.
RUN apk --no-cache add git chromium && \
    npm install -g @asyncapi/generator@$ASYNCAPI_GENERATOR_VERSION && \
    apk del git chromium && \
    rm -rf /var/cache/apk/*



ENTRYPOINT [ "ag" ]
