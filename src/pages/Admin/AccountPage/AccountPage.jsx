import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getAllUser, handleAddRole} from '../../../redux/slices/userSlice';
import {
	getAllUserSelector,
	getLoadingUserSelector,
	GetUserDetailSelector,
} from '../../../redux/selectors';
import {Button, message, Modal, Select, Space, Table, Tooltip} from 'antd';
import {DeleteFilled, EditFilled, UpCircleFilled} from '@ant-design/icons';

const AccountPage = () => {
	const dispatch = useDispatch();
	const userList = useSelector(getAllUserSelector);
	const loading = useSelector(getLoadingUserSelector);
	const userDetail = useSelector(GetUserDetailSelector);

	const [pageSize, setPageSize] = useState(100);
	const [current, setCurrent] = useState(0);
	const [users, setUsers] = useState();
	const [userId, setUserId] = useState('');
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedOption, setSelectedOption] = useState(null);

	const columns = [
		{
			title: 'ID',
			dataIndex: 'Id',
			key: 'Id',
			align: 'center',
		},
		{
			title: 'FirstName',
			dataIndex: 'FirstName',
			key: 'FirstName',
			align: 'center',
		},
		{
			title: 'LastName',
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

		// {
		// 	title: 'SKU',
		// 	key: 'sku',
		// 	dataIndex: 'sku',
		// 	align: 'center',
		// },
		// {
		// 	title: 'Status',
		// 	key: 'status',
		// 	dataIndex: 'status',
		// 	align: 'center',
		// 	render: (status) => {
		// 		let color = status.length > 5 ? 'geekblue' : 'green';
		// 		if (status === 'Expired') {
		// 			color = 'volcano';
		// 		}
		// 		return <Tag color={color}>{status.toUpperCase()}</Tag>;
		// 	},
		// },
		// {
		// 	title: 'Price',
		// 	key: 'price',
		// 	dataIndex: 'price',
		// 	align: 'center',
		// },
		{
			title: 'Action',
			key: 'action',
			align: 'center',
			render: (_, record) => (
				<Space size="middle">
					<Tooltip title={'Thêm vai trò'}>
						<Button type="primary" ghost onClick={() => showModal(record.Id)}>
							<UpCircleFilled />
						</Button>
					</Tooltip>
					<Button danger>
						<DeleteFilled />
					</Button>
				</Space>
			),
		},
	];

	useEffect(() => {
		dispatch(getAllUser({current, size: pageSize}));
	}, []);

	useEffect(() => {
		if (userList) {
			setUsers(userList?.Values);
		}
	}, [userList]);

	const showModal = (id) => {
		setIsModalVisible(true);
		setUserId(id);
	};

	const handleOk = () => {
		const accId = {
			value: userId,
		};

		const roleId = {
			value: selectedOption,
		};

		dispatch(handleAddRole({accId, roleId})).then((res) => {
			if (res.payload) {
				message.error('Thêm vai trò thành công!');
			} else {
				message.error('!!!');
			}
		});
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const handleChange = (value) => {
		setSelectedOption(value);
	};

	console.log('selectedOption', selectedOption);
	console.log('userId', userId);

	return (
		<div>
			<Table
				dataSource={users}
				columns={columns}
				pagination={{pageSize: 5, total: 100}}
				className="custom-table-header"
				loading={loading}
			/>
			<Modal
				title="Select an Option"
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<Select
					placeholder="Select an option"
					style={{width: '100%'}}
					onChange={handleChange}
				>
					<Option value={44}>Deliverer</Option>
					<Option value={1}>Customer</Option>
					<Option value={11}>Staff</Option>
					<Option value={22}>Manager</Option>
					<Option value={33}>Admin</Option>
				</Select>
			</Modal>
		</div>
	);
};

export default AccountPage;
