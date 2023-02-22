import mysql from "mysql2";
var again = 0

// Создание соединения



// Функция для вытаскивания всех данных
function get_alldata(sql, callback){
const connection =  mysql.createConnection({
  host: "localhost",
  user: "gg",
  password: "28884323",
  database: "botdb"
})

  connection.query(sql, function(err, results){
        if (err){ 
          throw err;
        }
		console.log("Подключение открыто");
        return callback(results);
})
connection.end(function(err) {
  if (err) {
    return console.log("Ошибка: " + err.message);
  }
  console.log("Подключение закрыто");
});

}

var sql = "SELECT * from user";
var allfetch = '';
var alldata = get_alldata(sql, function(result){
allfetch = result;
});



// Функция для добавления нового пользователя
const add_newanon = function addnewanon(new_guy){

const connection =  mysql.createConnection({
  host: "localhost",
  user: "gg",
  password: "28884323",
  database: "botdb"
})


if (again !== new_guy.from.id) {
  var sql2 = "INSERT INTO user (id_telegram,  nickname_telegram, name_telegram) values ('"+new_guy.from.id+"','"+ new_guy.from.username +"','"+ new_guy.from.first_name+"')";
  connection.query(sql2, function(err) {
    if (err) throw err;
    else console.log("Успешно добавлен новый пользователь")
	again = new_guy.from.id;
  });
}
else{
console.log("Уже есть такой"); 
var alldata = get_alldata(sql, function(result){
allfetch = result;
}
);
}

connection.end(function(err) {
  if (err) {
    return console.log("Ошибка: " + err.message);
  }
  console.log("Подключение закрыто");
});

}





export {allfetch,add_newanon}

