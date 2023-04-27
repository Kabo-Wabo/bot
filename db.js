import mysql from "mysql2";
import mysqlPromise from 'mysql2/promise.js';
import { sqlparams, poolsql } from './config.js'


// Создание соединения
export async function pool_all_data(sql, callback) {
  const pool = mysql.createPool(poolsql)
  pool.query(sql, function (err, rows) {
    return callback(rows);
  })
  pool.end(function (err) {
    if (err) {
      return console.log(err.message);
    }
  });
}


export async function assql(sql) {

  const pool = mysql.createPool(poolsql);
  // now get a Promise wrapped instance of that pool
  const promisePool = pool.promise();
  // query database using promises
  const rows = await promisePool.query(sql);
  connection.end(function (err) {
    if (err) {
      return console.log("Ошибка: " + err.message);
    }
    console.log("Подключение для всех данных закрыто");
  });
  return rows
}

// Функция для вытаскивания всех данных
export function get_alldata(sql, callback) {
  try {
    const connection = mysql.createConnection(sqlparams)

    connection.query(sql, function (err, results) {
      if (err) {
        throw err;
      }
      console.log("Подключение для всех данных открыто");
      return callback(results);
    })
    connection.end(function (err) {
      if (err) {
        return console.log("Ошибка: " + err.message);
      }
      console.log("Подключение для всех данных закрыто");
    });
  }
  catch (err) {
    console.error('Ошибка в блоке a1', err);
  }
}



// Нормальная асинхронная функция блядь

export async function getalluser() {
  try {
    const connection = await mysqlPromise.createConnection({ host: '127.0.0.1', user: 'root', password: "28884323", database: 'botdb' });
    const [rows, fields] = await connection.execute('SELECT * FROM user');
    return rows;
  }
  catch (err) {
    console.error('Ошибка в блоке a2', err);
  }
}




// Функция для добавления нового пользователя
const add_newanon = function addnewanon(new_guy) {
  try {
    const connection = mysql.createConnection(sqlparams)

    var sql2 = "INSERT INTO user (id_telegram,  nickname_telegram, name_telegram) values ('" + new_guy.from.id + "','" + new_guy.from.username + "','" + new_guy.from.first_name + "')";
    connection.query(sql2, function (err) {
      if (err) throw err;
      else console.log("Успешно добавлен новый пользователь")
    });

    connection.end(function (err) {
      if (err) {
        console.log("Ошибка: " + err.message);
      }
      //console.log("Подключение для добавления нового пользователя закрыто");
    });
  }
  catch (err) {
    console.error('Ошибка в блоке a3', err);
  }
}


export { add_newanon }

