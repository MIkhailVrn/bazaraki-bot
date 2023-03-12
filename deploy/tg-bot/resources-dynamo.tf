resource "aws_dynamodb_table" "tg_bot_users" {
  name           = "tg-bot-users"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"

  attribute {
    name = "id"
    type = "N"
  }
}