import React, {useEffect, useState} from 'react';

import {
	CheckCircleOutlined,
	ClockCircleOutlined,
	CloseCircleOutlined,
	InboxOutlined,
	UploadOutlined,
} from '@ant-design/icons';
import CircleIcon from '@mui/icons-material/Circle';
import {
	Button,
	Form,
	Input,
	InputNumber,
	message,
	Modal,
	Select,
	Space,
	Typography,
	Upload,
} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import Loading from '../../../../../components/Loading';
import {getAllDelivererSelector, GetUserDetailSelector} from '../../../../../redux/selectors';
import {
	handleAddTransfer,
	handleConfirmTransfer,
	handleConfirmTransferStaff,
	handleDeliveryFailed,
	handleOrderAssignDeliverer,
	handleOrderReject,
	handleRedeliver,
	handleRefundOrder,
} from '../../../../../redux/slices/orderSlice';
import {getDelivererAccount} from '../../../../../redux/slices/userSlice';
import {getOrderStatus} from '../../../../../utils';
import {TimeLine} from './TimeLine';
import {handleOrder} from '../../../../../redux/slices/paymentSlice';

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

const TimeLineOrder = ({
	orders,
	loading,
	statusOrder,
	paymentStatusOrder,
	id,
	userDetail,
	setCompleted,
}) => {
	const dispatch = useDispatch();

	const delivererList = useSelector(getAllDelivererSelector);

	const [status, setStatus] = useState();
	const [userRoleManager, setUserRoleManager] = useState(false);
	const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
	const [userRoleStaff, setUserRoleStaff] = useState(false);
	const [userRoleDeliverer, setUserRoleDeliverer] = useState(false);
	const [selectedShipper, setSelectedShipper] = useState();
	const [deliverer, setDeliverer] = useState([]);
	const [amount, setAmount] = useState(null);
	const [transactionCode, setTransactionCode] = useState(null);
	const [fileList, setFileList] = useState([]);
	const [images, setImages] = useState([]);
	const [video, setVideo] = useState(null);

	console.log('video', video);

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

	const handleImageChange = ({fileList}) => {
		setImages(fileList);
	};

	const handleVideoChange = (info) => {
		console.log('info', info);

		if (info.fileList && info.fileList.length > 0) {
			const latestFile = info.fileList[info.fileList.length - 1]; // Lấy file cuối cùng
			if (latestFile.originFileObj) {
				setVideo(latestFile.originFileObj); // Gán video vào state
			} else {
				console.error('Không tìm thấy originFileObj trong fileList:', info.fileList);
			}
		} else {
			console.error('fileList trống hoặc không hợp lệ:', info);
		}
	};

	const handleAmountChange = (value) => {
		setAmount(value);
	};

	const handleTransactionCodeChange = (e) => {
		setTransactionCode(e.target.value);
	};

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
		if (!amount || !transactionCode) {
			// If either amount or transactionCode is empty, show an error message
			message.error('Vui lòng nhập đầy đủ số tiền và mã giao dịch');
			return;
		}

		const transaction = orders?.Transactions.find((txn) => txn.Status === 1);

		if (transaction) {
			const {Id: transactionId} = transaction; // Destructure to get the transaction Id
			console.log('transactionId', transactionId);

			dispatch(
				handleConfirmTransfer({orderId: orders.Id, transactionId, amount, transactionCode})
			)
				.unwrap()
				.then(() => {
					message.success('Xác nhận thành công!');
					setAmount(null);
					setTransactionCode(null);
				})
				.catch((error) => {
					message.error(error?.data?.title || error?.detail);
				});
		} else {
			message.error('Không tìm thấy giao dịch');
		}
	};

	const handleAcceptDelivered = () => {
		Modal.confirm({
			title: 'Đồng ý xác nhận đơn hàng này',
			content: 'Bạn có chắc chắn muốn tiếp tục?',
			okText: 'Xác nhận',
			cancelText: 'Hủy',
			okType: 'primary',
			onOk: handleAcceptDeliveredStatus,
		});
	};

	const handleAcceptDeliveredStatus = async () => {
		if (!amount || !transactionCode) {
			message.error('Vui lòng nhập đầy đủ số tiền và mã giao dịch');
			return;
		}

		const transaction = orders?.Transactions.find((txn) => txn.Status === 1);

		if (transaction) {
			const {Id: transactionId} = transaction;
			console.log('transactionId', transactionId);

			dispatch(
				handleConfirmTransferStaff({
					orderId: orders.Id,
					transactionId,
					amount,
					transactionCode,
				})
			)
				.unwrap()
				.then(() => {
					message.success('Xác nhận thành công!');
					setAmount(null);
					setTransactionCode(null);
				})
				.catch((error) => {
					message.error(error?.detail);
				});
		} else {
			message.error('Không tìm thấy giao dịch');
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
		dispatch(handleOrder({id: orders.Id, confirmImages: null, confirmVideo: null}))
			.unwrap()
			.then((res) => {
				message.success('Chuẩn bị hàng hoàn tất!');
				setCompleted(res);
			})
			.catch((error) => {
				message.error(error?.detail);
			});
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
		dispatch(handleOrderAssignDeliverer({orderId: orders.Id, delivererId: selectedShipper}))
			.unwrap()
			.then(() => {
				message.success('Đã chuyển giao cho nhân viên vận chuyển!');
			})
			.catch((error) => {
				message.error(error?.detail);
			});
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

	const handleDeliveringStatus = () => {
		dispatch(handleOrder({id: orders.Id, confirmImages: null, confirmVideo: null}))
			.unwrap()
			.then(() => {
				message.success('Xác nhận giao hàng!');
				setCompleted(res);
			})
			.catch((error) => {
				message.error(error?.detail);
			});
	};

	const handleDelivered = () => {
		Modal.confirm({
			title: 'Xác nhận giao hàng thành công đơn đặt hàng này',
			okText: 'Xác nhận',
			okType: 'primary',
			cancelText: 'Hủy',
			onOk: handleDeliveredStatus,
		});
	};

	const handleDeliveredStatus = () => {
		if (!images.length && !video) {
			message.error('Vui lòng tải lên ít nhất một hình ảnh hoặc video!');
			return;
		}

		const confirmImages = images.map((file) => file.originFileObj);

		dispatch(
			handleOrder({
				id: orders.Id,
				confirmImages,
				confirmVideo: video,
			})
		)
			.unwrap()
			.then((res) => {
				message.success('Hoàn tất giao hàng!');
				setCompleted(res);
			})
			.catch((error) => {
				message.error(error?.detail);
			});
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

	const handleFailedDeliveredStatus = () => {
		dispatch(handleDeliveryFailed(orders.Id))
			.unwrap()
			.then((res) => {
				message.warning('Giao hàng không thành công!');
			})
			.catch((error) => {
				message.error(error?.data?.title || error?.detail);
			});
	};

	const handleRefund = () => {
		Modal.confirm({
			title: 'Xác nhận hoàn tiền đơn đặt hàng này',
			// icon: <CheckCircleOutlined />,
			content: 'Bạn có chắc chắn muốn tiếp tục?',
			okText: 'Xác nhận',
			cancelText: 'Hủy',
			okType: 'danger',
			onOk: handleRefundStatus,
		});
	};
	const handleRefundSuccess = () => {
		Modal.success({
			title: 'Đã Hoàn Tiền Thành Công Đơn Đặt Hàng Này!',
			icon: <CheckCircleOutlined />,
			// content: 'Bạn có chắc chắn muốn tiếp tục?',
			okText: 'Xác nhận',
			okType: 'primary',
			okCancel: false,
			// footer: null,
		});
	};

	const handleRefundStatus = async () => {
		dispatch(handleRefundOrder(orders.Id))
			.unwrap()
			.then((res) => {
				handleRefundSuccess();
			})
			.catch((error) => {
				message.error(error?.data?.title || error?.detail);
			});
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
		dispatch(handleRedeliver({orderId: orders.Id, delivererId: selectedShipper}))
			.unwrap()
			.then((res) => {
				message.success('Đã chuyển giao cho nhân viên vận chuyển!');
			})
			.catch((error) => {
				message.error(error?.data?.title || error?.detail);
			});
	};

	const submitCancelOrder = (values) => {
		dispatch(handleOrderReject({orderId: orders.Id, reason: values.reason}))
			.unwrap()
			.then((res) => {
				message.success('Từ chối thành công!');
			})
			.catch((error) => {
				message.error(error?.data?.title || error?.detail);
			});

		setIsCancelModalVisible(false);
	};

	const handleCompleted = () => {
		Modal.confirm({
			title: 'Bạn có chắc chắn muốn tải lên ảnh này!',
			// content: 'Bạn có chắc chắn muốn tiếp tục?',
			okText: 'Đồng Ý',
			cancelText: 'Hủy Bỏ',
			onOk: handleAdd,
		});
	};

	const handleAdd = () => {
		dispatch(handleAddTransfer({OrderId: orders.Id, Evidence: fileList}))
			.unwrap()
			.then((res) => {})
			.catch((error) => {
				message.error(error.detail || error.title);
			});
	};

	const handleFileChange = ({file, fileList}) => {
		// Chỉ giữ lại file mới nhất, không thêm file vào danh sách cũ
		setFileList(fileList.slice(-1)); // Giữ lại 1 file
	};

	const beforeUpload = (file) => {
		// Chặn upload tự động và thêm file vào state
		setFileList([file]); // Chỉ giữ lại file này
		return false;
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
								<p className="ml-5 text-primary font-semibold">
									<ClockCircleOutlined /> {ORDER_STATUS_TEXTS.Pending}
								</p>
							</div>
							{orders?.Transactions?.length > 0 ? (
								<>
									<div className="my-5">
										<Title level={5}>
											Xác Nhận Thông Tin Giao Dịch Từ Ngân Hàng
										</Title>

										<div className="my-2">
											<label className="font-semibold text-base">
												Số Tiền
											</label>
											<InputNumber
												className="w-full"
												value={amount}
												onChange={handleAmountChange}
												min={0} // Optional: Ensures the number is non-negative
												placeholder="Nhập số tiền"
											/>
										</div>

										<div className="my-2">
											<label className="font-semibold text-base">
												Mã Giao Dịch
											</label>
											<Input
												value={transactionCode}
												onChange={handleTransactionCodeChange}
												placeholder="Nhập mã giao dịch"
											/>
										</div>
									</div>
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
								</>
							) : (
								<div className="text-center">
									<div className="font-semibold text-base text-darkBlue mb-5">
										Chờ Nhân Viên Giao Hàng Xác Nhận
									</div>
									<div className="flex justify-around">
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
											deliverer.map((user) => (
												<Option
													key={user?.Account?.Id}
													value={user?.Account?.Id}
													disabled={!user?.IsFree}
												>
													<div className="flex ">
														<div className="mr-3">
															<CircleIcon
																style={{
																	color: user?.IsFree
																		? 'green'
																		: 'red',
																	fontSize: '16px',
																}}
															/>
														</div>
														<div>
															<div className="flex items-center">
																<Space className="font-semibold">
																	{user?.Account?.FirstName}
																	{user?.Account?.LastName} •{' '}
																</Space>
																{user?.Account?.Email}{' '}
															</div>
															{user?.BusyMessage}
														</div>
													</div>
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
					{status === 'Delivering' && orders?.PaymentType === 1 && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center mb-5" style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn hàng:</p>
								<p className="ml-5 text-primary font-semibold">
									<ClockCircleOutlined /> {ORDER_STATUS_TEXTS.Delivering}
								</p>
							</div>
							<div className="flex justify-around">
								{!userRoleDeliverer && (
									<div className="font-semibold text-base text-darkBlue">
										Chờ Nhân Viên Giao Hàng Xác Nhận
									</div>
								)}
								{userRoleDeliverer && (
									<div className="">
										<Upload
											listType="picture-card"
											multiple
											beforeUpload={() => false} // Để không tự động upload, chỉ lấy file
											onChange={handleImageChange}
										>
											<Button icon={<UploadOutlined />}>Upload Ảnh</Button>
										</Upload>

										<Upload
											listType="text"
											beforeUpload={() => false}
											onChange={handleVideoChange}
											accept="video/*"
										>
											<Button icon={<UploadOutlined />}>Upload Video</Button>
										</Upload>
										<Space className="mt-5 flex items-center justify-center">
											<Button
												type="text"
												className="font-semibold w-full rounded-full bg-primary"
												onClick={handleDelivered}
												loading={loading}
											>
												Giao Hàng Thành Công
											</Button>
											<Button
												danger
												className="font-semibold w-full rounded-full"
												onClick={handleFailedDelivered}
											>
												Giao Hàng Thất Bại
											</Button>
										</Space>
									</div>
								)}
							</div>
						</div>
					)}
					{status === 'Delivering' && orders?.PaymentType === 2 && (
						<div className="border rounded-lg border-primary bg-tintWhite p-5 mb-5">
							<div className="flex items-center mb-5" style={{fontSize: 16}}>
								<p className="font-semibold">Trạng thái đơn hàng:</p>
								<p className="ml-5 text-primary font-semibold">
									<ClockCircleOutlined /> {ORDER_STATUS_TEXTS.Delivering}
								</p>
							</div>
							<div className="flex justify-around">
								{!userRoleDeliverer && (
									<div className="">
										{orders?.Transactions?.find(
											(transaction) => transaction.Status === 1
										) ? (
											<>
												<div className="my-5">
													<Title level={5}>
														Xác Nhận Thông Tin Giao Dịch Từ Ngân Hàng
													</Title>

													<div className="my-2">
														<label className="font-semibold text-base">
															Số Tiền
														</label>
														<InputNumber
															className="w-full"
															value={amount}
															onChange={handleAmountChange}
															min={0} // Đảm bảo số không âm
															placeholder="Nhập số tiền"
														/>
													</div>

													<div className="my-2">
														<label className="font-semibold text-base">
															Mã Giao Dịch
														</label>
														<Input
															value={transactionCode}
															onChange={handleTransactionCodeChange}
															placeholder="Nhập mã giao dịch"
														/>
													</div>
												</div>

												<Space className="mt-5 flex items-center justify-center">
													<Button
														type="text"
														className="font-semibold w-full rounded-full bg-primary"
														onClick={handleAcceptDelivered}
														loading={loading}
													>
														Xác Nhận Thành Công
													</Button>
													<Button
														danger
														className="font-semibold w-full rounded-full"
														onClick={handleFailedDelivered}
													>
														Từ Chối
													</Button>
												</Space>
											</>
										) : (
											<div className="font-semibold text-base text-darkBlue">
												Chờ Nhân Viên Giao Hàng Xác Nhận
											</div>
										)}
									</div>
								)}

								{userRoleDeliverer && (
									<div className="">
										{orders?.Transactions?.length === 1 &&
										orders?.Transactions?.some(
											(transaction) => transaction.Status !== 1
										) ? (
											<>
												<div className="mt-6">
													<h4 className="text-lg font-medium mb-2">
														Tải ảnh đã thanh toán
													</h4>
													<div className="flex items-center justify-center">
														<Upload.Dragger
															listType="picture-card"
															fileList={fileList}
															onChange={handleFileChange}
															beforeUpload={beforeUpload}
															maxCount={1} // Giới hạn số lượng file
															accept="image/*"
															capture="camera"
														>
															<p className="ant-upload-drag-icon">
																<InboxOutlined />
															</p>
															<p className="ant-upload-text">
																Nhấp hoặc kéo tệp vào khu vực này để
																tải lên
															</p>
															<p className="ant-upload-hint">
																Hỗ trợ cho một lần tải lên. Kéo tệp
																vào đây hoặc nhấp để tải lên.
															</p>
														</Upload.Dragger>
													</div>
												</div>
												<Space className="mt-5 flex items-center justify-center">
													<Button
														type="text"
														className="font-semibold w-full rounded-full bg-primary"
														onClick={handleCompleted}
														loading={loading}
													>
														Gửi
													</Button>
													<Button
														danger
														className="font-semibold w-full rounded-full"
														onClick={handleFailedDelivered}
													>
														Giao Hàng Thất Bại
													</Button>
												</Space>
											</>
										) : orders?.Transactions?.some(
												(transaction) => transaction.Status === 1
										  ) ? (
											<div className="font-semibold text-base text-darkBlue">
												Chờ Quản Lý, Nhân Viên Xác Nhận
											</div>
										) : (
											<>
												<Upload
													listType="picture-card"
													multiple
													beforeUpload={() => false} // Để không tự động upload, chỉ lấy file
													onChange={handleImageChange}
													maxCount={3}
												>
													<Button icon={<UploadOutlined />}>
														Tải Ảnh
													</Button>
												</Upload>

												<Upload
													listType="text"
													beforeUpload={() => false}
													onChange={handleVideoChange}
													accept="video/*"
												>
													<Button icon={<UploadOutlined />}>
														Tải Video
													</Button>
												</Upload>
												<Space className="mt-5 flex items-center justify-center">
													<Button
														type="text"
														className="font-semibold w-full rounded-full bg-primary"
														onClick={handleDelivered}
														loading={loading}
													>
														Giao Hàng Thành Công
													</Button>
													<Button
														danger
														className="font-semibold w-full rounded-full"
														onClick={handleFailedDelivered}
													>
														Giao Hàng Thất Bại
													</Button>
												</Space>
											</>
										)}
									</div>
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
