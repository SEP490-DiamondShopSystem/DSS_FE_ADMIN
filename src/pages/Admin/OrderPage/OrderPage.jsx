import {CalendarOutlined, EditFilled} from '@ant-design/icons';
import {Button, DatePicker, Input, Space, Table, Tag} from 'antd';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {Filter} from '../../../components/Filter';
import {
	getAllOrderSelector,
	GetUserDetailSelector,
	LoadingOrderSelector,
} from '../../../redux/selectors';
import {getAllOrder} from '../../../redux/slices/orderSlice';
import {convertToVietnamDate, formatPrice} from '../../../utils';
import {enums} from '../../../utils/constant';

const {Search} = Input;
const {RangePicker} = DatePicker;

const statusList = [
	{name: 'All', value: ''},
	{name: 'Pending', value: '1'},
	{name: 'Processing', value: '2'},
	{name: 'Rejected', value: '3'},
	{name: 'Cancelled', value: '4'},
	{name: 'Prepared', value: '5'},
	{name: 'Delivering', value: '6'},
	{name: 'Failed', value: '7'},
	{name: 'Success', value: '8'},
	{name: 'Refused', value: '9'},
];
const delivererStatusList = [
	{name: 'All', value: ''},
	{name: 'Prepared', value: '5'},
	{name: 'Delivering', value: '6'},
	{name: 'Failed', value: '7'},
	{name: 'Success', value: '8'},
	// {name: 'Refused', value: '9'},
];

const paymentStatusList = [
	{name: 'PaidAll', value: '1'},
	{name: 'Deposited', value: '2'},
	{name: 'Refunding', value: '3'},
	{name: 'Refunded', value: '4'},
	{name: 'Pending', value: '5'},
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
		status: getEnumKey(attributes?.OrderStatus, data?.Status),
		email: null,
		totalAmount: formatPrice(data?.TotalPrice),
		customer: null,
		paymentMethod: getEnumKey(attributes?.PaymentStatus, data?.PaymentStatus),
	};
};

const OrderPage = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const loading = useSelector(LoadingOrderSelector);
	const orderList = useSelector(getAllOrderSelector);
	const userDetail = useSelector(GetUserDetailSelector);

	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [activeStatus, setActiveStatus] = useState('');
	const [searchText, setSearchText] = useState('');
	const [orders, setOrders] = useState([]);
	const [pageSize, setPageSize] = useState(100);
	const [current, setCurrent] = useState(1);
	const [delivererRole, setDelivererRole] = useState(false);

	useEffect(() => {
		dispatch(
			getAllOrder({
				pageSize: pageSize,
				start: current,
				Status: activeStatus,
				CreatedDate: startDate,
				ExpectedDate: endDate,
				Email: searchText,
			})
		);
		// dispatch(getAllOrder());
	}, [pageSize, current, activeStatus, startDate, endDate, searchText]);

	console.log('orderList', orderList);
	console.log('orders', orders);
	console.log('userDetail', userDetail);

	useEffect(() => {
		if (userDetail?.Roles) {
			const isDeliverer = userDetail.Roles.some((role) => role?.RoleName === 'deliverer');

			setDelivererRole(isDeliverer);
		}
	}, [userDetail]);

	useEffect(() => {
		if (orderList && enums) {
			// Map diamond attributes to more readable values
			const mappedData = orderList?.Values?.map((order) => mapAttributes(order, enums));
			setOrders(mappedData);
		}
	}, [orderList, enums]);

	const columns = [
		// {
		// 	title: 'ID Đơn Hàng',
		// 	dataIndex: 'id',
		// 	key: 'id',
		// 	align: 'center',
		// },
		{
			title: 'Email',
			key: 'email',
			dataIndex: 'email',
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
			render: (status) => {
				const foundStatus = paymentStatusList.find((item) => item.name === status);

				let color = 'green';

				// Determine color based on status
				if (status === 'Refunding' || status === 'Refunded') {
					// 'canceled', 'rejected', 'shipFailed'
					color = 'red';
				} else if (status === 'Pending') {
					// 'refunded'
					color = 'orange';
				} else if (status === 'Deposited') {
					// 'deposited'
					color = 'blue';
				} else if (status === 'PaidAll') {
					// 'paidAll'
					color = 'cyan';
				}

				return (
					<Tag color={color}>
						{foundStatus ? foundStatus.name.toUpperCase() : status.toUpperCase()}
					</Tag>
				);
			},
		},

		{
			title: 'Trạng Thái',
			key: 'status',
			dataIndex: 'status',
			align: 'center',
			render: (status) => {
				const foundStatus = statusList.find((item) => item.name === status);

				let color = 'green';

				// Determine color based on status
				if (
					status === 'Cancelled' ||
					status === 'Delivery Failed' ||
					status === 'Refused' ||
					status === 'Rejected'
				) {
					// 'canceled', 'rejected', 'shipFailed'
					color = 'red';
				} else if (status === 'Pending') {
					// 'refunded'
					color = 'orange';
				} else if (status === 'Processing') {
					// 'deposited'
					color = 'blue';
				} else if (status === 'Delivering') {
					// 'paidAll'
					color = 'cyan';
				} else if (status === 'Prepared') {
					// 'pending'
					color = 'purple';
				} else if (status === 'Success') {
					// 'refunding'
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
					<Button
						type="text"
						className="bg-primary"
						ghost
						onClick={() => navigate(`/orders/${record.id}`)}
					>
						<EditFilled />
					</Button>
				</Space>
			),
		},
	];

	const handleDateChange = (dates, dateStrings) => {
		setStartDate(dates[0]);
		setEndDate(dates[1]);
		console.log();
	};

	const handleStatusChange = (value) => {
		setActiveStatus(value);
	};

	const onSearch = (value) => {
		setSearchText(value);
		console.log(value);
	};

	return (
		<div className="mx-20 my-10">
			<Filter
				filter={delivererRole ? delivererStatusList : statusList}
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
