import React, {useEffect, useRef, useState} from 'react';
import {BellOutlined} from '@ant-design/icons'; // Import icon for notification bell
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {getUserDetail, logout, userLoginSlice} from '../../redux/slices/userLoginSlice';
import {getLocalStorage, removeLocalStorage} from '../../utils/localstorage';
import {notifySuccess} from '../../utils/toast';
import profileImage from './profileImage.jpg'; // Import a sample profile image for illustration
import styles from './TopNavBar.module.css'; // Import CSS module file for styling
import {Button, message} from 'antd';
import {GetUserDetailSelector} from '../../redux/selectors';
import {getUserId} from '../GetUserId';

const TopNavbar = () => {
	function getLocalStorage(key) {
		return localStorage.getItem(key);
	}
	const userLocal = getLocalStorage('user');
	const user = userLocal ? JSON.parse(userLocal) : null;
	const userId = getUserId();
	const userDetail = useSelector(GetUserDetailSelector);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [showNotification, setShowNotification] = useState(false);
	const [showSignOutPopup, setShowSignOutPopup] = useState(false);
	const [showSignOutButton, setShowSignOutButton] = useState(false);
	const signOutRef = useRef(null);

	useEffect(() => {
		dispatch(getUserDetail(userId));
	}, []);

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
		dispatch(logout());
		message.success('Đăng xuất thành công!');
		navigate('/login');
	};

	const roles = userDetail?.Roles?.map((role) => role.RoleName);
	console.log(roles);
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
						<span className={styles.userName}>{user?.Name}</span>
						{roles &&
							roles?.map((role, i) => (
								<span key={i} className={styles.userRole}>
									{role}
								</span>
							))}
					</div>
					{showSignOutButton && (
						<Button
							ref={signOutRef}
							type="text"
							className={styles.signOutButton}
							onClick={handleSignOut}
						>
							Đăng Xuất
						</Button>
					)}
					{showSignOutPopup && (
						<div className={styles.signOutPopup}>
							<span className={styles.signOutText}>
								Bạn có chắc chắn muốn đăng xuất không?
							</span>
							<div className="flex items-center justify-around my-2">
								<Button danger className="" onClick={handleConfirmSignOut}>
									Đăng xuất
								</Button>
								<Button
									type="text"
									className="text-lightGray1 border border-lightGray1"
									onClick={handleCancelSignOut}
								>
									Hủy bỏ
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