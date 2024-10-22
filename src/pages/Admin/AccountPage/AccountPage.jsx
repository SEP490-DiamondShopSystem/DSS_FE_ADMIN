import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getAllUser} from '../../../redux/slices/userSlice';
import {
	getAllUserSelector,
	getLoadingUserSelector,
	GetUserDetailSelector,
} from '../../../redux/selectors';
import {Button, Space, Table} from 'antd';
import {DeleteFilled, EditFilled} from '@ant-design/icons';

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
				<Button type="primary" ghost>
					<EditFilled />
				</Button>
				<Button danger>
					<DeleteFilled />
				</Button>
			</Space>
		),
	},
];

const AccountPage = () => {
	const dispatch = useDispatch();
	const userList = useSelector(getAllUserSelector);
	const loading = useSelector(getLoadingUserSelector);
	const userDetail = useSelector(GetUserDetailSelector);

	const [users, setUsers] = useState();

	useEffect(() => {
		dispatch(getAllUser());
	}, []);

	useEffect(() => {
		if (userList) {
			setUsers(userList?.Values);
		}
	}, [userList]);

	console.log('users', users);
	console.log('userDetail', userDetail);

	return (
		<div>
			<Table
				dataSource={users}
				columns={columns}
				pagination={{pageSize: 5, total: 10}}
				className="custom-table-header"
				loading={loading}
			/>
		</div>
	);
};

export default AccountPage;
