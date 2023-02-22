import mysql from "mysql2";


// Создание соединения


export default function addwork(job, params){
const connection =  mysql.createConnection({
  host: "localhost",
  user: "gg",
  password: "28884323",
  database: "botdb"
})
let $job = job;
let $params = params;

if (connection) console.log("Соединение с базой установлено")
  var sql = "INSERT INTO work (driver_id_tel, phone, time, address, phone_name, firm, pererabotka, manager_id, add_date, rebuit, approved_by_d, height) values ?";

										
										// Нет формы оплаты, переработки
const currentDate = new Date();
  var $driver_id_tel = $params[0]
  var $phone = $job[4]
  var $time = job[2] 
  var $address = $job[3]
  var $phone_name = $job[5] 
  var $firm = $job[3]
  var $pererabotka = $job[7]
  var $manager_id = $params[2]
  var $add_date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
  var $rebuit = 0 
  var $approved_by_d = 0 
  var $height = job[1] 
  
  var values = [
  [$driver_id_tel, 
  $phone,
  $time,
  $address,
  $phone_name,
  $firm,
  $pererabotka,
  $manager_id,
  $add_date,
  $rebuit,
  $approved_by_d,
  $height]
  ]
  
  connection.query(sql,[values], function(err) {
    if (err) throw err;
    else {
		console.log("Успешно добавлена новая работа")
		connection.end(function(err) {
		  if (err) {
			return console.log("Ошибка: " + err.message);
		  }
		  console.log("Подключение закрыто");
		});
	}
  });

}



