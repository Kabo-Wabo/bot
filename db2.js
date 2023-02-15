import mysql from "mysql2";

const pool = mysql.createPool({
        connectionLimit : 100,
  host: "localhost",
  user: "gg",
  password: "28884323",
  database: "botdb"
    });

    let arr;

    const promisePool  = pool.promise(); 

    async function getOnline() {
        const sql = 'SELECT * FROM user'

        const [rows, fields] = await promisePool.query(sql);
        return rows;
    }

   let r =  getOnline().then(r => console.log(r)) 
	console.log(r)