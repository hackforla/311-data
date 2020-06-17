# this hits all the endpoints in the CI collection using the local env

# to use, run this script from the /server directory while the api is running
# chmod +x postman/test.sh && postman/test.sh


COLLECTION=311-CI
ENVIRONMENT=311-local

docker run \
  --network host \
  -v `pwd`/postman/collections:/etc/newman \
  -v `pwd`/postman/environments:/etc/newman-envs \
  -t postman/newman:alpine run ${COLLECTION}.postman_collection.json \
  --environment /etc/newman-envs/${ENVIRONMENT}.postman_environment.json \
  --globals /etc/newman-envs/311.postman_globals.json
