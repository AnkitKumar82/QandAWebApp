var mysql = require('mysql');
var con = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DBNAME,
  port : process.env.DATABASE_PORT,
  multipleStatements : true
});
con.connect(function(err) {
  if (err) console.log("Database not connected",err);
  else console.log("Database connected");
});
module.exports = con;