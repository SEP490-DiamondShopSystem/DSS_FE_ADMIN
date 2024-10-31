import {CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
import {Timeline} from 'antd';
import React from 'react';

const OrderStatus = {
	Pending: 1,
	Processing: 2,
	Prepared: 3,
	Delivering: 4,
	Delivery_Failed: 5,
	Success: 6,
	Rejected: 7,
};

export const TimeLine = ({status}) => {
	const getStepStatus = (stepStatus) => {
		if (stepStatus < OrderStatus[status]) {
			return {color: 'blue', icon: <CheckCircleOutlined style={{fontSize: '16px'}} />};
		} else if (stepStatus === OrderStatus[status]) {
			if (status === 'Success' && stepStatus === OrderStatus.Success) {
				return {color: 'blue', icon: <CheckCircleOutlined style={{fontSize: '16px'}} />};
			}
			if (status === 'Delivery_Failed' && stepStatus === OrderStatus.Delivery_Failed) {
				return {color: 'red', icon: <CloseCircleOutlined style={{fontSize: '16px'}} />};
			}
			if (status === 'Rejected' && stepStatus === OrderStatus.Rejected) {
				return {color: 'red', icon: <CloseCircleOutlined style={{fontSize: '16px'}} />};
			}
			return {color: '#dec986', icon: <ClockCircleOutlined style={{fontSize: '16px'}} />};
		} else {
			return null; // Hide future steps
		}
	};

	let allSteps = [
		{
			children: 'Chờ Xác Nhận',
			color: getStepStatus(OrderStatus.Pending)?.color,
			dot: getStepStatus(OrderStatus.Pending)?.icon,
		},
<<<<<<< Updated upstream
=======
		// Chỉ thêm bước "Đã Hủy" nếu trạng thái hiện tại chưa qua "Processing"
		...(OrderStatus[status] < OrderStatus.Processing
			? [
					{
						children: 'Đã Hủy',
						color: getStepStatus(OrderStatus.Cancelled)?.color,
						dot: getStepStatus(OrderStatus.Cancelled)?.icon,
					},
			  ]
			: []),
>>>>>>> Stashed changes
		{
			children: 'Đã Từ Chối',
			color: getStepStatus(OrderStatus.Rejected)?.color,
			dot: getStepStatus(OrderStatus.Rejected)?.icon,
		},
		{
			children: 'Đang Xử Lý',
			color: getStepStatus(OrderStatus.Processing)?.color,
			dot: getStepStatus(OrderStatus.Processing)?.icon,
		},
		{
			children: 'Chuẩn Bị Đơn Hàng',
			color: getStepStatus(OrderStatus.Prepared)?.color,
			dot: getStepStatus(OrderStatus.Prepared)?.icon,
		},
		{
			children: 'Đang Vận Chuyển',
			color: getStepStatus(OrderStatus.Delivering)?.color,
			dot: getStepStatus(OrderStatus.Delivering)?.icon,
		},
		{
			children: 'Giao Hàng Thất Bại',
			color: getStepStatus(OrderStatus.Delivery_Failed)?.color,
			dot: getStepStatus(OrderStatus.Delivery_Failed)?.icon,
		},
		{
			children: 'Giao Hàng Thành Công',
			color: getStepStatus(OrderStatus.Success)?.color,
			dot: getStepStatus(OrderStatus.Success)?.icon,
		},
	];

	// If status is Reject, only display steps up to "Đã Từ Chối" and hide subsequent steps
	if (status === 'Rejected') {
		allSteps = allSteps.filter(
			(step) =>
				step.children !== 'Đang Xử Lý' &&
				step.children !== 'Chuẩn Bị Đơn Hàng' &&
				step.children !== 'Đang Vận Chuyển' &&
				step.children !== 'Giao Hàng Thất Bại' &&
				step.children !== 'Giao Hàng Thành Công'
		);
	}

	// Filter steps with a defined color to display
	allSteps = allSteps.filter((step) => step.color);

	return (
		<div className="mt-10">
			<Timeline reverse={true} items={allSteps} />
		</div>
	);
};
