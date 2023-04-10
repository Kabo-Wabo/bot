// var d = "СТС 5 борт новый 2.jpg"
// var regexp1 = /\.jpg$/
// var regexp2 = /\.jpeg$/
// var regexp3 = /\.pdf$/
// if( /\.jpg$/.test(d) || /\.jpeg$/.test(d) || /\.pdf$/.test(d)) {console.log('Ըես')}

var d = [
    [ '3 Лев 11:00 Рога и Копыта Большой Пердунский переулок д4 ID:602' ],
    [ '3 Лев 11:00 Рога и Копыта Большой Пердунский переулок д4 ID:601' ],
    [ '19 Сос 09:00 Рога и Копыта Большой Пердунский переулок д4 ID:595']
  ]

  d.forEach(function(item, i) {
    console.log( i + ": " + item  );
    console.log(item[0]);
    console.log(item[0].indexOf('ID:602'));
  });