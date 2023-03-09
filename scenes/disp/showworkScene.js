import Scene from 'telegraf/scenes/base.js'
import {ShowworkKeyboard,actionWithwork } from '../../keyboards.js'
const showworkScene = new Scene('showwork')
import {confirmerwork} from './addworkScene.js'
import {get_alldata} from '../../db.js'
import {gettomorrowDate,gettodayDate} from '../../config.js'
import Markup from 'telegraf/markup.js'

showworkScene.enter((ctx) => {
ctx.replyWithHTML('Вы в режиме отображения. Выберите пункт меню', ShowworkKeyboard());
console.log('Режим отображения активен')

})




showworkScene.hears('Кратко', (ctx) => {
let sql = "SELECT * from work where work_date ='" + gettomorrowDate() + "' OR work_date= '"+gettodayDate()+"' ORDER BY driver_name "
console.log(sql);
let b =  new Array()
get_alldata(sql, function(allwork) {
if (allwork=="") { ctx.reply("А на завтра работ нету :("); }	
else {
for(let i = 0; i < allwork.length; i++){
b[i] = 
//"<b>"+allwork[i].id+"</b> "+
allwork[i].driver_name+" "+
allwork[i].work_date.toISOString().split('T')[0]+" "+
allwork[i].height+" "+
allwork[i].time+" "+
allwork[i].payment_type+" "+
allwork[i].firm
}

b = b.join('\n'); 
ctx.replyWithHTML(b);
}
})

})


showworkScene.hears('Назад', (ctx) => {
ctx.scene.enter('addwork');
})


showworkScene.hears('Все', (ctx) => {
let sql = "SELECT * from work where work_date ='" + gettomorrowDate() + "' OR work_date= '"+gettodayDate()+"' ORDER BY driver_name "
get_alldata(sql, function(allwork) {

if (allwork=="") { ctx.reply("А на завтра работ нету :("); }
else {
for(let i = 0; i < allwork.length; i++){

	
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
							,Markup.inlineKeyboard([
								Markup.callbackButton('Удалить '+allwork[i].id, 'add '+allwork[i].id),
								Markup.callbackButton('Изменить '+allwork[i].id, 'changework '+allwork[i].id),
							], {columns: 2}).extra());
							}

}

})
})


showworkScene.action(/add (\d+)/gi, (ctx) => {
// Пускай название вас не смущает, это общая функция. 
get_alldata("DELETE FROM work where id = '"+ctx.match[1]+"'",function()
{
	ctx.reply("Удалили работу с ID" + ctx.match[1]);
	console.log("Удалили работу с ID" + ctx.match[1]);
	ctx.deleteMessage()
});
});



showworkScene.action(/changework (\d+)/gi, (ctx) => {
get_alldata("SELECT * FROM work where id = '"+ctx.match[1]+"'",function(result)
{
	if (!result[0].payment_value) { result[0].payment_value='' }
	var d = "ID"+result[0].id+","+result[0].driver_name+","+result[0].height+","+result[0].time+","+result[0].address+","+result[0].phone+","+result[0].phone_name+","+result[0].manager_name+","+result[0].pererabotka+","+result[0].payment_type+result[0].payment_value+","+result[0].firm;
	ctx.replyWithHTML("<b>&#10071;Не удаляйте ID с цифрами вначале&#10071;</b>\n Скопируйте сообщение снизу в форму и отредактируйте то, что нужно");
	ctx.reply(d);
	ctx.deleteMessage()
});

})

showworkScene.hears(/ID/, (ctx) => {
console.log("Получилось!");
let job = ctx.match.input.split(',')
	job.forEach(function (item, i, job) {
		job[i] = item.trim()
	});
confirmerwork(job,ctx);

})

showworkScene.on('message', (ctx) => {
ctx.reply("Вы в режиме отображения",ShowworkKeyboard());

})

export default showworkScene