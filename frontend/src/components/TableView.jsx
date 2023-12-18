import TableRow from './TableRow';

function TableView({ data }) {
	return (
		<table>
			<thead>
				<tr>
					<th>Player ID</th>
					<th>First Name</th>
					<th>Last Name</th>
					<th>Date Of Birth</th>
					<th>Elo Rank</th>
					<th>Team ID</th>
					<th>Team Name</th>
					<th>Founded</th>
					<th>League ID</th>
					<th>League Rank</th>
					<th>League Name</th>
				</tr>
			</thead>
			<tbody>
				{data.map((record) => (
					<TableRow record={record} key={record.player_id} />
				))}
			</tbody>
		</table>
	);
}

export default TableView;
