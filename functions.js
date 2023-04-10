import Markup from 'telegraf/markup.js'
import { DispMainMenu, yesNoKeyboard, workerconfirmed } from './keyboards.js'
import { get_alldata } from './db.js'
import { bot } from './app.js'
import { drivers, disp } from './controllers/drivers.js'
import { updatework } from './controllers/update.js'
import fs from 'fs'
import mysql from "mysql2";
import { poolsql } from './config.js'

//import { get } from 'https'
// Функция для вывода всех данных в телеграм
export function worktotelegram(allwork, ctx) {
	try {
		let status;
		for (let i = 0; i < allwork.length; i++) {
			if (allwork[i].approved_by_driver == 0) { status = "Не принята" }
			if (allwork[i].approved_by_driver == 1) { status = "Принято" }

			ctx.replyWithHTML(
				`<b>ID:` + allwork[i].id + ` ` + status +
				`</b>\n` + allwork[i].driver_name +
				` ` + allwork[i].time + ` ` +
				` ` + allwork[i].height + ` ` +
				` ` + allwork[i].address + ` ` +
				` ` + allwork[i].phone + ` ` +
				` ` + allwork[i].phone_name + ` ` +
				` ` + allwork[i].manager_name + ` ` +
				` ` + allwork[i].payment_type + ` ` +
				` ` + allwork[i].payment_value + ` ` +
				` ` + allwork[i].firm + ` ` +
				`переработка ` + allwork[i].pererabotka + ` ` +
				` ` + allwork[i].work_date.toISOString().split('T')[0]
				, Markup.inlineKeyboard([
					Markup.callbackButton('Удалить ' + allwork[i].id, 'del ' + allwork[i].id),
					Markup.callbackButton('Изменить ' + allwork[i].id, 'changework ' + allwork[i].id),
				], { columns: 2 }).extra());
		}
	}
	catch (err) {
		console.error('Ошибка в блоке 1', err);
	}
}


// Функция для вывода кратких данных
export function shorttotelegram(allwork, ctx) {
	try {
		let b = new Array()
		if (allwork == "") { ctx.reply("На этот день работ в базе нет"); }
		else {
			for (let i = 0; i < allwork.length; i++) {
				b[i] =
					allwork[i].time + " " +
					allwork[i].driver_name + " " +
					allwork[i].height + " " +
					allwork[i].payment_type + " " +
					allwork[i].firm
			}
			b = b.join('\n');
			ctx.replyWithHTML(b);
		}
	}

	catch (err) {
		console.error('Ошибка в блоке 2', err);
	}
}


