import {allfetch} from '../db.js'

function whoareyou(x) {
	
var user = "unknown"
var params = ""

allfetch.forEach(function(entry) {

 if (entry.id_telegram == x) {
	if (entry.role == 1) user = 'admin'; params = entry ;
	if (entry.role == 2) user = 'driver'; params = entry;
	if (entry.role == 3) user = 'boss'; params = entry;
	if (!entry.role) user = 'unknown_inbd'; params = entry;
 }

});
return [user,params];
}



export { whoareyou };