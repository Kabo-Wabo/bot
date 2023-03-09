import Markup from 'telegraf/markup.js'


export function DispMainMenu() {
    return Markup.keyboard([
        ['Добавить', 'Спец запрос', 'Удалить'],
        ['Работы на завтра и на сегодня'],
    ]).resize().extra()
}

export function ShowworkKeyboard() {
    return Markup.keyboard([
        ['Назад', 'Все', 'Кратко'],
    ]).resize().extra()
}

export function yesNoKeyboard() {
    return Markup.inlineKeyboard([
        Markup.callbackButton('Да', 'yes'),
        Markup.callbackButton('Нет', 'no')
    ], {columns: 2}).extra()
}

export function actionWithwork() {
    return Markup.inlineKeyboard([
        Markup.callbackButton('Удалить', 'deletework'),
        Markup.callbackButton('Изменить', 'chahgework'),
        Markup.callbackButton('Назад', 'back_to_work'),
    ], {columns: 3}).extra()
}
