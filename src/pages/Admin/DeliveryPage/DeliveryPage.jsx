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
} from 'antd';
import {Filter} from '../../../components/Filter';
import '../../../css/antd.css';
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
	const [users, setUsers] = useState([]);
	const [userRoleManager, setUserRoleManager] = useState([]);
	const [userRoleDeliverer, setUserRoleDeliverer] = useState([]);
	const [isModalVisible, setIsModalVisible] = useState(false);

	const columns = [
		{
			title: 'ID',
			dataIndex: 'Id',
			key: 'Id',
			align: 'center',
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
		},
		{
			title: 'Phương thức giao hàng',
			key: 'DeliveryMethod',
			dataIndex: 'DeliveryMethod',
			align: 'center',
		},
		// Conditionally render the "Action" column if userRoleDeliverer is true
		...(userRoleDeliverer
			? [
					{
						title: 'Action',
						key: 'action',
						align: 'center',
						render: (_, record) => (
							<Tooltip title="Giao Sớm">
								<Button
									type="text"
									className="bg-primary"
									onClick={handleBeginDeliveryBtn}
								>
									<CarryOutOutlined />
								</Button>
							</Tooltip>
						),
					},
			  ]
			: []),
	];

	useEffect(() => {
		dispatch(getAllDelivery());
	}, []);

	useEffect(() => {
		dispatch(getAllOrder());
	}, []);

	useEffect(() => {
		dispatch(getAllUser());
	}, []);

	useEffect(() => {
		if (deliveryList) {
			setDeliveries(
				deliveryList?.map((delivery) => ({
					Id: delivery.Id,
					DeliveryDate: convertToVietnamDate(delivery.DeliveryDate),
					DelivererId: delivery.DelivererId,
					DeliveryMethod: delivery.DeliveryMethod,
				}))
			);
		}
	}, [deliveryList]);

	useEffect(() => {
		if (orderList) {
			const mappedOrder = orderList?.filter((order) => order?.Status === 5);
			setOrders(mappedOrder);
		}
	}, [orderList]);

	useEffect(() => {
		if (userDetail?.Roles) {
			const isManager = userDetail.Roles.some((role) => role?.RoleName === 'manager');
			const isDeliverer = userDetail.Roles.some((role) => role?.RoleName === 'deliverer');

			setUserRoleManager(isManager);
			setUserRoleDeliverer(isDeliverer);
		}
	}, [userDetail]);

	// useEffect(() => {
	// 	if (userList) {
	// 		const mappedOrder = userList?.Values?.filter((user) => user?.Status === 2);
	// 		setOrders(mappedOrder);
	// 	}
	// }, [userList]);

	console.log('userDetail', userDetail);

	const filter = [
		{name: 'All', value: 'all'},
		{name: 'Activated', value: 'activated'},
		{name: 'Expired', value: 'expired'},
	];

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
		console.log('Form Values:', values);

		dispatch(handleCreateDelivery(values)).then((res) => {
			if (res.payload) {
				message.success('Tạo gói hàng thành công!');
				setIsModalVisible(false);
			}
		});
	};

	const handleBeginDeliveryBtn = () => {
		dispatch(handleBeginDelivery()).then((res) => {
			if (res.payload) {
				message.success('Giao hàng sớm');
				window.location.reload();
			} else {
				message.error('Lỗi hệ thống!');
			}
		});
	};

	const onSearch = (value) => {
		setSearchText(value);
	};

	const handleTypeChange = (value) => {
		setType(value);
	};

	const handleMetalChange = (value) => {
		setMetal(value);
	};

	// console.log(filteredData);

	return (
		<div className="mx-20 my-10">
			{/* <Filter filter={filter} handleStatusBtn={handleStatusBtn} active={active} /> */}
			<div>
				<div className="flex items-center justify-between">
					<div className="flex items-center my-5">
						<p className="mr-3">Tìm kiếm</p>
						<Search
							className="w-60"
							placeholder="input search text"
							allowClear
							onSearch={onSearch}
						/>
						<Space wrap className="ml-8">
							<Select
								defaultValue=""
								style={{width: 120}}
								allowClear
								onChange={handleTypeChange}
								options={[
									{value: 'ring', label: 'Ring'},
									{value: 'pendant', label: 'Pendant'},
									{value: 'bracelets', label: 'Bracelets'},
									{value: 'earrings', label: 'Earrings'},
								]}
							/>
							<Select
								defaultValue=""
								style={{width: 120}}
								allowClear
								onChange={handleMetalChange}
								options={[
									{value: 'gold', label: 'Gold'},
									{value: 'silver', label: 'Silver'},
								]}
							/>
							<Select
								defaultValue=""
								style={{width: 120}}
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
						</Space>
					</div>
					{userRoleManager && (
						<div>
							<Button
								type="text"
								className="bg-primary"
								icon={<PlusOutlined />}
								onClick={showModal}
							>
								Thêm
							</Button>
						</div>
					)}
				</div>
				<div>
					<Table dataSource={deliveries} columns={columns} loading={loading} />
				</div>
			</div>
			<Modal
				title="Add Delivery"
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={null} // Custom footer with form submission
			>
				<Form layout="vertical" onFinish={onFinish}>
					{/* Select Order IDs */}
					<Form.Item
						name="orderIds"
						label="Id Đơn Hàng"
						rules={[{required: true, message: 'Please select order IDs'}]}
					>
						{orders &&
							orders?.map((order) => (
								<Select mode="multiple" placeholder="Chọn Order IDs">
									<Option value={order.Id}>{order.Id}</Option>
								</Select>
							))}
					</Form.Item>
					<Form.Item
						name="delivererId"
						label="Người Giao Hàng"
						rules={[{required: true, message: 'Chọn người giao hàng'}]}
					>
						{/* {orders &&
							orders?.map((order) => (
								<Select mode="multiple" placeholder="Select Order IDs">
									<Option value={order.Id}>{order.Id}</Option>
								</Select>
							))} */}

						<Select placeholder="Chọn người giao hàng">
							<Option value="be289669-d5aa-4558-8e5b-bb24a89d41b5">
								be289669-d5aa-4558-8e5b-bb24a89d41b5
							</Option>
						</Select>
					</Form.Item>
					{/* Select Delivery Date */}

					<Form.Item
						name="deliveryDate"
						label="Delivery Date"
						rules={[{required: true, message: 'Please choose a delivery date'}]}
					>
						<DatePicker
							format="DD-MM-YYYY"
							placeholder="Select delivery date"
							style={{width: '100%'}}
						/>
					</Form.Item>
					{/* Select Method */}
					<Form.Item
						name="method"
						label="Delivery Method"
						rules={[{required: true, message: 'Please select a method'}]}
					>
						<Select placeholder="Select Method">
							<Option value="car">Car</Option>
							{/* <Option value="Online Payment">Online Payment</Option> */}
						</Select>
					</Form.Item>
					{/* Submit Button */}
					<Form.Item>
						<Button type="primary" htmlType="submit">
							Thêm
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default DeliveryPage;
