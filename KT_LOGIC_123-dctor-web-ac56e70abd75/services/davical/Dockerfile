# FROM php:8.1.16-apache
FROM php:7.4.33-apache

RUN apt-get update \
    && apt-get install -y \
        libapache2-mod-auth-openidc \
        libc-client-dev \
        libkrb5-dev \
        libldap2-dev \
        libldb-dev \
        libpq-dev \
        perl \
     	libyaml-perl \
     	libdbd-pg-perl \
     	libdbi-perl \
        postgresql-client \
    && a2enmod headers \
    && rm -r /var/lib/apt/lists/*

RUN docker-php-ext-configure imap --with-kerberos --with-imap-ssl \
    && docker-php-ext-install \
        calendar \
        gettext \
        imap \
        ldap \
        pdo_pgsql \
        pgsql
