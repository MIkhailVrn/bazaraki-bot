variable "aws_region" {
  type    = string
  default = "eu-west-2"
}

variable "tg_bot_zip" {
  type    = string
  default = "../../output/tg-bot.zip"
}

variable "tg_bot_src" {
  type    = string
  default = "../../dist/tg-bot/index.js"
}

variable "tg_bot_token" {
	type = string
	sensitive = true
}