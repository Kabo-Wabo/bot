import Scene from 'telegraf/scenes/base.js'
import Stage from 'telegraf/stage.js'
import addwork from '../../controllers/add_db.js'
import { drivers, disp } from '../../controllers/drivers.js'
import { updatework } from '../../controllers/update.js'
import { DispMainMenu,yesNoKeyboard } from '../../keyboards.js'
import showworkScene from './showworkScene.js'
var $id

export const addworkScene = new Scene('addwork')
export const stage = new Stage([addworkScene, showworkScene])


addworkScene.enter((ctx) => {
	ctx.replyWithHTML(
		`Вы вошли в режим добавления работ\n` +
		`<i>Добавьте работы по шаблону</i>\n`+
		`1 Водитель,\n 2 Метраж,\n 3 Время,\n 4 Адрес,\n 5 Телефон,\n 6 Контакт, \n 7 Диспетчер,\n 8 Переработка,\n 9 Форма оплаты\n 10 Фирма\n`
	,DispMainMenu())
	
	console.log('Режим добавления активен')
}
)

addworkScene.hears('Спец запрос', (ctx) => {
	ctx.reply('Работаю над функией');


})

addworkScene.hears('Удалить', (ctx) => {
	ctx.reply('Себя удали');
})

addworkScene.hears('Работы на завтра и на сегодня', (ctx) => {
	ctx.scene.enter('showwork')


})



addworkScene.on('message', (ctx) => {

	ctx.session.taskText = ctx.message.text
	let job = ctx.session.taskText.split(',')
	job.forEach(function (item, i, job) {
		job[i] = item.trim()
	});
	confirmerwork(job,ctx);



})

export function confirmerwork(job,ctx) {
	console.log(job);

	// Проверяем есть ли первый ID который указывает, что нужно не добавить а обновить
		var myArray = /ID/.exec(job[0]);
		if (job.length == 11 && myArray) {
		$id = job[0].replace(/[^0-9]/g,"")
		console.log($id)
		console.log(job)
		job.splice(0,1)
		console.log(job);
		
		}
		
		
		if (job.length == 10) {
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
									
									/// Вот основа проверки , если ID нет то добавляем новую работу

									if (!$id) { addafterconfirm(job,ctx)}
									else {updatework(job,$id,ctx);$id = ''										}

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
	else {
	ctx.replyWithHTML(
		`Что-то не введено. Должно быть 10 значений через запятую, которые пройдут валидацию\n` +
		`<i>Добавьте работы по шаблону</i>\n`+
		`1 Водитель (только актуальные водители),\n 2 Метраж( две цифры + буква (т,к,в,б),\n 3 Время (формат хх:хх),\n 4 Адрес (любое значение - но не ставьте запятые!),\n 5 Телефон (начинается с 8 и далее +10 цифр),\n 6 Контакт (любое значение), \n 7 Диспетчер (только наши),\n 8 Переработка (есть, нет, утч) ,\n 9 Форма оплаты (бн, налсумма,залогсумма)\n 10 Фирма (любое значение)\n`
	,DispMainMenu())
		}
}

function addafterconfirm(job,ctx) {

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
										`\n<i>&#128178;  Форма оплаты</i>:     `+job[8]+
										`\n<i>&#128178;  Фирма</i>:     `+job[9]+`\n ---------------`,yesNoKeyboard()
								)
								// Спрашиваем у нашего пользователя, все ли ок
								addworkScene.action(['yes', 'no'], ctx => {
									// Тут ошибка, хз почему приходится переопределять данные ctx.session.taskText

									if (ctx.callbackQuery.data === 'yes') {
											
										 job = ctx.session.taskText.split(',')
										job.forEach(function (item, i, job) {
											job[i] = item.trim()
										});

								let params = [job[0],job[6]];
								let fibish = addwork(job, params);
								ctx.reply('В базу данных добавлена новая работа',DispMainMenu)
									} else {
										ctx.deleteMessage()
									}
								})
}