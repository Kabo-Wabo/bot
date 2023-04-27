import Markup from 'telegraf/markup.js'
import { setDate, sliceryear } from './functions.js'

export function DispMainMenu() {
    return Markup.keyboard([
        ['Спец', 'Мои', 'Статус', 'Доки', 'Долг'],
        [sliceryear(setDate(-4)), sliceryear(setDate(-3)), sliceryear(setDate(-2)), sliceryear(setDate(-1)), sliceryear(setDate(0)), sliceryear(setDate(+1))],
    ]).resize().extra()
}

export function PutevkiMenu() {
    return Markup.keyboard([
        ['Не закрытые', 'Мои', 'Назад'],
        [sliceryear(setDate(-4)), sliceryear(setDate(-3)), sliceryear(setDate(-2)), sliceryear(setDate(-1)), sliceryear(setDate(0)),],
    ]).resize().extra()
}

export function BossMenu() {
    return Markup.keyboard([
        ['🤣', 'Должники', 'Доки'],
    ]).resize().extra()
}

export function SupGevMenu() {
    return Markup.keyboard([
        ['🤣', 'Должники', 'Доки','хуй','нуль'],
        ['в','а','г','к','б','ф']
    ]).resize().extra()
}


export function ShowworkKeyboard() {
    return Markup.keyboard([
        ['Назад', 'Все', 'Кратко'],

    ]).resize().extra()
}

export function statusKeyboard() {
    return Markup.keyboard([
        ['Не приняли', 'курящие', 'не в строю'],
        ['Актуализация', 'Отобразить статус', 'Назад'],

    ]).resize().extra()
}


export function driverkeyboard() {
    return Markup.keyboard([
        ['Завершенные работы', 'Актуальные работы', 'Инструкция'],
    ]).resize().extra()
}

export function yesNoKeyboard() {
    return Markup.inlineKeyboard([
        Markup.callbackButton('Да', 'yes'),
        Markup.callbackButton('Нет', 'no')
    ], { columns: 2 }).extra()
}

export function FirmChoser() {
    return Markup.inlineKeyboard([
        Markup.callbackButton('М', 'm'),
        Markup.callbackButton('С', 's')
    ], { columns: 2 }).extra()
}

export function workerconfirmed(id) {
    return Markup.inlineKeyboard([
        Markup.callbackButton('Закончил', 'end' + id),
        Markup.callbackButton('Отмена', 'cancel' + id),
        Markup.callbackButton('Проблемы', 'late' + id)
    ], { columns: 3 }).extra()
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
        ['Очистить запрос', 'Шаг назад', 'Произвести запрос']
    ]).resize().extra()
}

