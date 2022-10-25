variable "cloudflare_account_id" {
  type      = string
  sensitive = true
}

variable "api_base_url" {
  type = string
}

variable "skladis_frontend_domain_name" {
  type    = string
  default = "skladis.com"
}

variable "zone_id" {
  type      = string
  sensitive = true
}

variable "skladis_project_name" {
  type    = string
  default = "skladis-frontend"
}
