import React from 'react';
import Countdown from 'react-countdown';

const CountdownTimer = ({expiredDate}) => {
	// Chuyển ExpiredDate thành đối tượng Date
	const parseDate = (dateString) => {
		const [day, month, year, time] = dateString.split(/[- ]/);
		return new Date(`${year}-${month}-${day}T${time}`);
	};

	// Renderer để hiển thị countdown
	const renderer = ({days, hours, minutes, seconds, completed}) => {
		if (completed) {
			return <span className="text-red font-semibold">Hết hạn thanh toán!</span>;
		} else {
			return (
				<span className="font-semibold">
					{hours}giờ {minutes}phút {seconds}giây
				</span>
			);
		}
	};

	return <Countdown date={parseDate(expiredDate)} renderer={renderer} />;
};

export default CountdownTimer;
