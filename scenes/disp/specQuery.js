import Scene from 'telegraf/scenes/base.js'
import Stage from 'telegraf/stage.js'
import {ShowworkKeyboard } from '../../keyboards.js'
import {worktotelegram, shorttotelegram,setDate} from '../../functions.js'
import {get_alldata} from '../../db.js'
const specQuery = new Scene('specQuery')

var sql 

specQuery.enter((ctx) => {
ctx.replyWithHTML('Вы в режиме спецзапроса', ShowworkKeyboard());
// SELECT * FROM work WHERE driver_name = 'Аро1' OR driver_name = 'Гаджи'
// SELECT * FROM work WHERE disp_name = 'Аро1' OR driver_name = 'Гаджи'
// SELECT * FROM work WHERE work_date > '2023-03-06' AND work_date < '2023-03-09'
// SELECT * FROM work WHERE firm LIKE '%строй%'
// SELECT * FROM work WHERE addres LIKE '%строй%'
// SELECT * FROM work WHERE height < 22
// SELECT * FROM work WHERE payment_type < 22

})


specQuery.hears('Назад', (ctx) => {
ctx.scene.enter('addwork');
})

specQuery.hears('Все', (ctx) => {

})

specQuery.hears('Кратко', (ctx) => {
ctx.reply("Хуятка");

})


specQuery.on('message', (ctx) => {
ctx.replyWithHTML('Вы в режиме спецзапроса', ShowworkKeyboard());

})

export default specQuery