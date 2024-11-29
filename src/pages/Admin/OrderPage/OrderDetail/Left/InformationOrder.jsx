import React, {useEffect, useState} from 'react';

import {ArrowLeftOutlined, PlusOutlined} from '@ant-design/icons';
import {
	Button,
	Col,
	Divider,
	Input,
	message,
	Modal,
	Row,
	Table,
	Tag,
	Typography,
	Upload,
} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {LoadingOrderSelector} from '../../../../../redux/selectors';
import {
	handleOrderLogDeliver,
	handleOrderLogProcessing,
} from '../../../../../redux/slices/orderSlice';
import {
	formatPrice,
	getOrderItemStatusTag,
	getOrderStatus,
	getOrderStatusTag,
} from '../../../../../utils';

const {Title, Text} = Typography;

const InformationOrder = ({orders, statusOrder, paymentStatusOrder}) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const loading = useSelector(LoadingOrderSelector);

	const orderStatus = getOrderStatusTag(paymentStatusOrder);
	const status = getOrderStatus(statusOrder);

	const [dataSource, setDataSource] = useState([]);
	const [description, setDescription] = useState('');
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const [previewTitle, setPreviewTitle] = useState('');
	const [fileList, setFileList] = useState([]);
	const [messageProcessing, setMessageProcessing] = useState();
	const [imageFiles, setImageFiles] = useState([]);

	console.log('fileList', fileList);

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

	const expandedRowRender = (record) => {
		return (
			<Table
				columns={expandedColumns}
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
		console.log('file', file);

		setPreviewImage(file.url || file.thumbUrl);
		setPreviewOpen(true);
		setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
	};

	const handleChange = ({fileList: newFileList}) => {
		setFileList(newFileList);
	};

	console.log('orders', orders);

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
					error?.data?.title || error?.title || 'Đã xảy ra lỗi, vui lòng thử lại.'
				);
			});
	};

	const handleLogDeliver = () => {
		if (!fileList || fileList.length === 0) {
			message.error('Vui lòng chọn ít nhất một tệp hình ảnh!');
			return;
		}

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
					error?.data?.title || error?.title || 'Đã xảy ra lỗi, vui lòng thử lại.'
				);
			});
	};

	return (
		<div>
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
								{status === 'Cancelled' ? 'Đơn Hàng Bị Hủy' : 'Đơn Hàng Bị Từ Chối'}
							</Title>
						</Col>
					</Row>
					<Row gutter={[16, 16]} justify="center" align="middle" className="my-3">
						<Col span={12}>
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
						<Col span={12}>
							<Text strong style={{fontSize: 18}}>
								Lý Do
							</Text>
							<br />
							<Text>{orders?.CancelledReason}</Text>
						</Col>
					</Row>
					<Row gutter={[16, 16]} justify="center" align="middle" className="my-3">
						<Col span={12}>
							<Text strong style={{fontSize: 18}}>
								{status === 'Cancelled' ? 'Thời Gian Hủy' : 'Thời Gian Từ Chối'}
							</Text>
							<br />
							<Text>{orders?.CancelledDate}</Text>
						</Col>
						<Col span={12}>
							<Text strong className="mb-5" style={{fontSize: 18}}>
								Trạng Thái
							</Text>
							<br />
							<Tag color={orderStatus.color}>{orderStatus.name.toUpperCase()}</Tag>
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
				<Col span={12}>
					<Text strong style={{fontSize: 18}}>
						Loại Đơn Hàng
					</Text>
					<br />
					<Text className="flex items-center">
						<p className="mr-1">Đơn hàng</p>{' '}
						<p className="font-semibold">Trang Sức Có Sẵn</p>
					</Text>
				</Col>
				<Col span={12}>
					<Text strong style={{fontSize: 18}}>
						Khách hàng
					</Text>
					<br />
					<Text>
						{orders?.Account?.FirstName} {orders?.Account?.LastName}
					</Text>
				</Col>
			</Row>
			<Row gutter={[16, 16]} justify="center" align="middle" className="my-3">
				<Col span={12}>
					<Text strong style={{fontSize: 18}}>
						Email
					</Text>
					<br />
					<Text>{orders?.Account?.Email}</Text>
				</Col>
				<Col span={12}>
					<Text strong style={{fontSize: 18}}>
						Địa Chỉ
					</Text>
					<br />
					<Text>{orders?.ShippingAddress}</Text>
				</Col>
			</Row>

			<Row gutter={[16, 16]} justify="center" align="middle" className="my-3">
				<Col span={12}>
					<Text strong style={{fontSize: 18}}>
						Thời Gian Đặt Hàng
					</Text>
					<br />
					<Text>{orders?.CreatedDate}</Text>
				</Col>

				<Col span={12}>
					{orders && orders?.CancelledReason === null && (
						<>
							<Text strong className="mb-5" style={{fontSize: 18}}>
								Phương Thức Thanh Toán
							</Text>
							<br />
							{orders?.PaymentMethod?.MappedName}
						</>
					)}
				</Col>
			</Row>
			<Divider style={{borderColor: '#d9d9d9'}} />
			{statusOrder === 2 && (
				<>
					<Row>
						<Col span={24}>
							<Title level={4}>Tiến Trình Xử Lý</Title>
						</Col>
					</Row>
					<div>
						<Col span={12}>
							<Text strong style={{fontSize: 18}}>
								Mô Tả
							</Text>
							<br />
							<Text className="">
								<Input.TextArea onChange={handleDescription} />
							</Text>
						</Col>
						<Col span={12} className="sm:w-full mt-5">
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
					<Button type="primary mt-5 w-1/2" onClick={handleLogProcessing}>
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
						<Col span={12}>
							<Text strong style={{fontSize: 18}}>
								Mô Tả
							</Text>
							<br />
							<Text className="">
								<Input.TextArea onChange={handleDescription} />
							</Text>
						</Col>
						<Col span={12} className="sm:w-full mt-5">
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
										Upload
									</div>
								</div>
							</Upload>
						</Col>
					</div>
					<Button type="primary mt-5 w-1/2" onClick={handleLogDeliver}>
						Gửi
					</Button>
				</>
			)}

			{orders?.Transactions?.map((transaction) => (
				<>
					<Row>
						<Col span={24}>
							<Title level={4}>Chi Tiết Giao Dịch</Title>
						</Col>
					</Row>
					<Col span={24}>
						<Title level={5}>Thông tin giao dịch</Title>
					</Col>
					<Row gutter={[16, 16]} justify="center" align="middle" className="my-3">
						<Col span={12}>
							<Text strong style={{fontSize: 18}}>
								Mã giao dịch
							</Text>
							<br />
							<Text className="flex items-center">
								<p className="font-semibold">{transaction?.AppTransactionCode}</p>
							</Text>
						</Col>
						<Col span={12}>
							<Text strong style={{fontSize: 18}}>
								Mô tả giao dịch
							</Text>
							<br />
							<Text>{transaction?.Description}</Text>
						</Col>
					</Row>
					<Row gutter={[16, 16]} justify="center" align="middle" className="my-3">
						<Col span={12}>
							<Text strong style={{fontSize: 18}}>
								Ngày thanh toán
							</Text>
							<br />
							<Text>{transaction?.PayDate}</Text>
						</Col>
						<Col span={12}>
							<Text strong style={{fontSize: 18}}>
								Số tiền giao dịch
							</Text>
							<br />
							<Text>{formatPrice(transaction?.TransactionAmount)}</Text>
						</Col>
					</Row>

					<Row gutter={[16, 16]} justify="center" align="middle" className="my-3">
						<Col span={12}>
							<Text strong style={{fontSize: 18}}>
								Số tiền phạt
							</Text>
							<br />
							<Text>{formatPrice(transaction?.FineAmount)}</Text>
						</Col>

						<Col span={12}></Col>
					</Row>
					<Col span={24}>
						<Title level={5}>Thông tin phương thức thanh toán</Title>
					</Col>
					<Row gutter={[16, 16]} justify="center" align="middle" className="my-3">
						<Col span={12}>
							<Text strong style={{fontSize: 18}}>
								Phương thức
							</Text>
							<br />
							<Text className="flex items-center">
								<Tag color="blue" className="font-semibold">
									{transaction?.PayMethod?.MethodName}
								</Tag>
							</Text>
						</Col>
						<Col span={12}>
							<Text strong style={{fontSize: 18}}>
								Mã giao dịch Paygate
							</Text>
							<br />
							<Text>{transaction?.PaygateTransactionCode}</Text>
						</Col>
					</Row>
					<Col span={24}>
						<Title level={5}>Thông tin giao dịch khác</Title>
					</Col>
					<Row gutter={[16, 16]} justify="center" align="middle" className="my-3">
						<Col span={12}>
							<Text strong style={{fontSize: 18}}>
								Loại giao dịch
							</Text>
							<br />
							<Text className="flex items-center">
								<Text
									className={`font-semibold ${
										transaction?.TransactionType === 1
											? 'text-darkGreen'
											: 'text-red'
									}`}
								>
									{transaction?.TransactionType === 1
										? 'Thanh Toán'
										: 'Hoàn Tiền'}
								</Text>
							</Text>
						</Col>
						<Col span={12}></Col>
					</Row>
					<Divider style={{borderColor: '#d9d9d9'}} />
				</>
			))}

			<Row>
				<Col span={24}>
					<Title level={4}>Chi Tiết Sản Phẩm</Title>
				</Col>
			</Row>

			<div className="font-semibold w-full  py-10 bg-white rounded-lg">
				<Table
					dataSource={dataSource}
					columns={columns}
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
	);
};

export default InformationOrder;
