import {Rate, Tag} from 'antd';
import {enums} from './constant';

export const StarRating = ({rating}) => {
	return (
		<>
			<Rate
				allowHalf
				defaultValue={rating}
				style={{fontSize: 20, color: '#F9A825'}}
				disabled
			/>
		</>
	);
};

export const formatPrice = (price) => {
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
		minimumFractionDigits: 0, // To avoid decimal places for whole numbers
	}).format(price);
};

export function convertToVietnamDate(utcDateString) {
	// Create a Date object from the UTC date string
	const utcDate = new Date(utcDateString);

	// Get the timezone offset in minutes and convert it to milliseconds
	const vnTimeZoneOffset = 7 * 60; // UTC+7 in minutes
	const utcOffset = utcDate.getTimezoneOffset(); // Offset in minutes

	// Calculate the local time in Vietnam
	const vnDate = new Date(utcDate.getTime() + (vnTimeZoneOffset + utcOffset) * 60 * 1000);

	// Extract the day, month, and year
	const day = String(vnDate.getDate()).padStart(2, '0'); // Pad single digit day with leading zero
	const month = String(vnDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
	const year = vnDate.getFullYear();

	// Format to DD/MM/YYYY
	return `${day}/${month}/${year}`;
}

export const getOrderStatus = (status) => {
	switch (status) {
		case 1:
			return 'Pending';
		case 2:
			return 'Processing';
		case 3:
			return 'Rejected';
		case 4:
			return 'Cancelled';
		case 5:
			return 'Prepared';
		case 6:
			return 'Delivering';
		case 7:
			return 'Delivery_Failed';
		case 8:
			return 'Success';
		case 9:
			return 'Refused';
		default:
			return 'Unknown';
	}
};

export const getOrderCustomizeStatus = (status) => {
	switch (status) {
		case 1:
			return 'Pending';
		case 2:
			return 'Priced';
		case 3:
			return 'Requesting';
		case 4:
			return 'Accepted';
		case 5:
			return 'Shop_Rejected';
		case 6:
			return 'Customer_Rejected';
		case 7:
			return 'Customer_Cancelled';

		default:
			return 'Unknown';
	}
};

export const getOrderStatusTag = (status) => {
	switch (status) {
		case 1:
			return {name: 'Paid All', color: 'cyan'};
		case 2:
			return {name: 'Deposited', color: 'blue'};
		case 3:
			return {name: 'Refunding', color: 'red'};
		case 4:
			return {name: 'Refunded', color: 'red'};
		case 5:
			return {name: 'Pending', color: 'orange'};
		case 6:

		default:
			return {name: 'Unknown', color: 'grey'};
	}
};

export const getStepFromStatus = (status) => {
	switch (status) {
		case 'Pending':
			return 0;
		case 'Processing':
			return 1;
		case 'Prepared':
			return 2;
		case 'Delivering':
			return 3;
		case 'Delivery_Failed':
			return 4;
		case 'Success':
			return 5;
		case 'Refused':
			return 6;
		default:
			return 0;
	}
};

export const getOrderItemStatusTag = (status) => {
	const statusMap = {
		[enums.OrderItemStatus.Pending]: {label: 'Chờ xử lý', color: 'blue'},
		[enums.OrderItemStatus.Prepared]: {label: 'Đã chuẩn bị', color: 'gold'},
		[enums.OrderItemStatus.Done]: {label: 'Hoàn thành', color: 'green'},
		[enums.OrderItemStatus.Removed]: {label: 'Đã xóa', color: 'red'},
	};

	const statusInfo = statusMap[status];
	if (statusInfo) {
		return <Tag color={statusInfo.color}>{statusInfo.label}</Tag>;
	}
	return <Tag color="default">Không xác định</Tag>;
};
