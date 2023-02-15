import {allfetch} from '../db.js'

function whoareyou(x) {
var user = "unknown"

 if (x === 285512812 ) user = 'admin';
 if (x === 466427533 ) user = 'driver';
 if (x === 566427533 ) user = 'boss';
return user;
}

export { whoareyou };