variable profile {}

variable region {
  type        = string
  default     = "us-east-1"
}

variable availability_zones {
  description = "Available cidr blocks for public subnets."
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
  default     = 512
}

variable container_port {
  type        = number
  default     = 5000
}

variable task_name {
  type        = string
  default     = "311-data-api"
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
