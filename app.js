import { TOKEN } from './config.js'
import Telegraf from 'telegraf'
import session from 'telegraf/session.js'
import { stage } from './stage.js'
import { getMainMenu, yesNoKeyboard, getMainKeyboard } from './keyboards.js'
import { whoareyou } from './controllers/check_id.js'



const bot = new Telegraf(TOKEN)
bot.use(session())
bot.use(stage.middleware())

// Старт позволяет понять, кто перед нами - проверяем по его индификатору, есть ли он в базе данных.
bot.start(ctx => {
    ctx.replyWithHTML('Приветсвую в <b>Moscowkranbot</b>. Великий Геворк работает над ним. Сейчас мы попробуем понять кто Вы')
	let d = whoareyou(ctx.from.id);
	if (d[0]=='admin') {
		ctx.scene.enter('greeter')
		ctx.replyWithHTML('Авторизация пройдена успешна. Привет <b>'+d[1].name_telegram+'</b>! Вы в режиме <b>диспетчера</b>')
	}
		else {
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
