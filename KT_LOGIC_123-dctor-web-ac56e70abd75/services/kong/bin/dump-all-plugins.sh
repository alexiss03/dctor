#!/bin/bash

node ./node_modules/.bin/kong-js-pluginserver -d /appl/pluginserver/js-plugins --dump-all-plugins > socks/js-plugins.json
