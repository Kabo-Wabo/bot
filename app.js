import { TOKEN, admin_id } from './config.js'
import Telegraf from 'telegraf'
import session from 'telegraf/session.js'
import { greeterScene, stage } from './stage.js'
import { connection } from './db.js'
import { getMainMenu, yesNoKeyboard, getMainKeyboard } from './keyboards.js'





const bot = new Telegraf(TOKEN)
bot.use(session())

bot.start(ctx => {
    ctx.replyWithHTML('Приветсвую в <b>Moscowkranbot</b>. Великий Геворк работает над ним.')
})



bot.use(stage.middleware())

bot.command('/a', async ctx => {
try {
for (let i of admin_id) {

	if (i[1] == ctx.message.from.id ) {
		await console.log("Привет "+i[0])
		await ctx.reply('Привет '+i[0]);
		await ctx.scene.enter('greeter')
		return ctx.message('Авторизация пройдена успешна')
	}
}
		await ctx.reply("Ты не администратор")
}
catch {console.error()}
})


bot.on('text', ctx => {
    try {ctx.replyWithHTML(`Это основной режим`)}
	catch { console.err(error) }
	})



bot.launch()
