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

Here are some useful AWS commands.

```bash
# do a rolling update of a ECS cluster (forces new tasks)
aws ecs update-service --cluster dev-la-311-data-cluster --service dev-la-311-data-svc --force-new-deployment

aws ecs register-task-definition --cli-input-json task-definition.json --profile 311user

aws ecs run-task --cli-input-json file://alembic_task.json --profile 311user

aws logs describe-log-groups --profile 311user

aws elbv2 describe-load-balancers --profile 311user

aws cloudformation delete-stack --stack-name arn:aws:cloudformation:us-east-1:640613795150:stack/server/32b66700-1968-11eb-bb25-1246411399d1 --profile 311user

aws secretsmanager get-secret-value --secret-id dev --profile 311user
```

SSH

```bash
ssh -i ~/.ssh/my-private-key -L
5432:myrds-terraform-db.asdfjvasku.us-west-12rds.amazonaws.com:5432
ec2-user@32.12.12.24


```

# Dev SSH tunnel
ssh -i ~/.ssh/id_matt_H4LA -L 5432:la-311-data-db-dev.cs29ter7rwc4.us-east-1.rds.amazonaws.com:5432 ec2-user@34.233.7.31

# Prod SSH tunnel
ssh -i ~/.ssh/id_matt_H4LA -L 5432:la-311-data-db-prod.cs29ter7rwc4.us-east-1.rds.amazonaws.com:5432 ec2-user@3.227.40.114



postgresql+ssh://ec2-user@3.227.40.114/la_311_user_prod:vKDW6GdAcsy9exXt@la-311-data-db-prod.cs29ter7rwc4.us-east-1.rds.amazonaws.com/la311data_db_prod

psql -U la_311_user_prod -h localhost -p 5432 -d la311data_db_prod

CREATE ROLE la_311_user_dev NOINHERIT LOGIN PASSWORD 'QDAQutA5FVVkAUTU';


# connect with dev user
psql -U la_311_user_dev -h localhost -p 5432 -d la311data_db
pg_dump -U la_311_user_dev -h localhost -p 5432 la311data_db -f dev_db_dump.sql
psql -U la_311_user_dev -h localhost -p 5432 -d la311data_db_dev -f dev_db_dump.sql

postgresql+ssh://ec2-user@34.233.7.31/la_311_user_dev:QDAQutA5FVVkAUTU@la-311-data-db-dev.cs29ter7rwc4.us-east-1.rds.amazonaws.com/la311data_db

pg_dump -U {user-name} {source_db} -f {dumpfilename.sql}
psql -U erp -d erp_devel -f mydb.sql



