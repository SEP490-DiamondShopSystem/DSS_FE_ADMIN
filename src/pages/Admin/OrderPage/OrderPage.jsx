import React, {useEffect, useState} from 'react';
import {CalendarOutlined, EditFilled} from '@ant-design/icons';
import {Button, DatePicker, Input, Select, Space, Table, Tag, Typography} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import {
	getAllOrderSelector,
	GetUserDetailSelector,
	LoadingOrderSelector,
} from '../../../redux/selectors';
import {getAllOrder} from '../../../redux/slices/orderSlice';
import {formatPrice} from '../../../utils';
import {enums} from '../../../utils/constant';
import {Filter} from '../../../components/Filter';

const {Search} = Input;
const {RangePicker} = DatePicker;
const {Title} = Typography;
const {Option} = Select;

const statusList = [
	{name: 'Tất Cả', value: ''},
	{name: 'Chờ Xử Lý', value: '1'},
	{name: 'Đang Xử Lý', value: '2'},
	{name: 'Từ Chối', value: '3'},
	{name: 'Hủy Đơn', value: '4'},
	{name: 'Đã Chuẩn Bị', value: '5'},
	{name: 'Đang Vận Chuyển', value: '6'},
	{name: 'Vận Chuyển Thất Bại', value: '7'},
	{name: 'Thành Công', value: '8'},
];

const statusMapping = {
	1: {label: 'Chờ Xử Lý', color: 'green'},
	2: {label: 'Đang Xử Lý', color: 'blue'},
	3: {label: 'Từ Chối', color: 'red'},
	4: {label: 'Hủy Đơn', color: 'red'},
	5: {label: 'Đã Chuẩn Bị', color: 'purple'},
	6: {label: 'Đang Vận Chuyển', color: 'orange'},
	7: {label: 'Vận Chuyển Thất Bại', color: 'volcano'},
	8: {label: 'Thành Công', color: 'geekblue'},
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
	const [selectOrder, setSelectOrder] = useState('');
	const [orders, setOrders] = useState([]);
	const [pageSize, setPageSize] = useState(5);
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
				IsCustomize: selectOrder,
			})
		);
	}, [dispatch, pageSize, current, activeStatus, startDate, endDate, searchText, selectOrder]);
	useEffect(() => {
		if (orderList) {
			const mappedData = orderList?.Values?.map((order) => ({
				id: order?.Id,
				orderTime: order?.CreatedDate,
				Status: order?.Status,
				email: order?.Account?.Email,
				totalAmount: formatPrice(order?.TotalPrice),
				paymentMethod: order?.PaymentStatus,
				OrderCode: order?.OrderCode,
				CustomizeRequestId: order?.CustomizeRequestId,
			}));

			setOrders(mappedData);
		}
	}, [orderList]);

	const columns = [
		{
			title: 'ID Đơn Hàng',
			dataIndex: 'OrderCode',
			key: 'OrderCode',
			align: 'center',
			ellipsis: true,
		},
		{
			title: 'Email',
			key: 'email',
			dataIndex: 'email',
			align: 'center',

			responsive: ['sm'],
		},
		{
			title: 'Thời Gian',
			dataIndex: 'orderTime',
			key: 'orderTime',
			align: 'center',
			responsive: ['md'],
		},
		{
			title: 'Giá',
			key: 'totalAmount',
			dataIndex: 'totalAmount',
			align: 'center',
		},
		{
			title: 'Trạng Thái',
			key: 'Status',
			dataIndex: 'Status',
			align: 'center',
			render: (status) => {
				const {label, color} = statusMapping[status] || {label: 'Unknown', color: 'gray'};
				return <Tag color={color}>{label?.toUpperCase()}</Tag>;
			},
			ellipsis: true,
		},
	];

	const handleDateChange = (dates) => {
		setStartDate(dates?.[0]);
		setEndDate(dates?.[1]);
	};

	return (
		<div className="  my-1">
			<Helmet>
				<title>Danh Sách Đơn Đặt Hàng</title>
			</Helmet>
			<Title level={3} className="text-center sm:text-left">
				Danh Sách Đơn Đặt Hàng
			</Title>
			<div className="flex flex-wrap items-center justify-between mb-5 gap-2">
				<Search
					placeholder="Tìm theo email"
					allowClear
					onSearch={setSearchText}
					className="my-2 sm:my-0 sm:ml-5"
				/>
				<RangePicker
					format="DD/MM/YYYY"
					suffixIcon={<CalendarOutlined />}
					onChange={handleDateChange}
				/>
				<Select
					className="w-32 my-2 sm:my-0 sm:ml-5"
					placeholder="Loại đơn"
					onChange={setSelectOrder}
				>
					<Option value={false}>Đơn Thường</Option>
					<Option value={true}>Đơn Thiết Kế</Option>
				</Select>
			</div>
			<Table
				dataSource={orders}
				columns={columns}
				pagination={{
					current: current,
					total: orderList?.TotalPage * pageSize,
					pageSize: 1000, // Set the default page size to 50
					onChange: (page) => setCurrent(page),
					showSizeChanger: false, // Disable size changer for consistency
				}}
				loading={loading}
				rowKey="id"
				onRow={(record) => ({
					onClick: () => navigate(`/orders/${record.id}`),
					className: 'cursor-pointer hover:bg-gray-100 transition-colors duration-200' // Add hover effect

				})}
				scroll={{
					y: 500, // Set vertical scroll height
				}}
				className="w-svw"
				sticky
			/>
		</div>
	);
};

export default OrderPage;
