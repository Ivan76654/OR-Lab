const pgFormat = require('pg-format');
const { format } = require('date-fns');

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
	'elo_rank'
];

const csvColumnHeaders = [
	'Player ID',
	'First Name',
	'Last Name',
	'Date Of Birth',
	'Elo Rank',
	'Team ID',
	'Team Name',
	'Founded',
	'League ID',
	'League Rank',
	'Number Of Teams'
];

const playerColumns = [
	'player_id',
	'player_first_name',
	'player_last_name',
	'date_of_birth',
	'elo_rank'
];

const teamColumns = [
	'team_id', 
	'team_name', 
	'founded'
];

const leagueColumns = [
	'league_id', 
	'league_rank', 
	'number_of_teams'
];

function formatDatesInResultSet(rows, dateFormat) {
	return rows.map((row) => {
		return {
			...row,
			founded: format(row.founded, dateFormat),
			date_of_birth: format(row.date_of_birth, dateFormat),
		};
	});
}

function sqlFilterHelper(sqlQuery, params, filterField, filterValue, columns) {
	if ((!columns.includes(filterField) && filterField !== '*') || !filterValue) return sqlQuery + ';';

	switch (filterField) {
		case '*':
			let filterHelper = 'WHERE';

			for (let i = 0; i < columns.length; i++) {
				if (i === columns.length - 1) {
					filterHelper += ` LOWER(${columns[i]}::VARCHAR) = LOWER($1)`;

					continue;
				}

				filterHelper += ` LOWER(${columns[i]}::VARCHAR) = LOWER($1) OR`;
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

	return sqlQuery;
}

function toCSVString(headerRow, rows, numOfColumns) {
	let csvString = '';

	for (let i = 0; i < numOfColumns; i++) {
		if (i === 0) {
			csvString += headerRow[i];

			continue;
		}

		csvString = `${csvString},${headerRow[i]}`;
	}

	csvString += '\n';

	const keys = Object.keys(rows[0]);

	for (let i = 0; i < rows.length; i++) {

		for (let j = 0; j < numOfColumns; j++) {
			if (j === 0) {
				csvString += rows[i][keys[j]];

				continue;
			}

			csvString = `${csvString},${rows[i][keys[j]]}`;
		}

		csvString += '\n';
	}

	return csvString;
}

module.exports = {
	allColumns,
	csvColumnHeaders,
	playerColumns,
	teamColumns,
	leagueColumns,
	formatDatesInResultSet,
	sqlFilterHelper,
	toCSVString
};
