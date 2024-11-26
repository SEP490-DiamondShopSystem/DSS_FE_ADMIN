import {CalendarOutlined, EditFilled} from '@ant-design/icons';
import {Button, DatePicker, Input, Space, Table, Tag, Typography} from 'antd';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {Filter} from '../../../components/Filter';
import {
	getAllOrderCustomizeSelector,
	GetUserDetailSelector,
	LoadingOrderSelector,
} from '../../../redux/selectors';
import {getAllOrderCustomize} from '../../../redux/slices/customizeSlice';
import {formatPrice} from '../../../utils';
import {enums} from '../../../utils/constant';
import {Helmet} from 'react-helmet';

const {Search} = Input;
const {RangePicker} = DatePicker;
const {Title} = Typography;

const statusList = [
	{name: 'Tất Cả', value: ''},
	{name: 'Chờ Xử Lý', value: '1'},
	{name: 'Đã Có Giá', value: '2'},
	{name: 'Đang Yêu Cầu', value: '3'},
	{name: 'Đã Chấp Nhận', value: '4'},
	{name: 'Shop Từ Chối', value: '5'},
	{name: 'Khách Hàng Từ Chối', value: '6'},
	{name: 'Khách Hàng Hủy Đơn', value: '7'},
];

const statusMapping = {
	1: {label: 'Chờ Xử Lý', color: 'green'},
	2: {label: 'Đã Có Giá', color: 'blue'},
	3: {label: 'Đang Yêu Cầu', color: 'orange'},
	4: {label: 'Đã Chấp Nhận', color: 'geekblue'},
	5: {label: 'Shop Từ Chối', color: 'red'},
	6: {label: 'Khách Từ Chối', color: 'volcano'},
	7: {label: 'Khách Hủy Đơn', color: 'volcano'},
};

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
		EngravedFont: data?.EngravedFont,
		EngravedText: data?.EngravedText,
		AccountId: data.AccountId,
		SizeId: data?.SizeId,
		orderTime: data?.CreatedDate,
		expiredTime: data?.ExpiredDate,
		status: data?.Status,
		email: data?.Account?.Email,
		totalAmount: formatPrice(data?.TotalPrice),
		customer: null,
		paymentMethod: getEnumKey(attributes?.PaymentStatus, data?.PaymentStatus),
		RequestCode: data?.RequestCode,
	};
};

const OrderCustomizePage = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const loading = useSelector(LoadingOrderSelector);
	const orderList = useSelector(getAllOrderCustomizeSelector);
	const userDetail = useSelector(GetUserDetailSelector);

	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [activeStatus, setActiveStatus] = useState('');
	const [searchText, setSearchText] = useState('');
	const [orders, setOrders] = useState([]);
	const [pageSize, setPageSize] = useState(5);
	const [current, setCurrent] = useState(1);
	const [delivererRole, setDelivererRole] = useState(false);

	useEffect(() => {
		dispatch(
			getAllOrderCustomize({
				pageSize: pageSize,
				currentPage: current,
				Email: searchText,
				CreatedDate: startDate,
				ExpiredDate: endDate,
				Status: activeStatus,
			})
		);
	}, [pageSize, current, activeStatus, startDate, endDate, searchText]);

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
		{
			title: 'Mã Yêu Cầu',
			key: 'RequestCode',
			dataIndex: 'RequestCode',
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
			title: 'Thời Gian Hết Hạn',
			dataIndex: 'expiredTime',
			key: 'expiredTime',
			align: 'center',
		},

		{
			title: 'Trạng Thái',
			key: 'status',
			dataIndex: 'status',
			align: 'center',
			render: (status) => {
				console.log('status', status);

				const {label, color} = statusMapping[status] || {label: 'Unknown', color: 'gray'};
				return <Tag color={color}>{label?.toUpperCase()}</Tag>;
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
						onClick={() =>
							navigate(`/request-customize/${record.id}`, {state: {record}})
						}
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
			<Helmet>
				<title>Danh Sách Đơn Thiết Kế</title>
			</Helmet>
			<Title level={3}>Danh Sách Đơn Thiết Kế</Title>
			<Filter
				filter={statusList}
				handleStatusBtn={handleStatusChange}
				active={activeStatus}
			/>
			<div className="flex flex-col sm:flex-row sm:items-center">
				<Space wrap className="w-full my-5">
					<div className="flex items-center my-3 sm:my-5">
						<p className="mr-3 text-sm sm:text-base">Tìm theo ngày:</p>
					</div>
					<div
						className="flex items-center pl-2 sm:my-0"
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
					<div className="flex items-center my-5 ml-10">
						<p className="mr-3">Tìm kiếm:</p>
						<Search
							className="w-60"
							placeholder="Tìm theo email"
							type="email"
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
					className=""
					size="large"
					pagination={{
						current: current,
						total: orderList?.TotalPage * pageSize,
						pageSize: pageSize,
						onChange: (page) => setCurrent(page),
						// showSizeChanger: true,
						onShowSizeChange: (current, size) => setPageSize(size),
					}}
					loading={loading}
				/>
			</div>
		</div>
	);
};

export default OrderCustomizePage;
