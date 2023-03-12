variable "aws_region" {
  type    = string
  default = "eu-west-2"
}

variable "bz_crawler_zip" {
  type    = string
  default = "../../output/tg-bot.zip"
}

variable "bz_crawler_src" {
  type    = string
  default = "../../dist/index.js"
}

variable "bz_crawler_token" {
	type = string
	sensitive = true
}