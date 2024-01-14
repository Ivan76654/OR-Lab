import ErrorDisplay from './ErrorDisplay';

function ErrorPage401() {
	return (
		<ErrorDisplay
			errorMessage='Error 401: Unauthorized'
			actionDescription='You need to be logged in to access this page!'
		/>
	);
}

export default ErrorPage401;
