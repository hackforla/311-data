data "aws_ecs_task_definition" "three_one_one_backend_task" {
  task_definition = aws_ecs_task_definition.three_one_one_backend_task.family
  depends_on      = [aws_ecs_task_definition.three_one_one_backend_task]
}

resource "aws_ecs_task_definition" "three_one_one_backend_task" {
  family = "service"

  container_definitions = file("task-definitions/backend.json")
}
