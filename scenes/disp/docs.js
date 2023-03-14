import Scene from 'telegraf/scenes/base.js'
import Markup from 'telegraf/markup.js'
const docs = new Scene('docsscene')
import fs  from 'fs' 
import { listDir } from '../../functions.js'
import { yesNoKeyboard } from '../../keyboards.js'
import {bot} from '../../app.js'

		var i = 0
		var driverfolders = []
var dirname = './docs/1 - Гор2/Гор 2 Водитель/';



docs.enter((ctx) => {
	

listDir().then((value) => {


	var a = 		[
		{text: value[0]},
		{text: value[1]},
		{text: "х"},
		{text: "х"},
		{text: "х"}
		]
		
			var b = 		[
		{text: "х"},
		{text: "х"},
		{text: "х"},
		{text: "х"},
		{text: "х"}
		
		]
bot.telegram.sendMessage(ctx.chat.id, "Bot Info", {
	reply_markup: {
		keyboard: [
a, b
		],
		resize_keyboard:true
	}
})
  
  
  
  
  
  
});

})


docs.hears('1 - Гор2', (ctx) => {
	fs.readdir(dirname, (err, files) => {
		
 			files.forEach(file => {
		ctx.replyWithDocument({ source: dirname + file })

		});
 
	  });
})


docs.hears('Назад', (ctx) => {
	ctx.scene.enter('addwork');
})

docs.on('message', (ctx) => {

	fs.readdir('./docs/'+ctx.message.text+'/Гор 2 Водитель/', (err, files) => {
		try{
 			files.forEach(file => {
		ctx.replyWithDocument({ source: dirname + file })

		});
		}
		catch {
			ctx.reply("Что-то не так");
		}
 
	  });
})


 

export default docs