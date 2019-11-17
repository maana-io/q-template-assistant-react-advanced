#!/bin/sh

readonly CACHE_BREAKER=$(date +%s)

echo $NODE_ENV

[ -z "$OTHER_SERVICE_ID" ] && echo "Need to set OTHER_SERVICE_ID" && exit 1;
[ -z "$PORT" ] && echo "Need to set PORT" && exit 1;

echo "var MAANA_ENV = {"                         >  build/maana.env.js
echo "  OTHER_SERVICE_ID: '$OTHER_SERVICE_ID',"  >> build/maana.env.js
echo "}"                                         >> build/maana.env.js

pushstate-server -p $PORT -d build
