var d = "Аро1,22м,13:00,Бульвар Аршака,89253804563,Василий,Аршак,есть,бн,Строй Престиж"

var myArray = /ID/.exec(d);
	let job = d.split(',')
	job.forEach(function (item, i, job) {
		job[i] = item.trim()
	});
	
if(myArray) {console.log("ЕСТЬ ID")}