import React, {useEffect, useState} from 'react';
import {Information} from './Left/Information';
import {EditInfo} from './Right/EditInfo';
import {useDispatch, useSelector} from 'react-redux';
import {
	getUserAccountDetail,
	handleAddRole,
	handleBanAccount,
	handleRemoveRole,
	handleUpdateAccount,
} from '../../../../redux/slices/userSlice';
import {useNavigate, useParams} from 'react-router-dom';
import {getDetailUserSelector, GetUserDetailSelector} from '../../../../redux/selectors';
import {Button, Modal, Select, message, Spin} from 'antd';
import Loading from '../../../../components/Loading';

const {Option} = Select;

const AccountDetail = () => {
	const {id} = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const userDetail = useSelector(getDetailUserSelector);
	const userDetailCurrent = useSelector(GetUserDetailSelector);

	const [editing, setEditing] = useState(false);
	const [user, setUser] = useState({});
	const [selectedOption, setSelectedOption] = useState(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isModalRemoveRoleVisible, setIsModalRemoveRoleVisible] = useState(false);
	const [userId, setUserId] = useState('');
	const [userInfo, setUserInfo] = useState({
		Email: userDetail?.Email || '',
		FirstName: userDetail?.FirstName || '',
		LastName: userDetail?.LastName || '',
		PhoneNumber: userDetail?.PhoneNumber || '',
		Id: userDetail?.Id || '',
		Addresses: userDetail?.Addresses || [],
	});
	const [addressChanges, setAddressChanges] = useState({
		addedAddress: [],
		updatedAddress: {},
		removedAddressId: [],
	});
	const [roleLevel, setRoleLevel] = useState(0);
	const [loading, setLoading] = useState(true); // Add loading state

	useEffect(() => {
		if (id) {
			// Reset state on id change to avoid mixing data between profiles
			setUserInfo({
				Email: '',
				FirstName: '',
				LastName: '',
				PhoneNumber: '',
				Id: '',
				Addresses: [],
			});
			setUser({}); // Clear previous user data
			setLoading(true); // Show loading indicator when fetching new data

			dispatch(getUserAccountDetail(id)) // Fetch new user's data based on id
				.then(() => setLoading(false)) // Set loading to false after data is fetched
				.catch(() => setLoading(false)); // Set loading to false in case of error
		}
	}, [dispatch, id]); // Only trigger when the id changes

	useEffect(() => {
		if (userDetail) {
			setUser(userDetail); // Set user data when it's fetched
			setUserInfo({
				Email: userDetail?.Email || '',
				FirstName: userDetail?.FirstName || '',
				LastName: userDetail?.LastName || '',
				PhoneNumber: userDetail?.PhoneNumber || '',
				Id: userDetail?.Id || '',
				Addresses: userDetail?.Addresses || [],
			});
		}
	}, [userDetail]);
	useEffect(() => {
		if (userDetailCurrent?.Roles) {
			const roles = userDetailCurrent.Roles.map((role) => role?.RoleName);
			if (roles.includes('admin')) {
				setRoleLevel(5);
			} else if (roles.includes('manager')) {
				setRoleLevel(4);
			} else if (roles.includes('staff')) {
				setRoleLevel(3);
			}
		}
	}, [userDetailCurrent]);

	const handleEditing = () => {
		setEditing(!editing);
	};
	const preparePayload = () => {
		const {addedAddress, updatedAddress, removedAddressId, newDefaultAddressId} =
			addressChanges;

		const filteredAddedAddress = addedAddress
			.filter((addr) => addr && addr.province && addr.district && addr.ward && addr.street)
			.map((addr) => ({
				province: addr.province,
				district: addr.district,
				ward: addr.ward,
				street: addr.street,
			}));

		const payload = {
			changedFullName: {
				firstName: userInfo?.FirstName?.trim(),
				lastName: userInfo?.LastName?.trim(),
			},
			changedAddress: {},
			newDefaultAddressId: newDefaultAddressId || userInfo?.newDefaultAddressId || '', // Use addressChanges as fallback
			newPhoneNumber: userInfo?.PhoneNumber?.trim(),
		};

		if (filteredAddedAddress.length > 0) {
			payload.changedAddress.addedAddress = filteredAddedAddress;
		}

		if (Object.keys(updatedAddress).length > 0) {
			payload.changedAddress.updatedAddress = updatedAddress;
		}

		if (removedAddressId.length > 0) {
			payload.changedAddress.removedAddressId = removedAddressId;
		}

		if (Object.keys(payload.changedAddress).length === 0) {
			delete payload.changedAddress;
		}

		return payload;
	};

	const handleUpdate = async () => {
		const payload = preparePayload();

		await dispatch(handleUpdateAccount({id: userInfo.Id, payload}))
			.unwrap()
			.then(() => {
				message.success('Cập nhật thông tin tài khoản thành công!');
				setEditing(false); // Disable editing mode
			})
			.catch((error) => {
				message.error(error?.data?.detail || error?.detail || 'Đã xảy ra lỗi!');
			});
		await dispatch(getUserAccountDetail(id));
	};

	const onChange = (e) => {
		const {value, name} = e.target;
		setUserInfo((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const showModal = (id) => {
		setIsModalVisible(true);
		setUserId(id);
	};

	const showRemoveModal = (id) => {
		setIsModalRemoveRoleVisible(true);
		setUserId(id);
	};

	const handleChange = (value) => {
		setSelectedOption(value);
	};

	const handleOk = async () => {
		const accId = {
			value: userId,
		};

		const roleId = {
			value: selectedOption,
		};

		await dispatch(handleAddRole({accId, roleId}))
			.unwrap()
			.then(() => {
				message.success('Thêm vai trò thành công!');
				setIsModalVisible(false);
			})
			.catch((error) => {
				message.error(error?.data?.detail || error?.detail);
			});
		await dispatch(getUserAccountDetail(id));
	};
	const handleRemove = async () => {
		const accId = {
			value: userId,
		};

		const roleId = {
			value: selectedOption,
		};

		await dispatch(handleRemoveRole({accId, roleId}))
			.unwrap()
			.then(() => {
				message.success('Xóa vai trò thành công!');
				setIsModalRemoveRoleVisible(false);
			})
			.catch((error) => {
				message.error(error?.data?.detail || error?.detail);
			});

		await dispatch(getUserAccountDetail(id));
		setIsModalVisible(false);
	};

	const handleBan = async () => {
		await dispatch(handleBanAccount(user?.IdentityId))
			.unwrap()
			.then(() => {
				message.success(`Cấm tài khoản ${user.Id} thành công`);
				// form.resetFields();
			})
			.catch((error) => {
				message.error(error?.data?.detail || error?.detail);
			});
		await dispatch(getUserAccountDetail(id));
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};
	const handleRemoveCancel = () => {
		setIsModalRemoveRoleVisible(false);
	};

	if (loading) {
		return <Loading />;
	}
	return (
		<div>
			<div className="">
				<Button type="text" className="bg-primary" onClick={() => navigate('/accounts')}>
					Quay lại
				</Button>
				<div className="flex w-full">
					<div style={{width: '60%'}}>
						<EditInfo
							user={user}
							editing={editing}
							onChange={onChange}
							userInfo={userInfo}
							userDetail={userDetail}
							addressChanges={addressChanges}
							setAddressChanges={setAddressChanges}
							setUserInfo={setUserInfo}
						/>
					</div>
					<div style={{width: '40%'}}>
						<Information
							user={user}
							handleEditing={handleEditing}
							editing={editing}
							handleUpdate={handleUpdate}
							showModal={showModal}
							showRemoveModal={showRemoveModal}
							handleBanAccount={handleBan}
						/>
					</div>
				</div>
			</div>
			<Modal
				title="Chọn Vai Trò"
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<Select placeholder="Chọn" style={{width: '100%'}} onChange={handleChange}>
					{roleLevel >= 5 && <Option value={33}>Admin</Option>}
					{roleLevel >= 4 && <Option value={22}>Quản Lý</Option>}
					{roleLevel >= 3 && <Option value={11}>Nhân Viên</Option>}
					{roleLevel >= 3 && <Option value={44}>Nhân Viên Giao Hàng</Option>}
					{roleLevel >= 3 && <Option value={1}>Khách Hàng</Option>}
					{roleLevel >= 3 && <Option value={2}>Thành Viên Đồng</Option>}
					{roleLevel >= 3 && <Option value={3}>Thành Viên Bạc</Option>}
					{roleLevel >= 3 && <Option value={4}>Thành Viên Vàng</Option>}
				</Select>
			</Modal>

			<Modal
				title="Chọn Vai Trò"
				visible={isModalRemoveRoleVisible}
				onOk={handleRemove}
				onCancel={handleRemoveCancel}
			>
				<Select placeholder="Chọn" style={{width: '100%'}} onChange={handleChange}>
					{userDetail?.Roles.map((role) => (
						<Option key={role.Id} value={role.Id}>
							{role.RoleName.replace('_', ' ')}
						</Option>
					))}
				</Select>
			</Modal>
		</div>
	);
};

export default AccountDetail;
