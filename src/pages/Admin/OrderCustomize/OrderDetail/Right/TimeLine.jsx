import {CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
import {Timeline} from 'antd';
import React from 'react';

const OrderStatus = {
	Pending: 1,
	Cancelled: 2,
	Processing: 3,
	Prepared: 4,
	Delivering: 5,
	Delivery_Failed: 6,
	Success: 7,
	Rejected: 8,
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
			if (status === 'Cancelled' && stepStatus === OrderStatus.Cancelled) {
				return {color: 'red', icon: <CloseCircleOutlined style={{fontSize: '16px'}} />};
			}
			return {color: '#dec986', icon: <ClockCircleOutlined style={{fontSize: '16px'}} />};
		} else {
			return null; // Hide future steps
		}
	};

	let allSteps = [
		{
			children: status === 'Pending' ? 'Chờ Xác Nhận' : 'Đã Được Xác Nhận',
			color: getStepStatus(OrderStatus.Pending)?.color,
			dot: getStepStatus(OrderStatus.Pending)?.icon,
		},
		{
			children: 'Đã Hủy',
			color: getStepStatus(OrderStatus.Cancelled)?.color,
			dot: getStepStatus(OrderStatus.Cancelled)?.icon,
		},
		{
			children: 'Đã Từ Chối',
			color: getStepStatus(OrderStatus.Rejected)?.color,
			dot: getStepStatus(OrderStatus.Rejected)?.icon,
		},
		{
			children: status === 'Processing' ? 'Đang Xử Lý' : 'Đã Xử Lý',
			color: getStepStatus(OrderStatus.Processing)?.color,
			dot: getStepStatus(OrderStatus.Processing)?.icon,
		},
		{
			children: status === 'Prepared' ? 'Chuẩn Bị Đơn Hàng' : 'Đơn Hàng Đã Được Chuẩn Bị',
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

	// Nếu trạng thái là "Cancelled", chỉ hiển thị bước "Đã Hủy" và ẩn tất cả các bước khác
	if (status === 'Cancelled') {
		allSteps = allSteps.filter((step) => step.children === 'Đã Hủy');
	}

	// Nếu trạng thái là "Rejected", chỉ hiển thị bước "Đã Từ Chối" và ẩn tất cả các bước khác
	if (status === 'Rejected') {
		allSteps = allSteps.filter((step) => step.children === 'Đã Từ Chối');
	}

	// Nếu trạng thái không phải "Cancelled" hoặc "Rejected", ẩn các bước này
	if (status !== 'Cancelled') {
		allSteps = allSteps.filter((step) => step.children !== 'Đã Hủy');
	}

	if (status !== 'Rejected') {
		allSteps = allSteps.filter((step) => step.children !== 'Đã Từ Chối');
	}

	// Nếu trạng thái là "Success", ẩn bước "Giao Hàng Thất Bại"
	if (status === 'Success') {
		allSteps = allSteps.filter((step) => step.children !== 'Giao Hàng Thất Bại');
	}

	// Filter chỉ các bước có màu để hiển thị
	allSteps = allSteps.filter((step) => step.color);

	return (
		<div className="mt-10">
			<Timeline reverse={true} items={allSteps} />
		</div>
	);
};
