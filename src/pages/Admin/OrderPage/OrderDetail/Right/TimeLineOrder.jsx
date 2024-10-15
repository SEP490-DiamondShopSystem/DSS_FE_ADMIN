import {Button, Select, Steps, Typography} from 'antd';
import React, {useEffect, useState} from 'react';

const {Title, Text} = Typography;

const TimeLineOrder = () => {
	const [confirmStatus, setConfirmStatus] = useState(false);
	const [currentStep, setCurrentStep] = useState(0);
	const [orderStatus, setOrderStatus] = useState('Chờ Xác Nhận');
	const [status, setStatus] = useState({
		pending: 'process',
		processing: 'waiting',
		prepared: 'waiting',
		delivering: 'waiting',
		success: 'waiting',
		error: 'waiting',
	});

	const handleProcessStatus = () => {
		setCurrentStep(1);
		setStatus({
			pending: 'finish',
			processing: 'process',
			prepared: 'waiting',
			delivering: 'waiting',
			success: 'waiting',
			error: 'waiting',
		});
	};
	const handlePreparedStatus = () => {
		setCurrentStep(2);
		setStatus({
			pending: 'finish',
			processing: 'finish',
			prepared: 'process',
			delivering: 'waiting',
			success: 'waiting',
			error: 'waiting',
		});
	};
	const handleTransferStatus = () => {
		setCurrentStep(3);
		setStatus({
			pending: 'finish',
			processing: 'finish',
			prepared: 'finish',
			delivering: 'process',
			success: 'waiting',
			error: 'waiting',
		});
	};
	const handleDeliveringStatus = () => {
		setCurrentStep(4);
		setStatus({
			pending: 'finish',
			processing: 'finish',
			prepared: 'finish',
			delivering: 'process',
			success: 'waiting',
			error: 'waiting',
		});
	};
	const handleDeliveredStatus = () => {
		setCurrentStep(5);
		setStatus({
			pending: 'finish',
			processing: 'finish',
			prepared: 'finish',
			delivering: 'finish',
			success: 'process',
			error: 'waiting',
		});
	};
	const handleSuccessStatus = () => {
		setCurrentStep(6);
		setStatus({
			pending: 'finish',
			processing: 'finish',
			prepared: 'finish',
			delivering: 'finish',
			success: 'finish',
			error: 'waiting',
		});
	};
	const handleErrorStatus = () => {
		setCurrentStep(7);
		setStatus({
			pending: 'finish',
			processing: 'finish',
			prepared: 'finish',
			delivering: 'finish',
			success: 'finish',
			error: 'error',
		});
	};

	const allSteps = [
		{
			title: 'Chờ Xác Nhận',
			subTitle: '00:01:02',
			status: `${status.pending}`,
		},
		// {
		// 	title: 'Chờ Thanh Toán',
		// 	subTitle: '00:01:02',
		// 	status: 'process',
		// },
		{
			title: 'Xác Nhận Thành Công',
			subTitle: '00:01:02',
			status: `${status.processing}`,
		},
		{
			title: `${
				status.prepared === 'process'
					? 'Đang Chuẩn Bị Đơn Hàng'
					: 'Chuẩn Bị Đơn Hàng Hoàn Tất'
			}`,
			subTitle: '00:01:02',
			status: `${status.prepared}`,
		},
		{
			title: `${status.delivering === 'process' ? 'Chuyển Giao Shipper' : 'Đang Vận Chuyển'}`,
			subTitle: '00:01:02',
			status: `${status.delivering}`,
		},
		// {
		// 	title: 'Đang vận chuyển',
		// 	subTitle: '00:01:02',
		// 	status: `${status.delivering}`,
		// },
		{
			title: 'Đã Giao',
			subTitle: '00:01:02',
			status: `${status.success}`,
		},
		{
			title: 'Bị báo cáo',
			subTitle: '00:01:02',
			status: `${status.error}`,
		},
	];

	const getReverseSteps = () => {
		// Filter out steps with status 'waiting' or 'error'
		const filteredSteps = allSteps.filter(
			(step) =>
				step.status === 'finish' || step.status === 'process' || step.status === 'error'
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
							onClick={handleProcessStatus}
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
							onClick={handlePreparedStatus}
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
							onClick={handleTransferStatus}
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
							onClick={handleDeliveringStatus}
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
							onClick={handleDeliveredStatus}
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
							onClick={handleSuccessStatus}
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
							onClick={handleErrorStatus}
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
