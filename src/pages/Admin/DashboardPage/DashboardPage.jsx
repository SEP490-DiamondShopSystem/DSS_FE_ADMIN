import {
	Box,
	Card,
	CardContent,
	CardHeader,
	Container,
	Divider,
	FormControl,
	Grid,
	MenuItem,
	Select,
	Stack,
	Typography,
} from '@mui/material';
import {useState} from 'react';
import {Helmet} from 'react-helmet';
import ReactLoading from 'react-loading';
import {OverviewBookKpi, OverviewKpi} from './overview/OverviewKpi';
import {OverviewSummary} from './overview/OverviewSummary';

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

	const handleMonthChange = (event) => {
		setMonth(event.target.value);
	};

	const handleYearChange = (event) => {
		setYear(event.target.value);
	};

	return (
		<>
			<Helmet>
				<title>Dashboard</title>
			</Helmet>
			<Box sx={{flexGrow: 1, py: 8, bgcolor: '#f4f6f8'}}>
				<Container maxWidth="xl">
					{loading ? (
						<Box
							display="flex"
							justifyContent="center"
							alignItems="center"
							height="100vh"
						>
							<ReactLoading type="spinningBubbles" color="#4878db" />
						</Box>
					) : (
						<Stack spacing={1}>
							<Typography
								variant="h4"
								sx={{fontWeight: 'bold', color: 'primary.main'}}
							>
								Dashboard Reports
							</Typography>

							<div style={{display: 'flex', justifyContent: 'flex-end'}}>
								<FormControl sx={{minWidth: 120, mr: 2}}>
									<Select
										labelId="select-month-label"
										id="select-month"
										value={month}
										onChange={handleMonthChange}
									>
										{Array.from({length: 12}, (_, i) => (
											<MenuItem key={i + 1} value={i + 1}>
												{new Date(0, i).toLocaleString('default', {
													month: 'long',
												})}
											</MenuItem>
										))}
									</Select>
								</FormControl>
								<FormControl sx={{minWidth: 120}}>
									<Select
										labelId="select-year-label"
										id="select-year"
										value={year}
										onChange={handleYearChange}
									>
										{[2022, 2023, 2024, 2025].map((y) => (
											<MenuItem key={y} value={y}>
												{y}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</div>
							<Grid container spacing={1}>
								<Grid item xs={3}>
									<OverviewSummary
										label="TOTAL REVENUE"
										value={fakeData.users.players.total_player.toLocaleString(
											'vi-VN'
										)}
									/>
								</Grid>
								<Grid item xs={3}>
									<OverviewSummary
										label="TOTAL ORDER"
										value={fakeData.users.stadiums.total_stadium_account.toLocaleString(
											'vi-VN'
										)}
									/>
								</Grid>
								<Grid item xs={3}>
									<OverviewSummary
										label="TOTAL CUSTOM ORDER"
										value={fakeData.blogs.total_blog.toLocaleString('vi-VN')}
									/>
								</Grid>
								<Grid item xs={3}>
									<OverviewSummary
										label="TOTAL CUSTOMER"
										value={`${fakeData.premiums.total_premium}`}
									/>
								</Grid>
							</Grid>
							<Grid container spacing={1}>
								<Grid item xs={12}>
									<Box>
										<Card sx={{boxShadow: 3}}>
											<CardHeader title="Match Summary" />
											<Divider />
											<CardContent>
												<Stack
													direction="row"
													justifyContent="center"
													spacing={3}
												>
													<Grid item xs={6}>
														<OverviewSummary
															label="Total Matches"
															value={fakeData.matches.total_match.toLocaleString(
																'vi-VN'
															)}
														/>
													</Grid>
													<Grid item xs={6}>
														<OverviewSummary
															label="Change from last month"
															value={`${fakeData.matches.compare_last_month}%`}
														/>
													</Grid>
												</Stack>
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
											</CardContent>
										</Card>
									</Box>
								</Grid>
							</Grid>
							<Grid container spacing={1}>
								<Grid item xs={12}>
									<Box mb={3}>
										<Card sx={{boxShadow: 3, width: '100%'}}>
											<div style={{display: 'flex'}}>
												<CardHeader title="Booking Summary" />
											</div>
											<Divider />
											<CardContent>
												<Stack
													direction="row"
													justifyContent="center"
													spacing={3}
												>
													<Grid item xs={3}>
														<OverviewSummary
															label="Total Bookings"
															value={fakeData.bookings.bookings.total_booking.toLocaleString(
																'vi-VN'
															)}
														/>
													</Grid>
													<Grid item xs={3}>
														<OverviewSummary
															label="Total Income"
															value={fakeData.revenues.income.total_income.toLocaleString(
																'vi-VN'
															)}
														/>
													</Grid>
													<Grid item xs={3}>
														<OverviewSummary
															label="Total Revenue"
															value={`${fakeData.revenues.revenue.total_revenue.toLocaleString(
																'vi-VN'
															)} VNĐ`}
														/>
													</Grid>
													<Grid item xs={3}>
														<OverviewSummary
															label="Booking Revenue (30%)"
															value={`${(
																fakeData.revenues.revenue
																	.total_revenue * 0.3
															).toLocaleString('vi-VN')} VNĐ`}
														/>
													</Grid>
												</Stack>
												<OverviewBookKpi
													chartSeries={[
														{
															name:
																selectedTable
																	.charAt(0)
																	.toUpperCase() +
																selectedTable.slice(1),
															data: fakeData.bookings.bookings.booking_by_day_of_week.map(
																(item) => ({
																	x: [
																		'Mon',
																		'Tue',
																		'Wed',
																		'Thu',
																		'Fri',
																		'Sat',
																		'Sun',
																	][item.day],
																	y: item.total,
																})
															),
														},
													]}
												/>
											</CardContent>
										</Card>
									</Box>
								</Grid>
							</Grid>
						</Stack>
					)}
				</Container>
			</Box>
		</>
	);
};

export default DashboardPage;
