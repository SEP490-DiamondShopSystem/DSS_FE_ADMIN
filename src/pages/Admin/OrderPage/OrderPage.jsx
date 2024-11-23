import React, {useEffect, useState} from 'react';

import {CalendarOutlined, EditFilled} from '@ant-design/icons';
import {Button, DatePicker, Input, Space, Table, Tag} from 'antd';
import debounce from 'lodash/debounce';
import {useDispatch, useSelector} from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';
import {Filter} from '../../../components/Filter';
import {
	getAllOrderSelector,
	GetUserDetailSelector,
	LoadingOrderSelector,
} from '../../../redux/selectors';
import {getAllOrder} from '../../../redux/slices/orderSlice';
import {formatPrice} from '../../../utils';
import {enums} from '../../../utils/constant';

const {Search} = Input;
const {RangePicker} = DatePicker;

const statusList = [
	{name: 'Tất Cả', value: ''},
	{name: 'Pending', value: '1'},
	{name: 'Processing', value: '2'},
	{name: 'Rejected', value: '3'},
	{name: 'Cancelled', value: '4'},
	{name: 'Prepared', value: '5'},
	{name: 'Delivering', value: '6'},
	{name: 'Failed', value: '7'},
	{name: 'Success', value: '8'},
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

	console.log('orderList', orderList);

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
	}, [dispatch, pageSize, current, activeStatus, startDate, endDate, searchText]);

	useEffect(() => {
		if (userDetail?.Roles) {
			const isDeliverer = userDetail.Roles.some((role) => role?.RoleName === 'deliverer');

			setDelivererRole(isDeliverer);
		}
	}, [userDetail]);

	useEffect(() => {
		if (orderList && enums) {
			const mapAttributes = (data, attributes) => ({
				id: data?.Id,
				orderTime: data?.CreatedDate,
				status: getEnumKey(attributes?.OrderStatus, data?.Status),
				email: data?.Account?.Email,
				totalAmount: formatPrice(data?.TotalPrice),
				customer: null,
				paymentMethod: getEnumKey(attributes?.PaymentStatus, data?.PaymentStatus),
				OrderCode: data?.OrderCode,
				CustomizeRequestId: data?.CustomizeRequestId,
			});

			const mappedData = orderList?.Values?.map((order) => mapAttributes(order, enums));

			setOrders(mappedData);
		}
	}, [orderList, enums]);

	const columns = [
		{
			title: 'ID Đơn Hàng',
			dataIndex: 'OrderCode',
			key: 'OrderCode',
			align: 'center',
		},
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
			title: 'Loại Đơn Hàng',
			key: 'CustomizeRequestId',
			dataIndex: 'CustomizeRequestId',
			align: 'center',
			render: (CustomizeRequestId) => (CustomizeRequestId ? 'Đơn Thiết Kế' : 'Đơn Thường'),
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
					<Link to={`/orders/${record.id}`}>
						<Button type="text" className="bg-primary">
							<EditFilled />
						</Button>
					</Link>
				</Space>
			),
		},
	];

	const handleDateChange = (dates, dateStrings) => {
		setStartDate(dates[0]);
		setEndDate(dates[1]);
	};

	const handleStatusChange = (value) => {
		setActiveStatus(value);
	};

	const onSearch = (value) => {
		setSearchText(value);
	};

	return (
		<div className="mx-20 my-10">
			<Filter
				filter={delivererRole ? delivererStatusList : statusList}
				handleStatusBtn={handleStatusChange}
				active={activeStatus}
			/>
			<div className="flex flex-col sm:flex-row sm:items-center">
				<Space wrap className="w-full">
					<div className="flex items-center my-3 sm:my-5">
						<p className="mr-3 text-sm sm:text-base">Tìm theo ngày:</p>
					</div>
					<div
						className="flex items-center pl-2 py-1 my-3 sm:my-0"
						style={{
							border: '1px solid #d9d9d9',
							borderRadius: '4px',
							width: '100%',
							maxWidth: '400px',
						}}
					>
						<span className="mr-3 font-bold text-sm sm:text-base">Từ</span>
						<span className="mr-3">→</span>
						<span className="mr-3 font-bold text-sm sm:text-base">Đến</span>
						<RangePicker
							format="DD/MM/YYYY"
							suffixIcon={<CalendarOutlined />}
							style={{border: 'none', width: '100%'}}
							onChange={handleDateChange}
						/>
					</div>

					<div className="flex items-center my-3 sm:my-5 sm:ml-10 w-full sm:w-auto">
						<p className="mr-3 text-sm sm:text-base">Tìm kiếm:</p>
						<Search
							className="w-full sm:w-60"
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
