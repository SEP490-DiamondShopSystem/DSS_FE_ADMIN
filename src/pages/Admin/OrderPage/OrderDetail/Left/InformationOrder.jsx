import {ArrowLeftOutlined} from '@ant-design/icons';
import {Button, Col, Divider, Row, Typography} from 'antd';
import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {convertToVietnamDate, formatPrice, getOrderStatus} from '../../../../../utils';
import {useDispatch} from 'react-redux';
import {getUserDetail} from '../../../../../redux/slices/userLoginSlice';

const {Title, Text} = Typography;

const detailGroups = {
	total_price: 20138000,
	groups: [
		{
			jewelry_price: 10069000,
			items: [
				{
					id: 86,
					name: 'Round Diamond 3.5 Carat IF',
					unitPrice: 3357000,
					quantity: 1,
					total: 3357000,
				},
				{
					id: 86,
					name: 'Round Diamond 3.5 Carat VVS1',
					unitPrice: 4467000,
					quantity: 1,
					total: 4467000,
				},
				{
					id: 86,
					name: 'Petite Solitaire Engagement Ring In 14k White Gold',
					unitPrice: 2245000,
					quantity: 1,
					total: 2245000,
				},
			],
		},
		{
			jewelry_price: 10069000,
			items: [
				{
					id: 86,
					name: 'Round Diamond 3.5 Carat IF',
					unitPrice: 3357000,
					quantity: 1,
					total: 3357000,
				},
				{
					id: 86,
					name: 'Round Diamond 3.5 Carat VVS1',
					unitPrice: 4467000,
					quantity: 1,
					total: 4467000,
				},
				{
					id: 86,
					name: 'Petite Solitaire Engagement Ring In 14k White Gold',
					unitPrice: 2245000,
					quantity: 1,
					total: 2245000,
				},
			],
		},
	],
};

const InformationOrder = ({orders}) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

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
					<Text>Đơn hàng custom</Text>
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
					{/* <Text strong style={{fontSize: 18}}>
						Payment Method
					</Text>
					<br />
					<Text>VNPAY</Text> */}
				</Col>
			</Row>
			<Row gutter={[16, 16]} justify="center" align="middle" className="my-3">
				<Col span={24}>
					<Text strong style={{fontSize: 18}}>
						Trạng Thái Thanh Toán
					</Text>
					<br />
					<Text>{getOrderStatus(orders?.Status)}</Text>
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
