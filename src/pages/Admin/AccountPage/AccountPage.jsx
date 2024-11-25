import React, {useEffect, useState} from 'react';

import {EditFilled, PlusOutlined} from '@ant-design/icons';
import {Button, Form, Input, message, Modal, Select, Space, Table, Tag, Tooltip} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {
	getAllUserSelector,
	getLoadingUserSelector,
	GetUserDetailSelector,
} from '../../../redux/selectors';
import {
	handleAdminRegister,
	handleRegisterDeliverer,
	handleStaffRegister,
} from '../../../redux/slices/userLoginSlice';
import {getAllUser} from '../../../redux/slices/userSlice';

const {Search} = Input;

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
	const [isManager, setIsManager] = useState();
	const [role, setRole] = useState();
	const [searchText, setSearchText] = useState('');

	const columns = [
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
							case 'customer_bronze':
								color = '#cd7f32';
								break;
							case 'customer_silver':
								color = '#c0c0c0';
								break;
							case 'customer_gold':
								color = '#ffd700';
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
							<Tag color={color} key={role?.Id}>
								{role.RoleName.toUpperCase()?.replace('_', ' ')}
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
					<Tooltip title="Xem Chi Tiết">
						<Button
							type="text"
							className="bg-primary"
							onClick={() => navigate(`/Accounts/${record.Id}`)}
						>
							<EditFilled />
						</Button>
					</Tooltip>
				</Space>
			),
		},
	];

	useEffect(() => {
		dispatch(getAllUser({current, size: pageSize, roleId: role, emailStr: searchText}));
	}, [current, pageSize, role, searchText]);

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
			dispatch(handleRegisterDeliverer({...value, fullName}))
				.unwrap()
				.then(() => {
					message.success('Tạo thành công tài khoản giao hàng!');
				})
				.catch((error) => {
					message.error(error?.data?.title || error?.detail);
				});
		} else if (role === 'manager') {
			dispatch(handleStaffRegister({...value, fullName, isManager: true}))
				.unwrap()
				.then(() => {
					message.success('Tạo thành công tài khoản quản lí!');
				})
				.catch((error) => {
					message.error(error?.data?.title || error?.detail);
				});
		} else if (role === 'staff') {
			dispatch(handleStaffRegister({...value, fullName, isManager: false}))
				.unwrap()
				.then(() => {
					message.success('Tạo thành công tài khoản nhân viên!');
				})
				.catch((error) => {
					message.error(error?.data?.title || error?.detail);
				});
		} else if (role === 'admin') {
			dispatch(handleAdminRegister({...value, fullName}))
				.unwrap()
				.then(() => {
					message.success('Tạo thành công tài khoản admin!');
				})
				.catch((error) => {
					message.error(error?.data?.title || error?.detail);
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

	return (
		<div className="mx-20 my-10">
			{/* <Filter filter={filter} handleStatusBtn={handleStatusBtn} active={active} /> */}
			<div>
				<div className="flex items-center justify-between">
					<div className="flex items-center my-5">
						<div className="flex items-center my-3 sm:my-5 ml-5">
							<p className="mr-3 text-sm sm:text-base">Tìm kiếm vai trò:</p>
						</div>

						<Space wrap className="">
							<Select
								// defaultValue=""
								style={{width: 200}}
								className="md:w-full"
								allowClear
								placeholder="CHỌN VAI TRÒ"
								onChange={handleRoleChange}
								options={[
									{value: '1', label: 'Khách Hàng'},
									{value: '2', label: 'Khách Hàng Hạng Đồng'},
									{value: '3', label: 'Khách Hàng Hạng Bạc'},
									{value: '4', label: 'Khách Hàng Hạng Vàng'},
									{value: '44', label: 'Nhân Viên Giao Hàng'},
									{value: '11', label: 'Nhân Viên'},
									{value: '22', label: 'Quản Lý'},
									{value: '33', label: 'Admin'},
								]}
							/>
							<div className="flex items-center my-3 sm:my-5 ml-5">
								<p className="mr-3 text-sm sm:text-base">Tìm kiếm email:</p>
							</div>
							<Search
								className="w-full sm:w-60"
								placeholder="Tìm theo email"
								allowClear
								onSearch={onSearch}
							/>
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
