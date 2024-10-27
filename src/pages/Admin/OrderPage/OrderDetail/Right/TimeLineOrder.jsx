import {Button, message, Select, Steps, Typography} from 'antd';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Loading from '../../../../../components/Loading';
import {getAllDeliverySelector, GetUserDetailSelector} from '../../../../../redux/selectors';
import {
	handleOrder,
	handleOrderAssignDeliverer,
	handleOrderReject,
} from '../../../../../redux/slices/orderSlice';
import {convertToVietnamDate, getOrderStatus, getStepFromStatus} from '../../../../../utils';

const {Title, Text} = Typography;

const OrderStatus = {
	Pending: 1,
	Processing: 2,
	Prepared: 3,
	Delivering: 4,
	Delivery_Failed: 5,
	Success: 6,
	Refused: 7,
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
	const [selectedShipper, setSelectedShipper] = useState();
	const [isAssigned, setIsAssigned] = useState(false);

	useEffect(() => {
		if (orders?.Id) {
			const savedIsAssigned =
				JSON.parse(localStorage.getItem(`isAssigned_${orders.Id}`)) || false;
			setIsAssigned(savedIsAssigned);
		}
	}, [orders]);

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
			setCurrentStep(getStepFromStatus(newStatus));
		}
	}, [orders?.Status]);

	const handleRejectStatus = async () => {
		const res = await dispatch(handleOrderReject(orders.Id));
		if (res.payload) {
			message.success('Từ chối thành công!');
		} else {
			message.error('Lỗi khi từ chối đơn hàng.');
		}
	};

	const handleAcceptStatus = async () => {
		const res = await dispatch(handleOrder(orders.Id));
		if (res.payload) {
			message.success('Xác nhận thành công!');
		} else {
			message.error('Lỗi khi xác nhận đơn hàng.');
		}
	};

	const handlePreparedStatus = async () => {
		const res = await dispatch(handleOrder(orders.Id));
		if (res.payload) {
			message.success('Chuẩn bị hàng hoàn tất!');
		} else {
			message.error('Lỗi khi chuẩn bị hàng.');
		}
	};
	const handleAssignDeliverer = async () => {
		const res = await dispatch(
			handleOrderAssignDeliverer({orderId: orders.Id, delivererId: selectedShipper})
		);
		if (res.payload) {
			message.success('Đã chuyển giao cho shipper!');
			localStorage.setItem(`isAssigned_${orders.Id}`, JSON.stringify(true));
		} else {
			message.error('Lỗi khi chuyển giao cho shipper.');
		}
	};
	const handleDeliveringStatus = async () => {
		const res = await dispatch(handleOrder(orders.Id));
		if (res.payload) {
			message.success('Xác nhận giao hàng!');
		} else {
			message.error('Lỗi khi giao hàng.');
		}
	};
	const handleDeliveredStatus = async () => {
		const res = await dispatch(handleOrder(orders.Id));
		if (res.payload) {
			message.success('Hoàn tất giao hàng!');
		} else {
			message.error('Lỗi khi giao hàng.');
		}
	};

	const allSteps = [
		{
			title: 'Chờ Xác Nhận',
			subTitle: '00:01:02',
			status: `${
				OrderStatus.Pending < OrderStatus[status]
					? 'finish'
					: OrderStatus.Pending === OrderStatus[status]
					? 'process'
					: 'wait'
			}`,
		},
		{
			title: 'Đang Xử Lý',
			subTitle: '00:01:02',
			status: `${
				OrderStatus.Processing < OrderStatus[status]
					? 'finish'
					: OrderStatus.Processing === OrderStatus[status]
					? 'process'
					: 'wait'
			}`,
		},
		{
			title: 'Chuẩn Bị Đơn Hàng',
			subTitle: '00:01:02',
			status: `${
				OrderStatus.Prepared < OrderStatus[status]
					? 'finish'
					: OrderStatus.Prepared === OrderStatus[status]
					? 'process'
					: 'wait'
			}`,
		},
		{
			title: 'Đang Vận Chuyển',
			subTitle: '00:01:02',
			status: `${
				OrderStatus.Delivering < OrderStatus[status]
					? 'finish'
					: OrderStatus.Delivering === OrderStatus[status]
					? 'process'
					: 'wait'
			}`,
		},
		{
			title: 'Giao Hàng Thất Bại',
			subTitle: '00:01:02',
			status: `${
				OrderStatus.Delivery_Failed < OrderStatus[status]
					? 'finish'
					: OrderStatus.Delivery_Failed === OrderStatus[status]
					? 'process'
					: 'wait'
			}`,
		},
		{
			title: 'Giao Hàng Thành Công',
			subTitle: '00:01:02',
			status: `${OrderStatus.Success === OrderStatus[status] ? 'finish' : 'wait'}`,
		},
		{
			title: 'Đã Từ Chối',
			subTitle: '00:01:02',
			status: `${
				OrderStatus.Refused < OrderStatus[status]
					? 'finish'
					: OrderStatus.Refused === OrderStatus[status]
					? 'process'
					: 'wait'
			}`,
		},
	];

	const getReverseSteps = () => {
		return allSteps
			.filter(
				(step) =>
					step.status === 'finish' || step.status === 'process' || step.status === 'error'
			)
			.reverse();
	};

	const handleChange = (value) => {
		setSelectedShipper(value);
	};

	console.log('userRoleManager', userRoleManager);
	console.log('userRoleDeliverer', userRoleDeliverer);

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
										className="bg-primary font-semibold w-32 rounded-full"
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
									className="bg-primary font-semibold w-full rounded-full"
									onClick={handlePreparedStatus}
									disabled={loading}
								>
									Chuẩn bị hàng hoàn tất
								</Button>
							</div>
						</div>
					)}

					{/* Thanh Toán Hoàn Tất */}
					{status === 'Prepared' && userRoleManager && !isAssigned && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center" style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn hàng:</p>
								<p className="ml-5">Hoàn Tất Chuẩn Bị Hàng</p>
							</div>

							<>
								<div className="flex mt-2">
									<p className="text-red mr-1">*</p>
									<p>Chọn giao hàng</p>
								</div>
								<Select
									defaultValue=""
									className="w-full mb-5"
									onChange={handleChange}
									options={[
										{
											value: '66313c7b-53f3-4c9a-a777-64211afdbf4f',
											label: '66313c7b-53f3-4c9a-a777-64211afdbf4f',
										},
										// Additional options can be uncommented as needed
										// { value: 'thai', label: 'Thái' },
										// { value: 'minh', label: 'Minh' },
										// { value: 'tai', label: 'Tai', disabled: true },
									]}
								/>
								<div className="flex justify-around">
									<Button
										type="text"
										className="bg-primary font-semibold rounded-full w-full"
										onClick={handleAssignDeliverer}
									>
										Chuyển Giao
									</Button>
								</div>
							</>
						</div>
					)}

					{status === 'Prepared' &&
						userRoleDeliverer &&
						!userRoleManager &&
						isAssigned && (
							<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
								<div className="flex items-center mb-5" style={{fontSize: 16}}>
									<p className="font-semibold">Trạng thái đơn hàng:</p>
									<p className="ml-5">Chuyển Giao Thành Công</p>
								</div>

								<div className="flex justify-around">
									<Button
										type="text"
										className="bg-primary font-semibold rounded-full w-full"
										onClick={handleDeliveringStatus}
									>
										Bắt Đầu Giao Hàng
									</Button>
								</div>
							</div>
						)}

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
										className="bg-primary font-semibold w-full rounded-full"
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
							className="bg-primary font-semibold w-full rounded-full"
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
								<p className="ml-5 text-darkGreen font-semibold text-lg">
									Đã Giao Hàng
								</p>
							</div>
							{/* <div className="flex justify-around">
						<Button
							type="text"
							className="bg-primary font-semibold w-full rounded-full"
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
									className="bg-primary font-semibold w-full rounded-full"
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
