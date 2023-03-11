resource "aws_ssm_parameter" "tg_bot_token" {
	name = "bot-token"
	type = "SecureString"
	value = var.tg_bot_token
}