import {Button, Select, Steps, Typography} from 'antd';
import React, {useEffect, useState} from 'react';

const {Title, Text} = Typography;

const TimeLineOrder = () => {
	const [confirmStatus, setConfirmStatus] = useState(false);
	const [currentStep, setCurrentStep] = useState(0);
	const [orderStatus, setOrderStatus] = useState('Chờ Xác Nhận');

	useEffect(() => {
		switch (orderStatus) {
			case 'Chờ Xác Nhận':
				setCurrentStep(0);
				break;
			// case 'Chờ Thanh Toán':
			// 	setCurrentStep(1);
			// 	break;
			case 'Đang Chuẩn Bị':
				setCurrentStep(1);
				break;
			case 'Hoàn Tất Chuẩn Bị Hàng':
				setCurrentStep(2);
				break;
			case 'Chuyển giao shipper thành công':
				setCurrentStep(3);
				break;
			case 'Đang vận chuyển':
				setCurrentStep(4);
				break;
			case 'Đã vận chuyển':
				setCurrentStep(5);
				break;
			case 'Bị báo cáo':
				setCurrentStep(6);
				break;
			default:
				setCurrentStep(0);
		}
	}, [orderStatus]);

	const allSteps = [
		{
			title: 'Chờ Xác Nhận',
			subTitle: '00:01:02',
			status: `${'finish'}`,
		},
		// {
		// 	title: 'Chờ Thanh Toán',
		// 	subTitle: '00:01:02',
		// 	status: 'process',
		// },
		{
			title: 'Thanh Toán Hoàn Tất',
			subTitle: '00:01:02',
			status: 'process',
		},
		{
			title: 'Hoàn Tất Chuẩn Bị Hàng',
			subTitle: '00:01:02',
			status: 'waiting',
		},
		{
			title: 'Chuyển giao shipper thành công',
			subTitle: '00:01:02',
			status: 'waiting',
		},
		{
			title: 'Đang vận chuyển',
			subTitle: '00:01:02',
			status: 'waiting',
		},
		{
			title: 'Đã vận chuyển',
			subTitle: '00:01:02',
			status: 'waiting',
		},
		{
			title: 'Bị báo cáo',
			subTitle: '00:01:02',
			status: 'waiting',
		},
	];

	const getReverseSteps = () => {
		// Filter out steps with status 'waiting' or 'error'
		const filteredSteps = allSteps.filter(
			(step) => step.status === 'finish' || step.status === 'process'
		);
		// Reverse the filtered steps
		return filteredSteps.reverse();
	};

	const handleChange = (value) => {
		console.log(`selected ${value}`);
	};

	return (
		<div>
			{/* Chờ Xác Nhận */}
			{currentStep === 0 && (
				<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
					<div className="flex items-center mb-5" style={{fontSize: 16}}>
						<p className="font-semibold">Trạng thái đơn hàng:</p>
						<p className="ml-5">Chờ Xác Nhận</p>
					</div>
					<div className="flex justify-around">
						<Button type="text" className="bg-red font-semibold w-32 rounded-full">
							Hủy bỏ
						</Button>
						<Button
							type="text"
							className="bg-green font-semibold w-32 rounded-full"
							onClick={() => setCurrentStep(1)}
						>
							Xác nhận
						</Button>
					</div>
				</div>
			)}

			{/* Chờ Thanh Toán */}
			{currentStep === 1 && (
				<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
					<div className="flex items-center mb-5" style={{fontSize: 16}}>
						<p className="font-semibold">Trạng thái đơn hàng:</p>
						<p className="ml-5">Đơn Hàng Đã Xác Nhận</p>
					</div>
					<div className="flex justify-around">
						<Button
							type="text"
							className="bg-green font-semibold w-full rounded-full"
							onClick={() => setCurrentStep(2)}
						>
							Chuẩn bị hàng
						</Button>
					</div>
				</div>
			)}

			{/* Thanh Toán Hoàn Tất */}
			{currentStep === 2 && (
				<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
					<div className="flex items-center mb-5" style={{fontSize: 16}}>
						<p className="font-semibold">Trạng thái đơn hàng:</p>
						<p className="ml-5">Đang Chuẩn Bị Đơn Hàng</p>
					</div>
					<div className="flex justify-around">
						<Button
							type="text"
							className="bg-green font-semibold w-full rounded-full"
							onClick={() => setCurrentStep(3)}
						>
							Hoàn Tất
						</Button>
					</div>
				</div>
			)}

			{/* Hoàn Tất Chuẩn Bị Hàng */}
			{currentStep === 3 && (
				<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
					<div className="flex items-center mb-5" style={{fontSize: 16}}>
						<p className="font-semibold">Trạng thái đơn hàng:</p>
						<p className="ml-5">Hoàn Tất Chuẩn Bị Hàng</p>
					</div>
					<div>
						<Text className="flex">
							<p className="text-red mr-1">*</p>
							<p>Chọn Shipper</p>
						</Text>
					</div>
					<div>
						<Select
							defaultValue=""
							className="w-full mb-5"
							onChange={handleChange}
							options={[
								{value: 'huy', label: 'Huy'},
								{value: 'thai', label: 'Thái'},
								{value: 'minh', label: 'Minh'},
								{value: 'tai', label: 'Tai', disabled: true},
							]}
						/>
					</div>
					<div className="flex justify-around">
						<Button
							type="text"
							className="bg-green font-semibold rounded-full w-full"
							onClick={() => setCurrentStep(4)}
						>
							Chuyển Giao
						</Button>
					</div>
				</div>
			)}

			{/* Chuyển giao shipper thành công */}
			{currentStep === 4 && (
				<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
					<div className="flex items-center mb-5" style={{fontSize: 16}}>
						<p className="font-semibold">Trạng thái đơn hàng:</p>
						<p className="ml-5">Chuyển giao shipper thành công</p>
					</div>
					<div className="flex justify-around">
						<Button
							type="text"
							className="bg-green font-semibold w-full rounded-full"
							onClick={() => setCurrentStep(5)}
						>
							Tiếp tục
						</Button>
					</div>
				</div>
			)}

			{/* Đang giao hàng */}
			{currentStep === 5 && (
				<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
					<div className="flex items-center mb-5" style={{fontSize: 16}}>
						<p className="font-semibold">Trạng thái đơn hàng:</p>
						<p className="ml-5">Đang giao hàng</p>
					</div>
					<div className="flex justify-around">
						<Button
							type="text"
							className="bg-green font-semibold w-full rounded-full"
							onClick={() => setCurrentStep(6)}
						>
							Tiếp tục
						</Button>
					</div>
				</div>
			)}

			{/* Đã giao */}
			{currentStep === 6 && (
				<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
					<div className="flex items-center mb-5" style={{fontSize: 16}}>
						<p className="font-semibold">Trạng thái đơn hàng:</p>
						<p className="ml-5">Đã giao</p>
					</div>
					<div className="flex justify-around">
						<Button
							type="text"
							className="bg-green font-semibold w-full rounded-full"
							onClick={() => setCurrentStep(7)}
						>
							Tiếp tục
						</Button>
					</div>
				</div>
			)}

			{/* Bị báo cáo */}
			{currentStep === 7 && (
				<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
					<div className="flex items-center mb-5" style={{fontSize: 16}}>
						<p className="font-semibold">Trạng thái đơn hàng:</p>
						<p className="ml-5 text-red">Bị báo cáo</p>
					</div>
					<div className="flex justify-around">
						<Button
							type="text"
							className="bg-green font-semibold w-full rounded-full"
							onClick={() => setCurrentStep(0)}
						>
							Tiếp tục
						</Button>
					</div>
				</div>
			)}

			<Title level={3}>Order Timeline</Title>
			<Steps
				progressDot
				current={currentStep}
				direction="vertical"
				items={getReverseSteps()}
			/>
		</div>
	);
};

export default TimeLineOrder;
