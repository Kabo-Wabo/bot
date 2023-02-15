import Scene from 'telegraf/scenes/base.js'
import Stage from 'telegraf/stage.js'
export const greeterScene = new Scene('greeter') 
export const stage = new Stage([greeterScene])

greeterScene.enter((ctx) =>
		{
					ctx.replyWithHTML(
						`Вы вошли в режим добавления работ\n`+
						`<i>Добавьте работы по шаблону</i>`,
				)
				
				console.log('Режим добавления активен')
		}
)

greeterScene.hears('все',(ctx) => {
	ctx.reply('Выход из режима добавления работ')
	ctx.scene.leave()
})

greeterScene.on('message', (ctx) => {

	console.log(ctx.message.text)
    ctx.session.taskText = ctx.message.text
	let job = ctx.session.taskText.split(',')
        job.forEach(function(item, i, job) {
        job[i] = item.trim()
      });
	
    if (job.length==6) 
    {
		ctx.replyWithHTML(
						`<b>Все данные на месте</b>\n\n`+
						`<i>&#128119;Водитель</i>: `+job[0]+
						`\n<i>&#9201;Время</i>: `+job[1]+
						`\n<i>&#128217;Адрес</i>: `+job[2]+
						`\n<i>&#128217;Телефон</i>: `+job[3]+
						`\n<i>&#128217;Переработка</i>: `+job[4]+
						`\n<i>&#128217;Способ оплаты</i>: `+job[5]
				)
    }
    else {

        ctx.reply('Что-то не введено')

    }
})

