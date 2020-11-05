# Useful Commands

To time API calls using curl: add ```--write-out '%{time_total}\n' --output /dev/null --silent```

For example:

```bash
curl -X POST "http://localhost:5000/map/pins" -H  "accept: application/json" -H  "Content-Type: application/json" -d "{\"startDate\":\"01/01/2020\",\"endDate\":\"08/27/2020\",\"ncList\":[52,46,128,54,104,76,97,121,55],\"requestTypes\":[\"Homeless Encampment\"]}" --write-out '%{time_total}\n' --output /dev/null --silent
```

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

Some helpful Redis commands

```bash
redis-cli
keys *
mget <key>
MEMORY USAGE <key>
```
