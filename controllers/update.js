import { drivers, disp } from './drivers.js'
import mysql from "mysql2";
import {setDate} from '../functions.js'
import {sqlparams} from '../config.js'

export function updatework(job, id, ctx){

let jobdriver
let driverid
let jobdisp
let dispid
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
	

const connection =  mysql.createConnection(sqlparams)

var value = job[8].replace(/\D/g, "");
var type = job[8].replace(/[^А-Яа-яЁё]/g,'')
if (!value) value = 0

if (connection) console.log("Соединение с базой для обновления установлено")
 var sql = "UPDATE work SET "+
"driver_id_tel = "+driverid+
",driver_name = '"+jobdriver+"'"+
",height = '"+job[1]+"'"+
",time = '"+job[2]+"'"+
",address = '"+job[3]+"'"+
",phone = '"+job[4]+"'"+
",phone_name = '"+job[5]+"'"+
",pererabotka = '"+job[7]+"'"+
",firm = '"+job[9]+"'"+
",manager_id = "+dispid+
",manager_name = '"+jobdisp+"'"+
",payment_type = '"+type+"'"+
",payment_value =  '"+value+"'"+
",work_date = '"+setDate(+1)+"'"+
" WHERE id = "+id+"";


connection.query(sql, function(err) {
    if (err) throw err;
    else {
		ctx.reply("Работа отредактирована");
		console.log("Отредактировали!")
		connection.end(function(err) {
		  if (err) {
			return console.log("Ошибка: " + err.message);
		  }
		  console.log("Подключение закрыто");
		});
	}
  });
  
  
}
