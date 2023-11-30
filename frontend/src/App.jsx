import { useEffect, useState } from 'react';
import './App.css';
import FilterForm from './components/FilterForm';
import Header from './components/Header';
import TableDataDisplay from './components/TableDataDisplay';

function App() {
	const host = import.meta.env.VITE_SERVER_HOST;

	const [data, setData] = useState([]);
	const [filterField, setFilterField] = useState('');
	const [filterValue, setFilterValue] = useState('');

	function onFilterSearchSubmit(elements) {
		const filterFieldFormValue = elements.filterField.value;
		const filterValueFormValue = elements.filterValue.value;

		const requestBody = {
			filterField: filterFieldFormValue,
			filterValue: filterValueFormValue
		}

		const filterData = async () => {
			const response = await fetch(`${host}/filter`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody)
			});

			if (response.ok) {
				const body = await response.json();

				setData(body.data);
				setFilterField(filterFieldFormValue);
				setFilterValue(filterValueFormValue);
			}

		}

		if (!filterValueFormValue)
			return;

		filterData();
	}

	useEffect(() => {
		(async () => {
			const response = await fetch(`${host}/`);

			if (response.ok) {
				const body = await response.json();

				setData(body.data);
			}
		})();
	}, []);

	return (
		<>
			<Header />
			<main>
				<FilterForm
					filterField={filterField}
					filterValue={filterValue}
					onFilterSearchSubmit={onFilterSearchSubmit}
				/>
				<TableDataDisplay data={data} />
			</main>
		</>
	);
}

export default App;
