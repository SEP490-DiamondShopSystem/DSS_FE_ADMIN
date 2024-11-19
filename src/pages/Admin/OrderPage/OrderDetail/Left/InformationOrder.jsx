import React, {useEffect, useState} from 'react';

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

	const [dataSource, setDataSource] = useState([]);

	useEffect(() => {
		if (orders) {
			const newDataSource = [
				{
					orderId: orders?.Id,
					orderCode: orders?.OrderCode,
					orderTime: orders?.CreatedDate,
					price: formatPrice(orders?.TotalPrice),
					status: getOrderStatus(orders?.Status),
					paymentStatus: orders?.PaymentStatus,
					products: orders?.Items?.map((item) => ({
						productId: item?.Id,
						productCode: item?.Diamond?.SerialCode || item?.Jewelry?.SerialCode,
						productName: item?.Jewelry?.Model?.Name || item?.Diamond?.Title,
						productPrice: formatPrice(item?.PurchasedPrice),
					})),
					UserRankAmountSaved: formatPrice(orders?.UserRankAmountSaved),
				},
			];
			setDataSource(newDataSource);
		}
	}, [orders]);

	const columns = [
		{
			title: 'Mã đơn hàng',
			dataIndex: 'orderCode',
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
					size="large"
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
