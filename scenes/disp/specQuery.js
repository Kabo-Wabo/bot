import Scene from 'telegraf/scenes/base.js'
import { backKeyboard, ShowworkKeyboard } from '../../keyboards.js'
import { actyalwork, confirmerwork, shorttotelegram } from '../../functions.js'
import { get_alldata } from '../../db.js'

// По сути это аналог просмотра, но переопределять функции смысла не вижу
// Тут беда с проверками, есть над чем поработать
const specQuery = new Scene('specQuery')
var lastspecialsql


specQuery.enter((ctx) => {
    ctx.replyWithHTML(
        `1 Разделение команд идет <b>через символ точки с запятой, последнему значение ; не ставим</b>\n` +
        `2 <b>Жирным выделены примеры ввода данных.</b>\n` +
        `3 <b>Диапазоны разделяем через символ *</b>\n` +
        `4 Ключевое слово также <b>обязательно к написанию</b>\n (Водитель, Метраж и т.п. с слитно с двоеточием\n\n` +
        `Водитель: <b>Аро1, Аро2</b>;\n` +
        `Метраж: <b>16 * 25;</b>\n` +
        `Дата: <b>2023-03-06 * 2023-06-12;</b>\n` +
        `Диспетчер: <b>Гор, Фатих</b>\n` +
        `Фирма: <b>престиж</b> <i>(одним словом часть фирмы)</i>\n` +
        `Адрес: <b>тупик</b><i> (одним словом часть адреса)</i>\n` +
        `Оплата: <b>бн</b>\n\n` +
        `Пример запроса 1:\n <b>Водитель: Аро1; Дата: 2023-01-01 * 2023-01-02</b>\n` +
        `Пример запроса 2:\n <b>Фирма:СМК; Дата: 2023-05-12</b>\n` +
        `Пример запроса 3:\n <b>Оплата:нал; Водитель: Гаджи, Аро1</b>`, backKeyboard()
    )

})



specQuery.hears('Назад', (ctx) => {
    ctx.scene.enter('addwork');
})

specQuery.action(/del (\d+)/gi, (ctx) => {
    try {
        var sql = "DELETE FROM work where id = '" + ctx.match[1] + "'"
        get_alldata(sql, function () {
            ctx.reply("Удалили работу с ID" + ctx.match[1]);
            ctx.deleteMessage()
        });
    }
    catch (err) {
        console.error('Ошибка в блоке f1', err);
    }
});


// Если слышим команды изменения то переходим сюда
specQuery.action(/changework (\d+)/gi, (ctx) => {
    try {
        var sql = "SELECT * FROM work where id = '" + ctx.match[1] + "'";
        get_alldata(sql, function (result) {
            if (!result[0].payment_value) { result[0].payment_value = '' }
            var d = "ID" + result[0].id + "," + result[0].driver_name + "," + result[0].height + "," + result[0].time + "," + result[0].address + "," + result[0].phone + "," + result[0].phone_name + "," + result[0].manager_name + "," + result[0].pererabotka + "," + result[0].payment_type + result[0].payment_value + "," + result[0].firm;
            ctx.replyWithHTML("<b>&#10071;Не удаляйте ID с цифрами вначале&#10071;</b>\n Скопируйте сообщение снизу в форму и отредактируйте то, что нужно");
            ctx.reply(d);
            ctx.deleteMessage()
        });
    }
    catch (err) {
        console.error('Ошибка в блоке f2', err);
    }
})

specQuery.hears(/ID/, (ctx) => {
    try {
        let job = ctx.match.input.split(',')
        job.forEach(function (item, i, job) {
            job[i] = item.trim()
        });
        confirmerwork(job, ctx);
    }
    catch (err) {
        console.error('Ошибка в блоке f3', err);
    }
})

specQuery.hears('Все', (ctx) => {
    try {
        get_alldata(lastspecialsql, (result) => {
            actyalwork(result, ctx);
        })
    }
    catch (err) {
        console.error('Ошибка в блоке f4', err);
    }
})

specQuery.hears('Кратко', (ctx) => {
    try {
        get_alldata(lastspecialsql, (result) => {
            shorttotelegram(result, ctx);
        })
    }
    catch (err) {
        console.error('Ошибка в блоке f5', err);
    }
})


