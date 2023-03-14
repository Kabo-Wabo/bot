import Markup from 'telegraf/markup.js'
import { setDate, sliceryear } from './functions.js'

export function DispMainMenu() {
    return Markup.keyboard([
        ['Спец запрос', 'Мои', 'Доки'],
        [sliceryear(setDate(-4)), sliceryear(setDate(-3)), sliceryear(setDate(-2)), sliceryear(setDate(-1)), sliceryear(setDate(0)), sliceryear(setDate(+1))],
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
    ], { columns: 2 }).extra()
}

export function backKeyboard() {
    return Markup.keyboard([
        ['Назад'],
    ]).resize().extra()
}

export function specialKeyboard() {
    return Markup.keyboard([
        ['Водитель', 'Метраж', 'Даты', 'Диспетчер', 'Оплата'],
        ['Фирма содержит', 'Адрес содержит'],
        ['Очистить запрос', 'Шаг назад', 'Произвести запрос' ]
    ]).resize().extra()
}

