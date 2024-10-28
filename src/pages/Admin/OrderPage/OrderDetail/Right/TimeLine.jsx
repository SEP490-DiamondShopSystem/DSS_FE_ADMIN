import {CheckCircleOutlined, ClockCircleOutlined} from '@ant-design/icons';
import {Timeline} from 'antd';
import React from 'react';

const OrderStatus = {
	Pending: 1,
	Processing: 2,
	Prepared: 3,
	Delivering: 4,
	Delivery_Failed: 5,
	Success: 6,
	Refused: 7,
};

export const TimeLine = ({status}) => {
	const getStepStatus = (stepStatus) => {
		if (stepStatus < OrderStatus[status]) {
			return {color: 'blue', icon: <CheckCircleOutlined style={{fontSize: '16px'}} />};
		} else if (stepStatus === OrderStatus[status]) {
			// Nếu là bước "Giao Hàng Thành Công" và là trạng thái cuối cùng
			if (status === 'Success' && stepStatus === OrderStatus.Success) {
				return {color: 'blue', icon: <CheckCircleOutlined style={{fontSize: '16px'}} />};
			}
			return {color: '#dec986', icon: <ClockCircleOutlined style={{fontSize: '16px'}} />};
		} else {
			return null; // Các bước chưa đạt tới sẽ bị ẩn
		}
	};

	let allSteps = [
		{
			children: 'Chờ Xác Nhận',
			color: getStepStatus(OrderStatus.Pending)?.color,
			dot: getStepStatus(OrderStatus.Pending)?.icon,
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
		{
			children: 'Đã Từ Chối',
			color: getStepStatus(OrderStatus.Refused)?.color,
			dot: getStepStatus(OrderStatus.Refused)?.icon,
		},
	];

	// Loại bỏ "Giao Hàng Thất Bại" nếu đã có "Giao Hàng Thành Công" và ngược lại
	if (status === 'Success') {
		allSteps = allSteps.filter((step) => step.children !== 'Giao Hàng Thất Bại');
	} else if (status === 'Delivery_Failed') {
		allSteps = allSteps.filter((step) => step.children !== 'Giao Hàng Thành Công');
	}

	// Lọc các bước có màu để hiển thị
	allSteps = allSteps.filter((step) => step.color);

	return (
		<div>
			<Timeline reverse={true} items={allSteps} />
		</div>
	);
};
