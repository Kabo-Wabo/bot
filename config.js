export const TOKEN = '1746873328:AAFRA9BmmOExE71EkqQYh4yTygKS0tBYx3U'


export function gettomorrowDate(){
 var tomorrowDate = new Date();
	tomorrowDate.setDate(tomorrowDate.getDate() + 1);
	tomorrowDate = tomorrowDate.toISOString().split('T')[0]
return tomorrowDate
}

export function gettodayDate(){
 var todayDate = new Date();
	todayDate.setDate(todayDate.getDate());
	todayDate = todayDate.toISOString().split('T')[0]
return todayDate
}