import TableView from './TableView';

function TableDataDisplay({ data }) {

	return (
		<section>
			{ data.length > 0 ? (
				<TableView data={data} />
			) : (
				<p>Nothing to display</p>
			)}
		</section>
	);
}

export default TableDataDisplay;
