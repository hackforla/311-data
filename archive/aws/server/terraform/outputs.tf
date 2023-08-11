output database_url {
  description = "The db adress and port for this RDS instance"
  value       = module.networked_rds.db_instance_endpoint
}

output load_balancer_url {
  description = "The public DNS name for the load balancer"
  value       = aws_lb.alb.dns_name
}

output bastion_public_ip {
  description = "The public IP address for the bastion server"
  value       = module.networked_rds.eip_public_address
}
