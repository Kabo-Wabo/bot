import Scene from 'telegraf/scenes/base.js'
import { driverkeyboard,workerconfirmed} from '../../keyboards.js'
export const driver = new Scene('driver')
import { get_alldata } from '../../db.js'
import { driverwork,setDate } from '../../functions.js'

driver.enter((ctx) => {
	ctx.reply('Вы вошли в функционал водителя',driverkeyboard());
})

driver.hears('Актуальные работы', (ctx) => {
var sqldriverwork = "SELECT height,id, time, address,approved_by_driver, phone, phone_name, manager_name, pererabotka, work_date, payment_type, payment_value FROM work WHERE driver_id_tel = '" + ctx.update.message.from.id + "' AND (work_date = '" + setDate(0) + "') OR (work_date = '" + setDate(1) + "')"
		get_alldata(sqldriverwork, (result) => {
			driverwork(result, ctx);
		})
})

driver.action(/^approve/,(ctx) => {
var str = ctx.update.callback_query.data.replace(/approve/, '');
var sql = "UPDATE work  SET approved_by_driver='1' WHERE id="+str;
		get_alldata(sql, (result) => {
			ctx.replyWithHTML("<b>Работа принята</b>\n"+ctx.update.callback_query.message.text.substring(25),workerconfirmed());
			ctx.deleteMessage()
		})
})

driver.action(/^late/, (ctx) => {
ctx.reply('Ну и мудак!');

console.log(ctx.update.callback_query.data);
console.log(ctx.update.callback_query.message);
})


driver.on('message', (ctx) => {
ctx.reply('Мы рады тебя тут видеть',driverkeyboard());

})





		
		
export default driver