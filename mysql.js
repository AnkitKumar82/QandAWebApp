var mysql = require('mysql');
var con = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DBNAME,
  port : 3306,
  multipleStatements : true
});
con.connect(function(err) {
  if (err) throw err;
});
module.exports = con;