export function confirmerwork(job, ctx) {
	try {
		var $id
		// Проверяем есть ли первый ID который указывает, что нужно не добавить а обновить
		var myArray = /^ID/.exec(job[0]);
		if (myArray) {
			$id = job[0].replace(/[^0-9]/g, "")
			job.splice(0, 1)
		}

		if (job.length == 10) { job.push(setDate(1)) }
		if (job.length == 11) {
			let jobdriver
			drivers.forEach(function (entry) {
				if (job[0] == entry[0]) {
					jobdriver = entry[0];
				}
			})
			if (jobdriver) {
				console.log("Водитель определен")
				///// Водитель подходит, он совпадает с данными в файле
				var metrRe = /\d\d[дмтвкг]$/; // Рег выражения проверки метражности
				var height_ver = metrRe.test(job[1]);
				if (!height_ver) { ctx.reply('Метраж введен не верно') }
				else {
					/// Метраж введен корректно - 2 цифры и буква
					console.log("Метраж введен верно")
					var timeRe = /^[0-9][0-9]\:[0-9][0-9]$|\у\т\ч/; /// Рег выражение времени 00:00 или утч
					var time_ver = timeRe.test(job[2]);
					if (!time_ver) { ctx.reply('Время введено не верно. Введите в формате хх:хх или утч') }
					else {/// Время введено корректно
						console.log("Время введено верно")
						var telRe = /\8[0-9]{10}/; /// Рег выражение для телефона
						var tel_ver = telRe.test(job[4]);
						if (tel_ver && (job[4].length == 11)) {
							/// Телефон состоит из 11 цифр и начинается на 8
							console.log("Телефон введен верно")
							// Определяем, введен ли корректно ответсвенный диспетчер
							let jobdisp
							disp.forEach(function (entry) {
								if (job[6] == entry[0]) {
									jobdisp = entry[0];
								}
							})
							if (jobdisp) {
								// Определили диспетчера из разрешенного массива
								console.log("Диспетчер определен")
								// Смотрим как введена переработка
								if (job[7] == 'есть' || job[7] == 'нет' || job[7] == 'утч') {
									console.log("Переработка введена корректно")
									if (job[8].substring(0, 3) == 'нал' || job[8] == 'бн' || job[8].substring(0, 5) == 'залог') {
										console.log("Форма оплаты определена")

										/// Если последний элемент дата (а он дата, т.к. мы сами его и определяли) - то дальше
										if (/^202[34]\-[0-9][0-9]\-[0-9][0-9]$/.test(job[10])) {
											/// Вот основа проверки , если ID нет то добавляем новую работу

											if (!$id) { replyconfirmed(job, ctx) }
											else { updatework(job, $id, ctx); $id = '' }
										}
										else {
											ctx.reply('Что-то не так с датой? Как ты умудрился?!?!')
										}

									}
									else { ctx.reply('Введите форму оплаты (нал*сумма*, бн, залог*сумма*)') }
								}
								else { ctx.reply('Введите переработку (есть, нет, утч)') }
							}
							else { ctx.reply('Диспетчер введен не верно') }
						}
						else { ctx.reply('Телефон введен не формате 8ххххххххх') }
					}
				}
			}
			else { ctx.reply('Имя водителя указано не верно') }
		}
		else {
			ctx.replyWithHTML(
				`Что-то не введено. Должно быть 11 значений через запятую, которые пройдут валидацию\n` +
				`<i>Добавьте работы по шаблону</i>\n` +
				`1 Водитель (только актуальные водители),\n 2 Метраж( две цифры + буква (т,к,в,б),\n 3 Время (формат хх:хх),\n 4 Адрес (любое значение - но не ставьте запятые!),\n 5 Телефон (начинается с 8 и далее +10 цифр),\n 6 Контакт (любое значение), \n 7 Диспетчер (только наши),\n 8 Переработка (есть, нет, утч) ,\n 9 Форма оплаты (бн, налсумма,залогсумма)\n 10 Фирма (любое значение)\n 11 Дата (Если не указывать, то по умолчанию - завтра)`
				, DispMainMenu())
		}
	}
	catch (err) {
		console.error('Ошибка в блоке 3', err);
	}
}


export function replyconfirmed(job, ctx) {
	try {
		ctx.replyWithHTML(
			`&#128165;<b>Данные прошли валидацию</b>&#128165;\n\n<b>Все введенное верно?</b>\n---------------\n` +
			`<i>&#128053;  Водитель</i>:     ` + job[0] +
			`\n<i>&#128129;  Метраж</i>:     ` + job[1] +
			`\n<i>&#128347;  Время</i>:     ` + job[2] +
			`\n<i>&#128205;  Адрес</i>:     ` + job[3] +
			`\n<i>&#9742;  Телефон</i>:     ` + job[4] +
			`\n<i>&#128119;  Контакт (Имя)</i>:     ` + job[5] +
			`\n<i>&#128511;  Диспетчер</i>:     ` + job[6] +
			`\n<i>&#9654;  Переработка</i>:     ` + job[7] +
			`\n<i>&#128178;  Форма оплаты</i>:     ` + job[8] +
			`\n<i>💼  Фирма</i>:     ` + job[9] +
			`\n<i>⏱  Дата</i>:     ` + job[10] + `\n ---------------`, yesNoKeyboard()
		)
		ctx.session.work = ctx.message.text + ',' + job[10]
	}
	catch (err) {
		console.error('Ошибка в блоке 4', err);
	}
}


export function setDate(x) {
	try {
		var date = new Date();
		date.setDate(date.getDate() + x);
		date = date.toISOString().split('T')[0]
		return date;
	}
	catch (err) {
		console.error('Ошибка в блоке 5', err);
	}
}


// Функция разбития на массив сообщения
export function mestojob(ctx) {
	try {
		let job = ctx.message.text.split(',')
		job.forEach(function (item, i, job) {
			job[i] = item.trim()
		});
		return job;
	}
	catch (err) {
		console.error('Ошибка в блоке 6', err);
	}
}

