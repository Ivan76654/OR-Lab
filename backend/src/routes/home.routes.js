const express = require('express');
const fs = require('fs');
const { format } = require('date-fns');
const { query } = require('../db');
const {
	allColumns,
	csvColumnHeaders,
	formatDatesInResultSet,
	sqlFilterHelper,
	toCSVString
} = require('../utility');

const homeRouter = express.Router();

homeRouter.post('/data', (req, res) => {
	(async () => {
		try {
			const filterField = req.body.filterField;
			const filterValue = req.body.filterValue;

			let sqlQuery =
				'SELECT league.*, team.*, player.* FROM league NATURAL JOIN team NATURAL JOIN player';
			let params = [];

			sqlQuery = `${sqlFilterHelper(
				sqlQuery,
				params,
				filterField,
				filterValue,
				allColumns
			)} ORDER BY player.player_id, team.team_id, league.league_id;`;

			const result = await query(sqlQuery, params);

			const formattedResult = formatDatesInResultSet(
				result.rows,
				'yyyy-MM-dd'
			);

			res.json({
				rowCount: result.rowCount,
				data: formattedResult
			});
		} catch (err) {
			console.log(err);
			res.sendStatus(500);
		}
	})();
});

homeRouter.get('/refreshData', async (req, res) => {
	try {
		let playerSql =
			'SELECT DISTINCT player.* FROM league NATURAL JOIN team NATURAL JOIN player';
		let teamSql =
			'SELECT DISTINCT team.* FROM league NATURAL JOIN team NATURAL JOIN player';
		let leagueSql =
			'SELECT DISTINCT league.* FROM league NATURAL JOIN team NATURAL JOIN player';

		let playerParams = [];
		let teamParams = [];
		let leagueParams = [];

		const [playerResult, teamResult, leagueResult] = await Promise.all([
			query(playerSql, playerParams),
			query(teamSql, teamParams),
			query(leagueSql, leagueParams)
		]);

		const formattedPlayerResult = playerResult.rows.map((row) => {
			return {
				...row,
				date_of_birth: format(row.date_of_birth, 'yyyy-MM-dd')
			};
		});

		const formattedTeamResult = teamResult.rows.map((row) => {
			return {
				...row,
				founded: format(row.founded, 'yyyy-MM-dd')
			};
		});

		const formattedLeagueResult = leagueResult.rows;

		for (let i = 0; i < formattedTeamResult.length; i++) {
			const currentTeam = formattedTeamResult[i];
			const teamPlayers = formattedPlayerResult
				.filter((player) => currentTeam.team_id === player.team_id)
				.map((player) => {
					delete player.team_id;
					return player;
				});
			currentTeam.players = teamPlayers;
		}

		for (let i = 0; i < formattedLeagueResult.length; i++) {
			const currentLeague = formattedLeagueResult[i];
			const leagueTeams = formattedTeamResult
				.filter((team) => currentLeague.league_id === team.league_id)
				.map((team) => {
					delete team.league_id;
					return team;
				});
			currentLeague.teams = leagueTeams;
		}

		const jsonObject = {
			leagues: formattedLeagueResult
		};

		let sqlQuery =
			'SELECT player.*, team.*, league.* FROM league NATURAL JOIN team NATURAL JOIN player';
		let params = [];

		const result = await query(sqlQuery, params);

		const formattedResult = formatDatesInResultSet(
			result.rows,
			'yyyy-MM-dd'
		);

		const csvString = toCSVString(
			csvColumnHeaders,
			formattedResult,
			csvColumnHeaders.length
		);

		const buffer = Buffer.from(csvString, 'utf-8');

		// fs.writeFile('./../snapshots/data.csv', buffer, (err) => {});
		// fs.writeFile(
		// 	'./../snapshots/data.json',
		// 	JSON.stringify(jsonObject, null, 2),
		// 	(err) =>{

		// 	}
		// );

		res.end();
	} catch (err) {
		res.json({
			status: 500,
			message: err.message
		});
	}
});

module.exports = homeRouter;
