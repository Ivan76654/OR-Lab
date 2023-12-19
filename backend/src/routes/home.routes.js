const express = require('express');
const { query } = require('../db');
const { allColumns, formatDatesInResultSet, sqlFilterHelper } = require('../utility');

const homeRouter = express.Router();

homeRouter.post('/data', (req, res) => {
	(async () => {
		try {
			const filterField = req.body.filterField;
			const filterValue = req.body.filterValue;

			let sqlQuery = 'SELECT league.*, team.*, player.* FROM league NATURAL JOIN team NATURAL JOIN player';
			let params = [];

			sqlQuery = `${sqlFilterHelper(sqlQuery, params, filterField, filterValue, allColumns)} ORDER BY player.player_id, team.team_id, league.league_id;`;

			const result = await query(sqlQuery, params);

			const formattedResult = formatDatesInResultSet(result.rows, 'yyyy-MM-dd');

			res.json({
				rowCount: result.rowCount,
				data: formattedResult,
			});
			
		} catch (err) {
			console.log(err);
			res.sendStatus(500);
		}
	})();
});

module.exports = homeRouter;
