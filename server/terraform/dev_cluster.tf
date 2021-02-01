
resource "aws_lb_target_group" "dev" {
  name                  = "target-dev"
  port                  = var.container_port
  protocol              = "HTTP"
	deregistration_delay  = 100
  target_type           = "ip"
  vpc_id                = module.networked_rds.network_vpc_id

  health_check {
		enabled             = true
		healthy_threshold   = 5
		interval            = 30
		path                = var.health_check_path
		port                = "traffic-port"
		protocol            = "HTTP"
		timeout             = 10
		unhealthy_threshold = 3
  }
}

# Adding host_based_weighted_routing for 2nd cluster
resource "aws_lb_listener_rule" "host_based_weighted_routing" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 99

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.dev.arn
  }

  condition {
    host_header {
      values = ["dev-api.311-data.org"]
    }
  }
}

data "template_file" "task_definition_dev" {
  template = file("templates/task.json")
  vars = {
    # container_memory = var.container_memory
    # container_cpu    = var.container_cpu
    container_port   = var.container_port
    # container_name   = var.container_name
    image_tag        = "dev"
    task_name        = var.task_name
    region           = var.region
    stage            = "dev"
  }
}

data "template_file" "prefect_definition_dev" {
  template = file("templates/prefect.json")
  vars = {
    # container_memory = var.container_memory
    # container_cpu    = var.container_cpu
    # container_port   = var.container_port
    # container_name   = var.container_name
    image_tag        = "dev"
    task_name        = var.task_name
    region           = var.region
    stage            = "dev"
  }
}

resource "aws_ecs_task_definition" "task_dev" {
  family = "dev-${var.task_name}-server"
  container_definitions    = data.template_file.task_definition_dev.rendered
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  memory                   = var.container_memory
  cpu                      = var.container_cpu
  execution_role_arn       = "arn:aws:iam::${var.account_id}:role/ecsTaskExecutionRole"
}

resource "aws_ecs_service" "svc_dev" {
  name            = "dev-${var.task_name}-svc"
  cluster         = aws_ecs_cluster.cluster.id
  task_definition = aws_ecs_task_definition.task_dev.arn
  launch_type     = "FARGATE"
  desired_count   = 1

  load_balancer {
    container_name   = "311_data_api"
    container_port   = var.container_port
    target_group_arn = aws_lb_target_group.dev.arn
  }

  network_configuration {
    subnets          = module.networked_rds.network_public_subnet_ids
    security_groups  = [aws_security_group.svc.id, module.networked_rds.db_security_group_id, module.networked_rds.bastion_security_group_id]
    assign_public_ip = true
  }

  depends_on      = [aws_lb.alb, aws_lb_listener.https, aws_ssm_parameter.secret]
}

module "ecs_scheduled_task_dev" {
  source                          = "git::https://github.com/tmknom/terraform-aws-ecs-scheduled-task.git?ref=tags/2.0.0"
  name                            = "dev-${var.task_name}-nightly-update"
  schedule_expression             = "cron(0 8 * * ? *)"
  container_definitions           = data.template_file.prefect_definition_dev.rendered
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
