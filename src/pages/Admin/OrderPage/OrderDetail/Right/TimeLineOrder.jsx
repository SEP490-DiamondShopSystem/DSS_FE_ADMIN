import React, {useEffect, useState} from 'react';

import {CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
import CircleIcon from '@mui/icons-material/Circle';
import {Button, Form, Input, message, Modal, Select, Space, Typography} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import Loading from '../../../../../components/Loading';
import {
	getAllDelivererSelector,
	getAllDeliverySelector,
	GetUserDetailSelector,
} from '../../../../../redux/selectors';
import {
	handleDeliveryFailed,
	handleOrder,
	handleOrderAssignDeliverer,
	handleOrderReject,
	handleRedeliver,
	handleRefundOrder,
} from '../../../../../redux/slices/orderSlice';
import {getAllUser, getDelivererAccount} from '../../../../../redux/slices/userSlice';
import {convertToVietnamDate, getOrderStatus} from '../../../../../utils';
import {TimeLine} from './TimeLine';

const {Title, Text} = Typography;
const {Option} = Select;

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

const TimeLineOrder = ({orders, loading, statusOrder, paymentStatusOrder, id}) => {
	const dispatch = useDispatch();

	const userDetail = useSelector(GetUserDetailSelector);
	const deliveryList = useSelector(getAllDeliverySelector);
	const delivererList = useSelector(getAllDelivererSelector);

	const [currentStep, setCurrentStep] = useState(0);
	const [status, setStatus] = useState();
	const [userRoleManager, setUserRoleManager] = useState(false);
	const [deliveries, setDeliveries] = useState([]);
	const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
	const [userRoleStaff, setUserRoleStaff] = useState(false);
	const [userRoleDeliverer, setUserRoleDeliverer] = useState(false);
	const [selectedShipper, setSelectedShipper] = useState();
	const [isAssigned, setIsAssigned] = useState(false);
	const [deliverer, setDeliverer] = useState([]);

	useEffect(() => {
		dispatch(getDelivererAccount());
	}, [dispatch]);

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
		if (delivererList) {
			setDeliverer(delivererList);
		}
	}, [delivererList]);

	useEffect(() => {
		if (statusOrder !== undefined) {
			const newStatus = getOrderStatus(statusOrder);
			setStatus(newStatus);
		}
	}, [statusOrder]);

	const handleAccept = () => {
		Modal.confirm({
			title: 'Đồng ý xác nhận đơn hàng này',
			content: 'Bạn có chắc chắn muốn tiếp tục?',
			okText: 'Xác nhận',
			cancelText: 'Hủy',
			okType: 'primary',
			onOk: handleAcceptStatus,
		});
	};

	const handleAcceptStatus = async () => {
		const res = await dispatch(handleOrder(orders.Id));
		if (res.payload !== undefined) {
			message.success('Xác nhận thành công!');
		} else {
			message.error(error?.data?.title || error?.detail);
		}
	};

	const handlePrepared = () => {
		Modal.confirm({
			title: 'Hoàn tất chuẩn bị đơn đặt hàng này',
			content: 'Bạn có chắc chắn muốn tiếp tục?',
			okText: 'Xác nhận',
			cancelText: 'Hủy',
			okType: 'primary',
			onOk: handlePreparedStatus,
		});
	};

	const handlePreparedStatus = async () => {
		const res = await dispatch(handleOrder(orders.Id));
		if (res.payload !== undefined) {
			message.success('Chuẩn bị hàng hoàn tất!');
		} else {
			message.error(error?.data?.title || error?.detail);
		}
	};

	const handleAssignDeliverer = () => {
		Modal.confirm({
			title: 'Xác nhận chuyển giao đơn đặt hàng này',
			content: 'Bạn có chắc chắn muốn tiếp tục?',
			okText: 'Xác nhận',
			cancelText: 'Hủy',
			okType: 'primary',
			onOk: handleAssignDelivererStatus,
		});
	};

	const handleAssignDelivererStatus = async () => {
		const res = await dispatch(
			handleOrderAssignDeliverer({orderId: orders.Id, delivererId: selectedShipper})
		);

		if (res.payload !== undefined) {
			message.success('Đã chuyển giao cho shipper!');
			localStorage.setItem(`isAssigned_${orders.Id}`, JSON.stringify(true));
		} else {
			message.error(error?.data?.title || error?.detail);
		}
	};

	const handleDelivering = () => {
		Modal.confirm({
			title: 'Bắt đầu giao đơn đặt hàng này',
			content: 'Bạn có chắc chắn muốn tiếp tục?',
			okText: 'Xác Nhận',
			cancelText: 'Hủy',
			okType: 'primary',
			onOk: handleDeliveringStatus,
		});
	};

	const handleDeliveringStatus = async () => {
		const res = await dispatch(handleOrder(orders.Id));
		if (res.payload !== undefined) {
			message.success('Xác nhận giao hàng!');
		} else {
			message.error(error?.data?.title || error?.detail);
		}
	};

	const handleDelivered = () => {
		Modal.confirm({
			title: 'Xác nhận giao hàng thành công đơn đặt hàng này',
			content: 'Bạn có chắc chắn muốn tiếp tục?',
			okText: 'Xác nhận',
			okType: 'primary',
			cancelText: 'Hủy',
			onOk: handleDeliveredStatus,
		});
	};

	const handleDeliveredStatus = async () => {
		const res = await dispatch(handleOrder(orders.Id));
		if (res.payload !== undefined) {
			message.success('Hoàn tất giao hàng!');
		} else {
			message.error(error?.data?.title || error?.detail);
		}
	};

	const handleFailedDelivered = () => {
		Modal.confirm({
			title: 'Xác nhận hủy giao đơn đặt hàng này',
			content: 'Bạn có chắc chắn muốn tiếp tục?',
			okText: 'Xác nhận',
			cancelText: 'Hủy',
			okType: 'danger',
			onOk: handleFailedDeliveredStatus,
		});
	};

	const handleFailedDeliveredStatus = async () => {
		const res = await dispatch(handleDeliveryFailed(orders.Id));
		if (res.payload !== undefined) {
			message.warning('Đơn hàng giao hàng không thành công!');
		} else {
			message.error(error?.data?.title || error?.detail);
		}
	};

	const handleRefund = async () => {
		const res = await dispatch(handleRefundOrder(orders.Id));
		if (res.payload !== undefined) {
			message.warning('Xác nhận hoàn tiền!');
		} else {
			message.error(error?.data?.title || error?.detail);
		}
	};

	const handleChange = (value) => {
		setSelectedShipper(value);
	};

	const handleCancelOrder = () => {
		setIsCancelModalVisible(true);
	};

	const handleRedeliverBtn = () => {
		Modal.confirm({
			title: 'Xác nhận giao lại đơn đặt hàng này',
			content: 'Bạn có chắc chắn muốn tiếp tục?',
			okText: 'Xác nhận',
			cancelText: 'Hủy',
			okType: 'primary',
			onOk: handleRedeliverStatus,
		});
	};

	const handleRedeliverStatus = () => {
		dispatch(handleRedeliver({orderId: orders.Id, delivererId: selectedShipper})).then(
			(res) => {
				if (res.payload !== undefined) {
					message.success('Đã chuyển giao cho shipper!');
					localStorage.setItem(`isAssigned_${orders.Id}`, JSON.stringify(true));
				} else {
					message.error(error?.data?.title || error?.detail);
				}
			}
		);
	};

	const submitCancelOrder = async (values) => {
		const res = await dispatch(handleOrderReject({orderId: orders.Id, reason: values.reason}));

		if (res.payload !== undefined) {
			message.success('Từ chối thành công!');
		} else {
			message.error(error?.data?.title || error?.detail);
		}

		setIsCancelModalVisible(false);
	};

	console.log('orders', orders);

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
								<p className="ml-5 text-primary font-semibold">
									<ClockCircleOutlined /> {ORDER_STATUS_TEXTS.Pending}
								</p>
							</div>
							{userRoleManager || userRoleManager ? (
								<div className="flex justify-around">
									<Button
										type="text"
										className="bg-primary font-semibold w-32 rounded-full"
										onClick={handleAccept}
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
										Hủy đơn
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
								<p className="ml-5 text-primary font-semibold">
									<ClockCircleOutlined /> {ORDER_STATUS_TEXTS.Processing}
								</p>
							</div>
							<div className="flex justify-around">
								<Button
									type="text"
									className="bg-primary font-semibold rounded-full"
									onClick={handlePrepared}
									disabled={loading}
								>
									Chuẩn bị hàng hoàn tất
								</Button>
								<Button
									type="text"
									className="bg-red font-semibold w-32 rounded-full"
									onClick={handleCancelOrder}
									disabled={loading}
								>
									Hủy đơn
								</Button>
							</div>
						</div>
					)}

					{status === 'Prepared' && !userRoleDeliverer && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center" style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn hàng:</p>
								<p className="ml-5 text-darkGreen font-semibold">
									<CheckCircleOutlined /> {ORDER_STATUS_TEXTS.Prepared}
								</p>
							</div>
							{orders && orders?.DelivererId === null ? (
								<>
									<div className="flex mt-2">
										<p className="text-red mr-1">*</p>
										<p>Chọn giao hàng</p>
									</div>
									<Select
										defaultValue=""
										className="w-full mb-5"
										onChange={handleChange}
									>
										{deliverer &&
											deliverer?.map((user) => (
												<Option key={user?.Account?.Id}>
													<Space>
														{user?.Account?.Email}{' '}
														<div>
															<CircleIcon
																style={{
																	color: user?.IsFree
																		? 'green'
																		: 'red',
																	fontSize: '16px',
																}}
															/>
														</div>
														{user?.BusyMessage}
													</Space>
												</Option>
											))}
									</Select>
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
							) : (
								<div>
									<p className="mt-3 text-center font-semibold text-primary">
										Đơn Hàng Đã Chuyển Giao Cho Nhân Viên Giao Hàng
									</p>
								</div>
							)}

							{/* {userRoleDeliverer ||
								userRoleStaff ||
								(!userRoleManager && (
									<p className="mt-3 text-center">
										Chờ Manager Chọn Chuyển Giao Đơn Hàng
									</p>
								))} */}
						</div>
					)}

					{status === 'Prepared' && userRoleDeliverer && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center mb-5" style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn hàng:</p>
								<p className="ml-5 text-darkGreen font-semibold">
									<CheckCircleOutlined /> {ORDER_STATUS_TEXTS.Prepared}
								</p>
							</div>

							{userRoleDeliverer && (
								<div className="flex justify-around">
									<Button
										type="text"
										className="bg-primary font-semibold rounded-full w-full"
										onClick={handleDelivering}
									>
										Bắt Đầu Giao Hàng
									</Button>
								</div>
							)}
						</div>
					)}

					{/* Chuyển giao shipper thành công */}
					{status === 'Delivering' && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center mb-5" style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn hàng:</p>
								<p className="ml-5 text-primary font-semibold">
									<ClockCircleOutlined /> {ORDER_STATUS_TEXTS.Delivering}
								</p>
							</div>
							<div className="flex justify-around">
								{userRoleDeliverer ? (
									<div className="flex items-center">
										<Button
											type="text"
											className="bg-primary font-semibold w-full rounded-full mr-5"
											onClick={handleDelivered}
										>
											Đã Giao Hàng
										</Button>
										<Button
											danger
											className="font-semibold w-full rounded-full"
											onClick={handleFailedDelivered}
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

					{status === 'Delivery_Failed' && userRoleStaff && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center mb-5" style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn hàng:</p>
								<p className="ml-5 font-semibold text-red">
									<CloseCircleOutlined /> {ORDER_STATUS_TEXTS.Delivery_Failed}
								</p>
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
								>
									{deliverer &&
										deliverer?.map((user) => (
											<Option key={user?.Account?.Id}>
												<Space>
													{user?.Account?.Email}{' '}
													<div>
														<CircleIcon
															style={{
																color: user?.IsFree
																	? 'green'
																	: 'red',
																fontSize: '16px',
															}}
														/>
													</div>
													{user?.BusyMessage}
												</Space>
											</Option>
										))}
								</Select>
								<div className="flex justify-around">
									<Button
										type="text"
										className="bg-primary font-semibold w-full rounded-full"
										onClick={handleRedeliverBtn}
									>
										Giao Lại
									</Button>
								</div>
							</>
						</div>
					)}

					{status === 'Delivery_Failed' && userRoleDeliverer && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center" style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn hàng:</p>
								<p className="ml-5 font-semibold text-red">
									<CloseCircleOutlined /> {ORDER_STATUS_TEXTS.Delivery_Failed}
								</p>
							</div>
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
			<TimeLine status={status} loading={loading} id={id} orders={orders} />

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
