FROM node:19.1.0

USER node

WORKDIR /appl/pluginserver

RUN mkdir -p ./js-plugins && \
    mkdir -p ./socks

COPY --chown=node package*.json ./

RUN npm install

CMD [ "node", "./node_modules/.bin/kong-js-pluginserver", "-d", "/appl/pluginserver/js-plugins", "-p", "/appl/pluginserver/socks" ]
