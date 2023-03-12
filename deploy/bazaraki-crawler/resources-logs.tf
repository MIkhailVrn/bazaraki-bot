resource "aws_cloudwatch_log_group" "bz_crawler_logs" {
  name = "/aws/lambda/bz-crawler"
}
