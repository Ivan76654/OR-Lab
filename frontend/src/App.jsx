import { useEffect, useState } from 'react';
import './App.css';
import FilterForm from './components/FilterForm';
import Header from './components/Header';
import TableDataDisplay from './components/TableDataDisplay';

function App() {
	const host = 'http://localhost:3000';

	const [data, setData] = useState([]);

	useEffect(() => {
		(async () =>{
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
				<FilterForm />
				<TableDataDisplay data={data} />
			</main>
		</>
	);
}

export default App;
