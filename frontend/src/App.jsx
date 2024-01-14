import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import AppLayout from './components/AppLayout';
import UserProfile from './components/UserProfile';
import ErrorPage401 from './components/error/ErrorPage401';
import ErrorPage404 from './components/error/ErrorPage404';
import './App.css';

function App() {
	const host = import.meta.env.VITE_SERVER_HOST;

	const [data, setData] = useState([]);
	const [filterField, setFilterField] = useState('*');
	const [filterValue, setFilterValue] = useState('');

	function onFilterSearchSubmit(elements) {
		const filterFieldFormValue = elements.filterField.value;
		const filterValueFormValue = elements.filterValue.value;

		const requestBody = {
			filterField: filterFieldFormValue,
			filterValue: filterValueFormValue
		};

		const filterData = async () => {
			const response = await fetch(`${host}/data`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(requestBody)
			});

			if (response.ok) {
				const body = await response.json();

				setData(body.data);
				setFilterField(filterFieldFormValue);
				setFilterValue(filterValueFormValue);
			}
		};

		filterData();
	}

	useEffect(() => {
		(async () => {
			const requestBody = {
				filterField: '*',
				filterValue: ''
			};

			const response = await fetch(`${host}/data`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(requestBody)
			});

			if (response.ok) {
				const body = await response.json();

				setData(body.data);
			}
		})();
	}, []);

	return (
		<>
			<Routes>
				<Route path='/' element={<AppLayout />}>
					<Route
						index
						element={
							<Home
								filterField={filterField}
								filterValue={filterValue}
								onFilterSearchSubmit={onFilterSearchSubmit}
								data={data}
							/>
						}
					/>
					<Route path='/profile' element={<UserProfile />} />
				</Route>
				<Route path='/unauthorized' element={<ErrorPage401 />} />
				<Route path='*' element={<ErrorPage404 />}/>
			</Routes>
		</>
	);
}

export default App;
