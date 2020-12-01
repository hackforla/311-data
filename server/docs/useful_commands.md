# Useful Commands

## Curl

To time API calls using curl: add ```--write-out '%{time_total}\n' --output /dev/null --silent```

For example:

```bash
curl -X POST "http://localhost:5000/map/pins" -H  "accept: application/json" -H  "Content-Type: application/json" -d "{\"startDate\":\"01/01/2020\",\"endDate\":\"08/27/2020\",\"ncList\":[52,46,128,54,104,76,97,121,55],\"requestTypes\":[\"Homeless Encampment\"]}" --write-out '%{time_total}\n' --output /dev/null --silent
```

## Docker

Some other helpful commands:

```bash
# kill an orphaned API process
lsof -ti tcp:5000 | xargs kill
# list docker images and containers
docker system df
# get rid of old containers
docker system prune
# show the size of folders
sudo du -sh *
# show the size of a drive mounted at xvda1 (EC2)
df -hT /dev/xvda1
```

## Redis

Some helpful Redis commands

```bash
redis-cli
keys *
mget <key>
MEMORY USAGE <key>
```


## AWS

aws ecs register-task-definition --cli-input-json task-definition.json --profile 311user

aws logs describe-log-groups --profile 311user



docker -c 311context -f docker-compose.ecs.yml compose up

docker -c 311context -f docker-compose.ecs.yml compose up

aws elbv2 describe-load-balancers --profile 311userpw

aws cloudformation delete-stack --stack-name arn:aws:cloudformation:us-east-1:640613795150:stack/server/32b66700-1968-11eb-bb25-1246411399d1 --profile 311user

aws secretsmanager get-secret-value --secret-id dev --profile 311user