specQuery.on('text', (ctx) => {
    try {
        var sql = ''
        let job = ctx.message.text.split(';')

        job.forEach(function (item, i, job) {
            job[i] = item.trim()
        });
        var dr = '';
        var sql = '';
        var driver = 'Водитель:'; //+
        var disp = 'Диспетчер:';
        var firm = 'Фирма:';
        var addres = 'Адрес:';
        var payment = 'Оплата:';
        var height = 'Метраж:';
        var data = 'Дата:';

        for (var i = 0; i < job.length; ++i) {

            if (job[i].indexOf(driver) == 0) {
                if (sql.length > 2) { sql = sql + " AND " }
                var dr = job[i].substring(driver.length, job[i].length).split(" ").join("")
                dr = dr.split(',')
                sql = sql + "(";
                for (var y = 0; y < dr.length; y++) {
                    sql = sql + "driver_name =" + " '" + dr[y] + "' "
                    if (y < (dr.length - 1)) {
                        sql = sql + "OR "
                    }
                    else { sql = sql + ")" }

                }
            }// Получили водительей

            if (job[i].indexOf(disp) == 0) {
                if (sql.length > 2) { sql = sql + " AND " }
                var dr = job[i].substring(disp.length, job[i].length).split(" ").join("")
                dr = dr.split(',')
                sql = sql + "(";
                for (var y = 0; y < dr.length; y++) {
                    sql = sql + "manager_name =" + " '" + dr[y] + "' "
                    if (y < (dr.length - 1)) {
                        sql = sql + "OR "
                    }
                    else { sql = sql + ")" }

                }
            }// Получили менеджеров

            if (job[i].indexOf(payment) == 0) {
                if (sql.length > 2) { sql = sql + " AND " }
                var dr = job[i].substring(payment.length, job[i].length).split(" ").join("")
                dr = dr.split(',')
                sql = sql + "(";
                for (var y = 0; y < dr.length; y++) {
                    sql = sql + "payment_type =" + " '" + dr[y] + "' "
                    if (y < (dr.length - 1)) {
                        sql = sql + "OR "
                    }
                    else { sql = sql + ")" }

                }
            }// Получили Способы оплаты

            if (job[i].indexOf(firm) == 0) {
                if (sql.length > 2) { sql = sql + " AND " }
                var dr = job[i].substring(firm.length, job[i].length).split(" ").join("")
                dr = dr.split(',')
                sql = sql + "(";
                for (var y = 0; y < dr.length; y++) {
                    sql = sql + "firm LIKE" + " '%" + dr[y] + "%' "
                    if (y < (dr.length - 1)) {
                        sql = sql + "OR "
                    }
                    else { sql = sql + ")" }

                }
            }// Получили Фирму

            if (job[i].indexOf(addres) == 0) {
                if (sql.length > 2) { sql = sql + " AND " }
                var dr = job[i].substring(addres.length, job[i].length).split(" ").join("")
                dr = dr.split(',')
                sql = sql + "(";
                for (var y = 0; y < dr.length; y++) {
                    sql = sql + "address LIKE" + " '%" + dr[y] + "%' "
                    if (y < (dr.length - 1)) {
                        sql = sql + "OR "
                    }
                    else { sql = sql + ")" }

                }
            }// Получили Адрес

            if (job[i].indexOf(height) == 0) {
                if (sql.length > 2) { sql = sql + " AND " }
                var dr = job[i].substring(height.length, job[i].length).split(" ").join("")
                dr = dr.split('*')
                if (dr.length == 1) { sql = sql + "height='" + dr[0] + "'" }
                if (dr.length == 2) { sql = sql + "(height>'" + dr[0] + "' AND height<'" + dr[1] + "')" }

            }// Получили Высоту

            if (job[i].indexOf(data) == 0) {

                if (job[i].indexOf('*') !== '-1' && job[i].indexOf(',') == '-1' && job[i].length < 30) {
                    if (sql.length > 2) { sql = sql + " AND " }
                    var dr = job[i].substring(data.length, job[i].length).split(" ").join("")
                    dr = dr.split('*')

                    if (dr.length == 1 && dr[0].length == 10) { sql = sql + "work_date='" + dr[0] + "'" }
                    if (dr.length == 2 && dr[0].length == 10 && dr[1].length == 10) { sql = sql + "(work_date>'" + dr[0] + "' AND work_date<'" + dr[1] + "')" }
                }
                else { ctx.reply('У вас что-то не то с датой') }
            }// Получили Дату

        }
        if (sql.length > 5) {

            // Итоговый запрос
            sql = "SELECT * FROM work WHERE " + sql;

            get_alldata(sql, (result) => {
                shorttotelegram(result, ctx);
            })
            lastspecialsql = sql;
            ctx.reply("Данные введены", ShowworkKeyboard())
        }
        else {
            ctx.reply("Запрос не сформировался")
        }


    }
    catch (err) {
        console.error('Ошибка в блоке fff', err);
    }
})



export default specQuery