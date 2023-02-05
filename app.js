import { TOKEN } from './config.js'
import Telegraf from 'telegraf'
import session from 'telegraf/session.js'
import { greeterScene, stage } from './stage.js'
import { getMainMenu, yesNoKeyboard, getMainKeyboard } from './keyboards.js'
import { getMyTasks, addTask, deleteTask } from './db.js'

const bot = new Telegraf(TOKEN)
bot.use(session())

bot.start(ctx => {
    ctx.replyWithHTML('Приветсвую в <b>Moscowkranbot</b>. Великий Геворк работает над ним.')
})



bot.use(stage.middleware())
bot.command('/a', async ctx => {
try {ctx.scene.enter('greeter')}
catch {console.error(err)}
})


bot.start(ctx => {
    ctx.replyWithHTML(
        'Приветсвую в <b>Боте Москоукран</b>\n\n'+
        'Чтобы быстро добавить задачу, просто напишите ее и отправьте боту',
        getMainMenu())

})


bot.hears('Мои задачи', async ctx => {
    try {
    const tasks = await getMyTasks()
    let result = ''

    for (let i = 0; i < tasks.length; i++) {
        result = result + `[${i+1}] ${tasks[i]}\n`
    }

    ctx.replyWithHTML(
        '<b>Список ваших задач:</b>\n\n'+
        `${result}`
    )
}
catch {console.error(err)}
})

bot.hears('Удалить задачу', ctx => {
    ctx.replyWithHTML(
        'Введите фразу <i>"удалить `порядковый номер задачи`"</i>, чтобы удалить сообщение,'+
        'например, <b>"удалить 3"</b>:'
    )
})

bot.hears(/^удалить\s(\d+)$/, ctx => {
    const id = Number(+/\d+/.exec(ctx.message.text)) - 1
    deleteTask(id)
    ctx.reply('Ваша задача успешно удалена')
})

bot.on('text', ctx => {
    ctx.replyWithHTML(
        `Это основной режим`
    )
})



bot.action(['yes', 'no'], ctx => {
    if (ctx.callbackQuery.data === 'yes') {
        addTask(ctx.session.taskText)
        ctx.editMessageText('Ваша задача успешно добавлена')
    } else {
        ctx.deleteMessage()
    }
})

bot.launch()
