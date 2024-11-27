import {useEffect, useState} from 'react';

import {Card, Col, DatePicker, Form, Image, Layout, Row, Select, Typography} from 'antd';
import {Helmet} from 'react-helmet';
import {OverviewDonutKpi, OverviewKpi} from './overview/OverviewKpi';
import {OverviewSummary} from './overview/OverviewSummary';
import {useDispatch, useSelector} from 'react-redux';
import {
	getAccountCount,
	getAllTopSellingShape,
	getDashboard,
	getOrderCompleted,
	getTopSellingJewelry,
} from '../../../redux/slices/dashboard';
import {
	GetAccountCountSelector,
	GetAllDashboardSelector,
	GetAllSellingJewelrySelector,
	GetAllTopSellingDiamondSelector,
	GetOrderCompletedCountSelector,
	LoadingDashboardSelector,
} from '../../../redux/selectors';
import {formatPrice} from '../../../utils';
import {CalendarOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';
import {shapeItems} from '../../../utils/constant';
import Loading from '../../../components/Loading';

const {Content} = Layout;
const {Option} = Select;
const {RangePicker} = DatePicker;
const {Text} = Typography;

const DashboardPage = () => {
	const dispatch = useDispatch();

	const dashboardDetail = useSelector(GetAllDashboardSelector);
	const diamondShapeSelling = useSelector(GetAllTopSellingDiamondSelector);
	const accountCount = useSelector(GetAccountCountSelector);
	const orderCompleted = useSelector(GetOrderCompletedCountSelector);
	const jewelrySelling = useSelector(GetAllSellingJewelrySelector);
	const loading = useSelector(LoadingDashboardSelector);

	const [change, setChange] = useState(false);
	const [changeChart, setChangeChart] = useState(false);
	const [dashboard, setDashboard] = useState();
	const [shapeSelling, setShapeSelling] = useState();
	const [customerCount, setCustomerCount] = useState(0);
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [orders, setOrders] = useState();
	const [jewelry, setJewelry] = useState();

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

	useEffect(() => {
		dispatch(getTopSellingJewelry());
	}, []);

	useEffect(() => {
		if (jewelrySelling) {
			setJewelry(jewelrySelling);
		}
	}, [jewelrySelling]);

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
						<Loading />
					) : (
						<div>
							<Row gutter={[16, 16]} className="mb-5" justify="space-between" wrap>
								<Col xs={24} sm={12} lg={6}>
									<OverviewSummary
										label="TỔNG DOANH THU"
										value={formatPrice(dashboardDetail?.TotalRevenue)}
									/>
								</Col>
								<Col xs={24} sm={12} lg={6}>
									<OverviewSummary
										label="TỔNG ĐƠN ĐẶT HÀNG"
										value={dashboardDetail?.TotalNormalOrderCount}
									/>
								</Col>
								<Col xs={24} sm={12} lg={6}>
									<OverviewSummary
										label="TỔNG ĐƠN THIẾT KẾ"
										value={dashboardDetail?.TotalCustomizeOrderCount}
									/>
								</Col>
								<Col xs={24} sm={12} lg={6}>
									<OverviewSummary label="SỐ KHÁCH HÀNG" value={accountCount} />
								</Col>
							</Row>
							<Row gutter={[16, 16]}>
								<Col span={24}>
									<Card bordered={false}>
										<div className="flex flex-col lg:flex-row justify-between items-center">
											<h3 className="font-bold text-lg mb-2 lg:mb-0">
												Đơn Đặt Hàng Thành Công Trong Tuần
											</h3>
											<div className="flex flex-col lg:flex-row gap-4 items-center">
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
															? dayjs(endDate, 'DD-MM-YYYY HH:mm:ss')
															: null,
													]}
													disabled
												/>
												<Select
													onChange={setChangeChart}
													value={changeChart}
													className="w-full lg:w-auto"
												>
													<Option value={false}>Đơn Thường</Option>
													<Option value={true}>Đơn Thiết Kế</Option>
												</Select>
											</div>
										</div>
										<div className="mt-4">
											<OverviewKpi
												chartSeries={[
													{
														name: 'Tổng Đơn Hàng',
														data: Object.entries(
															orders?.CompletedOrder?.filter(
																(item) => {
																	return (
																		item.CompleteDate &&
																		dayjs(
																			item.CompleteDate,
																			'DD-MM-YYYY HH:mm:ss',
																			true
																		).isValid()
																	);
																}
															)?.reduce((acc, item) => {
																// Nhóm dữ liệu theo ngày
																const dateKey = dayjs(
																	item.CompleteDate,
																	'DD-MM-YYYY HH:mm:ss'
																)
																	.startOf('day')
																	.format('YYYY-MM-DD');

																// Tăng số lượng đơn hàng theo ngày
																acc[dateKey] =
																	(acc[dateKey] || 0) + 1;
																return acc;
															}, {}) || {}
														)
															// Chuyển object thành mảng { x, y } để dùng trong chart
															.map(([date, count]) => ({
																x: dayjs(date, 'YYYY-MM-DD')
																	.toDate()
																	.getTime(),
																y: count,
															}))
															.sort((a, b) => a.x - b.x), // Sắp xếp theo ngày
													},
												]}
											/>
										</div>
									</Card>
								</Col>
							</Row>
							<Row gutter={[16, 16]} className="mt-4">
								<Col xs={24} md={12} lg={8}>
									<Card title="Đơn Đặt Hàng" bordered={false}>
										<OverviewDonutKpi
											chartSeries={Object.values(
												dashboardDetail?.NormalOrderGroupByStatus || {}
											)}
										/>
									</Card>
								</Col>
								<Col xs={24} md={12} lg={8}>
									<Card title="Đơn Thiết Kế" bordered={false}>
										<OverviewDonutKpi
											chartSeries={Object.values(
												dashboardDetail?.CustomizeOrderGroupByStatus || {}
											)}
										/>
									</Card>
								</Col>
								<Col xs={24} md={24} lg={8}>
									<Card
										title="Bán Chạy"
										bordered={false}
										className="h-full overflow-y-auto"
									>
										<Select
											onChange={setChange}
											value={change}
											className="mb-4 w-full lg:w-auto"
										>
											<Option value={false}>Trang Sức</Option>
											<Option value={true}>Kim Cương</Option>
										</Select>
										{!change ? (
											<Card
												bordered={false}
												style={{height: '100%', overflowY: 'auto'}}
											>
												<div className="flex justify-between items-center">
													<h3 className="font-bold text-lg">Bán Chạy</h3>
												</div>
												{Array.isArray(jewelry) &&
													jewelry?.map((product, i) => (
														<div
															key={i}
															className="flex justify-between items-center my-1"
														>
															<div className="flex flex-col my-2">
																<Text type className="ml-3">
																	{product.ModelName}
																</Text>
																<Text
																	type="secondary"
																	className="ml-3"
																>
																	{product.MetalName}
																</Text>
															</div>
															<div className="flex flex-col items-end">
																<Text type className="ml-3">
																	Tổng Doanh Thu
																</Text>
																<Text className="ml-3 font-semibold">
																	{formatPrice(product.Revenue)}
																</Text>
															</div>
														</div>
													))}
											</Card>
										) : (
											<Card
												bordered={false}
												style={{height: 420, overflowY: 'auto'}}
											>
												{Array.isArray(
													shapeSelling?.DiamondBestSellingShapes
												) &&
													shapeSelling?.DiamondBestSellingShapes.map(
														(shape) => {
															// Find the matching item in shapeItems based on ShapeName
															const matchedShape = shapeItems?.find(
																(item) =>
																	item.shape.toLowerCase() ===
																	shape?.Shape?.ShapeName?.toLowerCase()
															);

															return (
																<div
																	key={shape.Shape?.Id}
																	className="flex justify-between items-center my-1"
																>
																	<div className="flex items-center my-2">
																		<Image
																			alt={
																				shape?.Shape
																					?.ShapeName
																			}
																			src={
																				matchedShape?.image ||
																				'/default-image.jpg'
																			}
																			style={{
																				height: '100%',
																				width: 30,
																				objectFit: 'cover',
																			}}
																			className="rounded-lg"
																		/>
																		<p className="ml-3">
																			{
																				shape?.Shape
																					?.ShapeName
																			}
																		</p>
																	</div>
																	<div className="flex flex-col items-end">
																		<Text type className="ml-3">
																			Tổng Doanh Thu:
																		</Text>
																		<Text className="ml-3 font-semibold">
																			{formatPrice(
																				shape.TotalRevenueForThisShape
																			)}
																		</Text>
																	</div>
																</div>
															);
														}
													)}
											</Card>
										)}
									</Card>
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
