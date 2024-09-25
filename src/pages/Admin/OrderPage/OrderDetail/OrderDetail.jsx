import React from 'react';
import InformationOrder from './Left/InformationOrder';
import TimeLineOrder from './Right/TimeLineOrder';

const OrderDetail = () => {
	return (
		<div className="w-full flex">
			<div className="" style={{width: '70%'}}>
				<InformationOrder />
			</div>
			<div className="pl-10" style={{width: '30%'}}>
				<TimeLineOrder />
			</div>
		</div>
	);
};

export default OrderDetail;
