module "dev_config" {
  source                          = "./env-config"
  service_cpu                     = 1024
  service_memory                  = 2048
  project_name                    = local.project_name
  app_name                        = local.app_name
  default_region                  = module.project_config.default_region
  environment                     = "dev"
  network_name                    = "dev"
  domain_name                     = null
  enable_https                    = false
  has_database                    = local.has_database
  has_incident_management_service = local.has_incident_management_service
  service_override_extra_environment_variables = {
    "APP_ENV" = "dev",
    "PORT" = "8000"
  }
}
