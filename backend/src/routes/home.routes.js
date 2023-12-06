const express = require('express');
const { query } = require('../db');
const { allColumns, formatDatesInResultSet, sqlFilterHelper } = require('../utility');

const homeRouter = express.Router();

homeRouter.post('/data', (req, res) => {
	(async () => {
		try {
			const filterField = req.body.filterField;
			const filterValue = req.body.filterValue;

			let sqlQuery = 'SELECT leagues.*, teams.*, players.* FROM leagues NATURAL JOIN teams NATURAL JOIN players';
			let params = [];

			sqlQuery = sqlFilterHelper(sqlQuery, params, filterField, filterValue, allColumns);

			console.log(sqlQuery);

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
