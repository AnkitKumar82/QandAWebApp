var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Ankit@1234",
  database: "qandadb",
  multipleStatements: true
});
con.connect(function(err) {
  if (err) throw err;
});
module.exports = con;