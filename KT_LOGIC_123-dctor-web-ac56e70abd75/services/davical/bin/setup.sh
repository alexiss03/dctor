#!/bin/bash

DB_HOST=rdb
DB_PORT=5432
DB_SCHEMA=caldav

export PGOPTIONS="--search_path=${DB_SCHEMA} --client-min-messages=warning"
export PSQLOPTS="-h ${DB_HOST} -p ${DB_PORT} -U ${PGSQL_USER} ${PGSQL_DB}"

psql -qX ${PSQLOPTS} -c "CREATE SCHEMA IF NOT EXISTS ${DB_SCHEMA} AUTHORIZATION ${PGSQL_USER}"

cd /usr/share/davical/dba
./create-database.sh ${PGSQL_DB} ${CALDAV_ADMIN_PASSWORD} ${PGSQL_USER} ${PGSQL_USER}
