import { TOKEN } from './config.js'
import Telegraf from 'telegraf'
import session from 'telegraf/session.js'
import { stage } from './scenes/disp/addworkScene.js'
import { DispMainMenu, yesNoKeyboard } from './keyboards.js'
import { whoareyou } from './controllers/check_id.js'
import { add_newanon } from './db.js' 
import fetch  from 'node-fetch' 



export const bot = new Telegraf(TOKEN) 
bot.use(session())
bot.use(stage.middleware())



// Старт позволяет понять, кто перед нами - проверяем по его индификатору, есть ли он в базе данных.
bot.start(ctx => {
console.log(ctx);
	ctx.reply("Приветствуем Вас в нашем уютном боте!");
	ctx.reply("Напиши мне что-нибудь, чтобы активировать систему");

})



// async function mrcat(ctx)  {
	//ctx.replyWithDocument({ source: './scenes/disp/docs/1/opo.pdf' })
	// const response = await fetch("https://aws.random.cat/meow");
	// const data = await response.json();
	// return ctx.replyWithPhoto(data.file);
	
  // }
  
  


bot.on('text', ctx => {
	async function startid(){
	let d =  await whoareyou(ctx.from.id)
	if (d.role==1) {
		
		ctx.scene.enter('addwork')
		ctx.replyWithHTML('Авторизация пройдена успешна. Привет <b>' + d.name_telegram + '! </b>Вы в режиме <b>диспетчера</b>')

	}

	if (d.role==0) {
		ctx.reply('Вам не назначена никакая роль в нашей системе. Обратитесь к администратору @gevork_ch')
	}
	
	if (d.role==2) {
		ctx.replyWithHTML('Авторизация пройдена успешна. Привет <b>' + d.name_telegram + '! </b>Вы в режиме <b>диспетчера</b>')
		ctx.scene.enter('driver')
	}

	if (d==3) {
		console.log("dsa");
			add_newanon(ctx.message);  // Передаем данные в функцию добавление в БД нового пользователя
			ctx.reply('Вы не авторизованны, но мы Вас добавили')
			ctx.reply('Чтобы ускорить работу в системе, напишите в личку администратору @gevork_ch сообщение в формате "Привет я авторизовался в боте, меня зовут ****, я вожу *** борт"')
			bot.telegram.sendMessage(285512812,'Добавлен новый пользователь с ID '+ctx.from.id+'')
	}
}	
startid()

})

		




bot.launch()
