# Check out https://hub.docker.com/_/node to select a new base image
FROM node:20-slim

# Set to a non-root built-in user `node`
USER node

COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.7.0 /lambda-adapter /opt/extensions/lambda-adapter

# Create app directory (with user `node`)
RUN mkdir -p /home/node/app

WORKDIR /home/node/app

RUN npm install yarn

# Bundle app source code
COPY  --chown=node ./backend/conf ./conf
COPY  --chown=node ./backend/packages/core/dist ./packages/core/dist
COPY  --chown=node ./backend/packages/core/index.js ./packages/core/index.js
COPY  --chown=node ./backend/packages/core/package.json ./packages/core/package.json
COPY  --chown=node ./backend/packages/loopback-connector-postgresql ./packages/loopback-connector-postgresql
COPY  --chown=node ./backend/public ./public
COPY  --chown=node ./backend/dist ./dist
COPY  --chown=node ./backend/package.json ./
COPY  --chown=node ./backend/yarn.lock ./
COPY  --chown=node ./.env /home/node/.env

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
RUN ./node_modules/.bin/yarn install

RUN find ./packages -type d -name "src" -exec rm -r {} \;
# RUN rm -r src

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=3000

EXPOSE ${PORT}
CMD [ "node", "." ]
