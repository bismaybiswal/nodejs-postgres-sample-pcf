'use strict';
const cfenv = require('cfenv');
const appEnv = cfenv.getAppEnv()
const createTable =
    'CREATE TABLE IF NOT EXISTS Users \
        ( \
            id serial, \
            firstname varchar(100), \
            lastname varchar(100), \
            location varchar(100), \
            PRIMARY KEY (id) \
        )';

const getDBUri = () => {
    let uri = '';
    if (process.env.VCAP_SERVICES) {
        // running in cloud
        uri = appEnv.getService('db-service').credentials.uri;
    } else {
        console.log('running locally is not supported');
    }
    return uri;
}

const getDB = (callback) => {
    let pgp = require('pg-promise')({
        // Initialization Options
    });
    var db = pgp(getDBUri());
    let sql = createTable;
    db.query(sql)
        .then(function () {
            console.log('database initialized');
            callback(null, db);
            return;
        })
        .catch((err) => {
            console.log(err);
            callback(err, null);
            return;
        });
}

module.exports = {
    getDB: getDB
};
