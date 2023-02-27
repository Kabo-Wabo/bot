import { TOKEN, tomorrow } from './config.js'
import Telegraf from 'telegraf'
import session from 'telegraf/session.js'
import { stage } from './scenes/disp/addworkScene.js'
import { DispMainMenu, yesNoKeyboard } from './keyboards.js'
import { whoareyou } from './controllers/check_id.js'
import { add_newanon } from './db.js' 



export const bot = new Telegraf(TOKEN) 
bot.use(session())
bot.use(stage.middleware())

// Старт позволяет понять, кто перед нами - проверяем по его индификатору, есть ли он в базе данных.
bot.start(ctx => {
    ctx.replyWithHTML('Приветсвую в <b>Moscowkranbot</b>. Великий Геворк работает над ним. Сейчас мы попробуем понять кто Вы')

	// Сверяем с БД - есть ли человек в ней 
	let d = whoareyou(ctx.from.id);
	if (d[0]=='admin') {
		
		
		ctx.scene.enter('addwork')
		ctx.replyWithHTML('Авторизация пройдена успешна. Привет <b>'+d[1].name_telegram+'</b>! Вы в режиме <b>диспетчера</b>')

		//bot.telegram.sendMessage(890097599,'ПЛОР ты меня слышишь? ')
	}

	if (d[0]=='unknown_inbd') {
		ctx.reply('Вы не авторизованны, но мы уже знаем о Вас')
	}

	if (d[0]=='unknown') {
			add_newanon(ctx.message);  // Передаем данные в функцию добавление в БД нового пользователя
			ctx.reply('Вы не авторизованны')
	}
})



bot.on('text', ctx => {
    try {
	ctx.replyWithHTML(`Вы не авторизованы, обратитесь к администратору @gevork_ch , или запустите бота заново командой /start`)
 	}
	catch { console.err(error) }
})



bot.launch()