// Я очень долго мучался чтобы сделать одну функцию на две, но первая работает когда это первое сообщение
// а второе когда идет ответ ДА на проверенные данные. Долго мучался, забил

export function mestojob2(ctx) {
	try {
		let job = ctx.update.callback_query.message.text.split(',')
		job.forEach(function (item, i, job) {
			job[i] = item.trim()
		});
		return job;
	}
	catch (err) {
		console.error('Ошибка в блоке 7', err);
	}
}



//Если работ нету то пишем, если есть то передаем на отображение
export function actyalwork(allwork, ctx) {
	try {
		// Актуальные работы
		if (allwork == "") { ctx.reply("На этот день работ в базе нет"); }
		else { worktotelegram(allwork, ctx) }
	}
	catch (err) {
		console.error('Ошибка в блоке 7', err);
	}
}

export function driverwork(allwork, ctx) {
	try {
		if (allwork == "") { ctx.reply("Для Вас пока актуальных работ нету"); }
		else {

			allwork.forEach(function (job) {
				if (job.payment_value == 0) { job.payment_value = '' }
				job.work_date = job.work_date.toISOString().split('T')[0]
				if (job.work_date == setDate(0)) { job.work_date = 'Сегодня' }
				if (job.work_date == setDate(1)) { job.work_date = 'Завтра' }

				let telformat = "+7" + String(job.phone).slice(1)
				var vivod =
					"<b>" + job.work_date + " Время:  " + job.time + " </b>" +
					"\n----------------------------------------------\n" +
					"<i>&#128129;  Метраж</i>:      " + job.height +
					"\n<i>&#128129;  Адрес</i>:      " + job.address +
					"\n<i>&#128129;  Оплата</i>:      " + job.payment_type + ' ' + job.payment_value +
					"\n<i>&#128129;  Переработка</i>:      " + job.pererabotka +
					"\n<i>&#128129;  Ответсвенный</i>:      " + job.manager_name +

					"\n<i>&#128129;  Телефон</i>:" + telformat + ` ` + job.phone_name


				if (job.approved_by_driver == 0) {
					worknotconf(job, ctx, vivod);
				}
				if (job.approved_by_driver == 1) {
					workconf(job, ctx, vivod);
				}

			})
		}
	}
	catch (err) {
		console.error('Ошибка в блоке 8', err);
	}
}

function worknotconf(job, ctx, vivod) {
	try {
		ctx.replyWithHTML(
			`<b>&#10071;&#10071;&#10071;РАБОТА НЕ ПРИНЯТА&#10071;&#10071;&#10071;</b>\n\n` +
			vivod,
			Markup.inlineKeyboard([
				Markup.callbackButton('Принято', 'approve' + job.id)
			], { columns: 1 }).extra());
	}
	catch (err) {
		console.error('Ошибка в блоке 9', err);
	}
}

function workconf(job, ctx, vivod) {
	try {
		ctx.replyWithHTML(
			`<b>Работа принята</b>\n` +
			vivod,
			workerconfirmed(job.id)
		);
	}
	catch (err) {
		console.error('Ошибка в блоке 11', err);
	}
}


export function newnonconfirm(driverid, [manager_id, driver_name]) {
	try {
		//Тут в else нужно сделать уведомление о том , что водителя в телеграмме нет
		if (driverid !== 0) {
			bot.telegram.sendMessage(driverid, 'У вас есть новая работа!');
		}
		else {
			bot.telegram.sendMessage(manager_id, 'Водителю ' + driver_name + ' отправлена заявка, но его в телеграме нет! Заявка будет иметь не подтвержденный статус');
		}
	}
	catch (err) {
		console.error('Ошибка в блоке 10', err);
	}

}




export function sliceryear(str) {
	try {
		str = str.slice(5);
		return str
	}
	catch (err) {
		console.error('Ошибка в блоке 12', err);
	}
}


export async function listDir(ctx, path) {
	try {
		try {
			return await fs.promises.readdir(path);
		} catch (err) {
			ctx.reply("Не правильный запрос");
			return 2
		}
	}
	catch (err) {
		console.error('Ошибка в блоке 13', err);
	}
}

// Время в формате 00:00
export function nowtimexxxx() {
	try {
		var h = new Date();
		var c = h.getHours().toString()
		var d = h.getMinutes().toString()
		if (c.length == 1) { c = "0" + c }
		if (d.length == 1) { d = "0" + d }
		return (c + ":" + d);
	}
	catch (err) {
		console.error('Ошибка в блоке 14', err);
	}
}

