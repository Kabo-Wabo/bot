import Scene from 'telegraf/scenes/base.js'
import { PutevkiMenu } from '../../keyboards.js'
import { get_alldata } from '../../db.js'
import Markup from 'telegraf/markup.js'
const putevki = new Scene('putevki')
var date
let subarray

putevki.enter((ctx) => {
    ctx.reply("Вы в режиме обработки путевок", PutevkiMenu())
})


putevki.hears(/^[0-9][0-9]\-[0-9][0-9]$/, (ctx) => {
    try {
        date = 2023 + "-" + ctx.message.text;
        var sql = "SELECT * from work where work_date ='" + date + "'  ORDER BY driver_name "
        ctx.reply("Это дата!")
        get_alldata("SELECT A.id, A.driver_name, A.time, A.firm, A.address, B.bort_number FROM work A INNER JOIN drivers B ON A.driver_name = B.driver_name WHERE A.work_date = '" + date + "' AND approved_by_disp=2 ORDER BY B.bort_number ", (result) => {
            subarray = [];
            var i = 0;
            for (var key in result) {
                subarray[i] = [result[key].bort_number + " " + result[key].driver_name + " " + result[key].time + " " + result[key].firm + " " + result[key].address + " ID:"+result[key].id]
                i++
            }
            console.log(subarray);
            ctx.reply("Работы в базе за этот день",Markup.keyboard(subarray).resize().extra())
        })
    }
    catch(error){
        console.log(error)
    }
})

putevki.hears('Назад', (ctx) => {
    ctx.scene.enter('addwork')
})

putevki.hears(/ID:[0-9]*$/, (ctx) => {
var s = toString('ID:' + ctx.message.text.split('ID:')[1])

console.log(subarray[0].indexOf(/Лев/));
ctx.reply("Введите кол-во часов и км через запятую",Markup.keyboard(subarray.slice(2)).resize().extra())
console.log(subarray);
})


putevki.on('text', (ctx) => {
    ctx.reply("В разработке")
})
export default putevki

