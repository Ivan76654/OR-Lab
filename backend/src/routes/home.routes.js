const express = require('express');
const pgFormat = require('pg-format');
const { query } = require('../db');
const { format } = require('date-fns');

const homeRouter = express.Router();

function formatDatesInResultSet(rows, dateFormat) {
	return rows.map((row) => {
		return {
			...row,
			founded: format(row.founded, dateFormat),
			date_of_birth: format(row.date_of_birth, dateFormat),
		};
	});
}

homeRouter.get('/', (req, res) => {
	(async () => {
		try {
			const sqlQuery = `SELECT leagues.*, teams.*, players.* FROM leagues NATURAL JOIN teams NATURAL JOIN players;`;
			const result = await query(sqlQuery, []);

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

homeRouter.post('/filter', (req, res) => {
	(async () => {
		try {
			const filterField = req.body.filterField;
			const filterValue = req.body.filterValue;

			let sqlQuery = 'SELECT leagues.*, teams.*, players.* FROM leagues NATURAL JOIN teams NATURAL JOIN players';
			let params = [];

			switch (filterField) {
				case '*':
					const allColumns = [
						'league_id',
						'league_rank',
						'number_of_teams',
						'team_id',
						'team_name',
						'founded',
						'player_id',
						'player_first_name',
						'player_last_name',
						'date_of_birth',
						'elo_rank',
					];

					let filterHelper = 'WHERE';

					for (let i = 0; i < allColumns.length; i++) {
						if (i === allColumns.length - 1) {
							filterHelper += ` LOWER(${allColumns[i]}::VARCHAR) = LOWER($1)`;

							continue;
						}

						filterHelper += ` LOWER(${allColumns[i]}::VARCHAR) = LOWER($1) OR`;
					}

					params.push(filterValue);
					sqlQuery = `${sqlQuery} ${filterHelper};`;
					break;

				default:
					sqlQuery = pgFormat(
						`${sqlQuery} WHERE LOWER(%I::VARCHAR) = LOWER(%L);`,
						filterField,
						filterValue
					);
					break;
			}

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
