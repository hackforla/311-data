resource "aws_alb_target_group" "three_one_one_target_group" {
  name     = "three-one-one-alb-target-group"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.vpc.id
}

resource "aws_alb" "three_one_one_main_alb" {
  name    = "three-one-one-main-alb"
  subnets = [aws_subnet.subnet_public.id]
  #security_groups = ["${module.new-vpc.default_security_group_id}"]
}

resource "aws_alb_listener" "back_end" {
  load_balancer_arn = aws_alb.three_one_one_main_alb.id
  port              = "80"
  protocol          = "HTTP"

  default_action {
    target_group_arn = aws_alb_target_group.three_one_one_target_group.id
    type             = "forward"
  }
}
