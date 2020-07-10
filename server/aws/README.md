## Notes

### Dev/Prod Setup

The `dev` and `prod` apis both live on `t2.micro` instances on `ec2`. They're both run with `docker-compose`. There's an AMI called `311-api` that includes the software necessary to run both instances, namely `docker`, `docker-compose`, and `git`.

The `prod` instance is behind a load balancer that uses our SSL cert to encrypt traffic. The `dev` instance is not, since it's not necessary to encrypt traffic from `dev`. Due to this difference, api calls follow different paths in the two environments:

#### dev environment

1. client sends `http` request to `dev-api` ec2 instance (on port 80)
2. docker-compose forwards the request to the Sanic api (on port 5000)
3. Sanic api responds (on port 5000)
4. docker-compose responds (on port 80)

#### prod environment

1. client sends `https` request to load balancer (on port 443)
2. load balancer forwards request to `prod-api` ec2 instance (on port 80)
3. docker-compose forwards the request to the Sanic api (on port 5000)
4. Sanic api responds (on port 5000)
5. docker-compose responds (on port 80)
6. load balancer encrypts the payload using our cert, and responds to client (on port 443)

### User Data Script

The `dev-api` and `prod-api` instances both have "user data" scripts to start the `docker` daemon whenever the instances are started or rebooted. Here's the script, which is adapted from [this article](https://aws.amazon.com/premiumsupport/knowledge-center/execute-user-data-ec2/).

```
Content-Type: multipart/mixed; boundary="//"
MIME-Version: 1.0

--//
Content-Type: text/cloud-config; charset="us-ascii"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit
Content-Disposition: attachment; filename="cloud-config.txt"

#cloud-config
cloud_final_modules:
- [scripts-user, always]

--//
Content-Type: text/x-shellscript; charset="us-ascii"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit
Content-Disposition: attachment; filename="userdata.txt"

#!/bin/bash
sudo service docker start
--//
```

### Terraform

We're not using it right now, so those files don't do anything.
