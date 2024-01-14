import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
	const { user, isAuthenticated } = useAuth0();
	const navigate = useNavigate();

	console.log(user);

	useEffect(() => {
		if (!isAuthenticated) navigate('/unauthorized');
	}, []);

	return (
		<main className='main-content'>
			<ul>
				<li><img src={user.picture} alt='No image'></img></li>
				<li><span className='user-field-label'>Name: </span> {user.name ? user.name : '-'}</li>
				<li><span className='user-field-label'>Nickname: </span> {user.nickname ? user.nickname : '-'}</li>
				<li><span className='user-field-label'>E-mail: </span> {user.email ? user.email : '-'}</li>
			</ul>
		</main>
	);
}

export default UserProfile;
