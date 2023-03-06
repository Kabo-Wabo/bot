import {getalluser} from '../db.js'
var y
/* var y = 3;
export function whoareyou(x) {


return y;

} */
export async function whoareyou(x){
	let d = await getalluser();
	let user = d.find(item => item.id_telegram == x);
	console.log(user);
if (user) { return (user); }
else {return (3);} 

}
