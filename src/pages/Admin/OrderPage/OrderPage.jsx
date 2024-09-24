import React, {useState} from 'react';
import {Filter} from '../../../components/Filter';
import {CalendarOutlined, EditFilled} from '@ant-design/icons';
import {Button, DatePicker, Input, Space, Table, Tag} from 'antd';
import {useNavigate} from 'react-router-dom';

const {Search} = Input;
const {RangePicker} = DatePicker;

const statusList = [
	{name: 'Tất cả', value: 'all'},
	{name: 'Chờ TToán', value: 'pendingPayment'},
	{name: 'Chờ XN', value: 'pendingConfirmation'},
	{name: 'Đã xác nhận', value: 'confirmed'},
	{name: 'Đã hủy', value: 'canceled'},
	{name: 'Từ chối', value: 'rejected'},
	{name: 'Đang VC', value: 'shipping'},
	{name: 'Đã VChuyển', value: 'shipped'},
	{name: 'VC Thất bại', value: 'shipFailed'},
];

// Sample data with email field
const dataSource = [
	{
		id: '001',
		orderTime: '24/09/2024',
		totalAmount: '$120.00',
		paymentMethod: 'Credit Card',
		customer: 'John Doe',
		email: 'john.doe@example.com',
		status: 'confirmed',
	},
	{
		id: '002',
		orderTime: '23/09/2024',
		totalAmount: '$85.00',
		paymentMethod: 'PayPal',
		customer: 'Jane Smith',
		email: 'jane.smith@example.com',
		status: 'pendingPayment',
	},
	// Add other data entries as needed
];

const OrderPage = () => {
	const navigate = useNavigate();
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [activeStatus, setActiveStatus] = useState('all');
	const [searchText, setSearchText] = useState('');

	const columns = [
		{
			title: 'Order ID',
			dataIndex: 'id',
			key: 'id',
			align: 'center',
		},
		{
			title: 'Order Time',
			dataIndex: 'orderTime',
			key: 'orderTime',
			align: 'center',
		},
		{
			title: 'Total Amount',
			key: 'totalAmount',
			dataIndex: 'totalAmount',
			align: 'center',
		},
		{
			title: 'Payment Method',
			key: 'paymentMethod',
			dataIndex: 'paymentMethod',
			align: 'center',
		},
		{
			title: 'Customer',
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
			title: 'Status',
			key: 'status',
			dataIndex: 'status',
			align: 'center',
			render: (status) => {
				// Find status item from statusList
				const foundStatus = statusList.find((item) => item.value === status);
				let color = 'green';

				if (status === 'canceled' || status === 'rejected' || status === 'shipFailed') {
					color = 'volcano';
				} else if (status === 'shipping') {
					color = 'blue';
				} else if (status === 'pendingPayment' || status === 'pendingConfirmation') {
					color = 'geekblue';
				} else if (status === 'shipped') {
					color = 'purple';
				} else if (status === 'confirmed') {
					color = 'gold';
				}

				return (
					<Tag color={color}>
						{foundStatus ? foundStatus.name.toUpperCase() : status.toUpperCase()}
					</Tag>
				);
			},
		},
		{
			title: 'Action',
			key: 'action',
			align: 'center',
			render: (_, record) => (
				<Space size="middle">
					<Button type="primary" ghost onClick={() => navigate('/orders/1')}>
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

	const filteredDataSource = dataSource
		.filter((item) => activeStatus === 'all' || item.status === activeStatus)
		.filter((item) => {
			const itemDate = new Date(item.orderTime.split('/').reverse().join('-'));
			const start = startDate ? new Date(startDate.split('/').reverse().join('-')) : null;
			const end = endDate ? new Date(endDate.split('/').reverse().join('-')) : null;
			return (!start || itemDate >= start) && (!end || itemDate <= end);
		})
		.filter((item) => item.email.toLowerCase().includes(searchText.toLowerCase()));

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
					dataSource={filteredDataSource}
					columns={columns}
					className="custom-table-header"
					pagination={{pageSize: 5}}
				/>
			</div>
		</div>
	);
};

export default OrderPage;
