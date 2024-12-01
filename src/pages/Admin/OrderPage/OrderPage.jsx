import React, {useEffect, useState} from 'react';
import {CalendarOutlined, EditFilled} from '@ant-design/icons';
import {Button, DatePicker, Input, Select, Space, Table, Tag, Typography} from 'antd';
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
import {Helmet} from 'react-helmet';

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
	1: {label: 'Chờ Xử Lý', color: 'geekblue'},
	2: {label: 'Đang Xử Lý', color: 'blue'},
	3: {label: 'Từ Chối', color: 'red'},
	4: {label: 'Hủy Đơn', color: 'red'},
	5: {label: 'Đã Chuẩn Bị', color: 'purple'},
	6: {label: 'Đang Vận Chuyển', color: 'orange'},
	7: {label: 'Vận Chuyển Thất Bại', color: 'volcano'},
	8: {label: 'Thành Công', color: 'green'},
};

const statusPaymentMapping = {
	1: {label: 'Trả Hết', color: 'geekblue'},
	2: {label: 'Trả Trước', color: 'blue'},
	3: {label: 'Chờ Hoàn Tiền', color: 'orange'},
	4: {label: 'Đã Hoàn Tiền', color: 'volcano'},
	5: {label: 'Chờ Xử Lý', color: 'green'},
};

const delivererStatusList = [
	{name: 'Tất Cả', value: ''},
	{name: 'Đã Chuẩn Bị', value: '5'},
	{name: 'Đang Vận Chuyển', value: '6'},
	{name: 'Vận Chuyển Thất Bại', value: '7'},
	{name: 'Thành Công', value: '8'},
];

