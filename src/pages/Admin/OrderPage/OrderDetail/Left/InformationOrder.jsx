import {ArrowLeftOutlined} from '@ant-design/icons';
import {Button, Col, Divider, Row, Typography} from 'antd';
import React from 'react';
import {useNavigate} from 'react-router-dom';

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

const InformationOrder = () => {
	const navigate = useNavigate();
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
					<Text>NGUYỄN VĂN A</Text>
				</Col>
			</Row>
			<Row gutter={[16, 16]} justify="center" align="middle" className="my-3">
				<Col span={12}>
					<Text strong style={{fontSize: 18}}>
						Số Điện Thoại
					</Text>
					<br />
					<Text>083456789</Text>
				</Col>
				<Col span={12}>
					<Text strong style={{fontSize: 18}}>
						Địa Chỉ
					</Text>
					<br />
					<Text>Thủ Đức, TP.HCM</Text>
				</Col>
			</Row>

			<Row gutter={[16, 16]} justify="center" align="middle" className="my-3">
				<Col span={12}>
					<Text strong style={{fontSize: 18}}>
						Ngày Đặt Hàng
					</Text>
					<br />
					<Text>24/09/2024</Text>
				</Col>
				<Col span={12}>
					<Text strong style={{fontSize: 18}}>
						Payment Method
					</Text>
					<br />
					<Text>VNPAY</Text>
				</Col>
			</Row>
			<Row gutter={[16, 16]} justify="center" align="middle" className="my-3">
				<Col span={24}>
					<Text strong style={{fontSize: 18}}>
						Trạng Thái Thanh Toán
					</Text>
					<br />
					<Text>Đang xử lí</Text>
				</Col>
			</Row>
			<Divider style={{borderColor: '#d9d9d9'}} />
			<div className="w-full bg-primary p-5 border rounded">
				<div className="w-full flex items-center font-semibold text-lg">
					<p style={{width: '10%'}} className="flex justify-center">
						Id
					</p>
					<p style={{width: '40%'}} className="flex justify-center">
						Tên Sản Phẩm
					</p>
					<p style={{width: '20%'}} className="flex justify-center">
						Đơn Giá
					</p>
					<p style={{width: '10%'}} className="flex justify-center">
						Số Lượng
					</p>
					<p style={{width: '20%'}} className="flex justify-center">
						Tổng giá
					</p>
				</div>
			</div>
			<div className="w-full ">
				{detailGroups.groups?.map((gr, i) => (
					<div key={i} className="border mb-5 p-5 rounded">
						{gr.items?.map((item, j) => (
							<div key={j}>
								<div className="w-full flex items-center text-lg">
									<p style={{width: '10%'}} className="flex justify-center">
										{item.id}
									</p>
									<p style={{width: '40%'}} className="flex my-2">
										{item.name}
									</p>

									<p style={{width: '20%'}} className="flex justify-center my-2">
										{item.unitPrice.toLocaleString()} ₫
									</p>
									<p style={{width: '10%'}} className="flex justify-center my-2">
										{item.quantity}
									</p>
									<p style={{width: '20%'}} className="flex justify-center">
										{item.total.toLocaleString()}
									</p>
								</div>
								<Divider />
							</div>
						))}
						<p className="flex justify-end items-center text-lg font-semibold">
							Jewelry Price:{' '}
							<p className="ml-10">{gr.jewelry_price.toLocaleString()} ₫</p>
						</p>
					</div>
				))}
				<div className="w-full bg-primary p-5 border rounded">
					<p className="flex justify-end items-center text-lg font-semibold">
						Total Price:{' '}
						<p className="ml-10">{detailGroups.total_price.toLocaleString()} ₫</p>
					</p>
				</div>
			</div>
		</div>
	);
};

export default InformationOrder;
