import {Rate} from 'antd';

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
