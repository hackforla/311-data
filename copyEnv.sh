echo REACT_APP_MAPBOX_TOKEN=$REACT_APP_MAPBOX_TOKEN > .env
echo DB_URL=$DB_URL >> .env
webpack
node server.js
