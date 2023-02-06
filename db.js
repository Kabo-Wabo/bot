import mysql from "mysql2";
 
export const connection = mysql.createConnection({
  host: "localhost",
  user: "gg",
  password: "28884323"
});
if (connection) console.log("Вход в базу данных успешен")
 
connection.end();