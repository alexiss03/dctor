local typedefs = require "kong.db.schema.typedefs"
local url = require "socket.url"

--Added a app_login_redirect_url for Single Page Apps that need redirection to their dashboard after auth prior to transacting against backend API services
--Added a new pf_idp_adapter_id tag as optional since we uses ping federate for OIDC
--Added a cookie_domain for valid domain the cookie can be used across

local function validate_url(value)
  local parsed_url = url.parse(value)
  if parsed_url.scheme and parsed_url.host then
    parsed_url.scheme = parsed_url.scheme:lower()
    if not (parsed_url.scheme == "http" or parsed_url.scheme == "https") then
      return false, "Supported protocols are HTTP and HTTPS"
    end
  end

  return true
end

return {
  name = "kong-oidc-auth",
  fields = {
    { protocols = typedefs.protocols },
    { config = {
        type = "record",
        fields = {
          -- { client_id = { type = "string", required = true}, },
          -- { client_secret = { type = "string", required = true}, },
          -- { scope = { type = "string" }, },
          -- { redirect_uri = { type = "string", required = true, custom_validator = validate_url }, },
          -- { introspection_endpoint = { type = "string", required = true, custom_validator = validate_url }, },
    }, }, },
  },
}