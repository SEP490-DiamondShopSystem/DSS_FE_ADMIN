import {Button, message, Steps, Typography} from 'antd';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Loading from '../../../../../components/Loading';
import {getAllDeliverySelector, GetUserDetailSelector} from '../../../../../redux/selectors';
import {
	handleOrderAccept,
	handleOrderComplete,
	handleOrderPreparing,
	handleOrderReject,
} from '../../../../../redux/slices/orderSlice';
import {convertToVietnamDate} from '../../../../../utils';

const {Title, Text} = Typography;

const getOrderStatus = (status) => {
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

const TimeLineOrder = ({orders, loading}) => {
	const dispatch = useDispatch();

	const userDetail = useSelector(GetUserDetailSelector);
	const deliveryList = useSelector(getAllDeliverySelector);

	const [confirmStatus, setConfirmStatus] = useState(false);
	const [currentStep, setCurrentStep] = useState(0);
	const [orderStatus, setOrderStatus] = useState('Chờ Xác Nhận');
	const [status, setStatus] = useState();
	const [userRoleManager, setUserRoleManager] = useState(false);
	const [deliveries, setDeliveries] = useState([]);
	const [userRoleDeliverer, setUserRoleDeliverer] = useState(false);

	console.log('userRoleDeliverer', userRoleDeliverer);
	console.log('status', status);

	useEffect(() => {
		if (userDetail?.Roles) {
			const isManager = userDetail?.Roles?.some((role) => role?.RoleName === 'manager');
			const isDeliverer = userDetail?.Roles?.some((role) => role?.RoleName === 'deliverer');

			setUserRoleManager(isManager);
			setUserRoleDeliverer(isDeliverer);
		}
	}, [userDetail]);

	useEffect(() => {
		if (deliveryList) {
			setDeliveries(
				deliveryList?.map((delivery) => ({
					Id: delivery.Id,
					DeliveryDate: convertToVietnamDate(delivery.DeliveryDate),
					DelivererId: delivery.DelivererId,
					DeliveryMethod: delivery.DeliveryMethod,
				}))
			);
		}
	}, [deliveryList]);

	console.log(deliveries);

	useEffect(() => {
		if (orders?.Status !== undefined) {
			const newStatus = getOrderStatus(orders.Status);
			setStatus(newStatus);
			// Update the current step based on status
			// setCurrentStep(getStepFromStatus(newStatus));
		}
	}, [orders?.Status]);

	const handleRejectStatus = async () => {
		const res = await dispatch(handleOrderReject(orders.Id));
		if (res.payload) {
			message.success('Từ chối thành công!');
			window.location.reload();
		} else {
			message.error('Lỗi khi từ chối đơn hàng.');
		}
	};

	const handleAcceptStatus = async () => {
		const res = await dispatch(handleOrderAccept(orders.Id));
		if (res.payload) {
			message.success('Xác nhận thành công!');
			window.location.reload();
		} else {
			message.error('Lỗi khi xác nhận đơn hàng.');
		}
	};

	const handlePreparedStatus = async () => {
		const res = await dispatch(handleOrderPreparing(orders.Id));
		if (res.payload) {
			message.success('Chuẩn bị hàng hoàn tất!');
			window.location.reload();
		} else {
			message.error('Lỗi khi chuẩn bị hàng.');
		}
	};
	const handleOrderAddToDelivery = async () => {
		const res = await dispatch(handleOrderPreparing(orders.Id));
		if (res.payload) {
			message.success('Chuẩn bị hàng hoàn tất!');
			window.location.reload();
		} else {
			message.error('Lỗi khi chuẩn bị hàng.');
		}
	};
	const handleDeliveringStatus = () => {};
	const handleDeliveredStatus = async () => {
		const res = await dispatch(handleOrderComplete(orders.Id));
		if (res.payload) {
			message.success('Giao hàng thành công!');
			window.location.reload();
		} else {
			message.error('Lỗi khi giao hàng.');
		}
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
			status: `${status === 'Pending' ? 'process' : 'finish'}`,
		},
		// {
		// 	title: 'Chờ Thanh Toán',
		// 	subTitle: '00:01:02',
		// 	status: 'process',
		// },
		// {
		// 	title: 'Xác Nhận Thành Công',
		// 	subTitle: '00:01:02',
		// 	status: `${(status = 'Processing' ? 'process' : '')}`,
		// },
		// {
		// 	title: `${
		// 		status.prepared === 'Processing'
		// 			? 'Đang Chuẩn Bị Đơn Hàng'
		// 			: 'Chuẩn Bị Đơn Hàng Hoàn Tất'
		// 	}`,
		// 	subTitle: '00:01:02',
		// 	status: `${status === 'Pending' ? 'process' : 'finish'}`,
		// },
		// {
		// 	title: `${status === 'Processing' ? 'Chuyển Giao Shipper' : 'Đang Vận Chuyển'}`,
		// 	subTitle: '00:01:02',
		// 	status: `${status === 'Processing' ? 'process' : 'finish'}`,
		// },
		// // {
		// // 	title: 'Đang vận chuyển',
		// // 	subTitle: '00:01:02',
		// // 	status: `${status.delivering}`,
		// // },
		// {
		// 	title: 'Đã Giao',
		// 	subTitle: '00:01:02',
		// 	status: `${status === 'Processing' ? 'process' : 'finish'}`,
		// },
		// {
		// 	title: 'Bị báo cáo',
		// 	subTitle: '00:01:02',
		// 	status: `${status === 'Processing' ? 'process' : 'finish'}`,
		// },
	];

	const steps = [
		{title: 'Chờ Xác Nhận', status: status === 'Pending' ? 'process' : 'finish'},
		{title: 'Đang Xử Lý', status: status === 'Processing' ? 'process' : 'finish'},
		{title: 'Chuẩn Bị Hàng', status: status === 'Prepared' ? 'process' : 'finish'},
		{title: 'Đang Giao', status: status === 'Delivering' ? 'process' : 'finish'},
		{title: 'Hoàn Tất', status: status === 'Success' ? 'finish' : 'wait'},
		{
			title: 'Bị Hủy',
			status: ['Rejected', 'Cancelled', 'Delivery_Failed'].includes(status)
				? 'error'
				: 'wait',
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
			{loading ? (
				<Loading />
			) : (
				<>
					{status === 'Pending' && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center mb-5" style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn hàng:</p>
								<p className="ml-5">Chờ Xác Nhận</p>
							</div>
							{userRoleManager ? (
								<div className="flex justify-around">
									<Button
										type="text"
										className="bg-red font-semibold w-32 rounded-full"
										onClick={handleRejectStatus}
										disabled={loading}
									>
										Hủy bỏ
									</Button>
									<Button
										type="text"
										className="bg-green font-semibold w-32 rounded-full"
										onClick={handleAcceptStatus}
										disabled={loading}
									>
										Xác nhận
									</Button>
								</div>
							) : (
								<div className="flex justify-around text-primary font-semibold">
									Vui lòng chờ Manager xác nhận
								</div>
							)}
						</div>
					)}

					{/* Chờ Thanh Toán */}
					{status === 'Processing' && (
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
									disabled={loading}
								>
									Chuẩn bị hàng hoàn tất
								</Button>
							</div>
						</div>
					)}

					{/* Thanh Toán Hoàn Tất */}
					{status === 'Prepared' && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center" style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn hàng:</p>
								<p className="ml-5">Hoàn Tất Chuẩn Bị Hàng</p>
							</div>
							{/* <div>
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
							</div> */}
						</div>
					)}

					{/* {currentStep === 3 && (
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
			)} */}

					{/* Chuyển giao shipper thành công */}
					{status === 'Delivering' && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center mb-5" style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn hàng:</p>
								<p className="ml-5">Đơn Hàng Đang Được Giao</p>
							</div>
							<div className="flex justify-around">
								{userRoleDeliverer ? (
									<Button
										type="text"
										className="bg-green font-semibold w-full rounded-full"
										onClick={handleDeliveredStatus}
									>
										Giao Hàng Thành Công
									</Button>
								) : (
									<p className="font-bold text-primary">Đang Giao Hàng Bởi ???</p>
								)}
							</div>
						</div>
					)}

					{/* {currentStep === 5 && (
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
			)} */}

					{/* Đã giao */}
					{status === 'Success' && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center " style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn hàng:</p>
								<p className="ml-5 text-darkGreen font-semibold text-lg">Đã giao</p>
							</div>
							{/* <div className="flex justify-around">
						<Button
							type="text"
							className="bg-green font-semibold w-full rounded-full"
							onClick={handleErrorStatus}
						>
							Tiếp tục
						</Button>
					</div> */}
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
				</>
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
