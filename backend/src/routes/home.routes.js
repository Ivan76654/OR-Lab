const express = require('express');
const { query } = require('../db');
const { format } = require('date-fns');

const homeRouter = express.Router();

homeRouter.get('/', (req, res) => {
	(async () =>{
		const sqlQuery = `SELECT leagues.*, teams.*, players.* FROM leagues NATURAL JOIN teams NATURAL JOIN players;`;

		try {
			const result = await query(sqlQuery, []);

			const formattedResult = result.rows.map(row => {
				return {
					...row,
					founded: format(row.founded, 'dd.MM.yyyy'),
					date_of_birth: format(row.date_of_birth, 'dd.MM.yyyy')
				}
			});

			res.json({
				rowCount: result.rowCount,
				data: formattedResult
			});

		} catch(err) {
			console.log(err);
			res.sendStatus(500);
		}

	})();
});

module.exports = homeRouter;