export function MakeMeSmile(ctx) {
	listDir(ctx, './smile/').then((value) => {
		console.log(value.length)
		let i = Math.floor(Math.random() * value.length);
		ctx.replyWithAudio({ source: './smile/' + value[i] });
	})
}


// Даем функции две даты в формате ХХ:ХХ и если дата старая - то заявку считаем подтвержденной у водителя 
export function changeApprove(a, b) {
	try {
		if (a != 'утч') {
			if (b < setDate(0)) { return 1 }
			if (b > setDate(0)) { return 0 }
			if (b == setDate(0)) {
				if (nowtimexxxx() >= a) { return 1 }
				if (nowtimexxxx() < a) { return 0 }
			}
		}
		else {
			return 0
		}
	}
	catch (err) {
		console.error('Ошибка в блоке 15', err);
	}
}


//Функция заебывания водителя на принятие заявки. 
export async function zaebzayavka(ctx, bot, zaebtime) {
	try {
		get_alldata("SELECT * FROM work WHERE driver_id_tel = " + ctx.update.message.from.id + " AND approved_by_driver = 0", (result) => {
			if (result.length > 0) {
				console.log("Есть не принятая заявка")
				var d = bot.telegram.sendMessage(ctx.update.message.from.id, '❗❗❗У вас есть не принятая заявка❗❗❗');
				d.then((value) => {
					setTimeout(deleter, zaebtime, value.chat.id, value.message_id, bot);
				})
			}
			else {
				console.log("Не подтвержденных заявок нет")
			}
		})
	}
	catch (err) {
		console.error('Ошибка в блоке 16', err);
	}
}

async function deleter(a, b, bot) {
	try {
		bot.telegram.deleteMessage(a, b)
	}
	catch (err) {
		console.error('Ошибка в блоке 17', err);
	}
}

export function showstatus(ctx, date, whom) {
	try {
		// whom - что нужно будет передать . 10 -всю краткую инфу

		get_alldata("SELECT * FROM bort_by_day WHERE date  LIKE '" + date + "%' LIMIT 1", function (result) {
			var unind = []; // статус 0
			var dontwork = []; // статус 1
			var senden = []; // статус 2
			var accepted = []; // статус 3
			var worked = []; // статус 4
			var undriver = []; // статус 5
			var remont = [];  // статус 6


			result = result[0]
			for (var key in result) {
				if (result[key] == 0) { unind = unind + key + ' ,' }
				if (result[key] == 1) { dontwork = dontwork + key + ' ,' }
				if (result[key] == 2) { senden = senden + key + ' ,' }
				if (result[key] == 3) { accepted = accepted + key + ' ,' }
				if (result[key] == 4) { worked = worked + key + ' ,' }
				if (result[key] == 5) { undriver = undriver + key + ' ,' }
				if (result[key] == 6) { remont = remont + key + ' ,' }

			}


			if (whom == 1 && dontwork.length > 1) { ctx.reply("Курящие: " + dontwork) }
			if (whom == 2 && senden.length > 1) { ctx.reply("Не приняли " + senden) }
			if (whom == 2 && senden.length < 1) { ctx.reply("Все приняли") }
			if (whom == 3 && accepted.length > 1) { ctx.reply("Борта с принятой заявкой: " + accepted) }
			if (whom == 4 && worked.length > 1) { ctx.reply("Отработавшие борта: " + worked) }
			if (whom == 5 && undriver.length > 1) { ctx.reply("Борта без водителей: " + undriver) }
			if (whom == 5 && undriver.length < 1) { ctx.reply("Без водителей бортов нет") }
			if (whom == 6 && remont.length > 1) { ctx.reply("Борта на ремонте: " + remont) }
			if (whom == 6 && remont.length < 1) { ctx.reply("Машин на ремонте нет") }

			if (whom == 10) {
				ctx.replyWithHTML(
					'<b>Дата ' + date +
					'\n\nКурят:   </b>' + dontwork +
					'\n<b>Не приняли заявку:   </b>' + senden +
					'\n<b>Приняли заявку:   </b>' + accepted +
					'\n<b>Отработано и подтверждено   </b>' + worked +
					'\n<b>Без водителей:   </b>' + undriver +
					'\n<b>Ремонт:   </b>' + remont
				)
			}
		})

	}
	catch (err) {
		console.error('Ошибка в блоке 18', err);
	}
}

