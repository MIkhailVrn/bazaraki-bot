resource "aws_apigatewayv2_api" "api" {
	name          = "api-${random_id.random_path.hex}"
	protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "api" {
	api_id           = aws_apigatewayv2_api.api.id
	integration_type = "AWS_PROXY"

	integration_method     = "POST"
	integration_uri        = aws_lambda_function.bazaraki_tg_bot.invoke_arn
	payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "api" {
	api_id    = aws_apigatewayv2_api.api.id
	route_key     = "ANY /${random_id.random_path.hex}/{proxy+}"

	target = "integrations/${aws_apigatewayv2_integration.api.id}"
}

resource "aws_apigatewayv2_stage" "api" {
	api_id      = aws_apigatewayv2_api.api.id
	name        = "$default"
	auto_deploy = true
}

resource "aws_lambda_permission" "apigw" {
	action        = "lambda:InvokeFunction"
	function_name = aws_lambda_function.bazaraki_tg_bot.arn
	principal     = "apigateway.amazonaws.com"

	source_arn = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

resource "random_id" "random_path" {
	byte_length = 16
}
