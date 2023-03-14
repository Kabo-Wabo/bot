import { getalluser } from '../db.js'


export async function whoareyou(x) {
	let d = await getalluser();
	let user = d.find(item => item.id_telegram == x);
	if (user) { return (user); }
	else { return (3); }  // 3 - роль означающая, что человека ранее в боте не было и его надо добавить

}
