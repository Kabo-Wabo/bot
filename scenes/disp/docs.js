import Scene from 'telegraf/scenes/base.js'
const docs = new Scene('docsscene')
import { listDir } from '../../functions.js'
var path
var enddocs = ''
var borts = []

docs.enter((ctx) => {
	path = './docs/'
	listDir(ctx, './docs/').then((value) => {
		// Оставляем только отображение бортов по номерам с двумя цифрами спереди
		value.forEach(function (elem) {
			if (elem.match(/^[0-9][0-9]/g)) { borts.push(elem) }
		})
		ctx.reply("...", { reply_markup: { keyboard: array_in_array(borts), resize_keyboard: true } });
	});
})


docs.on('message', (ctx) => {
	if (ctx.message.text == 'Назад' || ctx.message.text == 'Выход из режима') {
		where_to_go(ctx);
	}
	else {
		path = path + ctx.message.text + '/'
	}


	listDir(ctx, path).then((value) => {
		if (value == 2) { // Если пусто то прийдет магическая двойка
			path = './docs/'
			ctx.reply("Не надо сюда ничего писать. Пользуйся кнопками и только", { reply_markup: { keyboard: array_in_array(borts), resize_keyboard: true } });

		}
		else {
			// Если не соблюдается структура папка - в ней папки - в которой файлы , и во второй папке есть файлы
			// то этот код выдаст файл который в папке, указывая , что там есть проблема

			let subarray = array_in_array(value);
			// Проверяем, в список который мы получили есть ли файлы pdf jpeg jpg
			for (var i = 0; i < subarray.length; i++) {
				for (var y = 0; y < subarray[i].length; y++) {
					if (/\.jpg$/.test(subarray[i][y]) || /\.jpeg$/.test(subarray[i][y]) || /\.pdf$/.test(subarray[i][y])) {
						enddocs = enddocs + (subarray[i][y]) + ','
					}
				}
			}

			// Если в списке есть документы, то выдаем их
			if (enddocs.length > 0) {

				let driverfiles = enddocs.split(',')
				driverfiles.forEach(function (item, i, driverfiles) {
					driverfiles[i] = item.trim()
				});

				driverfiles.pop();
				ctx.reply('Гружу документы. ПОДОЖДИТЕ')

				driverfiles.forEach(file => {
					ctx.replyWithDocument({ source: path + file })
				});

				if (!path == './docs/') {
					path = path.slice(0, path.length - 1 - ctx.message.text.length);
				}
				path = ''
				driverfiles = ''
				enddocs = ''
				where_to_go(ctx);
			}
			else {
				ctx.reply("...", { reply_markup: { keyboard: (subarray), resize_keyboard: true } });
			}

		}

	})

})

// Тк данный модуль используется у нескольких то тут я делаю исключения для босов и админов
function where_to_go(ctx) {
	if (ctx.update.message.from.id == 263367241 || ctx.update.message.from.id == 5275200958) { ctx.scene.enter('gev') }
	else if (ctx.update.message.from.id == 285512812) { ctx.scene.enter('supergev') }
	else { ctx.scene.enter('addwork') }
}

function array_in_array(value) {
	let size = 4;
	let subarray = []
	for (let i = 0; i < Math.ceil(value.length / size); i++) {
		subarray[i] = value.slice((i * size), (i * size) + size);
	}
	subarray.push(["Выход из режима"])
	return subarray;
}

export default docs