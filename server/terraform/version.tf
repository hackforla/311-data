terraform {
  required_version = ">=0.12, <0.13"
  
  required_providers {
    aws = {
      # source  = "hashicorp/aws"
      version = "~> 2.70"
    }
  }
}
