import axios from 'axios';

axios.get(`https://sms.ru/sms/send?api_id=FE353751-C05C-BCFB-3465-C68FFE159267&to=+37455721750&msg=hello+world&json=1`).then((result) => {
console.log(result);
		})