terraform {
  backend "s3" {
    bucket = "terraform-filo-state-bucket"
    key    = "skladis-frontend/terraform.tfstate"
    region = "eu-central-1"

    dynamodb_table = "terraform-filo-state-locks"
    encrypt        = true
  }

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 3.0"
    }
  }
}

resource "cloudflare_pages_project" "skladis_frontend" {
  account_id        = var.cloudflare_account_id
  name              = var.skladis_project_name
  production_branch = "master"

  build_config {
    build_command   = "yarn build"
    destination_dir = "dist"
  }

  source {
    type = "github"
    config {
      owner                         = "lifo9"
      repo_name                     = "skladis-frontend"
      production_branch             = "master"
      pr_comments_enabled           = false
      deployments_enabled           = true
      preview_deployment_setting    = "none"
      production_deployment_enabled = true
    }
  }

  deployment_configs {
    production {
      environment_variables = {
        VITE_API_BASE_URL = var.api_base_url
        NODE_VERSION      = 16
      }
    }
  }
}

resource "cloudflare_pages_domain" "skladis_frontend_domain" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.skladis_frontend.name
  domain       = var.skladis_frontend_domain_name
}

resource "cloudflare_record" "skladis_dns" {
  zone_id = var.zone_id
  name    = "@"
  value   = "${var.skladis_project_name}.pages.dev"
  type    = "CNAME"
  proxied = true
}

resource "cloudflare_record" "www_skladis_dns" {
  zone_id = var.zone_id
  name    = "www"
  value   = "${var.skladis_project_name}.pages.dev"
  type    = "CNAME"
  proxied = true
}

resource "cloudflare_page_rule" "redirect_www_to_apex" {
  zone_id  = var.zone_id
  target   = "www.${var.skladis_frontend_domain_name}*"
  priority = 1

  actions {
    forwarding_url {
      url         = "https://${var.skladis_frontend_domain_name}/$1"
      status_code = 301
    }
  }
}
