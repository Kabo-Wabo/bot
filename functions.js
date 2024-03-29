import Markup from 'telegraf/markup.js'
import { DispMainMenu, yesNoKeyboard } from './keyboards.js'
import { drivers, disp } from './controllers/drivers.js'
import { updatework } from './controllers/update.js'
import fs  from 'fs' 
// Функция для вывода всех данных в телеграм
export function worktotelegram(allwork, ctx) {
	for (let i = 0; i < allwork.length; i++) {
		ctx.replyWithHTML(
			`<b>ID:` + allwork[i].id +
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
			`переработка ` + allwork[i].pererabotka + ` `
			, Markup.inlineKeyboard([
				Markup.callbackButton('Удалить ' + allwork[i].id, 'del ' + allwork[i].id),
				Markup.callbackButton('Изменить ' + allwork[i].id, 'changework ' + allwork[i].id),
			], { columns: 2 }).extra());
	}

}


// Функция для вывода кратких данных
export function shorttotelegram(allwork, ctx) {
	let b = new Array()
	if (allwork == "") { ctx.reply("На этот день работ в базе нет"); }
	else {
		for (let i = 0; i < allwork.length; i++) {
			b[i] =
				allwork[i].driver_name + " " +
				allwork[i].work_date.toISOString().split('T')[0] + " " +
				allwork[i].height + " " +
				allwork[i].time + " " +
				allwork[i].payment_type + " " +
				allwork[i].firm
		}
		b = b.join('\n');
		ctx.replyWithHTML(b);
	}
}


export function confirmerwork(job, ctx) {

	var $id
	// Проверяем есть ли первый ID который указывает, что нужно не добавить а обновить
	var myArray = /^ID/.exec(job[0]);
	if (job.length == 11 && myArray) {
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
				var timeRe = /^\d+\:\d+$|\у\т\ч/; /// Рег выражение времени 00:00 или утч
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
									if(/^202[34]\-[0-9][0-9]\-[0-9][0-9]$/.test(job[10])){
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


export function replyconfirmed(job, ctx) {
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
		`\n<i>&#128178;  Фирма</i>:     ` + job[9] +
		`\n<i>&#128178;  Дата</i>:     ` + job[10] +		`\n ---------------`, yesNoKeyboard()
	)
ctx.session.work = ctx.message.text + ','+job[10]

}


export function setDate(x) {
	var date = new Date();

	date.setDate(date.getDate() + x);
	date = date.toISOString().split('T')[0]

	return date;
}


// Функция разбития на массив сообщения
export function mestojob(ctx) {
	let job = ctx.message.text.split(',')
	job.forEach(function (item, i, job) {
		job[i] = item.trim()
	});
	return job;
}

// Я очень долго мучался чтобы сделать одну функцию на две, но первая работает когда это первое сообщение
// а второе когда идет ответ ДА на проверенные данные. Долго мучался, забил
 
export function mestojob2(ctx) {
	console.log(ctx);
	let job = ctx.update.callback_query.message.text.split(',')
	job.forEach(function (item, i, job) {
		job[i] = item.trim()
	});
	return job;
}



//Если работ нету то пишем, если есть то передаем на отобажение
export function actyalwork(allwork, ctx) {
	// Актуальные работы
	if (allwork == "") { ctx.reply("На этот день работ в базе нет"); }
	else { worktotelegram(allwork, ctx) }
}

export function driverwork(allwork, ctx) {
	if (allwork == "") { ctx.reply("Для Вас пока актуальных работ нету"); }
	else { 



	allwork.forEach(function (job) {
	if (job.payment_value == 0) {job.payment_value=''}
	job.work_date = job.work_date.toISOString().split('T')[0]
	if (job.work_date==setDate(0)) {job.work_date='Сегодня'}
	if (job.work_date==setDate(1)) {job.work_date='Завтра'}
	
	
	var vivod = 
	"<b>"+job.work_date+" Время:  "+job.time+" </b>"+
	"\n----------------------------------------------\n"+
	"<i>&#128129;  Метраж</i>:      "+ job.height+
	"\n<i>&#128129;  Адрес</i>:      "+ job.address+
	"\n<i>&#128129;  Оплата</i>:      "+ job.payment_type + ' ' + job.payment_value+
	"\n<i>&#128129;  Переработка</i>:      "+ job.pererabotka +
	"\n<i>&#128129;  Ответсвенный</i>:      "+  job.manager_name+
	"\n<i>&#128129;  Телефон</i>:      " + job.phone + ` ` + job.phone_name
	
	
	if(job.approved_by_driver==0){
	worknotconf(job,ctx,vivod);
	}
	if (job.approved_by_driver==1) {
	workconf(job,ctx,vivod);
	}

})}
	ctx.scene.sex = 2;
}

function worknotconf(job,ctx,vivod){
		ctx.replyWithHTML(
		`<b>&#10071;&#10071;&#10071;РАБОТА НЕ ПРИНЯТА&#10071;&#10071;&#10071;</b>\n\n`+
		vivod,
		Markup.inlineKeyboard([
				Markup.callbackButton('Принято', 'approve'+job.id)
			], { columns: 1 }).extra());
}

function workconf(job,ctx,vivod){
		ctx.replyWithHTML(
		`<b>Работа принята</b>\n`+
		vivod,
		Markup.inlineKeyboard([
				Markup.callbackButton('Закончил', 'end'+job.id),
				Markup.callbackButton('Опаздываю', 'late'+job.id),
				Markup.callbackButton('У меня проблемы', 'troubeles'+job.id)
			], { columns: 3 }).extra());
}


export function sliceryear(str) {
	str = str.slice(5);
	return str
}


export async function listDir(ctx,path) {
  try {
    return await fs.promises.readdir(path);
  } catch (err) {
	ctx.reply("Не правильный запрос");
    console.error('Error occurred while reading directory!', err);
  }
}


