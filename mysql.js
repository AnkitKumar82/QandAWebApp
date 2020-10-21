var mysql = require('mysql');
var con = mysql.createConnection({
  host     : process.env.RDS_HOSTNAME,
  user     : process.env.RDS_USERNAME,
  password : process.env.RDS_PASSWORD,
  port     : process.env.RDS_PORT,
  multipleStatements: true
});
con.connect(function(err) {
  if (err) throw err;
});
module.exports = con;