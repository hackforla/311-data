
provider "aws" {
  profile = var.profile
  region  = var.region
}

module "networked_rds" {
  source = "git::https://github.com/100Automations/terraform-aws-postgres-vpc.git"

  project_name          = "la-311-data"
  region                = var.region
  account_id            = var.account_id
  stage                 = var.stage

  availability_zones    = var.availability_zones
  ssh_public_key_names  = ["id_matt_H4LA"]
  
  # database settings
  db_name               = var.db_name
  db_username           = var.db_username
  db_password           = var.db_password

  bastion_instance_type = "t2.micro"
  db_instance_class     = "db.t2.micro"
}

resource "aws_ssm_parameter" "secret" {
  name        = "/${var.stage}/${var.region}/DB_DSN"
  description = "The parameter description"
  type        = "SecureString"
  value       = "postgresql://${var.db_username}:${var.db_password}@${module.networked_rds.db_instance_endpoint}/${var.db_name}"
}

resource "aws_ecs_cluster" "cluster" {
  name = "311-data-cluster"
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_security_group" "svc_sg" {
  name_prefix = "bn-loadbalancer"
  description = "inbound from load balancer to ecs service"

  vpc_id = module.networked_rds.network_vpc_id
  
  ingress {
    description     = "inbound from load balancer"
    from_port       = var.container_port
    to_port         = var.container_port
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
    self            = true
  }

  ingress {
    description     = "inbound ssh from bastion"
    from_port       = 20
    to_port         = 22
    protocol        = "tcp"
    security_groups = [module.networked_rds.bastion_security_group_id]
    self            = true
  }

  egress {
    description     = "outbound traffic to the world"
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = [aws_security_group.alb.id]
    cidr_blocks     = ["0.0.0.0/0"]
  }
  tags = merge({ Name = "ecs-service-sg" }, var.tags)
}

resource "aws_ecs_service" "svc" {
  name            = var.task_name
  cluster         = aws_ecs_cluster.cluster.id
  task_definition = "arn:aws:ecs:${var.region}:${var.account_id}:task-definition/311-data-server-task"
  launch_type     = "FARGATE"
  desired_count   = 1

  load_balancer {
    container_name   = "311_data_api"
    container_port   = var.container_port
    target_group_arn = aws_lb_target_group.default.arn
  }

  network_configuration {
    subnets          = module.networked_rds.network_public_subnet_ids
    security_groups  = [aws_security_group.svc_sg.id, module.networked_rds.db_security_group_id, module.networked_rds.bastion_security_group_id]
    assign_public_ip = true
  }
  depends_on      = [aws_lb.alb, aws_lb_listener.https, aws_ssm_parameter.secret]
}
