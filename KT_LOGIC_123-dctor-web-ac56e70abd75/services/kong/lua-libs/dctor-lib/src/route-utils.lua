local cjson = require("cjson.safe")
local oidc = require("resty.openidc")
local http = require("resty.http")

local function isempty(s)
    return s == nil or s == ''
end

local route_utils = {}

function route_utils.set_service_target(svc_name)
    local scheme, err = kong.vault.get("{vault://dctor/API_" .. svc_name .. "_SCHEME}")
    local host, err = kong.vault.get("{vault://dctor/API_" .. svc_name .. "_HOST}")
    local port, err = kong.vault.get("{vault://dctor/API_" .. svc_name .. "_PORT}")

    kong.service.request.set_scheme(scheme)
    ngx.req.set_header("Host", host)
    kong.service.set_target(host, tonumber(port))
end

function route_utils.set_upstream_path(endpoint_path, request_prefix, upstream_prefix)
    local path = kong.request.get_path()
    local service_path = string.gsub(path, "^/" .. request_prefix .. endpoint_path, "/" .. upstream_prefix .. endpoint_path)
    kong.service.request.set_path(service_path)
    return service_path
end

function route_utils.set_gqle_admin_secret()
    local admin_secret, err = kong.vault.get("{vault://dctor/API_GQLE_ADMIN_SECRET}")
    kong.service.request.set_header("X-Hasura-Admin-Secret", admin_secret)
end

function route_utils.get_authorization_payload()
    local discovery_endpoint, err = kong.vault.get("{vault://dctor/API_DISCOVERY_ENDPOINT}")

    local bearer_verify_opts = {
        discovery = discovery_endpoint
    }
    local jwt_res, jwt_err = oidc.bearer_jwt_verify(bearer_verify_opts)
    return jwt_res, jwt_err
end

function route_utils.set_me_to_user_id(path)
    local authz_payload = route_utils.get_authorization_payload()
    if isempty(path) then
        path = kong.request.get_path()
    end
    local service_path = string.gsub(path, "/me$", "/" .. authz_payload.sub)
    kong.service.request.set_path(service_path)
    return service_path
end

function route_utils.parse_query_params(request_query, param_name)
    local be_scheme, err = kong.vault.get("{vault://dctor/API_BE_SCHEME}")
    local be_host, err = kong.vault.get("{vault://dctor/API_BE_HOST}")
    local be_port, err = kong.vault.get("{vault://dctor/API_BE_PORT}")

    local conv_query = {}

    for k, v in pairs(request_query) do
        local conv_key = string.gsub(k, "^" .. param_name, "input[%1]")
        conv_query[conv_key] = v
    end

    local conv_request_params = {
        method = "GET",
        query = ngx.encode_args(conv_query),
        headers = {
            Host = be_host,
            ['Content-Type'] = "application/json",
            ['User-Agent'] = 'kong/3.3.1.0-enterprise-edition',
        }
    }
    kong.log.inspect(conv_request_params)

    local conv_request_uri = be_scheme .. "://" .. be_host .. ":" .. be_port .. "/api/utility/form-data-to-json"
    local httpc = http.new()
    local conv_res, err = httpc:request_uri(conv_request_uri, conv_request_params)

    return conv_res, err
end

function route_utils.generate_id(table_name, sequence_name)
    local be_scheme, err = kong.vault.get("{vault://dctor/API_BE_SCHEME}")
    local be_host, err = kong.vault.get("{vault://dctor/API_BE_HOST}")
    local be_port, err = kong.vault.get("{vault://dctor/API_BE_PORT}")

    local query_params = {
        table_name = table_name,
        sequence_name = sequence_name,
    }

    local request_params = {
        method = "POST",
        query = ngx.encode_args(query_params),
        headers = {
            Host = be_host,
            ['Content-Type'] = "application/json",
            ['User-Agent'] = 'kong/3.3.1.0-enterprise-edition',
        }
    }

    local request_uri = be_scheme .. "://" .. be_host .. ":" .. be_port .. "/api/utility/generate-id"
    local httpc = http.new()
    local res, err = httpc:request_uri(request_uri, request_params)

    if not err and res.status == 200 then
        response_data = cjson.decode(res.body)
        return response_data[1], response_data[2]
    else
        kong.log.inspect(err)
    end
    return nil, nil
end

return route_utils
