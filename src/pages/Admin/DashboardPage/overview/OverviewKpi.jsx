import {Card} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';

const useChartOptions = () => {
	const theme = useTheme();

	return {
		chart: {
			background: 'transparent',
			toolbar: {
				show: false,
			},
			zoom: {
				enabled: false,
			},
		},
		legend: {
			show: true,
		},
		colors: [theme.palette.primary.main],
		dataLabels: {
			enabled: false,
		},
		fill: {
			type: 'gradient',
		},
		grid: {
			borderColor: theme.palette.divider,
			xaxis: {
				lines: {
					show: true,
				},
			},
			yaxis: {
				lines: {
					show: true,
				},
			},
		},
		stroke: {
			width: 3,
		},
		theme: {
			mode: theme.palette.mode,
		},
		xaxis: {
			axisBorder: {
				color: theme.palette.divider,
				show: true,
			},
			axisTicks: {
				color: theme.palette.divider,
				show: true,
			},
			categories: [], // Để trống ban đầu
			labels: {
				style: {
					colors: theme.palette.text.secondary,
				},
			},
		},
		yaxis: {
			labels: {
				offsetX: -12,
				style: {
					colors: theme.palette.text.secondary,
				},
			},
		},
	};
};

export const OverviewKpi = (props) => {
	const {chartSeries = [], stats = [], chartOptionsOverride} = props;
	const chartOptions = useChartOptions();

	console.log(chartSeries);
	console.log(chartOptionsOverride);

	return (
		<Card>
			<Chart
				height="350"
				options={chartOptionsOverride || chartOptions}
				series={chartSeries}
				type="line" // Sử dụng loại biểu đồ line để hiển thị
			/>
		</Card>
	);
};
export const OverviewBookKpi = (props) => {
	const {chartSeries = [], stats = [], chartOptionsOverride} = props;
	const chartOptions = useChartOptions();

	console.log(chartSeries);
	console.log(chartOptionsOverride);

	return (
		<Card>
			<Chart
				height="350"
				options={chartOptionsOverride || chartOptions}
				series={chartSeries}
				type="area"
			/>
		</Card>
	);
};

OverviewKpi.propTypes = {
	chartSeries: PropTypes.array,
	stats: PropTypes.array,
	chartOptionsOverride: PropTypes.object,
};

OverviewBookKpi.propTypes = {
	chartSeries: PropTypes.array,
	stats: PropTypes.array,
	chartOptionsOverride: PropTypes.object,
};
