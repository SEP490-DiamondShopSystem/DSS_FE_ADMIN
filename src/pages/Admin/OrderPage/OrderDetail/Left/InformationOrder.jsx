import React, {useState} from 'react';

import {ArrowLeftOutlined} from '@ant-design/icons';
import {Button, Col, Divider, Row, Table, Tag, Typography} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {
	convertToVietnamDate,
	formatPrice,
	getOrderStatus,
	getOrderStatusTag,
} from '../../../../../utils';
import {LoadingOrderSelector} from '../../../../../redux/selectors';

const {Title, Text} = Typography;

const InformationOrder = ({orders, statusOrder, paymentStatusOrder}) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const loading = useSelector(LoadingOrderSelector);

	const orderStatus = getOrderStatusTag(paymentStatusOrder);
	const status = getOrderStatus(statusOrder);

	const [dataSource, setDataSource] = useState([
		{
			orderId: orders?.Id,
			orderTime: convertToVietnamDate(orders?.CreatedDate),
			price: formatPrice(orders?.TotalPrice),
			status: getOrderStatus(orders?.Status),
			paymentStatus: orders?.PaymentStatus,
			products: orders?.Items.map((item) => ({
				productId: item?.Id,
				productName: item?.Name,
				productPrice: formatPrice(item?.PurchasedPrice),
			})), // Mỗi sản phẩm trong đơn hàng
		},
	]);

	console.log('orders', orders);
	console.log('statusOrder', statusOrder);

	const columns = [
		{
			title: 'ID',
			dataIndex: 'orderId',
			align: 'center',
		},
		{
			title: 'Thời gian đặt hàng',
			dataIndex: 'orderTime',
			align: 'center',
		},

		{
			title: 'Tổng Giá',
			dataIndex: 'price',
			align: 'center',
		},
	];

	const expandedColumns = [
		{
			title: 'ID',
			dataIndex: 'productId',
			key: 'productId',
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

	return (
		<div>
			<div className="mb-4">
				<Button
					icon={<ArrowLeftOutlined />}
					type="text"
					className="bg-primary"
					onClick={() => navigate('/orders/preset')}
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
								{status === 'Cancelled' ? 'Ngày Hủy' : 'Ngày Từ Chối'}
							</Text>
							<br />
							<Text>{convertToVietnamDate(orders?.CancelledDate)}</Text>
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
						Ngày Đặt Hàng
					</Text>
					<br />
					<Text>{convertToVietnamDate(orders?.CreatedDate)}</Text>
				</Col>

				<Col span={12}>
					{orders && orders?.CancelledReason === null && (
						<>
							<Text strong className="mb-5" style={{fontSize: 18}}>
								Phương Thức Thanh Toán
							</Text>
							<br />
							<Tag color={orderStatus.color}>{orderStatus.name.toUpperCase()}</Tag>
						</>
					)}
				</Col>
			</Row>

			<Divider style={{borderColor: '#d9d9d9'}} />
			<Row>
				<Col span={24}>
					<Title level={4}>Chi Tiết Sản Phẩm</Title>
				</Col>
			</Row>
			<div className="font-semibold w-full  py-10 bg-white rounded-lg">
				<Table
					dataSource={dataSource}
					columns={columns}
					pagination={{pageSize: 5}}
					className="custom-table-header"
					rowKey="orderId"
					expandedRowRender={expandedRowRender}
					loading={loading}
				/>
			</div>
		</div>
	);
};

export default InformationOrder;
