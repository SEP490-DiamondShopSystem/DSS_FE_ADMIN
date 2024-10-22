import React, {useEffect, useState} from 'react';
import {Filter} from '../../../components/Filter';
import {CalendarOutlined, EditFilled} from '@ant-design/icons';
import {Button, DatePicker, Input, Space, Table, Tag} from 'antd';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {getAllOrderSelector, loadingOrderSelector} from '../../../redux/selectors';
import {getAllOrder} from '../../../redux/slices/orderSlice';
import {enums} from '../../../utils/constant';
import {convertToVietnamDate, formatPrice} from '../../../utils';

const {Search} = Input;
const {RangePicker} = DatePicker;

const statusList = [
	{name: 'Tất cả', value: 'all'},
	{name: 'Pending', value: 'Pending'},
	{name: 'Paid All', value: 'PaidAll'},
	{name: 'Deposited', value: 'Deposited'},
	{name: 'Refunding', value: 'Refunding'},
	{name: 'Refunded', value: 'Refunded'},
	// {name: 'Rejected', value: 'rejected'},
];

const getEnumKey = (enumObj, value) => {
	return enumObj
		? Object.keys(enumObj)
				.find((key) => enumObj[key] === value)
				?.replace('_', ' ')
		: '';
};

const mapAttributes = (data, attributes) => {
	return {
		id: data?.Id,
		orderTime: convertToVietnamDate(data?.CreatedDate),
		status: getEnumKey(attributes?.PaymentStatus, data?.PaymentStatus),
		email: null,
		totalAmount: formatPrice(data?.TotalPrice),
		customer: null,
		paymentMethod: null,
	};
};

// Sample data with email field
const dataSource = [
	{
		id: '001',
		orderTime: '24/09/2024',
		totalAmount: '$120.00',
		paymentMethod: 'Pay All',
		customer: 'John Doe',
		email: 'john.doe@example.com',
		status: 'accepted',
	},
	{
		id: '002',
		orderTime: '23/09/2024',
		totalAmount: '$85.00',
		paymentMethod: 'Online',
		customer: 'Jane Smith',
		email: 'jane.smith@example.com',
		status: 'pending',
	},
];

const OrderPage = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const orderList = useSelector(getAllOrderSelector);
	const loading = useSelector(loadingOrderSelector);

	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [activeStatus, setActiveStatus] = useState('all');
	const [searchText, setSearchText] = useState('');
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		dispatch(getAllOrder());
	}, []);

	console.log('orderList', orderList);
	console.log('orders', orders);

	useEffect(() => {
		if (orderList && enums) {
			// Map diamond attributes to more readable values
			const mappedData = orderList.map((order) => mapAttributes(order, enums));
			setOrders(mappedData);
		}
	}, [orderList, enums]);

	const columns = [
		{
			title: 'ID Đơn Hàng',
			dataIndex: 'id',
			key: 'id',
			align: 'center',
		},
		{
			title: 'Thời Gian Đặt Hàng',
			dataIndex: 'orderTime',
			key: 'orderTime',
			align: 'center',
		},
		{
			title: 'Giá',
			key: 'totalAmount',
			dataIndex: 'totalAmount',
			align: 'center',
		},
		{
			title: 'PT Thanh Toán',
			key: 'paymentMethod',
			dataIndex: 'paymentMethod',
			align: 'center',
		},
		{
			title: 'Khách Hàng',
			key: 'customer',
			dataIndex: 'customer',
			align: 'center',
		},
		{
			title: 'Email',
			key: 'email',
			dataIndex: 'email',
			align: 'center',
		},
		{
			title: 'Trạng Thái',
			key: 'status',
			dataIndex: 'status',
			align: 'center',
			render: (status) => {
				// Find status item from statusList
				const foundStatus = statusList.find((item) => item.value === status);
				let color = 'green';

				if (status === 'canceled' || status === 'rejected' || status === 'shipFailed') {
					color = 'volcano';
				} else if (status === 'refunded') {
					color = 'blue';
				} else if (status === 'deposited') {
					color = 'geekblue';
				} else if (status === 'paidAll') {
					color = 'purple';
				} else if (status === 'pending') {
					color = 'gold';
				} else if (status === 'refunding') {
					color = 'green';
				}

				return (
					<Tag color={color}>
						{foundStatus ? foundStatus.name.toUpperCase() : status.toUpperCase()}
					</Tag>
				);
			},
		},
		{
			title: '',
			key: 'action',
			align: 'center',
			render: (_, record) => (
				<Space size="middle">
					<Button type="primary" ghost onClick={() => navigate(`/orders/${record.id}`)}>
						<EditFilled />
					</Button>
				</Space>
			),
		},
	];
	const handleDateChange = (dates, dateStrings) => {
		setStartDate(dateStrings[0]);
		setEndDate(dateStrings[1]);
	};

	const handleStatusChange = (value) => {
		setActiveStatus(value);
		console.log(value);
	};

	const onSearch = (value) => {
		setSearchText(value);
	};

	const filteredDataSource = orders
		?.filter((item) => activeStatus === 'all' || item.status === activeStatus)
		.filter((item) => {
			const itemDate = new Date(item.orderTime.split('/').reverse().join('-'));
			const start = startDate ? new Date(startDate.split('/').reverse().join('-')) : null;
			const end = endDate ? new Date(endDate.split('/').reverse().join('-')) : null;
			return (!start || itemDate >= start) && (!end || itemDate <= end);
		})
		.filter((item) => item.email?.toLowerCase().includes(searchText.toLowerCase()));
	console.log('filteredDataSource', filteredDataSource);
	return (
		<div className="mx-20 my-10">
			<Filter
				filter={statusList}
				handleStatusBtn={handleStatusChange}
				active={activeStatus}
			/>
			<div className="flex items-center">
				<Space wrap>
					<div className="flex items-center my-5">
						<p className="mr-3">Tìm theo ngày:</p>
					</div>
					<div
						className="pl-2 flex items-center"
						style={{
							border: '1px solid #d9d9d9',
							borderRadius: '4px',
							width: '400px',
						}}
					>
						<span style={{marginRight: '10px', fontWeight: 'bold'}}>Từ</span>
						<span style={{marginRight: '10px'}}>→</span>
						<span style={{marginRight: '10px', fontWeight: 'bold'}}>Đến</span>
						<RangePicker
							format="DD/MM/YYYY"
							suffixIcon={<CalendarOutlined />}
							style={{border: 'none', width: '100%'}}
							onChange={handleDateChange}
						/>
					</div>
					<div className="flex items-center my-5 ml-10">
						<p className="mr-3">Tìm kiếm:</p>
						<Search
							className="w-60"
							placeholder="Tìm theo email"
							allowClear
							onSearch={onSearch}
						/>
					</div>
				</Space>
			</div>
			<div>
				<Table
					dataSource={orders}
					columns={columns}
					className="custom-table-header"
					pagination={{pageSize: 5}}
					loading={loading}
				/>
			</div>
		</div>
	);
};

export default OrderPage;
