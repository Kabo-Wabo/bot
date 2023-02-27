import Scene from 'telegraf/scenes/base.js'
import {ShowworkKeyboard } from '../../keyboards.js'
const showworkScene = new Scene('showwork')
import {allwork} from '../../db.js'


showworkScene.enter((ctx) => {
ctx.replyWithHTML('Вы в режиме отображения');
console.log('Режим отображения активен')
ctx.replyWithHTML(
`<b>ID:` + allwork[0].id +
`</b>\n` + allwork[0].time +
` ` + allwork[0].address + ` ` +
` ` + allwork[0].phone_name + ` ` +
` ` + allwork[0].phone + ` ` +
` ` + allwork[0].firm + ` ` +
` ` + allwork[0].pererabotka + ` ` +
` ` + allwork[0].add_date + ` ` +
` ` + allwork[0].height + ` ` +
` ` + allwork[0].time + ` `

,ShowworkKeyboard());

})



showworkScene.hears('Добавить', (ctx) => {
ctx.scene.enter('addwork');
})

showworkScene.hears('Изменить', (ctx) => {
ctx.replyWithHTML(`<b>bold</b>, <strong>bold</strong>
<i>italic</i>, <em>italic</em>
<u>underline</u>, <ins>underline</ins>
<s>strikethrough</s>, <strike>strikethrough</strike>, <del>strikethrough</del>
<span class="tg-spoiler">spoiler</span>, <tg-spoiler>spoiler</tg-spoiler>
<b>bold <i>italic bold <s>italic bold strikethrough <span class="tg-spoiler">italic bold strikethrough spoiler</span></s> <u>underline italic bold</u></i> bold</b>
<a href="http://www.example.com/">inline URL</a>
<a href="tg://user?id=123456789">inline mention of a user</a>
<code>inline fixed-width code</code>
<pre>pre-formatted fixed-width code block</pre>
<pre><code class="language-python">pre-formatted fixed-width code block written in the Python programming language</code></pre>`)

})

showworkScene.hears('Удалить', (ctx) => {
	ctx.replyWithHTML(`

2 22м 10:00 Хуевый бульвар д 10 Сергей 89253804563 Финанс строй инвест бн  Гор утч\n
3 22м 11:00 Хуевый бульвар д 11 Сергей 89253804563 Финанс строй инвест бн  Гор утч\n
4 22м 12:00 Хуевый бульвар д 12 Сергей 89253804563 Финанс строй инвест бн  Гор утч\n
5 22м 13:00 Хуевый бульвар д 13 Сергей 89253804563 Финанс строй инвест бн  Гор утч\n
6 22м 14:00 Хуевый бульвар д 14 Сергей 89253804563 Финанс строй инвест бн  Гор утч\n
7 22м 15:00 Хуевый бульвар д 15 Сергей 89253804563 Финанс строй инвест бн  Гор утч\n
8 22м 16:00 Хуевый бульвар д 16 Сергей 89253804563 Финанс строй инвест бн  Гор утч\n
9 22м 17:00 Хуевый бульвар д 17 Сергей 89253804563 Финанс строй инвест бн  Гор утч\n
2 22м 10:00 Хуевый бульвар д 10 Сергей 89253804563 Финанс строй инвест бн  Гор утч\n
3 22м 11:00 Хуевый бульвар д 11 Сергей 89253804563 Финанс строй инвест бн  Гор утч\n
4 22м 12:00 Хуевый бульвар д 12 Сергей 89253804563 Финанс строй инвест бн  Гор утч\n
5 22м 13:00 Хуевый бульвар д 13 Сергей 89253804563 Финанс строй инвест бн  Гор утч\n
6 22м 14:00 Хуевый бульвар д 14 Сергей 89253804563 Финанс строй инвест бн  Гор утч\n
7 22м 15:00 Хуевый бульвар д 15 Сергей 89253804563 Финанс строй инвест бн  Гор утч\n
8 22м 16:00 Хуевый бульвар д 16 Сергей 89253804563 Финанс строй инвест бн  Гор утч\n
9 22м 17:00 Хуевый бульвар д 17 Сергей 89253804563 Финанс строй инвест бн  Гор утч\n
2 22м 10:00 Хуевый бульвар д 10 Сергей 89253804563 Финанс строй инвест бн  Гор утч\n
3 22м 11:00 Хуевый бульвар д 11 Сергей 89253804563 Финанс строй инвест бн  Гор утч\n
4 22м 12:00 Хуевый бульвар д 12 Сергей 89253804563 Финанс строй инвест бн  Гор утч\n
5 22м 13:00 Хуевый бульвар д 13 Сергей 89253804563 Финанс строй инвест бн  Гор утч\n
6 22м 14:00 Хуевый бульвар д 14 Сергей 89253804563 Финанс строй инвест бн  Гор утч\n
7 22м 15:00 Хуевый бульвар д 15 Сергей 89253804563 Финанс строй инвест бн  Гор утч\n
8 22м 16:00 Хуевый бульвар д 16 Сергей 89253804563 Финанс строй инвест бн  Гор утч\n
9 22м 17:00 Хуевый бульвар д 17 Сергей 89253804563 Финанс строй инвест бн  Гор утч\n
`,ShowworkKeyboard());

})

showworkScene.hears('Отобразить', (ctx) => {
ctx.replyWithHTML(
`<b>ID:` + allwork[0].id +
`</b>\n` + allwork[0].time +
` ` + allwork[0].address + ` ` +
` ` + allwork[0].phone_name + ` ` +
` ` + allwork[0].phone + ` ` +
` ` + allwork[0].firm + ` ` +
` ` + allwork[0].pererabotka + ` ` +
` ` + allwork[0].add_date + ` ` +
` ` + allwork[0].height + ` ` +
` ` + allwork[0].time + ` `

,ShowworkKeyboard);

})

showworkScene.on('message', (ctx) => {
ctx.reply("հւը",ShowworkKeyboard());

})

export default showworkScene