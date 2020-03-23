provider "aws" {
  profile = "default"
  region  = "us-east-1"
}

terraform {
  backend "s3" {
    bucket = "three-one-one"
    key    = "terraform/backend"
    region = "us-east-1"
  }
}
