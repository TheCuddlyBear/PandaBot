const { mysqlhost, mysqlport, mysqluser, mysqlpass, mysqldb } = require('../config.json');
const mysql = require('mysql');
const conn = mysql.createConnection({
    host: mysqlhost,
    port: mysqlport,
    user: mysqluser,
    password: mysqlpass
})

module.exports = {
    name: "mcstats",
    description: "Get your minecraft stats",
    execute(message, args){
        conn.connect(function(err) {
            if (err) throw err;
            console.log("Connected to database...");
          });
    }
}