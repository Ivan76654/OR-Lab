const express = require('express');
const { format } = require('date-fns');
const { query } = require('../db');
const openapi = require('../../../openapi.json');

const apiRouter = express.Router();

apiRouter.get('/data', (req, res, next) => {
	(async () => {
		try {

			let playerSql = 'SELECT DISTINCT player.* FROM league NATURAL JOIN team NATURAL JOIN player ORDER BY player.player_id;';
			let teamSql = 'SELECT DISTINCT team.* FROM league NATURAL JOIN team NATURAL JOIN player ORDER BY team.team_id;';
			let leagueSql = 'SELECT DISTINCT league.* FROM league NATURAL JOIN team NATURAL JOIN player ORDER BY league.league_id;';
	
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
		
			res.header('Content-Type', 'application/json');
			res.status(200);
			res.json({
				status: 200,
				message: "Fetched all data.",
				response: formattedLeagueResult
			});

		} catch (err) {
			next({
				status: 500,
				message: err.message
			});
		}

	})();
});

apiRouter.get('/leagues', (req, res, next) => {
	(async () => {
		try {
			const sqlQuery = 'SELECT league_id, league_rank, league_name FROM league ORDER BY league_id;';
			const params = [];

			const result = (await query(sqlQuery, params)).rows;

			res.header('Content-Type', 'application/json');
			res.status(200);
			res.json({
				status: 200,
				message: 'Fetched all leagues successfully.',
				response: result
			});

		} catch (err) {
			next({
				status: 500,
				message: err.message
			});
		}

	})();
});

apiRouter.get('/teams', (req, res, next) => {
	(async () => {
		try {
			const sqlQuery = 'SELECT team_id, team_name, founded FROM team ORDER BY team_id;';
			const params = [];

			const result = (await query(sqlQuery, params)).rows;

			res.header('Content-Type', 'application/json');
			res.status(200);
			res.json({
				status: 200,
				message: 'Fetched all teams successfully.',
				response: result
			});

		} catch (err) {
			next({
				status: 500,
				message: err.message
			});
		}

	})();
});

apiRouter.get('/players', (req, res, next) => {
	(async () => {
		try {
			const sqlQuery = 'SELECT player_id, player_first_name, player_last_name, date_of_birth, elo_rank FROM player ORDER BY player_id;';
			const params = [];

			const result = (await query(sqlQuery, params)).rows;

			res.header('Content-Type', 'application/json');
			res.status(200);
			res.json({
				status: 200,
				message: 'Fetched all players successfully.',
				response: result
			});

		} catch (err) {
			next({
				status: 500,
				message: err.message
			});
		}

	})();
});

apiRouter.get('/players/:playerId', (req, res, next) => {
	(async () => {
		try {
			const playerId = req.params.playerId;
			const sqlQuery = 'SELECT player_id, player_first_name, player_last_name, date_of_birth, elo_rank FROM player WHERE player_id = $1;';
			const params = [playerId];

			const result = (await query(sqlQuery, params)).rows;

			if (result.length === 0) {
				next({
					status: 404,
					message: `Player with ID ${playerId} does not exist.`
				});
			}

			res.header('Content-Type', 'application/json');
			res.status(200);
			res.json({
				status: 200,
				message: 'Fetched all players successfully.',
				response: result[0]
			});

		} catch (err) {
			next({
				status: 500,
				message: err.message
			});
		}

	})();
});

apiRouter.get('/openapi', (req, res, next) => {
	(async () => {
		try {
			res.header('Content-Type', 'application/json');
			res.status(200);
			res.json({
				status: 200,
				message: "OpenAPI specification fetched successfully.",
				response: openapi
			});


		} catch (err) {
			next({
				status: 500,
				message: err.message
			});
		}

	})();
});

