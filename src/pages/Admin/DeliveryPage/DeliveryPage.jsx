import React, {useEffect, useState} from 'react';
import {CarryOutOutlined, DeleteFilled, EditFilled, PlusOutlined} from '@ant-design/icons';
import {
	Button,
	DatePicker,
	Form,
	Image,
	Input,
	message,
	Modal,
	Select,
	Space,
	Table,
	Tag,
	Tooltip,
	Row,
	Col,
} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {
	getAllDeliverySelector,
	getAllOrderSelector,
	getAllUserSelector,
	GetUserDetailSelector,
	LoadingDeliverySelector,
} from '../../../redux/selectors';
import {
	getAllDelivery,
	handleBeginDelivery,
	handleCreateDelivery,
} from '../../../redux/slices/deliverySlice';
import {getAllOrder} from '../../../redux/slices/orderSlice';
import moment from 'moment/moment';
import {getAllUser} from '../../../redux/slices/userSlice';
import {convertToVietnamDate} from '../../../utils';

const {Search} = Input;
const {Option} = Select;

const DeliveryPage = () => {
	const dispatch = useDispatch();
	const deliveryList = useSelector(getAllDeliverySelector);
	const orderList = useSelector(getAllOrderSelector);
	const userList = useSelector(getAllUserSelector);
	const userDetail = useSelector(GetUserDetailSelector);
	const loading = useSelector(LoadingDeliverySelector);

	const [active, setActive] = useState('all');
	const [type, setType] = useState('');
	const [metal, setMetal] = useState('');
	const [searchText, setSearchText] = useState('');
	const [orders, setOrders] = useState([]);
	const [deliveries, setDeliveries] = useState([]);
	const [userRoleManager, setUserRoleManager] = useState(false);
	const [userRoleDeliverer, setUserRoleDeliverer] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);

	const columns = [
		{
			title: 'ID',
			dataIndex: 'Id',
			key: 'Id',
			align: 'center',
			responsive: ['sm'],
		},
		{
			title: 'Ngày giao hàng',
			key: 'DeliveryDate',
			dataIndex: 'DeliveryDate',
			align: 'center',
		},
		{
			title: 'Người giao hàng',
			key: 'Deliverer',
			dataIndex: 'Deliverer',
			align: 'center',
			responsive: ['md'],
		},
		{
			title: 'Phương thức giao hàng',
			key: 'DeliveryMethod',
			dataIndex: 'DeliveryMethod',
			align: 'center',
			responsive: ['lg'],
		},
		// Conditionally render the "Action" column only if the user is the deliverer
		...(userRoleDeliverer && deliveries?.some((d) => d.DelivererId === userDetail?.Id)
			? [
					{
						title: 'Action',
						key: 'action',
						align: 'center',
						render: (_, record) =>
							record.DelivererId === userDetail?.Id && (
								<Tooltip title="Giao Sớm">
									<Button
										type="text"
										className="bg-primary"
										onClick={() => handleBeginDeliveryBtn(record.Id)}
									>
										<CarryOutOutlined />
									</Button>
								</Tooltip>
							),
					},
			  ]
			: []),
	];

	// Existing useEffect hooks remain the same

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const onFinish = (values) => {
		dispatch(handleCreateDelivery(values))
			.unwrap()
			.then(() => {
				message.success('Chuyển giao shipper thành công!');
				setIsModalVisible(false);
			})
			.catch((error) => {
				message.error(error?.data?.title || error?.detail);
			});
	};

	const handleBeginDeliveryBtn = () => {
		dispatch(handleBeginDelivery())
			.unwrap()
			.then(() => {
				message.success('Giao hàng sớm!');
			})
			.catch((error) => {
				message.error(error?.data?.title || error?.detail);
			});
	};

	const onSearch = (value) => {
		setSearchText(value);
	};

	return (
		<div className="p-4 sm:p-6 lg:p-10">
			<Row gutter={[16, 16]} align="middle" justify="space-between" className="mb-6">
				<Col xs={24} sm={24} md={12} lg={16}>
					<Row gutter={[16, 16]} align="middle" wrap>
						<Col xs={24} sm={8} md={6}>
							<p className="mb-2 sm:mb-0">Tìm kiếm</p>
						</Col>
						<Col xs={24} sm={16} md={18}>
							<Search
								className="w-full"
								placeholder="Nhập từ khóa tìm kiếm"
								allowClear
								onSearch={onSearch}
							/>
						</Col>
					</Row>
					<Row gutter={[16, 16]} className="mt-4">
						<Col xs={24} sm={12} md={8} lg={6}>
							<Select
								className="w-full"
								placeholder="Loại sản phẩm"
								allowClear
								onChange={(value) => setType(value)}
								options={[
									{value: 'ring', label: 'Ring'},
									{value: 'pendant', label: 'Pendant'},
									{value: 'bracelets', label: 'Bracelets'},
									{value: 'earrings', label: 'Earrings'},
								]}
							/>
						</Col>
						<Col xs={24} sm={12} md={8} lg={6}>
							<Select
								className="w-full"
								placeholder="Chất liệu"
								allowClear
								onChange={(value) => setMetal(value)}
								options={[
									{value: 'gold', label: 'Gold'},
									{value: 'silver', label: 'Silver'},
								]}
							/>
						</Col>
						<Col xs={24} sm={12} md={8} lg={6}>
							<Select
								className="w-full"
								placeholder="Hình dáng"
								allowClear
								options={[
									{value: 'round', label: 'Round'},
									{value: 'princess', label: 'Princess'},
									{value: 'cushion', label: 'Cushion'},
									{value: 'oval', label: 'Oval'},
									{value: 'emerald', label: 'Emerald'},
									{value: 'pear', label: 'Pear'},
									{value: 'asscher', label: 'Asscher'},
									{value: 'heart', label: 'Heart'},
									{value: 'radiant', label: 'Radiant'},
									{value: 'marquise', label: 'Marquise'},
								]}
							/>
						</Col>
					</Row>
				</Col>
				{userRoleManager && (
					<Col xs={24} sm={24} md={12} lg={8} className="text-right">
						<Button
							type="primary"
							icon={<PlusOutlined />}
							onClick={showModal}
							className="w-full sm:w-auto"
						>
							Thêm
						</Button>
					</Col>
				)}
			</Row>

			<Table
				dataSource={deliveries}
				columns={columns}
				loading={loading}
				responsive
				scroll={{x: 'max-content'}}
				className="w-full"
			/>

			<Modal
				title="Chuyển giao shipper"
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={null}
				width="90%"
				maxWidth={600}
			>
				<Form layout="vertical" onFinish={onFinish}>
					<Row gutter={[16, 16]}>
						<Col xs={24}>
							<Form.Item
								name="orderIds"
								label="Id Đơn Hàng"
								rules={[{required: true, message: 'Vui lòng chọn Order IDs'}]}
							>
								<Select
									mode="multiple"
									placeholder="Chọn Order IDs"
									className="w-full"
								>
									{orders?.map((order) => (
										<Option key={order.Id} value={order.Id}>
											{order.Id}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col xs={24}>
							<Form.Item
								name="delivererId"
								label="Người Giao Hàng"
								rules={[{required: true, message: 'Chọn người giao hàng'}]}
							>
								<Input placeholder="Nhập ID người giao hàng" className="w-full" />
							</Form.Item>
						</Col>
						<Col xs={24}>
							<Form.Item
								name="deliveryDate"
								label="Ngày Bắt Đầu Giao Hàng"
								rules={[{required: true, message: 'Vui lòng chọn ngày giao hàng'}]}
							>
								<DatePicker
									format="DD-MM-YYYY"
									placeholder="Chọn ngày giao hàng"
									className="w-full"
								/>
							</Form.Item>
						</Col>
						<Col xs={24}>
							<Form.Item
								name="method"
								label="Phương Thức Giao Hàng"
								rules={[{required: true, message: 'Vui lòng chọn phương thức'}]}
							>
								<Select placeholder="Chọn phương thức" className="w-full">
									<Option value="car">Xe</Option>
								</Select>
							</Form.Item>
						</Col>
						<Col xs={24}>
							<Form.Item>
								<Button type="primary" htmlType="submit" className="w-full">
									Thêm
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>
		</div>
	);
};

export default DeliveryPage;
