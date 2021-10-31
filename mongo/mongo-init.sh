#!/bin/bash

mongo -- "$MONGO_INITDB_DATABASE" <<-EOJS
    var rootUser = '$MONGODB_ROOT_USERNAME';
    var rootPassword = '$MONGODB_ROOT_PASSWORD';
    var admin = db.getSiblingDB('admin');

    admin.auth(rootUser, rootPassword);

    var user = '$MONGODB_USERNAME';
    var passwd = '$MONGODB_PASSWORD';

    db.createUser({ user: user, pwd: passwd, roles: ["readWrite"] });
EOJS

{
sleep 3 &&
mongo -- "$MONGODB_DATABASE_NAME" <<-EOJS
    var rootUser = '$MONGODB_ROOT_USERNAME';
    var rootPassword = '$MONGODB_ROOT_PASSWORD';
    var admin = db.getSiblingDB('admin');

    admin.auth(rootUser, rootPassword);

    rs.initiate()
EOJS
} &
