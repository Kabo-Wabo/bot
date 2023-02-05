import Markup from 'telegraf/markup.js'

export function getMainMenu() {
    return Markup.keyboard([
        ['Мои задачи', 'Удалить задачу'],
    ]).resize().extra()
}

export function yesNoKeyboard() {
    return Markup.inlineKeyboard([
        Markup.callbackButton('Да', 'yes'),
        Markup.callbackButton('Нет', 'no')
    ], {columns: 2}).extra()
}


export function getMainKeyboard() {
    return Markup.keyboard([
        ['Мои задачи', 'Удалить задачу'],
    ]).resize().extra()
}