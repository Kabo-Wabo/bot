import Scene from 'telegraf/scenes/base.js'
// import Markup from 'telegraf/markup.js'
import { ShowworkKeyboard, backKeyboard } from '../../keyboards.js'
const ywork = new Scene('showworkScene')
import { shorttotelegram, confirmerwork, actyalwork, setDate, doWhenDelete } from '../../functions.js'
import { get_alldata } from '../../db.js'

var date
var sql


ywork.enter((ctx) => {
	// Быстрое отображение всех добавленных менеджером сегодняшних работ
	try {


		if (ctx.match == "Мои") {
			var sqlmyworkstoday = "SELECT * FROM work WHERE manager_id = '" + ctx.update.message.from.id + "' AND add_date LIKE '%" + setDate(0) + "%'"
			get_alldata(sqlmyworkstoday, (result) => {
				actyalwork(result, ctx);
			})
			ctx.replyWithHTML('Только полное отображение заявок', backKeyboard())
		}
		else {
			// Не буду же я морочиться с годами пока? :)	
			date = 2023 + "-" + ctx.message.text;
			sql = "SELECT * from work where work_date ='" + date + "'  ORDER BY driver_name "
			ctx.replyWithHTML('Вы в режиме отображения работ за ' + date + '. Выберите пункт меню', ShowworkKeyboard());
			console.log('Режим отображения активен')
		}
	}
	catch (err) {
		console.error('Ошибка в блоке q1', err);
	}
})


ywork.hears('Назад', (ctx) => {
	ctx.scene.enter('addwork');
})

ywork.hears('Все', (ctx) => {
	get_alldata(sql, (result) => {
		actyalwork(result, ctx);
	})
})

ywork.hears('Кратко', (ctx) => {
	get_alldata(sql, (result) => {
		shorttotelegram(result, ctx);
	})

})






// Есть в ответе del - вычленяем ID и удаляем его из БД
ywork.action(/del (\d+)/gi, (ctx) => {
	try {
		var sql = "DELETE FROM work where id = '" + ctx.match[1] + "'"
		get_alldata("SELECT * FROM work where id = '" + ctx.match[1] + "'", function (dontdie) { // Перед удалением нужно сообщить это водителю, и изменить статус
			get_alldata(sql, function () {
				ctx.reply("Удалили работу с ID" + ctx.match[1]);
				ctx.deleteMessage()
				doWhenDelete(dontdie);
			});
		})
	}
	catch (err) {
		console.error('Ошибка в блоке q2', err);
	}
});


// Если слышим команды изменения то переходим сюда
ywork.action(/changework (\d+)/gi, (ctx) => {
	try {
		var sql = "SELECT * FROM work where id = '" + ctx.match[1] + "'";

		get_alldata(sql, function (result) {
			if (!result[0].payment_value) { result[0].payment_value = '' }
			var d = "ID" + result[0].id + "," + result[0].driver_name + "," + result[0].height + "," + result[0].time + "," + result[0].address + "," + result[0].phone + "," + result[0].phone_name + "," + result[0].manager_name + "," + result[0].pererabotka + "," + result[0].payment_type + result[0].payment_value + "," + result[0].firm + "," + result[0].work_date.toISOString().split('T')[0];
			ctx.replyWithHTML("<b>&#10071;Не удаляйте ID с цифрами вначале&#10071;</b>\n Скопируйте сообщение снизу в форму и отредактируйте то, что нужно");
			ctx.reply(d);
			ctx.deleteMessage()
		});
	}
	catch (err) {
		console.error('Ошибка в блоке q3', err);
	}
})


// Если вначале списка ввода есть ID, то проверяем есть ли у нас 11 (!) параметров и далее передаем параметры на редактирование
ywork.hears(/ID/, (ctx) => {
	try {
		let job = ctx.match.input.split(',')
		job.forEach(function (item, i, job) {
			job[i] = item.trim()
		});
		confirmerwork(job, ctx);
	}
	catch (err) {
		console.error('Ошибка в блоке q4', err);
	}
})

ywork.on('text', (ctx) => {
	if (!ctx.response) { ctx.replyWithHTML('Только полное отображение заявок или назад', backKeyboard()) }
	else { ctx.replyWithHTML('Вы в режиме отображения работ за ' + date + '. ', ShowworkKeyboard()); }

})

export default ywork