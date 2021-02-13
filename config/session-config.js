var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
const connection = require('./database-config');


var options = {
    host: process.env.HOST,
    port: 3306,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    clearExpired: true,
    checkExpirationInterval: 60 * 60 * 1000,  // 1 hr
    createDatabaseTable: true,
    endConnectionOnClose: true,
}

var sessionStore = new MySQLStore(options, connection);


module.exports = sessionStore;
