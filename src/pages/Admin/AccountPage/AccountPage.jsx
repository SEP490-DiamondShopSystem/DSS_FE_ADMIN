import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getAllUser, handleAddRole} from '../../../redux/slices/userSlice';
import {
	getAllUserSelector,
	getLoadingUserSelector,
	GetUserDetailSelector,
} from '../../../redux/selectors';
import {Button, Form, Input, message, Modal, Select, Space, Table, Tag, Tooltip} from 'antd';
import {DeleteFilled, EditFilled, PlusOutlined, UpCircleFilled} from '@ant-design/icons';
import {Filter} from '../../../components/Filter';
import {Search} from '@mui/icons-material';
import {useForm} from 'antd/es/form/Form';
import {
	handleAdminRegister,
	handleRegisterDeliverer,
	handleStaffRegister,
} from '../../../redux/slices/userLoginSlice';
import {useNavigate} from 'react-router-dom';

const AccountPage = () => {
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const userList = useSelector(getAllUserSelector);
	const loading = useSelector(getLoadingUserSelector);
	const userDetail = useSelector(GetUserDetailSelector);

	const [pageSize, setPageSize] = useState(100);
	const [current, setCurrent] = useState(0);
	const [users, setUsers] = useState();
	const [isModalAddVisible, setIsModalAddVisible] = useState(false);
	const [active, setActive] = useState('all');
	const [isManager, setIsManager] = useState();
	const [role, setRole] = useState();

	console.log('userDetail', userDetail);
	console.log('isManager', isManager);

	const columns = [
		// {
		// 	title: 'ID',
		// 	dataIndex: 'Id',
		// 	key: 'Id',
		// 	align: 'center',
		// },
		{
			title: 'Họ',
			dataIndex: 'FirstName',
			key: 'FirstName',
			align: 'center',
		},
		{
			title: 'Tên',
			key: 'LastName',
			dataIndex: 'LastName',
			align: 'center',
		},
		{
			title: 'Email',
			dataIndex: 'Email',
			key: 'Email',
			align: 'center',
			// render: (text) => <Image src={text} alt="product" style={{width: 50, height: 50}} />,
		},

		{
			title: 'Vai Trò',
			key: 'Roles',
			align: 'center',
			render: (_, record) => (
				<>
					{record.Roles.map((role) => {
						let color;
						switch (role.RoleName) {
							case 'customer':
								color = 'green';
								break;
							case 'admin':
								color = 'red';
								break;
							case 'staff':
								color = 'orange';
								break;
							case 'manager':
								color = 'blue';
								break;
							default:
								color = 'default';
						}
						return (
							<Tag color={color} key={role.Id}>
								{role.RoleName.toUpperCase()}
							</Tag>
						);
					})}
				</>
			),
		},

		{
			title: '',
			key: 'action',
			align: 'center',
			render: (_, record) => (
				<Space size="middle">
					{isManager || record.Id === userDetail.Id ? (
						<Tooltip title={`${isManager ? 'Xem Chi Tiết' : 'Sửa Thông Tin'} `}>
							<Button
								type="text"
								className="bg-primary"
								onClick={() => navigate(`/Accounts/${record.Id}`)}
							>
								<EditFilled />
							</Button>
						</Tooltip>
					) : null}
				</Space>
			),
		},
	];

	useEffect(() => {
		dispatch(getAllUser({current, size: pageSize, roleId: role}));
	}, [current, pageSize, role]);

	useEffect(() => {
		if (userDetail) {
			const isManager = userDetail?.Roles?.some((role) => role?.RoleName === 'manager');

			setIsManager(isManager);
		}
	}, [userDetail]);

	useEffect(() => {
		if (userList) {
			setUsers(userList?.Values);
		}
	}, [userList]);

	const openForm = () => {
		setIsModalAddVisible(true);
	};

	const onFinish = (value) => {
		console.log(value);
		const {firstName, lastName, role} = value;
		const fullName = {
			firstName,
			lastName,
		};
		if (role === 'deliverer') {
			dispatch(handleRegisterDeliverer({...value, fullName})).then((res) => {
				if (res.payload) {
					message.success('Tạo thành công tài khoản giao hàng!');
				} else {
					message.error('Vui lòng kiểm tra lại thông tin!');
				}
			});
		} else if (role === 'manager') {
			dispatch(handleStaffRegister({...value, fullName, isManager: true})).then((res) => {
				if (res.payload) {
					message.success('Tạo thành công tài khoản quản lí!');
				} else {
					message.error('Vui lòng kiểm tra lại thông tin!');
				}
			});
		} else if (role === 'staff') {
			dispatch(handleStaffRegister({...value, fullName, isManager: false})).then((res) => {
				if (res.payload) {
					message.success('Tạo thành công tài khoản nhân viên!');
				} else {
					message.error('Vui lòng kiểm tra lại thông tin!');
				}
			});
		} else if (role === 'admin') {
			dispatch(handleAdminRegister({...value, fullName})).then((res) => {
				if (res.payload) {
					message.success('Tạo thành công tài khoản admin!');
				} else {
					message.error('Vui lòng kiểm tra lại thông tin!');
				}
			});
		}
		form.resetFields();
		setIsModalAddVisible(false);
	};

	const handleAddCancel = () => {
		setIsModalAddVisible(false);
	};

	const handleCloseAdd = () => {
		form.resetFields();
		handleAddCancel();
	};

	const handleRoleChange = (value) => {
		setRole(value);
		console.log('role', value);
	};

	const onSearch = (value) => {
		setSearchText(value);
	};

	// const filter = [
	// 	{name: 'All', value: 'all'},
	// 	{name: 'Activated', value: 'activated'},
	// 	{name: 'Expired', value: 'expired'},
	// ];

	return (
		<div className="mx-20 my-10">
			{/* <Filter filter={filter} handleStatusBtn={handleStatusBtn} active={active} /> */}
			<div>
				<div className="flex items-center justify-between">
					<div className="flex items-center my-5">
						<p className="mr-3 font-semibold">Tìm kiếm</p>
						{/* <Search
							className="w-60"
							placeholder="input search text"
							allowClear
							onSearch={onSearch}
						/> */}
						<Space wrap className="">
							<Select
								// defaultValue=""
								style={{width: 160}}
								allowClear
								onChange={handleRoleChange}
								options={[
									{value: '', label: 'CHỌN VAI TRÒ'},
									{value: '1', label: 'Customer'},
									{value: '2', label: 'Customer Bronze'},
									{value: '3', label: 'Customer Silver'},
									{value: '4', label: 'Customer Gold'},
									{value: '44', label: 'Deliverer'},
									{value: '11', label: 'Staff'},
									{value: '22', label: 'Manager'},
									{value: '33', label: 'Admin'},
								]}
							/>
							{/* <Select
								defaultValue=""
								style={{width: 120}}
								allowClear
								// onChange={handleMetalChange}
								options={[
									{value: 'gold', label: 'Gold'},
									{value: 'silver', label: 'Silver'},
								]}
							/>
							<Select
								defaultValue=""
								style={{width: 120}}
								allowClear
								options={[
									{value: 'round', label: 'Round'},
									{value: 'princess', label: 'Princess'},
									{value: 'cushion', label: 'Cushion'},
									{value: 'oval', label: 'Oval'},
									{value: 'emerald', label: 'Emerald'},
									{value: 'pear', label: 'Pear'},
									{value: 'asscher', label: 'Asscher'},
									{value: 'heart', label: 'Heart'},
									{value: 'radiant', label: 'Radiant'},
									{value: 'marquise', label: 'Marquise'},
								]}
							/> */}
						</Space>
					</div>
					<div>
						<Button
							type="text"
							className="bg-primary"
							icon={<PlusOutlined />}
							onClick={openForm}
						>
							Thêm
						</Button>
					</div>
				</div>
				<div>
					<Table
						dataSource={users}
						columns={columns}
						pagination={{pageSize: 5, total: 100}}
						className="custom-table-header"
						loading={loading}
					/>
				</div>

				<Modal
					title="Thêm Tài Khoản"
					visible={isModalAddVisible}
					onOk={() => form.submit()}
					onCancel={handleCloseAdd}
				>
					<Form layout="vertical" form={form} onFinish={onFinish}>
						<Form.Item
							label="Họ"
							name="firstName"
							rules={[{required: true, message: 'Vui lòng nhập họ'}]}
						>
							<Input placeholder="Enter first name" />
						</Form.Item>

						<Form.Item
							label="Tên"
							name="lastName"
							rules={[{required: true, message: 'Vui lòng nhập tên'}]}
						>
							<Input placeholder="Enter last name" />
						</Form.Item>

						<Form.Item
							label="Email"
							name="email"
							rules={[
								{required: true, message: 'Vui lòng nhập email'},
								{type: 'email', message: 'Please enter a valid email'},
							]}
						>
							<Input placeholder="Enter email" />
						</Form.Item>

						<Form.Item
							label="Mật khẩu"
							name="password"
							rules={[{required: true, message: 'Vui lòng nhập mật khẩu'}]}
						>
							<Input.Password placeholder="Nhập mật khẩu" />
						</Form.Item>

						<Form.Item
							label="Vai trò"
							name="role"
							rules={[{required: true, message: 'Please select a role'}]}
						>
							<Select placeholder="Chọn vai trò" style={{width: '100%'}}>
								<Option value={'deliverer'}>Deliverer</Option>
								{/* <Option value={'customer'}>Customer</Option> */}
								<Option value={'staff'}>Staff</Option>
								<Option value={'manager'}>Manager</Option>
								<Option value={'admin'}>Admin</Option>
							</Select>
						</Form.Item>
					</Form>
				</Modal>
			</div>
		</div>
	);
};

export default AccountPage;
