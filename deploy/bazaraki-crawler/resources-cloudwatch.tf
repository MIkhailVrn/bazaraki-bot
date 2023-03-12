resource "aws_cloudwatch_event_rule" "every_five_min" {
  name                = "bz-crawler-every_five_min"
  description         = "Fires every five minutes"
  schedule_expression = "cron(*/5 * * * ? *)"
}

resource "aws_cloudwatch_event_target" "check_every_five_min" {
  rule      = aws_cloudwatch_event_rule.every_five_min.name
  target_id = "bz-crawler"
  arn       = aws_lambda_function.bz_crawler.arn
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_check" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.bz_crawler.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.every_five_min.arn
}