export function bort_to_date(date) {
	try {
		get_alldata("SELECT bort_number, status, change_date FROM borts", function (result) {

			for (var key in result) {
				/// ТУТ МЕНЯЛ
				if (result[key].change_date.toISOString().split('T')[0] == setDate(0)) {
					get_alldata("UPDATE bort_by_day SET `" + result[key].bort_number + "`=" + result[key].status + " WHERE date  LIKE '" + date + "%'", function (update) { })
				}
				else {
					console.log("НЕ Измененый борт: " + result[key].bort_number);
					if (result[key].status == 5 || result[key].status == 0 || result[key].status == 6) {

						get_alldata("UPDATE bort_by_day SET `" + result[key].bort_number + "`=" + result[key].status + " WHERE date  LIKE '" + date + "%'", function (update) { })
					}
				}

			}
		})
	}
	catch (err) {
		console.error('Ошибка в блоке 19', err);
	}
}


// Функция для изменения статуса машины в таблице шаблоне, которая используется для ежедневного построения рабочей таблицы
export function newbortstatus(ctx, borts, whom) {
	try {
		var statusb
		if (whom == 1) { statusb = "в строю" }
		if (whom == 5) { statusb = "без водителя" }
		if (whom == 6) { statusb = "не в строю" }


		borts.forEach(function (result) {
			get_alldata("UPDATE borts SET STATUS=" + whom + ", change_date='" + setDate(0) + "' WHERE bort_number=" + result + "", function (update) {
				ctx.reply("Борт " + result + " переведен в статус: " + statusb);
			})
		})
		actualizator()
	}
	catch (err) {
		console.error('Ошибка в блоке 19', err);
	}

}


// Актуализация данных по статусам принятия
export function actualizator() {
	try {
		var status;
		var sql = "SELECT A.work_date, A.time, A.approved_by_disp, A.approved_by_driver, B.driver_name, B.bort_number, B.expired_date  FROM work A INNER JOIN drivers B ON A.driver_name = B.driver_name WHERE A.work_date = '" + setDate(+1) + "'"

		get_alldata(sql, function (result) {
			for (var key in result) {


				if (result[key].work_date.toISOString().split('T')[0] > setDate(0) || (result[key].work_date.toISOString().split('T')[0] == setDate(0) && result[key].time > nowtimexxxx())) {
					if (result[key].approved_by_driver == 0) { status = 2 }
					if (result[key].approved_by_driver == 1) { status = 3 }
					if (result[key].approved_by_disp == 1) { status = 4 }
					get_alldata("UPDATE bort_by_day SET `" + result[key].bort_number + "` = " + status + " WHERE  `date`  LIKE '%" + setDate(+1) + "%'", function () {
					})

				}
				else {
					console.log("Заявку с временем после 13:00 игнорируем")
				}
			}

		})
	}
	catch (err) {
		console.error('Ошибка в блоке 20', err);
	}
}


// Если нет нового дня то эта функция его создаст
export function createnewday() {
	try {
		get_alldata("SELECT * FROM bort_by_day WHERE date  LIKE '" + setDate(+1) + "%' LIMIT 1", function (result) {
			if (result.length == 0) {
				get_alldata("INSERT INTO bort_by_day (date) VALUES ('" + setDate(+1) + "')", function (result) {
					console.log("Добавлен новый день!");
					actualizator()
				})
			}
		})
	}
	catch (err) {
		console.error('Ошибка в блоке 21', err);
	}
}


// Функция для внесения изменения после удаленной заявки (снизу копия но на изменение )
export function doWhenDelete(diyingwork) {
	console.log(diyingwork)
	try {
		if (diyingwork[0].work_date.toISOString().split('T')[0] > setDate(0) || (diyingwork[0].work_date.toISOString().split('T')[0] == setDate(0) && diyingwork[0].time > nowtimexxxx())) {
			// Проверка принятости и проверка есть ли в телеграмме
			if (diyingwork[0].driver_id_tel !== 0) {
				bot.telegram.sendMessage(diyingwork[0].driver_id_tel, 'Принятую работу по адресу: ' + diyingwork[0].address + ' удалил диспетчер. Вам сообщат о новых изменения');
				get_alldata("SELECT bort_number FROM drivers WHERE driver_name = '" + diyingwork[0].driver_name + "'", function (result) {
					get_alldata("UPDATE bort_by_day SET `" + result[0].bort_number + "` = 1 WHERE  `date`  LIKE '%" + diyingwork[0].work_date.toISOString().split('T')[0] + "%'", function () {
						console.log("Статус изменен на 1")
						actualizator()
					})

				})
			}

		}


	}
	catch (err) {
		console.error('Ошибка в блоке 22', err);
	}
}

