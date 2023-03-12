resource "aws_iam_role" "bz_crawler_iam_for_lambda" {
  name               = "bz_crawler_iam_for_lambda"
  assume_role_policy = data.aws_iam_policy_document.bz_crawler_assume_role.json
}

data "aws_iam_policy_document" "bz_crawler_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

data "aws_iam_policy_document" "bz_crawler_access_policy_document" {
  statement {
    effect = "Allow"
		actions = [
			"ssm:GetParameter",
		]
		resources = [
      "arn:aws:ssm:eu-west-2:532571067673:parameter/bot-token"
		]
	}

  statement {
    effect  = "Allow"
    actions = [
      "dynamodb:PutItem",
      "dynamodb:GetItem",
      "dynamodb:DeleteItem"
    ]
    resources = [
      aws_dynamodb_table.bz_crawler_last_adv.arn,
    ]
  }

  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = [ aws_cloudwatch_log_group.bz_crawler_logs.arn ]
  }
    
}

resource "aws_iam_policy" "bz_crawler_access_policy" {
  name   = "bz_crawler_ap"
  policy = data.aws_iam_policy_document.bz_crawler_access_policy_document.json
}

resource "aws_iam_role_policy_attachment" "bz_crawler_policy_attachment" {
  role       = aws_iam_role.bz_crawler_iam_for_lambda.name
  policy_arn = aws_iam_policy.bz_crawler_access_policy.arn
} 