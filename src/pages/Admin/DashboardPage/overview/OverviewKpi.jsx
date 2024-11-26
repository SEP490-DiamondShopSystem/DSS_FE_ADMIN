import {Card} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';
import {useMemo} from 'react';

const useChartOptions = () => {
	const theme = useTheme();

	return {
		chart: {
			background: 'transparent',
			toolbar: {show: false},
			zoom: {enabled: false},
		},
		xaxis: {
			type: 'datetime',
			tickAmount: 6, // Hiển thị 6 mốc thời gian
			labels: {
				format: 'dd MMM', // Hiển thị ngày dạng 'dd MMM' (ví dụ: '24 Nov')
				style: {
					colors: theme.palette.text.secondary,
				},
			},
		},
		yaxis: {
			tickAmount: 5, // Số dòng trên trục y
			min: 0, // Giá trị nhỏ nhất
			labels: {
				style: {
					colors: theme.palette.text.secondary,
				},
				formatter: (value) => {
					// Làm tròn giá trị
					return Math.round(value).toString();
				},
			},
		},
		stroke: {width: 3},
		grid: {
			yaxis: {
				lines: {
					show: true, // Hiển thị các đường kẻ dọc theo trục y
				},
			},
		},
	};
};

export const OverviewKpi = (props) => {
	const {chartSeries = [], stats = [], chartOptionsOverride} = props;
	const chartOptions = useChartOptions();

	return (
		<Card>
			<Chart
				height="350"
				options={chartOptionsOverride || chartOptions}
				series={chartSeries}
				type="line" // Biểu đồ dạng line
			/>
		</Card>
	);
};

export const OverviewDonutKpi = (props) => {
	const {chartSeries = [], stats = [], chartOptionsOverride} = props;

	const chartOptions = {
		chart: {
			type: 'donut',
		},
		labels: stats.map((stat) => stat.label),
		legend: {
			position: 'bottom',
		},
		dataLabels: {
			enabled: true,
			formatter: (val, opts) => `${val.toFixed(1)}%`,
		},
		tooltip: {
			y: {
				formatter: (val) => `${val}`,
			},
		},
	};

	const mergedChartOptions = {
		...chartOptions,
		...chartOptionsOverride,
	};

	return (
		<Card>
			<Chart height="350" options={mergedChartOptions} series={chartSeries} type="donut" />
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

// OverviewDonutKpi.propTypes = {
// 	chartSeries: PropTypes.array,
// 	stats: PropTypes.array,
// 	chartOptionsOverride: PropTypes.object,
// };

OverviewBookKpi.propTypes = {
	chartSeries: PropTypes.array,
	stats: PropTypes.array,
	chartOptionsOverride: PropTypes.object,
};
