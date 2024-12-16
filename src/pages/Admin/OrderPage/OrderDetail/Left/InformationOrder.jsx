import React, {useEffect, useState} from 'react';

import {ArrowLeftOutlined, CreditCardOutlined, PlusOutlined} from '@ant-design/icons';
import {
	Button,
	Col,
	Divider,
	Image,
	Input,
	message,
	Modal,
	Row,
	Table,
	Tag,
	Typography,
	Upload,
	Spin,
	Carousel,
	Space,
} from 'antd';

import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {
	LoadingOrderSelector,
	selectOrderFilesLoading,
	selectOrderFilesError,
} from '../../../../../redux/selectors';
import {
	handleOrderLogDeliver,
	handleOrderLogProcessing,
} from '../../../../../redux/slices/orderSlice';
import {fetchOrderFiles} from '../../../../../redux/slices/orderFileSlice';
import {
	formatPrice,
	getOrderItemStatusTag,
	getOrderStatus,
	getOrderStatusTag,
} from '../../../../../utils';
import {getTransactionByOrderId} from '../../../../../redux/slices/transactionSlice';

const {Title, Text} = Typography;

const InformationOrder = ({orders, statusOrder, paymentStatusOrder, userDetail}) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const loading = useSelector(LoadingOrderSelector);

	const orderStatus = getOrderStatusTag(paymentStatusOrder);
	const status = getOrderStatus(statusOrder);
	const orderFilesLoading = useSelector(selectOrderFilesLoading);
	const orderFilesError = useSelector(selectOrderFilesError);

	const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
	const [dataSource, setDataSource] = useState([]);
	const [description, setDescription] = useState('');
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const [previewTitle, setPreviewTitle] = useState('');
	const [fileList, setFileList] = useState([]);
	const [messageProcessing, setMessageProcessing] = useState();
	const [imageFiles, setImageFiles] = useState([]);
	const [delivererRole, setDelivererRole] = useState();
	const [orderFiles, setOrderFiles] = useState(null);
	const [transaction, setTransaction] = useState(null);

	useEffect(() => {
		if (userDetail) {
			const isDeliverer = userDetail?.Roles?.some((role) => role?.Id === '44');
			setDelivererRole(isDeliverer);
		}
	}, []);
	useEffect(() => {
		if (statusOrder === 8 && orders?.Id) {
			dispatch(fetchOrderFiles(orders.Id))
				.unwrap()
				.then((files) => {
					setOrderFiles(files);
				})
				.catch((error) => {
					message.error('Không thể tải chứng từ');
				});
		}
	}, [statusOrder, orders?.Id, dispatch]);
	// Responsive check
	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768);
			// Adjust page size based on screen size
			// setPageSize(window.innerWidth <= 768 ? 5 : 10);
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		if (orders) {
			const newDataSource = [
				{
					orderId: orders?.Id,
					orderCode: orders?.OrderCode,
					orderTime: orders?.CreatedDate,
					price: formatPrice(orders?.TotalPrice),
					shippingPrice: formatPrice(orders?.ShippingFee),
					status: getOrderStatus(orders?.Status),
					paymentStatus: orders?.PaymentStatus,
					products: orders?.Items?.map((item) => ({
						productId: item?.Id,
						productCode: item?.Diamond?.SerialCode || item?.Jewelry?.SerialCode,
						productName: item?.Jewelry?.Model?.Name || item?.Diamond?.Title,
						productStatus: item?.Status,
						productPrice: formatPrice(item?.PurchasedPrice),
					})),
					UserRankAmountSaved: orders?.UserRankAmountSaved,
					...orders,
				},
			];

			setDataSource(newDataSource);
		}
	}, [orders]);

	useEffect(() => {
		if (orders?.Id) {
			dispatch(getTransactionByOrderId(orders?.Id))
				.unwrap()
				.then((res) => {
					setTransaction(res?.Transactions);
				});
		}
	}, [orders]);

	const mobileColumns = [
		{
			title: 'Đơn Hàng',
			render: (record) => (
				<div className="flex flex-col">
					<div className="font-bold">ID: {record.orderCode}</div>
					<div>Thời Gian: {record.orderTime}</div>
					<div className="flex items-center">
						<span className="mr-2">Phí Giao Hàng:</span>
						{record.shippingPrice}
					</div>
					{record?.UserRankAmountSaved !== 0 && (
						<div className="flex items-center">
							<span className="mr-2">Giảm Giá:</span>-
							{formatPrice(record.UserRankAmountSaved)}
						</div>
					)}
					<div className="font-bold text-darkGreen">Tổng Giá: {record.price}</div>
				</div>
			),
		},
	];
	const columns = [
		{
			title: 'Mã đơn hàng',
			dataIndex: 'orderCode',
			// align: 'center',
		},
		{
			title: 'Thời gian đặt hàng',
			dataIndex: 'orderTime',
			// align: 'center',
		},

		{
			title: 'Phí phát sinh',
			dataIndex: 'price',
			// align: 'center',
			render: (_, record) => (
				<div className="flex flex-col">
					<div>Phí giao hàng: {record.shippingPrice}</div>
					{record?.UserRankAmountSaved !== 0 && (
						<div>Khách hàng thân thiết: -{formatPrice(record.UserRankAmountSaved)}</div>
					)}
				</div>
			),
		},
		{
			title: 'Tổng giá',
			dataIndex: 'price',
			// align: 'center',
			render: (_, record) => (
				<div className="flex flex-col">
					<div className="">{record.price}</div>
				</div>
			),
		},
	];

	const expandedColumns = [
		{
			title: 'Mã sản phẩm',
			dataIndex: 'productCode',
			key: 'productCode',
			align: 'center',
		},
		{
			title: 'Sản phẩm',
			dataIndex: 'productName',
			key: 'productName',
			align: 'center',
		},
		{
			title: 'Giá',
			dataIndex: 'productPrice',
			key: 'productPrice',
			align: 'center',
		},
		{
			title: 'Trạng Thái',
			dataIndex: 'productStatus',
			key: 'productStatus',
			align: 'center',
			render: (productStatus) => getOrderItemStatusTag(productStatus),
		},
	];
	const expandedMobileColumns = [
		{
			title: 'Sản Phẩm',
			render: (product) => (
				<div className="flex flex-col">
					<div className="font-bold">Mã Sản Phẩm: {product.productCode}</div>
					<div className="flex items-center">{product.productName}</div>
					<div className="font-bold text-darkGreen">Giá: {product.productPrice}</div>
					<div className="font-semibold">
						Trạng Thái: {getOrderItemStatusTag(product.productStatus)}
					</div>
				</div>
			),
		},
	];

	const expandedRowRender = (record) => {
		return (
			<Table
				columns={isMobile ? expandedMobileColumns : expandedColumns}
				dataSource={record.products}
				pagination={false}
				rowKey="productId"
			/>
		);
	};

	const handleDescription = (e) => {
		setMessageProcessing(e.target.value);
	};

	const handleCancel = () => setPreviewOpen(false);

	const handlePreview = async (file) => {
		setPreviewImage(file.url || file.thumbUrl);
		setPreviewOpen(true);
		setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
	};

	const handleChange = ({fileList: newFileList}) => {
		setFileList(newFileList);
	};

	const handleLogProcessing = () => {
		dispatch(
			handleOrderLogProcessing({
				orderId: orders?.Id,
				message: messageProcessing,
				images: imageFiles,
			})
		)
			.unwrap()
			.then(() => {
				message.success('Đã gửi thành công!');
			})
			.catch((error) => {
				message.error(
					error?.data?.detail || error?.detail || 'Đã xảy ra lỗi, vui lòng thử lại.'
				);
			});
	};

	const handleLogDeliver = () => {
		dispatch(
			handleOrderLogDeliver({
				orderId: orders?.Id,
				message: messageProcessing,
				images: imageFiles,
			})
		)
			.unwrap()
			.then(() => {
				message.success('Đã gửi thành công!');
			})
			.catch((error) => {
				message.error(
					error?.data?.detail || error?.detail || 'Đã xảy ra lỗi, vui lòng thử lại.'
				);
			});
	};

	return (
		<div className="mr-5">
			<div className="mb-4">
				<Button
					icon={<ArrowLeftOutlined />}
					type="text"
					className="bg-primary"
					onClick={() => navigate('/orders')}
				>
					Quay lại
				</Button>
			</div>
			<div className="shadow-lg p-5">
				<Row>
					<Col span={24}>
						<Title level={3}>Chi Tiết Đơn Hàng</Title>
					</Col>
				</Row>
				{orders && orders?.CancelledReason !== null && (
					<>
						<Divider style={{borderColor: '#d9d9d9'}} />
						<Row>
							<Col span={24}>
								<Title level={4}>
									{status === 'Cancelled'
										? 'Đơn Hàng Bị Hủy'
										: 'Đơn Hàng Bị Từ Chối'}
								</Title>
							</Col>
						</Row>
						<Row gutter={[16, 16]} justify="center" align="middle" className="my-3">
							<Col xs={12} sm={12} lg={12}>
								<Text strong style={{fontSize: 18}}>
									Tiêu Đề
								</Text>
								<br />
								<Text>
									{status === 'Cancelled'
										? 'Người Đặt Hủy Đặt Hàng'
										: 'Shop Từ Chối Đặt Hàng'}
								</Text>
							</Col>
							<Col xs={12} sm={12} lg={12}>
								<Text strong style={{fontSize: 18}}>
									Lý Do
								</Text>
								<br />
								<Text>{orders?.CancelledReason}</Text>
							</Col>
						</Row>
						<Row gutter={[16, 16]} justify="center" align="middle" className="my-3">
							<Col xs={12} sm={12} lg={12}>
								<Text strong style={{fontSize: 18}}>
									{status === 'Cancelled' ? 'Thời Gian Hủy' : 'Thời Gian Từ Chối'}
								</Text>
								<br />
								<Text>{orders?.CancelledDate}</Text>
							</Col>
							<Col xs={12} sm={12} lg={12}>
								{/* <Text strong className="mb-5" style={{fontSize: 18}}>
								Trạng Thái
							</Text>
							<br />
							<Tag color={orderStatus.color}>{orderStatus.name.toUpperCase()}</Tag> */}
							</Col>
						</Row>
					</>
				)}

				<Divider style={{borderColor: '#d9d9d9'}} />
				<Row>
					<Col span={24}>
						<Title level={4}>Thông Tin Chung</Title>
					</Col>
				</Row>
				<Row gutter={[16, 16]} justify="center" align="middle" className="my-3">
					{/* Loại Đơn Hàng */}
					<Col xs={12} sm={12} lg={12}>
						<Text strong style={{fontSize: 18}}>
							Loại Đơn Hàng
						</Text>
						<br />
						<Text className="flex items-center">
							<p className="font-semibold text-lg">
								{orders?.CustomizeRequestId
									? 'Đơn hàng thiết kế'
									: 'Đơn hàng thường'}
							</p>
						</Text>
					</Col>

					{/* Khách Hàng */}
					<Col xs={12} sm={12} lg={12}>
						<Text strong style={{fontSize: 18}}>
							Khách hàng
						</Text>
						<br />
						<Text className="text-lg">
							{orders?.Account?.FirstName} {orders?.Account?.LastName}
						</Text>
					</Col>
				</Row>
				<Row gutter={[16, 16]} justify="center" align="middle" className="my-3">
					<Col xs={12} sm={12} lg={12}>
						<Text strong style={{fontSize: 18}}>
							Email
						</Text>
						<br />
						<Text className="text-lg">{orders?.Account?.Email}</Text>
					</Col>
					<Col xs={12} sm={12} lg={12}>
						<Text strong style={{fontSize: 18}}>
							Địa Chỉ
						</Text>
						<br />
						<Text className="text-lg">{orders?.ShippingAddress}</Text>
					</Col>
				</Row>

				<Row gutter={[16, 16]} justify="center" align="middle" className="my-3">
					<Col xs={12} sm={12} lg={12}>
						<Text strong style={{fontSize: 18}}>
							Số Điện Thoại
						</Text>
						<br />
						<Text className="font-semibold text-lg">
							{orders?.Account?.PhoneNumber}
						</Text>
					</Col>

					<Col xs={12} sm={12} lg={12}>
						<Text strong style={{fontSize: 18}}>
							Thời Gian Đặt Hàng
						</Text>
						<br />
						<Text className="text-lg">{orders?.CreatedDate}</Text>
					</Col>
				</Row>
				<Row gutter={[16, 16]} justify="center" align="middle" className="my-3">
					<Col xs={12} sm={12} lg={12}>
						<Text strong className="mb-5" style={{fontSize: 18}}>
							Trạng Thái Thanh Toán
						</Text>
						<br />
						<Tag color={orderStatus.color} className="text-base">
							{orderStatus.name.toUpperCase()}
						</Tag>
					</Col>

					<Col xs={12} sm={12} lg={12}>
						{orders && orders?.CancelledReason === null && (
							<>
								<Text strong className="mb-5" style={{fontSize: 18}}>
									Phương Thức Thanh Toán
								</Text>
								<br />
								<Text className="text-lg">{orders?.PaymentMethod?.MappedName}</Text>
							</>
						)}
					</Col>
				</Row>
				<Row gutter={[16, 16]} justify="center" align="middle" className="my-3">
					<Col xs={24} lg={12}>
						<Text strong style={{fontSize: 18}}>
							Các Chứng Từ
						</Text>
						{orders?.Transactions?.length > 0 ? (
							<>
								<br />
								<Space wrap>
									{orders?.Transactions?.map((transaction, index) =>
										transaction.Evidence?.MediaPath ? (
											<Image
												key={index}
												src={transaction.Evidence.MediaPath}
												alt={`evidence-${index}`}
												className="mt-5 w-full md:w-[600px]"
											/>
										) : null
									)}
								</Space>
							</>
						) : (
							<>
								<br />
								<Text>Không có chứng từ hợp lệ</Text>
							</>
						)}
					</Col>
					<Col xs={0} lg={12}></Col>
				</Row>

				{orders?.Deliverer && (
					<>
						<Row className="mt-10">
							<Col span={24}>
								<Title level={4}>Thông Tin Nhân Viên Giao Hàng</Title>
							</Col>
						</Row>

						<Row gutter={[16, 16]} justify="center" align="middle" className="my-3">
							<Col xs={12} sm={12} lg={12}>
								<Text strong style={{fontSize: 18}}>
									Email
								</Text>
								<br />
								<Text className="text-lg">{orders?.Deliverer?.Email}</Text>
							</Col>
							<Col xs={12} sm={12} lg={12}>
								<Text strong style={{fontSize: 18}}>
									Họ Tên
								</Text>
								<br />
								<Text className="text-lg">
									{orders?.Deliverer?.FirstName} {orders?.Deliverer?.LastName}
								</Text>
							</Col>
						</Row>

						<Row gutter={[16, 16]} justify="center" align="middle" className="my-3">
							<Col xs={12} sm={12} lg={12}>
								<Text strong style={{fontSize: 18}}>
									Số Điện Thoại
								</Text>
								<br />
								<Text className="font-semibold text-lg">
									{orders?.Deliverer?.PhoneNumber
										? orders?.Deliverer?.PhoneNumber
										: 'Chưa có số điện thoại'}
								</Text>
							</Col>

							<Col xs={12} sm={12} lg={12}></Col>
						</Row>
					</>
				)}
			</div>

			<Divider style={{borderColor: '#d9d9d9'}} />
			{statusOrder === 2 && (
				<>
					<Row>
						<Col span={24}>
							<Title level={4}>Tiến Trình Xử Lý</Title>
						</Col>
					</Row>
					<div>
						<Col xs={12} sm={12} lg={12}>
							<Text strong style={{fontSize: 18}}>
								Mô Tả
							</Text>
							<br />
							<Text className="">
								<Input.TextArea onChange={handleDescription} />
							</Text>
						</Col>
						<Col xs={12} sm={12} lg={12} className="sm:w-full mt-5">
							<Text strong style={{fontSize: 18}} className="sm:text-sm">
								Hình Ảnh
							</Text>
							<br />
							<Upload
								multiple
								action="/upload.do"
								accept="image/*"
								listType="picture-card"
								fileList={fileList}
								onPreview={handlePreview}
								onChange={handleChange}
								beforeUpload={(file) => {
									setImageFiles((fileList) => [...fileList, file]);
									return false;
								}}
								className="sm:w-full"
							>
								<div>
									<PlusOutlined />
									<div style={{marginTop: 8}} className="text-sm">
										Upload
									</div>
								</div>
							</Upload>
						</Col>
					</div>
					<Button
						type="primary"
						className="mt-5 w-1/2"
						onClick={handleLogProcessing}
						disabled={
							messageProcessing === null ||
							messageProcessing === undefined ||
							messageProcessing === ''
						}
					>
						Gửi
					</Button>
					<Divider style={{borderColor: '#d9d9d9'}} />
				</>
			)}
			{statusOrder === 6 && (
				<>
					<Row>
						<Col span={24}>
							<Title level={4}>Cập Nhật Giao Hàng</Title>
						</Col>
					</Row>
					<div>
						<Col xs={12} sm={12} lg={12}>
							<Text strong style={{fontSize: 18}}>
								Mô Tả
							</Text>
							<br />
							<Text className="">
								<Input.TextArea onChange={handleDescription} />
							</Text>
						</Col>
						<Col xs={12} sm={12} lg={12} className="sm:w-full mt-5">
							<Text strong style={{fontSize: 18}} className="sm:text-sm">
								Hình Ảnh
							</Text>
							<br />
							<Upload
								multiple
								action="/upload.do"
								accept="image/*"
								listType="picture-card"
								fileList={fileList}
								onPreview={handlePreview}
								onChange={handleChange}
								beforeUpload={(file) => {
									setImageFiles((fileList) => [...fileList, file]);
									return false;
								}}
							>
								<div>
									<PlusOutlined />
									<div style={{marginTop: 8}} className="text-sm">
										Tải lên
									</div>
								</div>
							</Upload>
						</Col>
					</div>
					<Button
						type="primary"
						className="mt-5 w-1/2"
						onClick={handleLogDeliver}
						disabled={
							messageProcessing === null ||
							messageProcessing === undefined ||
							messageProcessing === ''
						}
					>
						Gửi
					</Button>
				</>
			)}

			{statusOrder === 8 && orderFiles && (
				<div className="shadow-lg p-5">
					<Text strong style={{fontSize: 18}}>
						Hình Ảnh Xác Nhận Giao Hàng
					</Text>
					{orderFiles.OrderDeliveryConfirmationImages?.length > 0 && (
						<div className="image-slider-container">
							<Carousel
								dots={true}
								slidesToShow={isMobile ? 1 : 3}
								swipeToSlide={true}
								draggable
								arrows
								responsive={[
									{
										breakpoint: 768,
										settings: {
											slidesToShow: 1,
											slidesToScroll: 1,
										},
									},
								]}
								className="order-delivery-carousel rounded-lg bg-primary"
							>
								{orderFiles.OrderDeliveryConfirmationImages.map((img, index) => (
									<div
										key={`delivery-img-${index}`}
										className="flex justify-center items-center p-2"
									>
										<div className="relative w-full max-w-[250px] aspect-square">
											<Image
												src={img.MediaPath}
												alt={`Delivery image ${index + 1}`}
												fill
												className="rounded-lg object-cover shadow-md hover:scale-105 transition-transform duration-300"
												sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
												loading="lazy" // Lazy load images
											/>
										</div>
									</div>
								))}
							</Carousel>
						</div>
					)}

					{/* Delivery Confirmation Video */}
					{orderFiles.OrderDeliveryConfirmationVideo && (
						<>
							<Text strong style={{fontSize: 18}}>
								Video Xác Nhận Giao Hàng
							</Text>
							<video
								controls
								preload="metadata" // Load only metadata initially to support seeking
								controlsList="nodownload" // Optional: Disable downloading if needed
								className="mt-5"
								style={{width: 600, marginBottom: 10}}
							>
								<source
									src={orderFiles.OrderDeliveryConfirmationVideo.MediaPath}
									type={orderFiles.OrderDeliveryConfirmationVideo.ContentType}
								/>
								Trình duyệt của bạn không được hỗ trợ, hãy lên một thiết bị hoặc
								trình duyệt khác và tiếp tục.
							</video>
						</>
					)}

					{orderFiles.OrderTransactionImages.length > 0 && (
						<>
							<Text strong style={{fontSize: 18}}>
								Hình Ảnh Giao Dịch Của Đơn Hàng
							</Text>
							<div className="image-slider-container">
								<Carousel
									dots={true}
									slidesToShow={isMobile ? 1 : 3}
									swipeToSlide={true}
									draggable
									arrows
									responsive={[
										{
											breakpoint: 768,
											settings: {
												slidesToShow: 1,
												slidesToScroll: 1,
											},
										},
									]}
									className="order-delivery-carousel rounded-lg bg-primary"
								>
									{Object.values(orderFiles.OrderTransactionImages || {})
										.flat()
										.map((img, index) => (
											<div
												key={`delivery-img-${index}`}
												className="flex justify-center items-center p-2"
											>
												<div className="relative w-full max-w-[250px] aspect-square">
													<Image
														key={`log-img-${index}`}
														src={img.MediaPath} // Use the filename for the log images
														alt={`log-image-${index}`}
														className="rounded-lg object-cover shadow-md hover:scale-105 transition-transform duration-300"
														sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
														loading="lazy" // Lazy load images
													/>
												</div>
											</div>
										))}
								</Carousel>
							</div>
						</>
					)}
				</div>
			)}

			{statusOrder === 8 && orderFilesLoading && <Spin />}
			{statusOrder === 8 && orderFilesError && (
				<Text type="danger">Không thể tải chứng từ</Text>
			)}
			<div className="">
				<div>
					{!delivererRole && orders?.Transactions?.length > 0 && (
						<div className="p-6 bg-gray-50 rounded-lg shadow-lg my-5">
							<Row>
								<Col span={24}>
									<h4 className="text-xl font-bold text-gray-700">
										Chi Tiết Giao Dịch
									</h4>
								</Col>
							</Row>
							{orders?.Transactions?.map((transaction) => (
								<div
									key={transaction?.Id}
									className="bg-white rounded-lg shadow-md p-4 my-4"
								>
									<Row>
										<Col span={24}>
											<h5 className="text-lg font-semibold text-gray-600">
												<CreditCardOutlined className="mr-2" />
												Thông tin giao dịch
											</h5>
										</Col>
									</Row>
									<Row gutter={[16, 16]} className="mt-4">
										<Col xs={12}>
											<p className="text-gray-600 font-medium">
												Mã giao dịch
											</p>
											<p className="text-lg font-semibold text-blue-600">
												{transaction?.AppTransactionCode}
											</p>
										</Col>
										<Col xs={12}>
											<p className="text-gray-600 font-medium">
												Mô tả giao dịch
											</p>
											<p className="text-gray-800">
												{transaction?.Description}
											</p>
										</Col>
									</Row>
									<Row gutter={[16, 16]} className="mt-4">
										<Col xs={12}>
											<p className="text-gray-600 font-medium">Ngày tạo</p>
											<p className="text-gray-800">{transaction?.InitDate}</p>
										</Col>
										<Col xs={12}>
											<p className="text-gray-600 font-medium">
												Số tiền giao dịch
											</p>
											<p className="text-lg font-semibold text-green-600">
												{formatPrice(transaction?.TransactionAmount)}
											</p>
										</Col>
									</Row>
									<Row gutter={[16, 16]} className="mt-4">
										<Col xs={12}>
											<p className="text-gray-600 font-medium">
												Ngày xác nhận
											</p>
											<p className="text-gray-800">
												{transaction?.VerifiedDate || 'Chưa được xác nhận'}
											</p>
										</Col>
										<Col xs={12}>
											{transaction?.FineAmount !== 0 && (
												<>
													<p className="text-gray-600 font-medium">
														Số tiền phạt
													</p>
													<p className="text-lg font-semibold text-red-600">
														{formatPrice(transaction?.FineAmount)}
													</p>
												</>
											)}
										</Col>
									</Row>
									<Row gutter={[16, 16]} className="mt-4">
										<Col xs={12}>
											<p className="text-gray-600 font-medium">
												Trạng thái giao dịch
											</p>
											<Tag
												color={
													transaction?.Status === 1
														? 'orange'
														: transaction?.Status === 2
														? 'green'
														: 'red'
												}
												className="font-semibold text-sm"
											>
												{transaction?.Status === 1
													? 'CHỜ XỬ LÝ'
													: transaction?.Status === 2
													? 'HỢP LỆ'
													: 'KHÔNG HỢP LỆ'}
											</Tag>
										</Col>
									</Row>
									<Divider className="my-4" />
									<Row>
										<Col span={24}>
											<h5 className="text-lg font-semibold text-gray-600">
												Thông tin thanh toán
											</h5>
										</Col>
									</Row>
									<Row gutter={[16, 16]} className="mt-4">
										<Col xs={12}>
											<p className="text-gray-600 font-medium">Phương thức</p>
											<Tag color="blue" className="font-semibold text-sm">
												{transaction?.PayMethod?.MethodName?.replace(
													'BANK_TRANSFER',
													'Chuyển Khoản'
												).toUpperCase()}
											</Tag>
										</Col>
										<Col xs={12}>
											{transaction?.TransactionType && (
												<>
													<p className="text-gray-600 font-medium">
														Loại giao dịch
													</p>
													<p className="text-gray-800 font-semibold">
														{transaction.TransactionType === 1 ? (
															<div className="text-darkGreen text-lg">
																Thanh Toán
															</div>
														) : (
															<div className="text-red text-lg">
																Hoàn Tiền
															</div>
														)}
													</p>
												</>
											)}
										</Col>
									</Row>
								</div>
							))}
						</div>
					)}
				</div>

				<Row>
					<Col span={24}>
						<Title level={4}>Chi Tiết Sản Phẩm</Title>
					</Col>
				</Row>

				<div className="font-semibold w-full py-10 bg-white rounded-lg">
					<Table
						dataSource={dataSource}
						columns={isMobile ? mobileColumns : columns} // Conditionally render columns
						size="large"
						pagination={{pageSize: 5}}
						className="custom-table-header"
						rowKey="orderId"
						expandedRowRender={expandedRowRender}
						loading={loading}
						responsive="sm"
					/>
				</div>

				<Modal
					open={previewOpen}
					title={previewTitle}
					footer={null}
					onCancel={handleCancel}
					className="sm:w-full"
				>
					<img alt="example" style={{width: '100%'}} src={previewImage} />
				</Modal>
			</div>
		</div>
	);
};

export default InformationOrder;
