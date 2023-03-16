import Scene from 'telegraf/scenes/base.js'
import Stage from 'telegraf/stage.js'
import addwork from '../../controllers/add_db.js'
import { DispMainMenu } from '../../keyboards.js'
import { confirmerwork, mestojob,mestojob2, actyalwork } from '../../functions.js'
import driver from '../driver/driverscene.js'
import ywork from './showWork.js'
import docs from './docs.js'
import specQuery from './specQuery.js'


export const addworkScene = new Scene('addwork')
export const stage = new Stage([addworkScene, ywork, specQuery, docs, driver])


addworkScene.enter((ctx) => {
	ctx.replyWithHTML(
		`Вы вошли в режим добавления работ\n` +
		`<i>Добавьте работы по шаблону</i>\n` +
		`1 Водитель,\n 2 Метраж,\n 3 Время,\n 4 Адрес,\n 5 Телефон,\n 6 Контакт, \n 7 Диспетчер,\n 8 Переработка,\n 9 Форма оплаты\n 10 Фирма\n 11 Дата (по умолчанию - завтра) `
		, DispMainMenu())

	console.log('Режим добавления активен')
}
)

addworkScene.hears('Спец запрос', (ctx) => {
	ctx.scene.enter('specQuery')


})

addworkScene.hears('Доки', (ctx) => {
	ctx.scene.enter('docsscene')


})

// Слышим дату в формате 00-00
addworkScene.hears(/^[0-9][0-9]\-[0-9][0-9]$/gi, (ctx) => {
	ctx.scene.enter('showworkScene')
})


addworkScene.hears('Мои', (ctx) => {
	ctx.scene.enter('showworkScene')
})


addworkScene.action('yes', (ctx) => {
ctx.update.callback_query.message.text = ctx.session.work;
let fibish = addwork(mestojob2(ctx));
ctx.reply('В базу данных добавлена новая работа', DispMainMenu)
})

addworkScene.action('no', ctx => {
	ctx.deleteMessage()
})

addworkScene.on('message', (ctx) => {
	//ctx.session.taskText = ctx.message.text // Не придумал как сделать без этой строчки
	confirmerwork(mestojob(ctx), ctx);
})

