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
  db_engine_version      = var.db_engine_version
}

resource "aws_ssm_parameter" "secret" {
  name        = "/${var.stage}/${var.region}/DB_DSN"
  description = "The parameter description"
  type        = "SecureString"
  value       = "postgresql://${var.db_username}:${var.db_password}@${module.networked_rds.db_instance_endpoint}/${var.db_name}"
}

resource "aws_ecs_cluster" "cluster" {
  name = "${local.name}-cluster"
  
  setting {
    name  = "containerInsights"
    value = "disabled"
  }
}

resource "aws_security_group" "svc" {
  name_prefix = "${local.name}-svc"
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


# SPLIT

data "template_file" "task_definition" {
  template = file("templates/task.json")
  vars = {
    # container_memory = var.container_memory
    # container_cpu    = var.container_cpu
    container_port   = var.container_port
    # container_name   = var.container_name
    image_tag        = var.image_tag
    task_name        = var.task_name
    region           = var.region
    stage            = var.stage
  }
}

data "template_file" "prefect_definition" {
  template = file("templates/prefect.json")
  vars = {
    # container_memory = var.container_memory
    # container_cpu    = var.container_cpu
    # container_port   = var.container_port
    # container_name   = var.container_name
    image_tag        = var.image_tag
    task_name        = var.task_name
    region           = var.region
    stage            = var.stage
  }
}

resource "aws_ecs_task_definition" "task" {
  family = "${local.name}-server"
  container_definitions    = data.template_file.task_definition.rendered
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  memory                   = var.container_memory
  cpu                      = var.container_cpu
  execution_role_arn       = "arn:aws:iam::${var.account_id}:role/ecsTaskExecutionRole"
}

resource "aws_ecs_service" "svc" {
  name            = "${local.name}-svc"
  cluster         = aws_ecs_cluster.cluster.id
  task_definition = aws_ecs_task_definition.task.arn
  launch_type     = "FARGATE"
  desired_count   = 1

  load_balancer {
    container_name   = "311_data_api"
    container_port   = var.container_port
    target_group_arn = aws_lb_target_group.default.arn
  }

  network_configuration {
    subnets          = module.networked_rds.network_public_subnet_ids
    security_groups  = [aws_security_group.svc.id, module.networked_rds.db_security_group_id, module.networked_rds.bastion_security_group_id]
    assign_public_ip = true
  }

  depends_on      = [aws_lb.alb, aws_lb_listener.https, aws_ssm_parameter.secret]
}

# scheduled tasks use the same subnets and security groups as services
module "ecs_scheduled_task" {
  source                          = "git::https://github.com/tmknom/terraform-aws-ecs-scheduled-task.git?ref=tags/2.0.0"
  name                            = "${local.name}-nightly-update"
  schedule_expression             = "cron(0 8 * * ? *)"
  container_definitions           = data.template_file.prefect_definition.rendered
  cluster_arn                     = aws_ecs_cluster.cluster.arn
  subnets                         = module.networked_rds.network_public_subnet_ids
  security_groups                 = [aws_security_group.svc.id, module.networked_rds.db_security_group_id, module.networked_rds.bastion_security_group_id]
  assign_public_ip                = true
  cpu                             = var.container_cpu
  memory                          = var.container_memory
  requires_compatibilities        = ["FARGATE"]
  create_ecs_events_role          = false
  ecs_events_role_arn             = "arn:aws:iam::${var.account_id}:role/ecsEventsRole"
  create_ecs_task_execution_role  = false
  ecs_task_execution_role_arn     = "arn:aws:iam::${var.account_id}:role/ecsTaskExecutionRole"
}
