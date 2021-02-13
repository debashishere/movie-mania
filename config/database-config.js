const mysql = require('mysql');
const { resolve } = require('path');


// creaet connection
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,

})

// connec to db
connection.connect(err => {
    if (err) console.log('error while Connecting db', err);
    console.log('Mysql connected')
})

module.exports = connection;