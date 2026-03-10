package = "kong-oidc-auth"
version = "0.0-1"
source = {
   url = "https://doctr-local.lbhonra.de/"
}
description = {
   summary = "OpenID Connect authentication with Kong Gateway v3.1.x",
   detailed = [[Please refer to the documentation associated here: https://doctr-local.lbhonra.de/ ]],
   homepage = "https://doctr-local.lbhonra.de/",
   license = "Apache 2.0"
}
dependencies = {}
build = {
   type = "builtin",
   modules = {
      ["kong.plugins.kong-oidc-auth.access"] = "src/access.lua",
      ["kong.plugins.kong-oidc-auth.handler"] = "src/handler.lua",
      ["kong.plugins.kong-oidc-auth.schema"] = "src/schema.lua",
   }
}
