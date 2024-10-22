import {useState} from 'react';

import {Card, Col, Form, Layout, Row, Select} from 'antd';
import {Helmet} from 'react-helmet';
import ReactLoading from 'react-loading';
import {OverviewKpi} from './overview/OverviewKpi';
import {OverviewSummary} from './overview/OverviewSummary';

const {Content} = Layout;
const {Option} = Select;

const DashboardPage = () => {
	const currentDate = new Date();
	const currentMonth = currentDate.getMonth() + 1;
	const currentYear = currentDate.getFullYear();

	const [month, setMonth] = useState(currentMonth);
	const [year, setYear] = useState(currentYear);
	const [selectedTable, setSelectedTable] = useState('bookings');
	const [loading, setLoading] = useState(false);

	// Fake data
	const fakeData = {
		users: {
			players: {total_player: 5000},
			stadiums: {total_stadium_account: 120},
		},
		blogs: {total_blog: 250},
		premiums: {total_premium: 30},
		matches: {
			total_match: 80,
			compare_last_month: 15.3,
			match_by_time: [
				{time: '10:00 AM', total_match: 10},
				{time: '12:00 PM', total_match: 20},
				{time: '2:00 PM', total_match: 30},
			],
		},
		bookings: {
			bookings: {
				total_booking: 700,
				booking_by_day_of_week: [
					{day: 0, total: 100}, // Monday
					{day: 1, total: 150}, // Tuesday
					{day: 2, total: 200}, // Wednesday
				],
			},
		},
		revenues: {
			income: {total_income: 5000000},
			revenue: {total_revenue: 10000000},
		},
	};

	const handleMonthChange = (value) => {
		setMonth(value);
	};

	const handleYearChange = (value) => {
		setYear(value);
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
							>
								<Form layout="inline">
									<Form.Item>
										<Select
											value={month}
											onChange={handleMonthChange}
											style={{width: 120}}
											placeholder="Select month"
										>
											{Array.from({length: 12}, (_, i) => (
												<Option key={i + 1} value={i + 1}>
													{new Date(0, i).toLocaleString('default', {
														month: 'long',
													})}
												</Option>
											))}
										</Select>
									</Form.Item>
									<Form.Item>
										<Select
											value={year}
											onChange={handleYearChange}
											style={{width: 120}}
											placeholder="Select year"
										>
											{[2022, 2023, 2024, 2025].map((y) => (
												<Option key={y} value={y}>
													{y}
												</Option>
											))}
										</Select>
									</Form.Item>
								</Form>
							</div>
							<Row gutter={[16, 16]} className="mb-5">
								<Col span={6}>
									<OverviewSummary
										label="TOTAL REVENUE"
										value={fakeData.users.players.total_player.toLocaleString(
											'vi-VN'
										)}
									/>
								</Col>
								<Col span={6}>
									<OverviewSummary
										label="TOTAL ORDER"
										value={fakeData.users.stadiums.total_stadium_account.toLocaleString(
											'vi-VN'
										)}
									/>
								</Col>
								<Col span={6}>
									<OverviewSummary
										label="TOTAL CUSTOM ORDER"
										value={fakeData.blogs.total_blog.toLocaleString('vi-VN')}
									/>
								</Col>
								<Col span={6}>
									<OverviewSummary
										label="TOTAL CUSTOMER"
										value={`${fakeData.premiums.total_premium}`}
									/>
								</Col>
							</Row>
							<Row gutter={[16, 16]}>
								<Col span={24}>
									<Card title="Match Summary" bordered={false}>
										<Row gutter={[16, 16]}>
											<Col span={12}>
												<OverviewSummary
													label="Total Matches"
													value={fakeData.matches.total_match.toLocaleString(
														'vi-VN'
													)}
												/>
											</Col>
											<Col span={12}>
												<OverviewSummary
													label="Change from last month"
													value={`${fakeData.matches.compare_last_month}%`}
												/>
											</Col>
										</Row>
										<OverviewKpi
											chartSeries={[
												{
													name: 'Total Matches',
													data: fakeData.matches.match_by_time.map(
														(item) => ({
															x: item.time,
															y: item.total_match,
														})
													),
												},
											]}
										/>
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
