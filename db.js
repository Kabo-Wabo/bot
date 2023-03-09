import mysql from "mysql2";
import mysqlPromise from 'mysql2/promise.js';
import {sqlparams} from './config.js'

// Создание соединения

var all;

// Функция для вытаскивания всех данных
export function get_alldata(sql, callback){


const connection =  mysql.createConnection(sqlparams)

  connection.query(sql, function(err, results){
        if (err){ 
          throw err;
        }
		console.log("Подключение для всех данных открыто");
        return callback(results);
})
connection.end(function(err) {
  if (err) {
    return console.log("Ошибка: " + err.message);
  }
  console.log("Подключение для всех данных закрыто");
});

}


// Нормальная асинхронная функция блядь

export async function getalluser() {
  const connection = await mysqlPromise.createConnection({host:'localhost', user: 'gg', password: "28884323",database: 'botdb'});
  const [rows,fields] = await connection.execute('SELECT * FROM user');
  return rows;
}




// Функция для добавления нового пользователя
const add_newanon = function addnewanon(new_guy){

const connection =  mysql.createConnection(sqlparams)

  var sql2 = "INSERT INTO user (id_telegram,  nickname_telegram, name_telegram) values ('"+new_guy.from.id+"','"+ new_guy.from.username +"','"+ new_guy.from.first_name+"')";
  connection.query(sql2, function(err) {
    if (err) throw err;
    else console.log("Успешно добавлен новый пользователь")
  });

connection.end(function(err) {
  if (err) {
    return console.log("Ошибка: " + err.message);
  }
  console.log("Подключение для добавления нового пользователя закрыто");
});

}



// Функция по доставанию работ из соответсвующей таблицы
function get_works(sql, callback){
const connection =  mysql.createConnection(sqlparams)

  connection.query(sql, function(err, results){
        if (err){ 
          throw err;
        }
		console.log("Подключение для доставания всех из соответсвующей открыто");
        return callback(results);
})
connection.end(function(err) {
  if (err) {
    return console.log("Ошибка: " + err.message);
  }
  console.log("Подключение для доставания всех из соответсвующих закрыто");
});

}




export {add_newanon}

