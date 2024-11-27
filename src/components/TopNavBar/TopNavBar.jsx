import React, { useEffect, useRef, useState } from 'react';
import { BellOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserDetail, logout } from '../../redux/slices/userLoginSlice';
import profileImage from './profileImage.jpg';
import styles from './TopNavBar.module.css';
import { Button, message } from 'antd';

const TopNavbar = () => {
	const userLocal = localStorage.getItem('user');
	const user = userLocal ? JSON.parse(userLocal) : null;
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [showNotification, setShowNotification] = useState(false);
	const [showSignOutPopup, setShowSignOutPopup] = useState(false);
	const signOutRef = useRef(null);

	useEffect(() => {
		dispatch(getUserDetail(user?.id));
	}, [dispatch, user]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (signOutRef.current && !signOutRef.current.contains(event.target)) {
				setShowSignOutPopup(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleConfirmSignOut = () => {
		dispatch(logout());
		message.success('Logged out successfully!');
		navigate('/login');
	};

	return (
		<div className={styles.topNavbar}>
			<div className={styles.logo}></div>
			<div className={styles.rightSection}>
				<div
					className={styles.notificationIconContainer}
					onClick={() => setShowNotification(!showNotification)}
				>
					<BellOutlined className={styles.notificationIcon} />
					{showNotification && (
						<div className={styles.notificationDropdown}>
							<p>No new notifications</p>
						</div>
					)}
				</div>
				<div className={styles.profileContainer}>
					<img
						src={user?.avatar_url || profileImage}
						alt="Profile"
						className={styles.profileImage}
						onClick={() => setShowSignOutPopup(!showSignOutPopup)}
					/>
					{showSignOutPopup && (
						<div ref={signOutRef} className={styles.signOutPopup}>
							<p className={styles.signOutText}>
								Are you sure you want to log out?
							</p>
							<div>
								<Button
									className={styles.confirmButton}
									onClick={handleConfirmSignOut}
								>
									Log Out
								</Button>
								<Button
									className={styles.cancelButton}
									onClick={() => setShowSignOutPopup(false)}
								>
									Cancel
								</Button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default TopNavbar;
