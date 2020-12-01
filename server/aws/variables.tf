locals {
  name = "${var.stage}-${var.task_name}"
}

variable profile {}

variable region {
  type        = string
  default     = "us-east-1"
}

variable availability_zones {
  description = "Available CIDR blocks for public subnets."
  type        = list(string)  
  default     = [
    "us-east-1a",
    "us-east-1b"
    ]
}

variable stage {
  type        = string
  default     = "dev"
}

variable image_tag {
  type        = string
  default     = "dev"
}

variable account_id {}

variable db_name {}
variable db_username {}
variable db_password {}

variable container_cpu {
  type        = number
  default     = 256
}

variable container_memory {
  type        = number
  default     = 1024
}

variable container_port {
  type        = number
  default     = 5000
}

variable container_tag {
  type        = string
  default     = "dev"
}

variable task_name {
  type        = string
  default     = "la-311-data"
}

variable health_check_path {
  type        = string
  default     = "/status/api"
}  

variable acm_certificate_arn  {}

variable tags {
  default     = {}
  type        = map
}
