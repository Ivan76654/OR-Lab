function TableRow({ record }) {
	return (
		<tr>
			<td>{record.player_id}</td>
			<td>{record.player_first_name}</td>
			<td>{record.player_last_name}</td>
			<td>{record.date_of_birth}</td>
			<td>{record.elo_rank}</td>
			<td>{record.team_id}</td>
			<td>{record.team_name}</td>
			<td>{record.founded}</td>
			<td>{record.league_id}</td>
			<td>{record.league_rank}</td>
			<td>{record.league_name}</td>
		</tr>
	);
}

export default TableRow;
