import {useEffect, useState} from 'react';

import {Card, Col, DatePicker, Form, Image, Layout, Row, Select} from 'antd';
import {Helmet} from 'react-helmet';
import ReactLoading from 'react-loading';
import {OverviewDonutKpi, OverviewKpi} from './overview/OverviewKpi';
import {OverviewSummary} from './overview/OverviewSummary';
import {useDispatch, useSelector} from 'react-redux';
import {
	getAccountCount,
	getAllTopSellingShape,
	getDashboard,
	getOrderCompleted,
} from '../../../redux/slices/dashboard';
import {
	GetAccountCountSelector,
	GetAllDashboardSelector,
	GetAllTopSellingDiamondSelector,
	GetOrderCompletedCountSelector,
} from '../../../redux/selectors';
import {formatPrice} from '../../../utils';
import {CalendarOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';

const {Content} = Layout;
const {Option} = Select;
const {RangePicker} = DatePicker;

const bestSellingProducts = [
	{
		id: 1,
		name: 'Product 1',
		sold: 20,
		image: 'https://via.placeholder.com/80',
	},
	{
		id: 2,
		name: 'Product 2',
		sold: 15,
		image: 'https://via.placeholder.com/80',
	},
	{
		id: 3,
		name: 'Product 3',
		sold: 30,
		image: 'https://via.placeholder.com/80',
	},
	{
		id: 4,
		name: 'Product 4',
		sold: 10,
		image: 'https://via.placeholder.com/80',
	},
	{
		id: 5,
		name: 'Product 5',
		sold: 25,
		image: 'https://via.placeholder.com/80',
	},
	{
		id: 6,
		name: 'Product 6',
		sold: 12,
		image: 'https://via.placeholder.com/80',
	},
];

const DashboardPage = () => {
	// const currentDate = new Date();
	// const currentMonth = currentDate.getMonth() + 1;
	// const currentYear = currentDate.getFullYear();
	const dispatch = useDispatch();

	const dashboardDetail = useSelector(GetAllDashboardSelector);
	const diamondShapeSelling = useSelector(GetAllTopSellingDiamondSelector);
	const accountCount = useSelector(GetAccountCountSelector);
	const orderCompleted = useSelector(GetOrderCompletedCountSelector);

	const [change, setChange] = useState(false);
	const [changeChart, setChangeChart] = useState(false);
	const [loading, setLoading] = useState(false);
	const [dashboard, setDashboard] = useState();
	const [shapeSelling, setShapeSelling] = useState();
	const [customerCount, setCustomerCount] = useState(0);
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [orders, setOrders] = useState();

	console.log('orders', orders);

	useEffect(() => {
		const now = dayjs();
		const sevenDaysAgo = now.subtract(7, 'day');

		setStartDate(sevenDaysAgo.format('DD-MM-YYYY HH:mm:ss'));
		setEndDate(now.format('DD-MM-YYYY HH:mm:ss'));
	}, []);

	useEffect(() => {
		dispatch(getOrderCompleted({startDate, endDate, isCustomOrder: changeChart}));
	}, [startDate, endDate, changeChart]);

	useEffect(() => {
		if (orderCompleted) {
			setOrders(orderCompleted);
		}
	}, [orderCompleted]);

	useEffect(() => {
		dispatch(getAllTopSellingShape());
	}, []);

	useEffect(() => {
		if (diamondShapeSelling) {
			setShapeSelling(diamondShapeSelling);
		}
	}, [diamondShapeSelling]);

	useEffect(() => {
		dispatch(getDashboard());
	}, []);

	useEffect(() => {
		if (dashboardDetail) {
			setDashboard(dashboardDetail);
		}
	}, [dashboardDetail]);

	useEffect(() => {
		dispatch(getAccountCount());
	}, []);

	useEffect(() => {
		if (accountCount) {
			setCustomerCount(accountCount);
		}
	}, [accountCount]);

	console.log('dashboard', dashboard);

	const getStatusLabel = (statusId) => {
		const statusMapping = {
			1: 'Pending',
			2: 'Processing',
			3: 'Rejected',
			4: 'Cancelled',
			5: 'Prepared',
			6: 'Delivering',
			7: 'Delivery Failed',
			8: 'Success',
			9: 'Refused',
		};
		return statusMapping[statusId] || 'Unknown';
	};

	const handleChange = () => {
		setChange(!change);
	};

	const handleOrderChange = () => {
		setChangeChart(!changeChart);
	};

	return (
		<>
			<Helmet>
				<title>Dashboard</title>
			</Helmet>
			<Layout style={{padding: '24px'}}>
				<Content>
					{loading ? (
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								height: '100vh',
							}}
						>
							<ReactLoading type="spinningBubbles" color="#4878db" />
						</div>
					) : (
						<div>
							<div
								style={{
									display: 'flex',
									justifyContent: 'flex-end',
									marginBottom: 16,
								}}
							></div>
							<Row gutter={[16, 16]} className="mb-5">
								<Col span={6}>
									<OverviewSummary
										label="TỔNG DOANH THU"
										value={formatPrice(dashboard?.TotalRevenue)}
									/>
								</Col>
								<Col span={6}>
									<OverviewSummary
										label="TỔNG ĐƠN ĐẶT HÀNG"
										value={dashboard?.TotalNormalOrderCount}
									/>
								</Col>
								<Col span={6}>
									<OverviewSummary
										label="TỔNG ĐƠN THIẾT KẾ"
										value={dashboard?.TotalCustomizeOrderCount}
									/>
								</Col>
								<Col span={6}>
									<OverviewSummary label="SỐ KHÁCH HÀNG" value={customerCount} />
								</Col>
							</Row>
							<Row gutter={[16, 16]}>
								<Col span={24}>
									<Card bordered={false}>
										<div className="flex justify-between items-center">
											<h3 className="font-bold text-lg">
												Đơn Đặt Hàng Trong Tháng
											</h3>
											<div className="flex ">
												<div
													className="pl-2 mr-5 flex items-center"
													style={{
														border: '1px solid #d9d9d9',
														borderRadius: '4px',
														width: '400px',
													}}
												>
													<span
														style={{
															marginRight: '10px',
															fontWeight: 'bold',
														}}
													>
														Từ
													</span>
													<span style={{marginRight: '10px'}}>→</span>
													<span
														style={{
															marginRight: '10px',
															fontWeight: 'bold',
														}}
													>
														Đến
													</span>
													<RangePicker
														format="DD-MM-YYYY HH:mm:ss"
														suffixIcon={<CalendarOutlined />}
														style={{border: 'none', width: '100%'}}
														value={[
															startDate
																? dayjs(
																		startDate,
																		'DD-MM-YYYY HH:mm:ss'
																  )
																: null,
															endDate
																? dayjs(
																		endDate,
																		'DD-MM-YYYY HH:mm:ss'
																  )
																: null,
														]}
														disabled
													/>
												</div>
												<Select
													onChange={handleOrderChange}
													value={changeChart}
													style={{width: 150}}
												>
													<Option value={false}>Đơn Thường</Option>
													<Option value={true}>Đơn Thiết Kế</Option>
												</Select>
											</div>
										</div>
										<Row gutter={[16, 16]}></Row>
										<Col span={6}>
											<OverviewSummary
												label="TỔNG ĐƠN ĐẶT HÀNG"
												value={orders?.TotalOrder}
											/>
										</Col>
										<OverviewKpi
											chartSeries={[
												{
													name: 'Tổng Giá',
													data:
														orders?.CompletedOrder?.filter((item) => {
															// Check if CompleteDate exists and is a valid date after parsing
															return (
																item.CompleteDate &&
																dayjs(
																	item.CompleteDate,
																	'DD-MM-YYYY HH:mm:ss',
																	true
																).isValid()
															);
														})
															?.sort(
																(a, b) =>
																	new Date(
																		a.CompleteDate
																	).getTime() -
																	new Date(
																		b.CompleteDate
																	).getTime()
															)
															?.map((item) => ({
																x: dayjs(
																	item.CompleteDate,
																	'DD-MM-YYYY HH:mm:ss'
																)
																	.toDate()
																	.getTime(), // Convert to timestamp
																y: formatPrice(item.TotalPrice), // Format price
															})) || [],
												},
											]}
										/>
									</Card>
								</Col>
							</Row>
							<Row gutter={[16, 16]}>
								<Col span={8}>
									<Card
										title="Đơn Đặt Hàng"
										bordered={false}
										style={{height: 420}}
									>
										<OverviewDonutKpi
											chartSeries={Object.values(
												dashboard?.NormalOrderGroupByStatus || {}
											)}
											stats={Object.entries(
												dashboard?.NormalOrderGroupByStatus || {}
											).map(([label, value]) => ({
												label,
												value,
											}))}
										/>
									</Card>
								</Col>
								<Col span={8}>
									<Card
										title="Đơn Thiết Kế"
										bordered={false}
										style={{height: 420}}
									>
										<OverviewDonutKpi
											chartSeries={Object.values(
												dashboard?.CustomizeOrderGroupByStatus || {}
											)}
											stats={Object.entries(
												dashboard?.CustomizeOrderGroupByStatus || {}
											).map(([label, value]) => ({
												label,
												value,
											}))}
										/>
									</Card>
								</Col>
								<Col span={8}>
									{!change ? (
										<Card
											bordered={false}
											style={{height: 420, overflowY: 'auto'}}
										>
											<div className="flex justify-between items-center">
												<h3 className="font-bold text-lg">Bán Chạy</h3>
												<Select
													onChange={handleChange}
													value={change}
													style={{width: 150}}
												>
													<Option value={false}>Trang Sức</Option>
													<Option value={true}>Kim Cương</Option>
												</Select>
											</div>
											{dashboard &&
												dashboard?.TopSellingJewelry?.map((product) => (
													<div
														key={product.id}
														className="flex justify-between items-center my-1"
													>
														<div className="flex items-center">
															<Image
																alt={product.name}
																src={product.image}
																style={{
																	height: 50,
																	width: 50,
																	objectFit: 'cover',
																}}
																className="rounded-lg"
															/>
															<p className="ml-3">{product.name}</p>
														</div>
														<span>Đã bán: {product.sold}</span>
													</div>
												))}
										</Card>
									) : (
										<Card
											bordered={false}
											style={{height: 420, overflowY: 'auto'}}
										>
											<div className="flex justify-between items-center">
												<h3 className="font-bold text-lg">Bán Chạy</h3>
												<Select
													onChange={handleChange}
													value={change}
													style={{width: 150}}
												>
													<Option value={false}>Trang Sức</Option>
													<Option value={true}>Kim Cương</Option>
												</Select>
											</div>
											{Array.isArray(
												shapeSelling?.DiamondBestSellingShapes
											) &&
												shapeSelling?.DiamondBestSellingShapes.map(
													(shape) => (
														<div
															key={shape.Shape?.Id}
															className="flex justify-between items-center my-1"
														>
															<div className="flex items-center">
																{/* Replace shape.image with the actual image URL if available */}
																<Image
																	alt={shape?.Shape?.ShapeName}
																	src={
																		shape.image ||
																		'/default-image.jpg'
																	}
																	style={{
																		height: 50,
																		width: 50,
																		objectFit: 'cover',
																	}}
																	className="rounded-lg"
																/>
																<p className="ml-3">
																	{shape?.Shape?.ShapeName}
																</p>
															</div>
															<span>
																Tổng Doanh Thu:{' '}
																{formatPrice(
																	shape.TotalRevenueForThisShape
																)}
															</span>
														</div>
													)
												)}
										</Card>
									)}
								</Col>
							</Row>
						</div>
					)}
				</Content>
			</Layout>
		</>
	);
};

export default DashboardPage;
