import Scene from 'telegraf/scenes/base.js'
export const gev = new Scene('gev')
import { BossMenu } from '../../keyboards.js'
import { MakeMeSmile, dolg } from '../../functions.js'

gev.enter((ctx) => {
	ctx.reply('Привет Гев! Ты в режиме Босса', BossMenu());
})

gev.hears('Доки', (ctx) => {
	ctx.scene.enter('docsscene')
})

gev.hears('🤣', (ctx) => {

	MakeMeSmile(ctx);

})

gev.hears('Должники', (ctx) => {
	dolg(ctx);
})

gev.on('text', (ctx) => {
	ctx.reply('Мы рады тебя тут видеть', BossMenu());

})




export default gev