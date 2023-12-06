const express = require('express');
const { query } = require('../db');
const {
	allColumns,
	csvColumnHeaders,
	playerColumns,
	teamColumns,
	leagueColumns,
	formatDatesInResultSet,
	sqlFilterHelper,
	toCSVString
} = require('../utility');

const downloadRouter = express.Router();

downloadRouter.post('/csv', (req, res) => {
	(async () => {
		const filterField = req.body.filterField;
		const filterValue = req.body.filterValue;
	
		let sqlQuery = 'SELECT players.*, teams.*, leagues.* FROM leagues NATURAL JOIN teams NATURAL JOIN players';
		let params = [];
		
		sqlQuery = sqlFilterHelper(sqlQuery, params, filterField, filterValue, allColumns);

		const result = await query(sqlQuery, params);
	
		const formattedResult = formatDatesInResultSet(result.rows, 'yyyy-MM-dd');
	
		const csvString = toCSVString(csvColumnHeaders, formattedResult, csvColumnHeaders.length);
	
		const buffer = Buffer.from(csvString, 'utf-8');
	
		res.writeHead(200, {
			'Content-Type': 'application/octet-stream',
		});

		res.write(buffer);
		res.end();
	})();
});

downloadRouter.post('/json', (req, res) => {

});

module.exports = downloadRouter;