const OrderPage = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const loading = useSelector(LoadingOrderSelector);
	const userDetail = useSelector(GetUserDetailSelector);

	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [activeStatus, setActiveStatus] = useState('');
	const [searchText, setSearchText] = useState('');
	const [selectOrder, setSelectOrder] = useState('');
	const [orders, setOrders] = useState([]);
	const [pageSize, setPageSize] = useState(10);
	const [current, setCurrent] = useState(1);
	const [delivererRole, setDelivererRole] = useState(false);
	const [orderList, setOrderList] = useState();
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

	// Responsive check
	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768);
			// Adjust page size based on screen size
			setPageSize(window.innerWidth <= 768 ? 5 : 10);
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

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
		)
			.unwrap()
			.then((res) => {
				setOrderList(res);
			});
	}, [dispatch, pageSize, current, activeStatus, startDate, endDate, searchText, selectOrder]);

	useEffect(() => {
		if (userDetail?.Roles) {
			const isDeliverer = userDetail.Roles.some((role) => role?.RoleName === 'deliverer');
			setDelivererRole(isDeliverer);
		}
	}, [userDetail]);

	useEffect(() => {
		if (orderList && enums) {
			const mapAttributes = (data) => ({
				id: data?.Id,
				orderTime: data?.CreatedDate,
				Status: data?.Status,
				email: data?.Account?.Email,
				totalAmount: formatPrice(data?.TotalPrice),
				customer: null,
				paymentMethod: data?.PaymentStatus,
				OrderCode: data?.OrderCode,
				CustomizeRequestId: data?.CustomizeRequestId,
			});
			const mappedData = orderList?.Values?.map((order) => mapAttributes(order));

			setOrders(mappedData);
		}
	}, [orderList, enums]);
	// Helper function to render status
	const renderStatus = (status) => {
		const {label, color} = statusMapping[status] || {label: 'Unknown', color: 'gray'};
		return <Tag color={color}>{label?.toUpperCase()}</Tag>;
	};
	const rendePaymentStatus = (status) => {
		const {label, color} = statusPaymentMapping[status] || {label: 'Unknown', color: 'gray'};
		return <Tag color={color}>{label?.toUpperCase()}</Tag>;
	};

	// Mobile-friendly columns
	const mobileColumns = [
		{
			title: 'Đơn Hàng',
			render: (record) => (
				<div className="flex flex-col border rounded-xl p-2">
					<div className="flex justify-between pb-3">
						<div className="font-bold">ID: {record.OrderCode}</div>
						{renderStatus(record.Status)}
					</div>
					<div className="font-semibold">Email: {record.email}</div>
					<div className="flex items-center">
						<span className="mr-2">Ngày Đặt Đơn:</span>
						{record.orderTime}
					</div>
					<div className="flex items-center">
						<span className="mr-2">TT Thanh Toán:</span>
						{rendePaymentStatus(record.paymentMethod)}
					</div>

					<div className="font-bold flex justify-end py-3 text-darkGreen">
						Giá: {record.totalAmount}
					</div>
					<div className="flex justify-end mt-2">
						<Link to={`/orders/${record.id}`}>
							<Button type="text" className="bg-primary">
								<EditFilled />
							</Button>
						</Link>
					</div>
				</div>
			),
		},
	];

	// Desktop columns
	const desktopColumns = [
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
				const {label, color} = statusPaymentMapping[status] || {
					label: 'Unknown',
					color: 'gray',
				};
				return <Tag color={color}>{label?.toUpperCase()}</Tag>;
			},
		},
		{
			title: 'Trạng Thái',
			key: 'Status',
			dataIndex: 'Status',
			align: 'center',
			render: renderStatus,
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
		if (dates) {
			setStartDate(dates[0]);
			setEndDate(dates[1]);
		} else {
			// If the dates are cleared
			setStartDate(null);
			setEndDate(null);
		}
	};
	const handleStatusChange = (value) => {
		setActiveStatus(value);
	};

	const onSearch = (value) => {
		setSearchText(value);
	};

	const handleOrderChange = (value) => {
		setSelectOrder(value);
	};

	return (
		<div className={`${isMobile ? ' my-4' : 'mx-20 my-10'}`}>
			<Helmet>
				<title>Danh Sách Đơn Đặt Hàng</title>
			</Helmet>
			<Title level={3} className="text-center md:text-start mb-4">
				Danh Sách Đơn Đặt Hàng
			</Title>

			<Filter
				filter={delivererRole ? delivererStatusList : statusList}
				handleStatusBtn={handleStatusChange}
				active={activeStatus}
			/>
			<div className="flex flex-col gap-2 my-4">
				{/* Date Range Picker */}
				{isMobile ? (
					<div className="flex flex-col gap-2">
						<div className="flex items-center space-x-2">
							<span className="text-sm mr-5">Từ:</span>
							<DatePicker
								className="w-full"
								format="DD/MM/YYYY"
								suffixIcon={<CalendarOutlined />}
								onChange={(date) => setStartDate(date)}
								placeholder="Chọn ngày bắt đầu"
							/>
						</div>
						<div className="flex items-center space-x-2">
							<span className="text-sm mr-5">Đến:</span>
							<DatePicker
								className="w-full"
								format="DD/MM/YYYY"
								suffixIcon={<CalendarOutlined />}
								onChange={(date) => setEndDate(date)}
								placeholder="Chọn ngày kết thúc"
							/>
						</div>
					</div>
				) : (
					<div className="flex items-center">
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
								allowClear
								format="DD/MM/YYYY"
								suffixIcon={<CalendarOutlined />}
								style={{border: 'none', width: '100%'}}
								onChange={handleDateChange}
							/>
						</div>
					</div>
				)}

				{/* Search and Filter Controls */}
				<div className="flex flex-col sm:flex-row items-center gap-2 sm:space-y-0 sm:space-x-4">
					<p className="mr-3">Tìm theo email:</p>
					<Search
						className="w-full md:w-60"
						placeholder="Tìm theo email"
						allowClear
						onSearch={onSearch}
					/>
					{/* <p className="mr-3">Tìm kiếm:</p> */}
					<Select
						className="w-full sm:w-32"
						onChange={(value) => handleOrderChange(value ?? '')}
						allowClear
						placeholder="Loại đơn"
					>
						<Option value={false}>Đơn Thường</Option>
						<Option value={true}>Đơn Thiết Kế</Option>
					</Select>
				</div>
			</div>

			<Table
				dataSource={orders}
				columns={isMobile ? mobileColumns : desktopColumns}
				pagination={{
					current: current,
					total: orderList?.TotalPage * pageSize,
					pageSize: pageSize,
					onChange: (page) => setCurrent(page),
					showSizeChanger: false,
				}}
				loading={loading}
				// scroll={{x: isMobile ? 300 : 'auto'}}
				className="overflow-x-auto"
			/>
		</div>
	);
};

export default OrderPage;
