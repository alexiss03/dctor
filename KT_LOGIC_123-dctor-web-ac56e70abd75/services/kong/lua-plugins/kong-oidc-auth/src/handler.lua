local access = require "kong.plugins.kong-oidc-auth.access"

local KongOidcAuth = {
  VERSION  = "0.0.1",
  PRIORITY = 10,
}
  
local kong = kong

function KongOidcAuth:access(config)
  return access.run(config)
end

return KongOidcAuth
