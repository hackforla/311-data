# 311 Data Terraform

The Terraform blueprint will create the infrastructure needed to run the API project in AWS.

- First, it creates the network including the VPC, subnets, gateway, network ACLs, and security groups.
- Next, it creates the Postgres RDS instance with the database and credentials which are stored as a SSM parameter.
- Last, it creates the ECS cluster and service and the ALB with public DNS to point to it.

## Assumptions

- The AWS account is already created
- The task-definition.json is already loaded to the AWS account
- There is a IAM Role (ecsTaskExecutionRole) already created with SSMReadOnlyAccess AND ECSTaskExecutionRolePolicy applied
- The SSL/TLS certificate is already created and loaded to the AWS account
- The client code is handled separately (S3 bucket and CloudFront)

## Deployment

The blueprint is meant to be deployed manually. The person deploying the blueprint will have the AWS CLI installed and a profile with Admin access for the AWS environment being used. Use the Terraform commands to configure the 0.12 environment and deploy the environment.

```bash
terraform init
terraform plan
terraform apply
```

### Parameters

The following parameters need to be set in order to run the blueprint. You can use, for example, a .tfvars file for these.

- profile
- account_id
- db_name
- db_username
- db_password
- acm_certificate_arn

## Connections

```bash
ssh -i ~/.ssh/id_matt_H4LA -L 5432:la-311-data-db-dev.cs29ter7rwc4.us-east-1.rds.amazonaws.com:5432 ec2-user@34.233.7.31
```


Old IP 54.225.164.110