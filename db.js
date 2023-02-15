import mysql from "mysql2";

const connection =  mysql.createConnection({
  host: "localhost",
  user: "gg",
  password: "28884323",
  database: "botdb"
})

function get_alldata(sql, callback){
      
  connection.query(sql, function(err, results){
        if (err){ 
          throw err;
        }
        return callback(results);
})
}

var sql = "SELECT * from user";
var allfetch = '';

const alldata = get_alldata(sql, function(result){
allfetch = result;
});
connection.end()
export {allfetch}

