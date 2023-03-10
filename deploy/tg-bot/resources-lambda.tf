resource "aws_lambda_function" "bazaraki_tg_bot" {
  filename         = var.tg_bot_zip
  function_name    = "bazaraki-tg-bot"
  runtime          = "nodejs16.x"
  handler          = "index.handler"

  source_code_hash = data.archive_file.tg_bot_archive_zip.output_base64sha256

  role             = aws_iam_role.tg_bot_iam_for_lambda.arn

  environment {
		variables = {
			TG_BOT_TOKEN  = aws_ssm_parameter.tg_bot_token.name
      DOMAIN        = aws_apigatewayv2_api.api.api_endpoint
      PATH_KEY      = random_id.random_path.hex
		}
	}
}

data "aws_lambda_invocation" "set_webhook" {
	function_name = aws_lambda_function.bazaraki_tg_bot.function_name

	input = <<JSON
  {
  	"setWebhook": true
  }
  JSON
}

data "archive_file" "tg_bot_archive_zip" {
  type        = "zip"
  source_file = var.tg_bot_src
  output_path = var.tg_bot_zip
}