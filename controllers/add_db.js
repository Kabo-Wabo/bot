import { drivers, disp } from './drivers.js'
import mysql from "mysql2";
import {sqlparams} from '../config.js'
// Создание соединения


export default function addwork(job){

const connection =  mysql.createConnection(sqlparams)


let jobdriver
let driverid
let jobdisp
let dispid

if (connection) console.log("Соединение с базой установлено")
  var sql = "INSERT INTO work (driver_id_tel, driver_name, height, time, address, phone, phone_name, pererabotka, firm, manager_id, manager_name, payment_type, payment_value, work_date  ) values ?";

// Из-за шляпы в addwork перепроверяю данные тут
drivers.forEach(function (entry) {

			if (job[0] == entry[0]) {
				jobdriver = entry[0];
				driverid = entry[1];
			}
		})
disp.forEach(function (entry) {
			if (job[6] == entry[0]) {
				jobdisp = entry[0];
				dispid = entry[1];
			}
		})		


var value = job[8].replace(/\D/g, "");
var type = job[8].replace(/[^А-Яа-яЁё]/g,'')
if (!value) value = 0
										
										// Нет формы оплаты, переработки

  var $driver_id_tel = driverid
  var $driver_name = jobdriver
  var $height = job[1] 
  var $time = job[2] 
  var $address = job[3]
  var $phone = job[4]
  var $phone_name = job[5] 
  var $pererabotka = job[7]
  var $firm = job[9]
  var $manager_id = dispid
  var $manager_name = jobdisp
  var $payment_type = type 
  var $payment_value = value
  var currentDate = new Date();
	currentDate.setDate(currentDate.getDate() + 1);
  var $work_date = currentDate;

  var values = [
  [$driver_id_tel, 
  $driver_name,
  $height,
  $time,
  $address,
  $phone,
  $phone_name,
  $pererabotka,
  $firm,
  $manager_id,
  $manager_name,
  $payment_type,
  $payment_value,
  $work_date,
 ]
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



