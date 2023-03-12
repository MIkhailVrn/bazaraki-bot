resource "aws_lambda_function" "bz_crawler" {
  filename         = var.bz_crawler_zip
  function_name    = "bz_crawler"
  runtime          = "nodejs16.x"
  handler          = "index.handler"

  source_code_hash = data.archive_file.bz_crawler_archive_zip.output_base64sha256

  role             = aws_iam_role.bz_crawler_iam_for_lambda.arn

  environment {
		variables = {
			TG_BOT_TOKEN  = aws_ssm_parameter.bz_crawler_token.name
      DOMAIN        = aws_apigatewayv2_api.api.api_endpoint
      PATH_KEY      = random_id.random_path.hex
		}
	}
}

data "archive_file" "bz_crawler_archive_zip" {
  type        = "zip"
  source_file = var.bz_crawler_src
  output_path = var.bz_crawler_zip
}