import React from 'react';
import {useSelector} from 'react-redux';
import {Navigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {getUserSelector} from '../redux/selectors';

const PrivateRoute = ({children, roles}) => {
	const userSelector = useSelector(getUserSelector);
	const userLocal = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'));

	const userRef = userLocal || userSelector;

	if (!userRef || userRef.role === '') {
		console.log('Private route redirect');
		console.log('userRef', userRef);
		toast.error('Please login!');
		return <Navigate to="/" />;
	}

	// Kiểm tra xem người dùng có vai trò phù hợp không
	if (roles.includes(userRef.role)) {
		console.log('Private route redirect');
		return <Navigate to="/permission-denied" />;
	}

	return <>{children}</>;
};

export default PrivateRoute;
