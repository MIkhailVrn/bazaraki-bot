variable "aws_region" {
  type    = string
  default = "eu-west-2"
}

variable "bz_crawler_zip" {
  type    = string
  default = "../../output/bz-crawler.zip"
}

variable "bz_crawler_src" {
  type    = string
  default = "../../dist/bz-crawler/index.js"
}