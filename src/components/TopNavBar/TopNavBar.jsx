// TopNavbar.jsx

import React, {useState, useRef, useEffect} from 'react';
import styles from './TopNavBar.module.css'; // Import CSS module file for styling
import {BellOutlined} from '@ant-design/icons'; // Import icon for notification bell
import profileImage from './profileImage.jpg'; // Import a sample profile image for illustration
import {useDispatch} from 'react-redux';
import {message} from 'antd';
import {useNavigate} from 'react-router-dom';
import {userLoginSlice} from '../../redux/slices/userLoginSlice';
import {getLocalStorage, removeLocalStorage} from '../../utils/localstorage';
import {notifySuccess} from '../../utils/toast';

const TopNavbar = () => {
	const userLocal = getLocalStorage('user');
	const user = userLocal?.user;

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [showNotification, setShowNotification] = useState(false);
	const [showSignOutPopup, setShowSignOutPopup] = useState(false);
	const [showSignOutButton, setShowSignOutButton] = useState(false);
	const signOutRef = useRef(null);

	useEffect(() => {
		// Function to handle clicks outside the sign-out button
		const handleClickOutside = (event) => {
			if (signOutRef.current && !signOutRef.current.contains(event.target)) {
				setShowSignOutButton(false); // Hide the sign-out button
				setShowSignOutPopup(false); // Hide the confirmation popup
			}
		};

		// Add event listener to detect clicks outside the sign-out button
		document.addEventListener('mousedown', handleClickOutside);

		// Clean up event listener on unmount
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleBellClick = () => {
		setShowNotification(!showNotification);
	};

	const handleProfileClick = () => {
		setShowSignOutButton(true); // Display the sign-out button
	};

	const handleSignOut = () => {
		setShowSignOutPopup(true); // Show confirmation popup
		setShowSignOutButton(false); // Hide the sign-out button
	};

	const handleCancelSignOut = () => {
		setShowSignOutPopup(false); // Hide confirmation popup
		setShowSignOutButton(false); // Hide the sign-out button
	};

	const handleConfirmSignOut = () => {
		removeLocalStorage('user');
		dispatch(
			userLoginSlice.actions.logout({
				userId: '',
				userPhone: '',
				name: '',
				email: '',
				password: '',
				bio: '',
				avatar_url: '',
				gender: '',
				date_of_birth: '',
				role: '',
				accessToken: '',
				refreshToken: '',
				last_active_time: null,
				status: '',
			})
		);
		notifySuccess('Logout successful!');
		navigate('/');
	};

	return (
		<div className={styles.topNavbar}>
			<div className={styles.rightSection}>
				<div className={styles.notificationIconContainer} onClick={handleBellClick}>
					<BellOutlined className={styles.notificationIcon} />

					{showNotification && (
						<div className={styles.notificationDropdown}>
							{/* Notification items */}
						</div>
					)}
				</div>
				<div className={styles.profileContainer}>
					<img
						src={user?.avatar_url || profileImage}
						alt="Profile"
						className={styles.profileImage}
						onClick={handleProfileClick}
					/>
					<div className={styles.userInfo}>
						<span className={styles.userName}>{user?.name}</span>
						<span className={styles.userRole}>{user?.role}</span>
					</div>
					{showSignOutButton && (
						<button
							ref={signOutRef}
							className={styles.signOutButton}
							onClick={handleSignOut}
						>
							Sign Out
						</button>
					)}
					{showSignOutPopup && (
						<div className={styles.signOutPopup}>
							<span className={styles.signOutText}>
								Are you sure you want to sign out?
							</span>
							<div>
								<button
									className={styles.confirmButton}
									onClick={handleConfirmSignOut}
								>
									Yes
								</button>
								<button
									className={styles.cancelButton}
									onClick={handleCancelSignOut}
								>
									Cancel
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default TopNavbar;
