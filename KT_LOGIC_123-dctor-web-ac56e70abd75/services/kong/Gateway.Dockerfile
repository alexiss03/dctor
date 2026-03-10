FROM kong/kong-gateway:3.5.0.2 AS STANDARD

USER root

RUN mkdir -p /appl \
    && mkdir -p /etc/kong/
    # && mkdir -p /tmp/kong/ \
    # && cp -R /usr/local/kong/* /tmp/kong/

COPY ./lua-libs /appl/lua-libs
COPY ./lua-plugins /appl/lua-plugins

COPY ./kong.conf /etc/kong/kong.conf

#     && luarocks install lzlib ZLIB_DIR=/usr/ ZLIB_LIBDIR=/usr/lib/x86_64-linux-gnu/ \
#    

RUN apt update -y \
    && apt install -y gcc git libpq-dev unzip zlib1g zlib1g-dev  \
    && rm -rf /var/lib/apt/lists/* \
    && luarocks install lzlib \
    && luarocks install kong-advanced-router \
    && luarocks install lua-resty-aws \
    && luarocks install lua-resty-jwt \
    && luarocks install lua-resty-openidc \
    && luarocks install PGSQL_INCDIR=/usr/include/postgresql/ luasql-postgres \
    && cd /appl/lua-plugins/kong-oidc-auth/ && luarocks make kong-oidc-auth-0.0-1.rockspec \
    && cd /appl/lua-libs/dctor-lib/ && luarocks make dctor-lib-0.0-1.rockspec \
    && cd /appl/lua-libs/ical-lib/ && luarocks make ical-lib-0.0-1.rockspec

USER kong

# COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.7.0 /lambda-adapter /opt/extensions/lambda-adapter
ENV PORT=8000
