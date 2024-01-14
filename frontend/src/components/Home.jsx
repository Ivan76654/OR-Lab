import FilterForm from './FilterForm';
import TableDataDisplay from './TableDataDisplay';

function Home({ filterField, filterValue, onFilterSearchSubmit, data }) {
	return (
		<main className='main-content'>
			<FilterForm
				filterField={filterField}
				filterValue={filterValue}
				onFilterSearchSubmit={onFilterSearchSubmit}
			/>
			<TableDataDisplay data={data} />
		</main>
	);
}

export default Home;
