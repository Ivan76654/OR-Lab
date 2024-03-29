const express = require('express');
const { format } = require('date-fns');
const { query } = require('../db');
const {
	allColumns,
	csvColumnHeaders,
	formatDatesInResultSet,
	sqlFilterHelper,
	toCSVString
} = require('../utility');

const downloadRouter = express.Router();

downloadRouter.post('/csv', (req, res) => {
	(async () => {
		const filterField = req.body.filterField;
		const filterValue = req.body.filterValue;
	
		let sqlQuery = 'SELECT player.*, team.*, league.* FROM league NATURAL JOIN team NATURAL JOIN player';
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
	(async () => {
		const filterField = req.body.filterField;
		const filterValue = req.body.filterValue;

		let playerSql = 'SELECT DISTINCT player.* FROM league NATURAL JOIN team NATURAL JOIN player';
		let teamSql = 'SELECT DISTINCT team.* FROM league NATURAL JOIN team NATURAL JOIN player';
		let leagueSql = 'SELECT DISTINCT league.* FROM league NATURAL JOIN team NATURAL JOIN player';

		let playerParams = [];
		let teamParams = [];
		let leagueParams = [];

		playerSql = `${sqlFilterHelper(playerSql, playerParams, filterField, filterValue, allColumns)} ORDER BY player.player_id;`;
		teamSql = `${sqlFilterHelper(teamSql, teamParams, filterField, filterValue, allColumns)} ORDER BY team.team_id;`;
		leagueSql = `${sqlFilterHelper(leagueSql, leagueParams, filterField, filterValue, allColumns)} ORDER BY league.league_id;`;

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
									.filter(player => currentTeam.team_id === player.team_id)
									.map(player => {
										delete player.team_id;
										return player;
									});
			currentTeam.players = teamPlayers;
		}

		for (let i = 0; i < formattedLeagueResult.length; i++) {
			const currentLeague = formattedLeagueResult[i];
			const leagueTeams = formattedTeamResult
									.filter(team => currentLeague.league_id === team.league_id)
									.map(team => {
										delete team.league_id;
										return team;
									});
			currentLeague.teams = leagueTeams;
		}
	
		res.json({
			leagues: formattedLeagueResult
		});
	})();
});

module.exports = downloadRouter;
