import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

const authConfig = {
	domain: import.meta.env.VITE_AUTH0_DOMAIN,
	clientId: import.meta.env.VITE_AUTH0_CLIENT_ID
};

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<BrowserRouter>
			<Auth0Provider
				domain={authConfig.domain}
				clientId={authConfig.clientId}
				authorizationParams={{
					redirect_uri: window.location.origin
				}}
			>
				<App />
			</Auth0Provider>
		</BrowserRouter>
	</React.StrictMode>
);
