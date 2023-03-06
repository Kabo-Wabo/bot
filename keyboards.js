import Markup from 'telegraf/markup.js'


export function DispMainMenu() {
    return Markup.keyboard([
        ['Добавить', 'Изменить', 'Удалить'],
        ['Работы на завтра'],
		['Отправить водителям', 'Статистика подтверждений']
    ]).resize().extra()
}

export function ShowworkKeyboard() {
    return Markup.keyboard([
        ['Назад', 'Изменить по ID', 'Удалить по ID'],
        ['Все', 'Кратко', 'Водитель'],
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
