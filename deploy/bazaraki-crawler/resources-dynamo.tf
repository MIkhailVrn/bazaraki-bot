resource "aws_dynamodb_table" "bz_crawler_last_adv" {
  name           = "bz-crawler-last-adv"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }
}