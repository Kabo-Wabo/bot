import Scene from 'telegraf/scenes/base.js'
import Stage from 'telegraf/stage.js'
import addwork from '../../controllers/add_db.js'
import { drivers, disp } from '../../controllers/drivers.js'
import { DispMainMenu,yesNoKeyboard } from '../../keyboards.js'
export const addworkScene = new Scene('addwork')
export const stage = new Stage([addworkScene])
// import bot from '../../app.js'
// import {showworkScene, staged2 } from './showworkScene.js'

export const showworkScene = new Scene('showwork')
export const staged2 = new Stage([showworkScene])




showworkScene.enter((ctx) => {
	ctx.reply("Вы в режиме отобажения работ")
	console.log('Режим отображения активен')
}
)

showworkScene.on('message', (ctx) => {
	ctx.reply("Ебать");
})



addworkScene.enter((ctx) => {
	ctx.replyWithHTML(
		`Вы вошли в режим добавления работ\n` +
		`<i>Добавьте работы по шаблону</i>\n`+
		`1 Водитель,\n 2 Метраж,\n 3 Время,\n 4 Адрес,\n 5 Телефон,\n 6 Контакт, \n 7 Диспетчер,\n 8 Переработка,\n 9 Форма оплаты\n`
	,DispMainMenu())
	
	console.log('Режим добавления активен')
}
)

addworkScene.hears('Работы на завтра', (ctx) => {
	ctx.reply('Хуй тебе а не работы');
	ctx.scene.enter('showworkScene');
	//ctx.scene.leave()
})

addworkScene.on('message', (ctx) => {

	console.log(ctx.message.text)
	ctx.session.taskText = ctx.message.text
	let job = ctx.session.taskText.split(',')
	job.forEach(function (item, i, job) {
		job[i] = item.trim()
	});


	if (job.length == 9) {
		let jobdriver
		let driverid
		drivers.forEach(function (entry) {
			if (job[0] == entry[0]) {
				jobdriver = entry[0];
				driverid = entry[1]
			}
		})
		if (jobdriver) {
			console.log("Водитель определен")
			///// Водитель подходит, он совпадает с данными в файле
			var metrRe = /\d\d[дмтвкг]$/; // Рег выражения проверки метражности
			var height_ver = metrRe.test(job[1]);
			if (!height_ver) {ctx.reply('Метраж введен не верно')}
			else {
				/// Метраж введен корректно - 2 цифры и буква
				console.log("Метраж введен верно")
				var timeRe = /^\d+\:\d+$|\у\т\ч/; /// Рег выражение времени 00:00 или утч
				var time_ver = timeRe.test(job[2]);
				if (!time_ver) {ctx.reply('Время введено не верно. Введите в формате хх:хх или утч')}
				else {/// Время введено корректно
					console.log("Время введено верно")
					var telRe = /\8[0-9]{10}/; /// Рег выражение для телефона
					var tel_ver = telRe.test(job[4]);
					if (tel_ver && (job[4].length == 11)) {
						/// Телефон состоит из 11 цифр и начинается на 8
						console.log("Телефон введен верно")
						// Определяем, введен ли корректно ответсвенный диспетчер
						let jobdisp
						let dispid
						disp.forEach(function (entry) {
							if (job[6] == entry[0]) {
								jobdisp = entry[0];
								dispid = entry[1]
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
									 yesNoKeyboard()
									ctx.replyWithHTML(
										`&#128165;<b>Данные прошли валидацию</b>&#128165;\n\n<b>Все введенное верно?</b>\n---------------\n`+
										`<i>&#128053;  Водитель</i>:     `+job[0]+
										`\n<i>&#128129;  Метраж</i>:     `+job[1]+
										`\n<i>&#128347;  Время</i>:     `+job[2]+
										`\n<i>&#128205;  Адрес</i>:     `+job[3]+
										`\n<i>&#9742;  Телефон</i>:     `+job[4]+
										`\n<i>&#128119;  Контакт (Имя)</i>:     `+job[5]+
										`\n<i>&#128511;  Диспетчер</i>:     `+job[6]+
										`\n<i>&#9654;  Переработка</i>:     `+job[7]+
										`\n<i>&#128178;  Форма оплаты</i>:     `+job[8]+`\n ---------------`,yesNoKeyboard()
								)
								// Спрашиваем у нашего пользователя, все ли ок
								addworkScene.action(['yes', 'no'], ctx => {
									if (ctx.callbackQuery.data === 'yes') {
								let params = [driverid,jobdriver,dispid,jobdisp];
								let fibish = addwork(job, params);
								ctx.reply('В базу данных добавлена новая работа')
									} else {
										ctx.deleteMessage()
									}
								})
								
								}
								else {ctx.reply('Введите форму оплаты (нал*сумма*, бн, залог*сумма*)')}
							}
							else {ctx.reply('Введите переработку (есть, нет, утч)')}
						}
						else {ctx.reply('Диспетчер введен не верно')}
					}
					else {ctx.reply('Телефон введен не формате 8ххххххххх')}
				}
			}
		}
		else {ctx.reply('Имя водителя указано не верно')}
	}
	else {ctx.reply('Что-то не введено. Мало данных')}
})

