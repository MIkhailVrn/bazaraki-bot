resource "aws_iam_role" "tg_bot_iam_for_lambda" {
  name               = "tg_bot_iam_for_lambda"
  assume_role_policy = data.aws_iam_policy_document.tg_bot_assume_role.json
}

data "aws_iam_policy_document" "tg_bot_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

data "aws_iam_policy_document" "tg_bot_access_policy_document" {
  statement {
    effect = "Allow"
		actions = [
			"ssm:GetParameter",
		]
		resources = [
			aws_ssm_parameter.tg_bot_token.arn
		]
	}
}

resource "aws_iam_policy" "tg_bot_access_policy" {
  name   = "tg_bot"
  policy = data.aws_iam_policy_document.tg_bot_access_policy_document.json
}

resource "aws_iam_role_policy_attachment" "tg_bot_policy_attachment" {
  role       = aws_iam_role.tg_bot_iam_for_lambda.name
  policy_arn = aws_iam_policy.tg_bot_access_policy.arn
}