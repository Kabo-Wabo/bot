import Scene from 'telegraf/scenes/base.js'
import {ShowworkKeyboard,actionWithwork } from '../../keyboards.js'
const showworkScene = new Scene('showwork')
import {get_alldata} from '../../db.js'


showworkScene.enter((ctx) => {
ctx.replyWithHTML('Вы в режиме отображения. Выберите пункт меню', ShowworkKeyboard());
console.log('Режим отображения активен')

})

showworkScene.hears('Кратко', (ctx) => {
let b =  new Array()
get_alldata("SELECT * from work", function(allwork) {
	
for(let i = 0; i < allwork.length; i++){
b[i] = allwork[i].id+" "+ allwork[i].time;
console.log(b[i]);
}
})

})


showworkScene.hears('Назад', (ctx) => {
ctx.scene.enter('addwork');
})

showworkScene.hears('Изменить', (ctx) => {
ctx.replyWithHTML(`<span class="tg-spoiler">Ты пидор</span>, <tg-spoiler>spoiler</tg-spoiler>`)

})

showworkScene.hears('Удалить', (ctx) => {
	ctx.replyWithHTML(`
4 22м 12:00 Хуевый бульвар д 12 Сергей 89253804563 Финанс строй инвест бн  Гор утч\n
`,ShowworkKeyboard());

})

showworkScene.hears('Все', (ctx) => {
get_alldata("SELECT * from work", function(allwork) {
for(let i = 0; i < allwork.length; i++){

	
								ctx.replyWithHTML(
							`<b>ID:` + allwork[i].id +
							`</b>\n` + allwork[i].time +
							` ` + allwork[i].address + ` ` +
							` ` + allwork[i].phone_name + ` ` +
							` ` + allwork[i].phone + ` ` +
							` ` + allwork[i].firm + ` ` +
							` ` + allwork[i].pererabotka + ` ` +
							` ` + allwork[i].add_date + ` ` +
							` ` + allwork[i].height + ` ` +
							` ` + allwork[i].time + ` `

							,actionWithwork());
							}
})
})

showworkScene.on('message', (ctx) => {
ctx.reply("հւը",ShowworkKeyboard());

})

export default showworkScene