apiRouter.post('/addNewPlayer', (req, res, next) => {
	(async () => {
		try {
			const body = req.body;

			if (!body.player_first_name || 
				!body.player_last_name || 
				!body.date_of_birth || 
				!body.elo_rank || 
				!body.team_id) {
					next({
						status: 400,
						message: "Missing player information."
					});
			}

			if (Number.isNaN(Date.parse(body.date_of_birth))) {
				next({
					status: 400,
					message: "Invalid date format."
				});
			}

			let sqlQuery = 'SELECT * FROM team WHERE team_id = $1;'
			let params = [body.team_id]

			const result = (await query(sqlQuery, params)).rowCount;

			if (result === 0) {
				next({
					status: 404,
					message: `Team with ID ${body.team_id} does not exist.`
				});
			}

			sqlQuery = 'INSERT INTO player (player_first_name, player_last_name, date_of_birth, elo_rank, team_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;';
			params = [
				body.player_first_name,
				body.player_last_name,
				body.date_of_birth,
				body.elo_rank,
				body.team_id,
			];
			
			let newPlayer = (await query(sqlQuery, params)).rows[0];
			newPlayer = {
				...newPlayer,
				date_of_birth: format(newPlayer.date_of_birth, 'yyyy-MM-dd')
			}
	
			res.header('Content-Type', 'application/json');
			res.status(201);
			res.json({
				status: 201,
				message: "Inserted new player successfully.",
				response: newPlayer
			});

		} catch (err) {
			next({
				status: 500,
				message: err.message
			});
		}

	})();
});

apiRouter.put('/updateTeam/:teamId', (req, res, next) => {
	(async () => {
		try {

			const teamId = req.params.teamId;
			const body = req.body;
	
			let sqlQuery = 'SELECT * FROM team WHERE team_id = $1;'
			let params = [teamId]
	
			const result = (await query(sqlQuery, params)).rowCount;
	
			if (result === 0) {
				next({
					status: 404,
					message: `Team with ID ${teamId} does not exist.`
				});
			}
	
			
			if (body.teamId) {
				next({
					status: 400,
					message: "Can not update team ID."
				});
			}
			
			if (body.founded && Number.isNaN(Date.parse(body.founded))) {
				next({
					status: 400,
					message: "Invalid date format."
				});
			}
			
			sqlQuery = 'UPDATE team SET '
			params = [];
	
			const keys = Object.keys(body);
			let i = 0;
			let counter = 1
	
			while (i < keys.length) {
				let value = body[keys[i]];
	
				if (i === 0 && value) {
					sqlQuery += `${keys[i]} = $${counter}`;
					params.push(value);
					counter++;
				} else if (value) {
					sqlQuery += `, ${keys[i]} = $${counter}`;
					params.push(value);
					counter++;
				}
	
				i++;
			}
	
			sqlQuery += ` WHERE team_id = $${counter};`
			params.push(teamId);
	
			await query(sqlQuery, params);
	
			res.header('Content-Type', 'application/json');
			res.status(200);
			res.json({
				status: 200,
				message: `Updated team with ID ${teamId} successfully.`,
				response: null
			});

		} catch (err) {
			next({
				status: 500,
				message: err.message
			});
		}

	})();
});

apiRouter.delete('/removePlayer/:playerId', (req, res, next) => {
	(async () => {
		try {
			const playerId = req.params.playerId;

			const sqlQuery = 'DELETE FROM player WHERE player_id = $1;'
			const params = [playerId];

			const result = await query(sqlQuery, params);

			if (result.rowCount === 0) {
				res.status(204);
				res.end();

				return;
			}

			res.header('Content-Type', 'application/json');
			res.status(200);
			res.json({
				status: 200,
				message: "Player deleted successfully.",
				response: null
			});

		} catch (err) {
			next({
				status: 500,
				message: err.message
			});
		}

	})();
});

// Error handling
apiRouter.use((err, req, res, next) => {
	res.header('Content-Type', 'application/json');
	res.status(err.status);
	res.json({
		status: err.status,
		message: err.message,
		response: null
	});
});

module.exports = apiRouter;
