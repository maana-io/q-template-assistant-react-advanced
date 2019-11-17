#!/bin/sh

PORT=80
OTHER_SERVICE_ID=io.maana.catalog
NODE_ENV=development

echo "var MAANA_ENV = {"                         >  build/maana.env.js
echo "  OTHER_SERVICE_ID: '$OTHER_SERVICE_ID',"  >> build/maana.env.js
echo "}"                                         >> build/maana.env.js

serve -c ./serve.json -s build -p $PORT
