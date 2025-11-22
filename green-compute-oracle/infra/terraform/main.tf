provider "aws" {
  region = "us-east-1"
}

resource "aws_db_instance" "default" {
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "15.4"
  instance_class       = "db.t3.micro"
  db_name              = "green_compute"
  username             = "postgres"
  password             = "changeme" # Use KMS/Secrets Manager in production
  parameter_group_name = "default.postgres15"
  skip_final_snapshot  = true
}

resource "aws_s3_bucket" "certificates" {
  bucket = "green-compute-certificates-v1"
  
  tags = {
    Name        = "Green Compute Certificates"
    Environment = "Production"
  }
}

resource "aws_eks_cluster" "main" {
  name     = "green-compute-cluster"
  role_arn = aws_iam_role.eks_cluster.arn

  vpc_config {
    subnet_ids = ["subnet-12345678", "subnet-87654321"]
  }
}

resource "aws_iam_role" "eks_cluster" {
  name = "eks-cluster-role"

  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "eks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
POLICY
}
