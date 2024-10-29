import React from 'react';

import {ArrowLeftOutlined} from '@ant-design/icons';
import {Button, Col, Divider, Row, Tag, Typography} from 'antd';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {
	convertToVietnamDate,
	formatPrice,
	getOrderStatus,
	getOrderStatusTag,
} from '../../../../../utils';

const {Title, Text} = Typography;

const InformationOrder = ({orders, statusOrder, paymentStatusOrder}) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const orderStatus = getOrderStatusTag(paymentStatusOrder);
	const status = getOrderStatus(statusOrder);

	console.log('orders', orders);
	console.log('statusOrder', statusOrder);

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
							<Title level={4}>Đơn Hàng Bị Hủy</Title>
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
					<Text>Đơn hàng</Text>
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
			<div className="w-full bg-primary p-5 border rounded">
				<div className="w-full flex items-center font-semibold text-lg">
					<p style={{width: '33%'}} className="flex justify-center">
						Id
					</p>
					<p style={{width: '33%'}} className="flex justify-center">
						Tên Sản Phẩm
					</p>
					<p style={{width: '33%'}} className="flex justify-center">
						Giá
					</p>
				</div>
			</div>
			<div className="w-full border">
				{orders &&
					orders.Items?.map((order, i) => (
						<div key={order.Id} className=" mb-5 p-5 rounded">
							<div className="w-full flex items-center text-lg">
								<p style={{width: '33%'}} className="flex justify-center">
									{i + 1}
								</p>
								<p style={{width: '33%'}} className="flex my-2">
									{/* {order?.Jewelry?.Name || orders} */}
								</p>
								<p style={{width: '33%'}} className="flex my-2">
									{formatPrice(
										order?.Jewelry?.TotalPrice || order.PurchasedPrice
									) || 'N/A'}
								</p>
							</div>
						</div>
					))}

				<div className="w-full bg-primary p-5 border rounded">
					<p className="flex justify-end items-center text-lg font-semibold">
						Tổng Giá: <p className="ml-10">{formatPrice(orders?.TotalPrice)}</p>
					</p>
				</div>
			</div>
		</div>
	);
};

export default InformationOrder;
