import Scene from 'telegraf/scenes/base.js'
const stat = new Scene('statusscene')
import { showstatus, bort_to_date, newbortstatus, setDate, actualizator, createnewday } from '../../functions.js'
import { statusKeyboard } from '../../keyboards.js'


var specialdate
var borts;

stat.enter((ctx) => {
	createnewday();
	ctx.reply("Вы в режиме статуса. fixed:2,3,4 ; withoutdriver: 5,6,7; jamed:5,2,45; date:2023-03-01", statusKeyboard())

})


stat.hears(/^date:/, (ctx) => {
	try {
		specialdate = (((ctx.update.message.text).replace(/ /g, '')).replace(/^date:/, ''));
		if (/^202[34]\-[0-9][0-9]\-[0-9][0-9]$/.test(specialdate)) {
			showstatus(ctx, specialdate, 10);
		}
		else {
			ctx.reply("Что-то не то с датой");
		}
	}
	catch (err) {
		console.error('Ошибка в блоке c1', err);
	}

})

// Починилось 1
stat.hears(/^fixed:/, (ctx) => {
	try {
		borts = (((ctx.update.message.text).replace(/ /g, '')).replace(/^fixed:/, '')).split(',')
		newbortstatus(ctx, borts, 1);
	}
	catch (err) {
		console.error('Ошибка в блоке c2', err);
	}
})



// Без водителя 5
stat.hears(/^withoutdriver:/, (ctx) => {
	try {
		borts = (((ctx.update.message.text).replace(/ /g, '')).replace(/^withoutdriver:/, '')).split(',')
		newbortstatus(ctx, borts, 5);
	}
	catch (err) {
		console.error('Ошибка в блоке c3', err);
	}
})

//Сломалось 6
stat.hears(/^jamed:/, (ctx) => {
	try {
		borts = (((ctx.update.message.text).replace(/ /g, '')).replace(/^jamed:/, '')).split(',')
		newbortstatus(ctx, borts, 6);
	}
	catch (err) {
		console.error('Ошибка в блоке c4', err);
	}
})


stat.hears('курящие', (ctx) => {
	showstatus(ctx, setDate(+1), 1);
})

stat.hears('Отобразить статус', (ctx) => {
	showstatus(ctx, setDate(+1), 10);
})

stat.hears('Не приняли', (ctx) => {
	showstatus(ctx, setDate(+1), 2);
})

stat.hears('не в строю', (ctx) => {
	showstatus(ctx, setDate(+1), 5);
	showstatus(ctx, setDate(+1), 6);
})


stat.hears('Актуализация', (ctx) => {
	bort_to_date(setDate(+1));
	actualizator();
	ctx.reply("Таблица актуализирована");
})

stat.hears('назад', (ctx) => {
	ctx.scene.enter('addworkScene')
})


export default stat