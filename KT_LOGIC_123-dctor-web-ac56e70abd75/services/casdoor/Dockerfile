FROM casbin/casdoor:v1.379.0 AS STANDARD

FROM public.ecr.aws/docker/library/golang:1.17.5 AS SERVERLESS
# FROM public.ecr.aws/lambda/go:latest AS SERVERLESS
# FROM public.ecr.aws/lambda/provided:latest AS SERVERLESS


COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.7.0 /lambda-adapter /opt/extensions/lambda-adapter
ENV PORT=7000

RUN mkdir -p /go/src/casdoor/ \
    && mkdir -p /conf/ \
    && mkdir -p /logs/

WORKDIR /
COPY --from=STANDARD /server ./server
COPY --from=STANDARD /swagger ./swagger
# COPY --from=STANDARD /docker-entrypoint.sh /docker-entrypoint.sh
# COPY --from=STANDARD /conf/app.conf ./conf/app.conf
# COPY --from=STANDARD /go/src/casdoor/version_info.txt ./go/src/casdoor/version_info.txt
COPY --from=STANDARD /web/build ./web/build
COPY ./conf/casdoor/app.conf ./conf/app.conf

WORKDIR /tmp

ENTRYPOINT ["/server"]
CMD ["/docker-entrypoint.sh"]
