import { drivers, disp } from './drivers.js'
import { changeApprove, newnonconfirm, actualizator } from '../functions.js'
import mysql from "mysql2";
import { sqlparams } from '../config.js'


export default function addwork(job) {
  try {
    const connection = mysql.createConnection(sqlparams)


    let jobdriver
    let driverid
    let jobdisp
    let dispid

    if (connection) console.log("Соединение с базой установлено")
    var sql = "INSERT INTO work (driver_id_tel, driver_name, height, time, address, phone, phone_name, pererabotka, firm, manager_id, manager_name, payment_type, payment_value, work_date, approved_by_driver  ) values ?";

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

    var approver = changeApprove(job[2], job[10]);


    var value = job[8].replace(/\D/g, "");
    var type = job[8].replace(/[^А-Яа-яЁё]/g, '')
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
    var $work_date = job[10]
    var $approved_by_driver = approver

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
        $approved_by_driver,
      ]
    ]

    connection.query(sql, [values], function (err) {
      if (err) throw err;
      else {
        if (approver == 0) {
          connection.query('SELECT LAST_INSERT_ID()', function (err, id) {

            var workid = (JSON.stringify(id[0])).replace(/[^0-9]/g, "")
            values.push(workid)

            newnonconfirm(driverid, [dispid, jobdriver]); // Отправляем заявку водителю
            actualizator(); //Актуализируем базу
          })

        }
        console.log("Успешно добавлена новая работа")
        connection.end(function (err) {
          if (err) {
            return console.log("Ошибка: " + err.message);
          }
          console.log("Подключение закрыто");
        });
      }
    });
  }
  catch (err) {
    console.error('Ошибка в блоке b1', err);
  }
}