// Функция по изменению статуса измененной заявки на 1. Ее можно объеденить с верхней, но мне пока лень это делать
export function workchanged(job, id_driver) {
	try {
		if (job[10] > setDate(0) || (job[10] == setDate(0) && job[2] > nowtimexxxx())) {
			// Проверка принятости и проверка есть ли в телеграмме
			if (id_driver !== 0) {
				bot.telegram.sendMessage(id_driver, 'Принятую работу изменил диспетчер. Посмотрите на новую заявку с изменениями!');
				get_alldata("SELECT bort_number FROM drivers WHERE driver_name = '" + job[0] + "'", function (result) {
					get_alldata("UPDATE bort_by_day SET `" + result[0].bort_number + "` = 1 WHERE  `date`  LIKE '%" + job[10] + "%'", function () {
						console.log("Статус изменен на 1")
						actualizator()
					})

				})
			}
		}
	}
	catch (err) {
		console.error('Ошибка в блоке 23', err);
	}
}

// Функция выводит должников
export function dolg(ctx) {

	//Если это я или Гев, то выдать еще общую статистику по долгам
	if (ctx.update.message.from.id == 263367241 || ctx.update.message.from.id == 285512812) {
		var a = 0
		var b = 0
		var k = 0
		var p = 0
		var g = 0
		var f = 0

		get_alldata("SELECT dolg2,manager from kompany WHERE dolg2>0 AND status=0", (result) => {
			result.forEach(function (value) {
				if (value.manager == 'a') { a = a + value.dolg2 }
				if (value.manager == 'b') { b = b + value.dolg2 }
				if (value.manager == 'k') { k = k + value.dolg2 }
				if (value.manager == 'p') { p = p + value.dolg2 }
				if (value.manager == 'g') { g = g + value.dolg2 }
				if (value.manager == 'f') { f = f + value.dolg2 }


			})
			let alldolg = a + b + k + p + g + f;
			a = "Аршак: <strong>" + Math.round(a / 1000).toLocaleString('ru') + "</strong> k \t" + Math.round(100 * a / alldolg) + "%";
			b = "Босс:  <strong>" + Math.round(b / 1000).toLocaleString('ru') + "</strong> k \t" + Math.round(100 * b / alldolg) + "%";
			k = "Вова:  <strong>" + Math.round(k / 1000).toLocaleString('ru') + "</strong> k \t" + Math.round(100 * k / alldolg) + "%";
			p = "Крис:  <strong>" + Math.round(p / 1000).toLocaleString('ru') + "</strong> k \t" + Math.round(100 * p / alldolg) + "%";
			g = "Гор:   <strong>" + Math.round(g / 1000).toLocaleString('ru') + "</strong> k \t" + Math.round(100 * g / alldolg) + "%";
			f = "Фатих: <strong>" + Math.round(f / 1000).toLocaleString('ru') + "</strong> k \t" + Math.round(100 * f / alldolg) + "%";

			ctx.replyWithHTML(`
 Общая сумма долга на \n${setDate(0)}
 <b>${alldolg.toLocaleString('ru')}р</b>
 ------------------------------
 ${f}
 ${b}
 ${g}
 ${a}
 ${k}
 ${p}
 `);


		})
	}


	// Далее выдать инфу по должнику исходя из файла диспетчеров, в котором буква диспетчера которая соответсвует букве в БД
	let letter = 0;
	let name
	disp.forEach(function (entry) {
		if (ctx.update.message.from.id == entry[1]) {
			letter = entry[2]
			name = entry[0]
		}
	})
	if (letter !== 0) {
		var massive = 'Монте ' + setDate(0) + "\nДолги " + name + "\n"
		var razn
		var i
		var slovo
		get_alldata("Select * from kompany WHERE STATUS=0 AND manager='" + letter + "' AND dolg2>0 ORDER BY name", (result) => {
			result.forEach(function (item) {
				razn = item.dolg1 - item.dolg2
				if (razn < 0) { slovo = '⬆️' }
				if (razn > 0) { slovo = '⬇️' }
				item.name = (item.name).replace('ООО', '');
				item.name = (item.name).replace('АО', '');
				item.name = (item.name).split('(')[0]
				item.name = (item.name).replace('  ', '');
				item.name = (item.name).replace('Представительство«АНТ', '');
				if (item.dolg1 == 0) { razn = '' }
				else { razn = "" + slovo + Math.abs(razn).toLocaleString('ru') }
				massive = massive + (("\n" + item.name + " <b>" + item.dolg2.toLocaleString('ru') + "</b> р  " + razn))
				massive = massive + "\n-----"
				i++
			})
			if (massive.length > 1) { ctx.replyWithHTML(massive); }
		})
	}



}

