import Scene from 'telegraf/scenes/base.js'
const docs = new Scene('docsscene')
import fs from 'fs'
import { listDir } from '../../functions.js'
import { bot } from '../../app.js'
var path
var enddocs = ''

///Это работает, но надо дописывать. Очень сырая система. 
// Должна быть правильная организация файлов водитель+борт/стс + водитель + ростех + удо а внутри каждой папки только файлы. 
// Также надо сделать доп проверки и организовать функции


// При входе проверяем папку с файлами на имена и выдаем их по 4 в ряд
docs.enter((ctx) => {
	path = './docs/'

	listDir(ctx, './docs/').then((value) => {
		if (value !== 2) {

			let size = 4; //размер подмассива
			let subarray = []; //массив в который будет выведен результат.
			for (let i = 0; i < Math.ceil(value.length / size); i++) {
				subarray[i] = value.slice((i * size), (i * size) + size);
			}

			bot.telegram.sendMessage(ctx.chat.id, "Bot Info", {
				reply_markup: {
					keyboard: subarray,
					resize_keyboard: true
				}
			})

		}
		else
		{
			ctx.reply("Не надо тут ничего писать!")
		}
	});
	})






docs.hears('Выход из режима', (ctx) => {
	ctx.scene.enter('docs');
})

docs.on('message', (ctx) => {

	if (ctx.message.text == 'Назад') {
		path = './docs/'
	}
	else {
		path = path + ctx.message.text + '/'
		console.log('Текущий путь:' + path);
	}


	listDir(ctx, path).then((value) => {


		let size = 4; //размер подмассива
		let subarray = []; //массив в который будет выведен результат.
		for (let i = 0; i < Math.ceil(value.length / size); i++) {
			subarray[i] = value.slice((i * size), (i * size) + size);
		}
		subarray.push(['Назад'])

		// Проверяем, в список который мы получили есть ли файлы pdf jpeg jpg
		for (var i = 0; i < subarray.length; i++) {
			for (var y = 0; y < subarray[i].length; y++) {
				if (/\.jpg$/.test(subarray[i][y]) || /\.jpeg$/.test(subarray[i][y]) || /\.pdf$/.test(subarray[i][y])) {
					enddocs = enddocs + (subarray[i][y]) + ','
				}
				console.log(subarray[i][y])
			}
		}


		console.log('Список конечных документов:' + enddocs);

		// Если в списке есть документы, то выдаем их
		if (!enddocs == '') {


			let driverfiles = enddocs.split(',')
			driverfiles.forEach(function (item, i, driverfiles) {
				driverfiles[i] = item.trim()
			});

			driverfiles.pop();

			console.log(driverfiles);
			ctx.reply('Гружу документы. ПОДОЖДИТЕ')

			driverfiles.forEach(file => {
				ctx.replyWithDocument({ source: path + file })
			});

			console.log("Путь тут такой" + path);

			if (!path == './docs/') {
				path = path.slice(0, path.length - 1 - ctx.message.text.length);
				console.log("Новый путь такой" + path);
			}
			path = ''
			driverfiles = ''
			enddocs = ''
			if(ctx.update.message.from.id==263367241 || ctx.update.message.from.id==285512812 || ctx.update.message.from.id==5275200958) {ctx.scene.enter('gev')}
			else {ctx.scene.enter('addwork')}
		}

		// Если нет,то выдаем список внутренних папок
		else {
			console.log('Сработал элс');
			bot.telegram.sendMessage(ctx.chat.id, "Bot Info", {
				reply_markup: {
					keyboard: subarray,
					resize_keyboard: true
				}
			})
		}



	})

})


export default docs