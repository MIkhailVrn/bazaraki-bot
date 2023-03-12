resource "aws_lambda_function" "bz_crawler" {
  filename         = var.bz_crawler_zip
  function_name    = "bz-crawler"
  runtime          = "nodejs16.x"
  handler          = "index.handler"
  timeout          = 10
  memory_size      = 1024

  source_code_hash = data.archive_file.bz_crawler_archive_zip.output_base64sha256

  role             = aws_iam_role.bz_crawler_iam_for_lambda.arn
}

data "archive_file" "bz_crawler_archive_zip" {
  type        = "zip"
  source_file = var.bz_crawler_src
  output_path = var.bz_crawler_zip
}