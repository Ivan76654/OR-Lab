const { Pool } = require('pg');

require('dotenv').config();

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5433,
});

module.exports = {
	query: async (sqlQuery, params) => {
		return pool.query(sqlQuery, params).then((res) => {
			console.log('Executing query:');
			console.log(sqlQuery);

			return res;
		});
	},
	pool: pool,
};