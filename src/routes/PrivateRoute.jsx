import {message} from 'antd';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Navigate} from 'react-router-dom';
import Loading from '../components/Loading';
import {GetUserDetailSelector} from '../redux/selectors';
import {getUserDetail} from '../redux/slices/userLoginSlice';

const PrivateRoute = ({children, roles}) => {
	const userId = localStorage.getItem('userId');
	const userDetail = useSelector(GetUserDetailSelector);

	const dispatch = useDispatch();

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (userId) {
			dispatch(getUserDetail(userId)).finally(() => {
				setLoading(false);
			});
		} else {
			setLoading(false);
		}
	}, [dispatch, userId]);

	if (loading) {
		return <Loading />;
	}

	// Kiểm tra xem người dùng đã đăng nhập chưa
	if (
		!userId ||
		userId === 0 ||
		!userDetail ||
		!userDetail.Roles ||
		userDetail.Roles.length === 0
	) {
		console.log('Private route redirect: User not logged in');
		message.error('Vui Lòng Đăng Nhập!');
		return <Navigate to="/login" />;
	}

	// Kiểm tra xem userDetail có tồn tại không
	if (!userDetail || !userDetail.Roles || userDetail.Roles.length === 0) {
		console.log('Private route redirect: User roles not available');
		message.error('Vai trò người dùng không có sẵn!');
		return <Navigate to="/login" />;
	}

	// Kiểm tra xem người dùng có ít nhất một vai trò phù hợp không
	const hasAccess = userDetail.Roles.some((role) => roles.includes(role.RoleName));

	console.log(hasAccess);
	if (!hasAccess) {
		console.log('Private route redirect: Access denied');
		message.error('Bạn không có quyền truy cập vào trang này!');
		return <Navigate to="/login" />;
	}

	// Nếu có quyền, cho phép truy cập vào children
	return <>{children}</>;
};
export default PrivateRoute;