// Я не знаю как закрыть этот пул чтобы освободить память((
var pool = mysql.createPool(poolsql).promise()
export function DolgLoader() {

	

	let dolgmas = []
	var i = 0
	let fileContent = fs.readFileSync('./123.txt', 'utf8');
	let result = String(fileContent);
	result = result.replace(/\,[0-9][0-9]/gi, "");
	result = result.replace(/([0-9])(\ )([0-9])/gi, "$1$3");
	result = result.replace(/\t/gi, "z");
	result = result.replace(/\n/gi, "end");
	result = result.replace(/\r/gi, "");
	var res = result.split("end");
	var reg = (res.splice(9, res.length - 10));
	reg.forEach(function (result) {
		var rev = result.split("z");
		if (rev[5] == '') { rev[5] = 0 }
		dolgmas[i] = rev[0] + "долг:" + rev[5]
		i++
	})

	sukablyad(dolgmas,pool)

async function sukablyad(dolgmas,pool){
	dolgmas.forEach(function (inffromfile) {
		var firm = inffromfile.split("долг:")[0];
		var dolg = inffromfile.split("долг:")[1];
		pool.execute(`SELECT name,status,d1,d2,dolg1,dolg2 from kompany WHERE name='${firm}' && firm='m' `).then((zbs) => {
			var result=zbs[0]
			//console.log(result);
			if (result.length==1) {
				if (dolg == result[0].dolg2) {
					console.log(`${firm} Долг не изменился `)
				}

				if (dolg != result[0].dolg2) {
					var dateold = (result[0].d2).toISOString().split('T')[0]
					pool.execute(`UPDATE kompany SET dolg1=${result[0].dolg2}, dolg2=${dolg}, d1='${dateold}', d2='${setDate(0)}', status=0 WHERE name='${firm}' && firm='m'`).then(() => { console.log(`${firm} Обновлен долг фирмы `); })
				}
			}
			//  В файле есть дублеж фирм АСТ и МОНОЛИТ СТРОЙ - поэтому такая реализация
			if(result.length==0)  {
				pool.execute(`INSERT INTO kompany (NAME,d2,dolg2,firm) VALUES ('${firm}','${setDate(0)}',${dolg},'m')`).then(() => { console.log(`${firm} добавлена новая фирма `); })
			}
		})
	})
}
		// 	  pool.query(`SELECT name,status,d1,d2,dolg1,dolg2 from kompany WHERE name='${firm}' && firm='m' `, function (err, result) {

		// if (result.length == 1) {
		// 	var dateold = (result[0].d2).toISOString().split('T')[0]
		// 	if (result.length == 1) {
		// 		if (dolg == result[0].dolg2) {
		// 			console.log(`${firm} Долг не изменился `)
		// 		}

		// 		if (dolg != result[0].dolg2) {
		// 			 pool.query(`UPDATE kompany SET dolg1=${result[0].dolg2}, dolg2=${dolg}, d1='${dateold}', d2='${setDate(0)}', status=0 WHERE name='${firm}' && firm='m'`, function (err, result) {
		// 				console.log(`${firm} Обновлен долг фирмы `);
		// 			})
		// 		}
		// 	}

		// }
		// if (result.length == 0) {
		// 	pool.query(`INSERT INTO kompany (NAME,d2,dolg2,firm) VALUES ('${firm}','${setDate(0)}',${dolg},'m')`, function (err, result) {
		// 		console.log(`${firm} Добавлена новая фирма`);
		// 	})
		// }
		// })



}
