import {Button, Form, Input, message, Modal, Select, Steps, Timeline, Typography} from 'antd';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Loading from '../../../../../components/Loading';
import {
	getAllDeliverySelector,
	getOrderStatusDetailSelector,
	GetUserDetailSelector,
} from '../../../../../redux/selectors';
import {
	handleDeliveryFailed,
	handleOrder,
	handleOrderAssignDeliverer,
	handleOrderReject,
	handleRefundOrder,
} from '../../../../../redux/slices/orderSlice';
import {convertToVietnamDate, getOrderStatus, getStepFromStatus} from '../../../../../utils';
import {CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
import {TimeLine} from './TimeLine';

const {Title, Text} = Typography;

const ORDER_STATUS_TEXTS = {
	Pending: 'Chờ Xác Nhận',
	Processing: 'Đang Xử Lý',
	Rejected: 'Đã Từ Chối',
	Cancelled: 'Đã Hủy Đơn',
	Prepared: 'Chuẩn Bị Đơn Hàng',
	Prepared_1: 'Đơn Hàng Được Chuyển Giao',
	Delivering: 'Đang Vận Chuyển',
	Delivery_Failed: 'Giao Hàng Thất Bại',
	Success: 'Giao Hàng Thành Công',
	Refused: 'Đã Từ Chối',
};

const TimeLineOrder = ({orders, loading, statusOrder, paymentStatusOrder}) => {
	const dispatch = useDispatch();

	const userDetail = useSelector(GetUserDetailSelector);
	const deliveryList = useSelector(getAllDeliverySelector);

	const [confirmStatus, setConfirmStatus] = useState(false);
	const [currentStep, setCurrentStep] = useState(0);
	const [orderStatus, setOrderStatus] = useState('Chờ Xác Nhận');
	const [status, setStatus] = useState();
	const [userRoleManager, setUserRoleManager] = useState(false);
	const [deliveries, setDeliveries] = useState([]);
	const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
	const [userRoleStaff, setUserRoleStaff] = useState(false);
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
			const isStaff = userDetail?.Roles?.some((role) => role?.RoleName === 'staff');
			const isDeliverer = userDetail?.Roles?.some((role) => role?.RoleName === 'deliverer');

			setUserRoleManager(isManager);
			setUserRoleStaff(isStaff);
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
		if (statusOrder !== undefined) {
			const newStatus = getOrderStatus(statusOrder);
			setStatus(newStatus);
		}
	}, [statusOrder]);

	const handleAcceptStatus = async () => {
		const res = await dispatch(handleOrder(orders.Id));
		if (res.payload !== undefined) {
			message.success('Xác nhận thành công!');
		} else if (res.payload.status === 400) {
			message.error('Lỗi khi xác nhận đơn hàng.');
		}
	};

	const handlePreparedStatus = async () => {
		const res = await dispatch(handleOrder(orders.Id));
		if (res.payload !== undefined) {
			message.success('Chuẩn bị hàng hoàn tất!');
		} else if (res.payload.status === 400) {
			message.error('Lỗi khi chuẩn bị hàng.');
		}
	};
	const handleAssignDeliverer = async () => {
		const res = await dispatch(
			handleOrderAssignDeliverer({orderId: orders.Id, delivererId: selectedShipper})
		);

		if (res.payload !== undefined) {
			message.success('Đã chuyển giao cho shipper!');
			localStorage.setItem(`isAssigned_${orders.Id}`, JSON.stringify(true));
		} else if (res.payload.status === 400) {
			message.error('Lỗi khi chuyển giao cho shipper.');
		}
	};
	const handleDeliveringStatus = async () => {
		const res = await dispatch(handleOrder(orders.Id));
		if (res.payload !== undefined) {
			message.success('Xác nhận giao hàng!');
		} else if (res.payload.status === 400) {
			message.error('Lỗi khi giao hàng.');
		}
	};
	const handleDeliveredStatus = async () => {
		const res = await dispatch(handleOrder(orders.Id));
		if (res.payload !== undefined) {
			message.success('Hoàn tất giao hàng!');
		} else if (res.payload.status === 400) {
			message.error('Lỗi khi giao hàng.');
		}
	};

	const handleFailedDeliveredStatus = async () => {
		const res = await dispatch(handleDeliveryFailed(orders.Id));
		if (res.payload !== undefined) {
			message.warning('Hủy giao hàng!');
		} else if (res.payload.status === 400) {
			message.error('Lỗi khi giao hàng.');
		}
	};

	const handleRefund = async () => {
		const res = await dispatch(handleRefundOrder(orders.Id));
		if (res.payload !== undefined) {
			message.warning('Xác nhận hoàn tiền!');
		} else if (res.payload.status === 400) {
			message.error('Lỗi khi giao hàng.');
		}
	};

	const handleChange = (value) => {
		setSelectedShipper(value);
	};

	const handleCancelOrder = () => {
		setIsCancelModalVisible(true);
	};

	const submitCancelOrder = async (values) => {
		const res = await dispatch(handleOrderReject({orderId: orders.Id, reason: values.reason}));
		console.log('err', res.payload);

		if (res.payload !== undefined) {
			message.success('Từ chối thành công!');
		} else if (res.payload.status === 400) {
			message.error('Lỗi khi từ chối đơn hàng.');
		}

		setIsCancelModalVisible(false);
	};

	console.log('userRoleManager', userRoleManager);
	console.log('userRoleDeliverer', userRoleDeliverer);
	console.log('isAssigned', isAssigned);
	console.log('status', status);
	console.log('statusOrder', statusOrder);
	console.log('paymentStatusOrder', paymentStatusOrder);

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
								<p className="ml-5">
									<ClockCircleOutlined /> {ORDER_STATUS_TEXTS.Pending}
								</p>
							</div>
							{userRoleManager ? (
								<div className="flex justify-around">
									<Button
										type="text"
										className="bg-primary font-semibold w-32 rounded-full"
										onClick={handleAcceptStatus}
										disabled={loading}
									>
										Xác nhận
									</Button>
									<Button
										type="text"
										className="bg-red font-semibold w-32 rounded-full"
										onClick={handleCancelOrder}
										disabled={loading}
									>
										Hủy bỏ
									</Button>
								</div>
							) : (
								<div className="flex justify-around text-primary font-semibold">
									Vui lòng chờ Manager xác nhận
								</div>
							)}
						</div>
					)}

					{status === 'Rejected' && paymentStatusOrder === 3 && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center mb-5" style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn hàng:</p>
								<p className="ml-5 text-red font-semibold">
									<CloseCircleOutlined /> {ORDER_STATUS_TEXTS.Rejected}
								</p>
							</div>
							<div className="flex justify-around">
								<Button
									type="text"
									className="bg-primary font-semibold w-full rounded-full"
									onClick={handleRefund}
									disabled={loading}
								>
									Xác nhận hoàn tiền
								</Button>
							</div>
						</div>
					)}
					{status === 'Rejected' && paymentStatusOrder === 4 && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center " style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn hàng:</p>
								<p className="ml-5 text-red font-semibold">
									<CloseCircleOutlined /> {ORDER_STATUS_TEXTS.Rejected}
								</p>
							</div>
						</div>
					)}
					{status === 'Cancelled' && paymentStatusOrder === 3 && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center mb-5" style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn hàng:</p>
								<p className="ml-5 text-red font-semibold">
									<CloseCircleOutlined /> {ORDER_STATUS_TEXTS.Cancelled}
								</p>
							</div>
							<div className="flex justify-around">
								<Button
									type="text"
									className="bg-primary font-semibold w-full rounded-full"
									onClick={handleRefund}
									disabled={loading}
								>
									Xác nhận hoàn tiền
								</Button>
							</div>
						</div>
					)}
					{status === 'Cancelled' && paymentStatusOrder === 4 && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center " style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn hàng:</p>
								<p className="ml-5 text-red font-semibold">
									<CloseCircleOutlined /> {ORDER_STATUS_TEXTS.Cancelled}
								</p>
							</div>
						</div>
					)}
					{status === 'Processing' && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center mb-5" style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn hàng:</p>
								<p className="ml-5">
									<ClockCircleOutlined /> {ORDER_STATUS_TEXTS.Processing}
								</p>
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

					{status === 'Prepared' && !isAssigned && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center" style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn hàng:</p>
								<p className="ml-5">
									<CheckCircleOutlined /> {ORDER_STATUS_TEXTS.Prepared}
								</p>
							</div>

							{userRoleManager && (
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
												value: '4d85fc09-6854-4c61-8e55-a615887e412e',
												label: 'Shipper 1',
											},
											// Uncomment for more options
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
							)}

							{userRoleDeliverer ||
								userRoleStaff ||
								(!userRoleManager && (
									<p className="mt-3 text-center">
										Chờ Manager Chọn Chuyển Giao Đơn Hàng
									</p>
								))}
						</div>
					)}

					{status === 'Prepared' && isAssigned && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center mb-5" style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn hàng:</p>
								<p className="ml-5">
									<CheckCircleOutlined /> {ORDER_STATUS_TEXTS.Prepared}
								</p>
							</div>

							{userRoleDeliverer ? (
								<div className="flex justify-around">
									<Button
										type="text"
										className="bg-primary font-semibold rounded-full w-full"
										onClick={handleDeliveringStatus}
									>
										Bắt Đầu Giao Hàng
									</Button>
								</div>
							) : (
								<div>
									<p className="mt-3 text-center font-semibold text-primary">
										Chờ Deliverer Giao Hàng
									</p>
								</div>
							)}
						</div>
					)}

					{/* Chuyển giao shipper thành công */}
					{status === 'Delivering' && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center mb-5" style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn hàng:</p>
								<p className="ml-5">
									<ClockCircleOutlined /> {ORDER_STATUS_TEXTS.Delivering}
								</p>
							</div>
							<div className="flex justify-around">
								{userRoleDeliverer ? (
									<div className="flex items-center">
										<Button
											type="text"
											className="bg-primary font-semibold w-full rounded-full mr-5"
											onClick={handleDeliveredStatus}
										>
											Đã Giao Hàng
										</Button>
										<Button
											danger
											className="font-semibold w-full rounded-full"
											onClick={handleFailedDeliveredStatus}
										>
											Hủy Giao Hàng
										</Button>
									</div>
								) : (
									<p className="font-bold text-primary">Đang Giao Hàng Bởi ???</p>
								)}
							</div>
						</div>
					)}

					{status === 'Delivery_Failed' && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center" style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn hàng:</p>
								<p className="ml-5 font-semibold text-red">
									<CloseCircleOutlined /> {ORDER_STATUS_TEXTS.Delivery_Failed}
								</p>
							</div>
							{/* <div className="flex justify-around">
								<Button
									type="text"
									className="bg-primary font-semibold w-full rounded-full"
									// onClick={handleSuccessStatus}
								>
									Tiếp tục
								</Button>
							</div> */}
						</div>
					)}

					{/* Đã giao */}
					{status === 'Success' && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center " style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn hàng:</p>
								<p className="ml-5 text-darkGreen font-semibold text-lg">
									<CheckCircleOutlined /> Đã Giao Hàng
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

			<Title level={3}>Trạng Thái Đơn Hàng</Title>
			<TimeLine status={status} />

			<Modal
				title="Hủy Đơn"
				visible={isCancelModalVisible}
				onCancel={() => setIsCancelModalVisible(false)}
				footer={null}
			>
				<Form onFinish={submitCancelOrder}>
					<Form.Item
						label="Lý do hủy"
						name="reason"
						rules={[{required: true, message: 'Vui lòng nhập lý do hủy đơn'}]}
					>
						<Input.TextArea />
					</Form.Item>
					<div className="flex items-center justify-center">
						<Button type="text" className="bg-primary" htmlType="submit">
							Xác nhận hủy
						</Button>
					</div>
				</Form>
			</Modal>
		</div>
	);
};

export default TimeLineOrder;
