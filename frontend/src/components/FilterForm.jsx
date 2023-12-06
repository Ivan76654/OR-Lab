import FileSaver from 'file-saver';

function FilterForm({ filterField, filterValue, onFilterSearchSubmit }) {
	const host = import.meta.env.VITE_SERVER_HOST;

	async function downloadCSV(e) {
		e.preventDefault();

		const requestBody = {
			filterField,
			filterValue
		}

		const response = await fetch(`${host}/download/csv`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(requestBody)
		});

		if (response.ok) {
			const csvBlob = await response.blob();

			FileSaver.saveAs(csvBlob, `data.csv`);
		}

	}

	async function downloadJSON(e) {
		e.preventDefault();
	}

	function handleSearchSubmit(e) {
		e.preventDefault();
		onFilterSearchSubmit(e.target.elements);
	}

	return (
		<section className='filter-form-section'>
			<div className='filter-form-container'>
				<form className='filter-form' onSubmit={handleSearchSubmit}>
					<select id='filterField' name='filterField'>
						<option value='*'>All Columns</option>
						<option value='player_id'>Player ID</option>
						<option value='player_first_name'>First Name</option>
						<option value='player_last_name'>Last Name</option>
						<option value='date_of_birth'>Date Of Birth</option>
						<option value='elo_rank'>Elo Rank</option>
						<option value='team_id'>Team ID</option>
						<option value='team_name'>Team Name</option>
						<option value='founded'>Founded</option>
						<option value='league_id'>League ID</option>
						<option value='league_rank'>League Rank</option>
						<option value='number_of_teams'>Number Of Teams</option>
					</select>
					<input
						id='filterValue'
						name='filterValue'
						type='text'
						placeholder='Filter value'
					></input>
					<button type='submit'>Search</button>
				</form>
			</div>
			<div className='export-links-container'>
				<ul className='export-links-list'>
					<li>
						<a onClick={downloadCSV}>CSV</a>
					</li>
					<li>
						<a onClick={downloadJSON}>JSON</a>
					</li>
				</ul>
			</div>
		</section>
	);
}

export default FilterForm;
