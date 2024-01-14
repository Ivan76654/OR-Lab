import { useNavigate } from 'react-router-dom';


function ErrorDisplay({ errorMessage, actionDescription }) {
	const navigate = useNavigate();

	return (
		<main className='error-content'>
			<h1>{errorMessage}</h1>
			{actionDescription && (
				<p className='action-description'>{actionDescription}</p>
			)}
			<a onClick={() => navigate(-1)}>Go back</a>
		</main>
	);
}

export default ErrorDisplay;
