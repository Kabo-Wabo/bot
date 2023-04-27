import Scene from 'telegraf/scenes/base.js'
import { driverkeyboard, workerconfirmed } from '../../keyboards.js'
export const driver = new Scene('driver')
import { get_alldata } from '../../db.js'
import { driverwork, setDate, zaebzayavka, actualizator,nowtimexxxx } from '../../functions.js'
import { bot } from '../../app.js'
var zaebtime = 600000 // 10 min
/*
Нужно сделать подтверждение заявки
Нужно разделять ночные и дневные и отображать в принятых только дневные
Нужно статус проверить для дневной
Нужно по принятию обновлять базу
Нужно выводить водителю его работы
Нужно делать таблицу как рабочую по часам , так и для водителя
Нужно сделать чтобы если водитель не согласен, приходило уведомление
Нужно сделать чтобы тот кто отправлял видел что он отправил (в базе новое значение)

*/



driver.enter((ctx) => {
	ctx.reply('Вы вошли в функционал водителя', driverkeyboard());
	setInterval(zaebzayavka, zaebtime, ctx, bot, zaebtime) // 10 min
})

// Все работы за сегодня и завтра
driver.hears('Актуальные работы', (ctx) => {
	var sqldriverwork = "SELECT height,id, time, address,approved_by_driver, phone, phone_name, manager_name, pererabotka, work_date, payment_type, payment_value FROM work WHERE driver_id_tel = '" + ctx.update.message.from.id + "' AND (work_date = '" + setDate(0) + "' OR work_date = '" + setDate(1) + "')"
	console.log(sqldriverwork)
	get_alldata(sqldriverwork, (result) => {
		console.log(result);
		driverwork(result, ctx);
	})
})

driver.hears('Завершенные работы', (ctx) => {
	var sqldriverwork = "SELECT * from work where driver_id_tel = '" + ctx.update.message.from.id + "' AND approved_by_disp='1' ORDER BY `id` DESC LIMIT 40"
	get_alldata(sqldriverwork, (result) => {
		result.forEach(function(key){
			ctx.replyWithHTML(
				key.work_date.toISOString().split('T')[0]+" "+key.height+" "+key.address+" Диспетчер:"+key.manager_name+" "+key.payment_type
				)
		})
	})
})

driver.hears('Инструкция', (ctx) => {
ctx.replyWithDocument({ source:'./instruction.pdf' })
})


// Работает, но нет обработчика ошибки и тупо вырезаю кусок и добавляю клавиаутуру - тут будут проблемы
driver.action(/^approve/, (ctx) => {
	var id = ctx.update.callback_query.data.replace(/approve/, '');
	var sql = "UPDATE work  SET approved_by_driver='1' WHERE id=" + id;
	get_alldata(sql, (result) => {
		ctx.replyWithHTML("<b>Работа принята </b>\n" + ctx.update.callback_query.message.text.substring(25), workerconfirmed(id));
		ctx.deleteMessage()
		actualizator();
	})
})

driver.action(/^late/, (ctx) => {
	var id = ctx.update.callback_query.data.replace(/late/, '');
	var sql = "SELECT firm,driver_name,manager_id from work WHERE id=" + id;
	get_alldata(sql,function(result){
		bot.telegram.sendMessage(result[0].manager_id, 'Водитель ' + result[0].driver_name + ' сообщил о проблемах по заявке '+result[0].firm);
		ctx.reply('Мы сообщили диспетчеру о проблеме!!!');
	})
})

driver.action(/^cancel/, (ctx) => {
	var id = ctx.update.callback_query.data.replace(/cancel/, '');
	var sql = "SELECT firm,driver_name,manager_id from work WHERE id=" + id;
	get_alldata(sql,function(result){
		bot.telegram.sendMessage(result[0].manager_id, 'Водитель ' + result[0].driver_name + ' сообщил об отмене заявки '+result[0].firm);
		ctx.reply('Мы сообщили всем диспетчерам об отмене!!!');
	})
})

driver.action(/^end/, (ctx) => {
	var id = ctx.update.callback_query.data.replace(/end/, '');
	var sql = "SELECT firm,driver_name,time,manager_id from work WHERE id=" + id;
	get_alldata(sql,function(result){
		bot.telegram.sendMessage(result[0].manager_id, 'Водитель ' + result[0].driver_name + ' закончил работу у '+result[0].firm);
		ctx.reply('Вы - молодец! Мы сообщили всем о том, что вы закончили');
		ctx.reply("Введите пожалуйста параметры работы:")
	})
})

driver.on('text', (ctx) => {
	ctx.reply('Мы рады тебя тут видеть', driverkeyboard());
	console.log(ctx.update.message.location);// Локация
})






export default driver