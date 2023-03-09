import Markup from 'telegraf/markup.js'
import {setDate, sliceryear} from './functions.js'

export function DispMainMenu() {
    return Markup.keyboard([
        [ 'Спец запрос', 'Мои', 'Данные'],
 [sliceryear(setDate(-4)), sliceryear(setDate(-3)),  sliceryear(setDate(-2)),  sliceryear(setDate(-1)), sliceryear(setDate(0)), sliceryear(setDate(+1))] ,
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




