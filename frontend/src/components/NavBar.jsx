import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

function NavBar() {
	const { isAuthenticated, isLoading, loginWithRedirect, logout } =
		useAuth0();

	return (
		<nav className='navbar-container'>
			<ul className='navbar'>
				<li>
					<Link to='/'>Home</Link>
				</li>
				{!isAuthenticated ? (
					<>
						<li>
							<a onClick={() => loginWithRedirect()}>
								Log In
							</a>
						</li>
					</>
				) : (
					!isLoading && (
						<>
							<li>
								<Link to='/profile'>Profile</Link>
							</li>
							<li>
								<a href='http://localhost:3000/refreshData'>Refresh Data</a>
							</li>
							<li>
								<a
									onClick={() =>
										logout({
											logoutParams: {
												returnTo: window.location.origin
											}
										})
									}
								>
									Log Out
								</a>
							</li>
						</>
					)
				)}
			</ul>
		</nav>
	);
}

export default NavBar;
