function FilterForm() {
	function downloadCSV(e) {
		e.preventDefault();

	}

	function downloadJSON(e) {
		e.preventDefault();
	}

	return (
		<section className='filter-form-section'>
			<div className='filter-form-container'>
				<form className='filter-form'>
					<select id='filterField' name='field'>
						<option value='all'>*</option>
						<option value='player_id'>Player ID</option>
						<option value='first_name'>First Name</option>
						<option value='last_name'>Last Name</option>
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
						name='filterValue'
						type='text'
						placeholder='value'
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
