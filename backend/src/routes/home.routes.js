const express = require('express');
const { query } = require('../db');

const homeRouter = express.Router();

homeRouter.get('/', (req, res) => {
	(async () =>{
		const sqlQuery = `SELECT leagues.*, teams.*, players.* FROM leagues NATURAL JOIN teams NATURAL JOIN players;`;

		try {
			const result = await query(sqlQuery, []);

			const formattedResult = result.rows.map(row => {
				return {
					...row,
					founded: `${row.founded.getDate()}.${row.founded.getMonth()}.${row.founded.getFullYear()}`,
					date_of_birth: `${row.date_of_birth.getDate()}.${row.date_of_birth.getMonth()}.${row.date_of_birth.getFullYear()}`
				}
			});

			res.json({
				rowCount: result.rowCount,
				data: formattedResult
			});

		} catch(err) {
			console.log(err);
		}

	})();
});

module.exports = homeRouter;
