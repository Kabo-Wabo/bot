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
        ['Добавить', 'Изменить', 'Удалить'],
        ['Отобразить'],
    ]).resize().extra()
}

export function yesNoKeyboard() {
    return Markup.inlineKeyboard([
        Markup.callbackButton('Да', 'yes'),
        Markup.callbackButton('Нет', 'no')
    ], {columns: 2}).extra()
}

