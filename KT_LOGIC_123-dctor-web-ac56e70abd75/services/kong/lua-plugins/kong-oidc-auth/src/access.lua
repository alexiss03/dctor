local cjson = require("cjson.safe")
-- local pl_stringx = require "pl.stringx"
local http = require("resty.http")
local oidc = require("resty.openidc")
-- local str = require "resty.string"
-- local openssl_digest = require "openssl.digest"
-- local cipher = require "openssl.cipher"
-- local aes = cipher.new("AES-128-CBC")
local oidc_error = nil
-- local salt = nil --16 char alphanumeric
-- local cookieDomain = nil
local kong = kong

local access = {}

function access.run(conf)
    -- local vault = kong.vault.get_vault("dctor")
    local client_id, err = kong.vault.get("{vault://dctor/API_CLIENT_ID}")
    local client_secret, err = kong.vault.get("{vault://dctor/API_CLIENT_SECRET}")
    local scope, err = kong.vault.get("{vault://dctor/API_SCOPE}")
    local redirect_uri, err = kong.vault.get("{vault://dctor/API_REDIRECT_URI}")
    local discovery_endpoint, err = kong.vault.get("{vault://dctor/API_DISCOVERY_ENDPOINT}")
    local introspection_endpoint, err = kong.vault.get("{vault://dctor/API_INTROSPECTION_ENDPOINT}")

    local bearer_verify_opts = {
        discovery = discovery_endpoint
    }
    local jwt_res, jwt_err = oidc.bearer_jwt_verify(bearer_verify_opts)

    if jwt_err or not jwt_res then
        ngx.status = 401
        local response_body = {
            error = {
                statusCode = 401,
                name = "Unauthorized",
                message = "No access token provided.",
            }
        }
        ngx.say(err and err or cjson.encode(response_body))
        ngx.exit(ngx.HTTP_FORBIDDEN)
    end

    local tags = cjson.decode(jwt_res.tag)

    local introspect_opts = {
        client_id = client_id,
        client_secret = client_secret,
        scope = scope,
        redirect_uri = redirect_uri,
        introspection_endpoint = introspection_endpoint,
    }
	local res, err = oidc.introspect(introspect_opts)
    if err then
        return kong.response.exit(ngx.HTTP_UNAUTHORIZED, { message = err })
    end
    kong.service.request.set_header("X-Hasura-Role", tags.roles[1])
    kong.service.request.set_header("X-Hasura-User-Id", res.sub)
    local now = ngx.now()
    local curr_timestamp = os.date('%Y-%m-%dT%H:%M:%S', now)
    kong.service.request.set_header("X-Hasura-Current-Timestamp", curr_timestamp)
end

return access
