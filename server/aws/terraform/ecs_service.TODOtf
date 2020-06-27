resource "aws_ecs_service" "three_one_one_backend_service" {
  name            = "three_one_one_backend_service"
  cluster         = aws_ecs_cluster.three_one_one_ecs_cluster.id
  task_definition = "${aws_ecs_task_definition.three_one_one_backend_task.family}:${max("${aws_ecs_task_definition.three_one_one_backend_task.revision}", "${data.aws_ecs_task_definition.three_one_one_backend_task.revision}")}"
  desired_count   = 1
  iam_role        = aws_iam_role.ecs-service-role.name

  load_balancer {
    target_group_arn = aws_alb_target_group.three_one_one_target_group.id
    container_name   = "nginx"
    container_port   = "80"
  }

  depends_on = [
    # "aws_iam_role_policy.ecs-service",
    aws_alb_listener.back_end,
  ]
}
