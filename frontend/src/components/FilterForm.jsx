function FilterForm() {

	return (
		<section className='filter-form-section'>
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
				<input name='filterValue' type='text' placeholder='value'></input>
				<button type='submit'>Search</button>
			</form>
		</section>
	);
}

export default FilterForm;
