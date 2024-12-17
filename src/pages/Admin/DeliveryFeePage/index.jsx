import React, {useEffect, useState} from 'react';
import {Table, Button, Input, Form, Modal, message, Select, Card, Space} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {
	fetchDeliveryFees,
	addDeliveryFee,
	updateDeliveryFee,
	deleteDeliveryFee,
	setActiveDeliveryFee,
} from '../../../redux/slices/deliveryFeeSlice';
import {fetchAllLocations} from '../../../redux/slices/locationSlice';
import {
	getAllDeliveryFeesSelector,
	DeliveryFeelErrorSelector,
	LoadingDeliveryFeeSelector,
	getAllLocationsSelector,
} from '../../../redux/selectors';
import {CheckOutlined, CloseOutlined, EditOutlined} from '@ant-design/icons';

const {Option} = Select;

const DeliveryFeePage = () => {
	const dispatch = useDispatch();
	const deliveryFees = useSelector(getAllDeliveryFeesSelector);
	const loading = useSelector(LoadingDeliveryFeeSelector);
	const error = useSelector(DeliveryFeelErrorSelector);

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editDeliveryFee, setEditDeliveryFee] = useState(null);
	const [form] = Form.useForm();

	useEffect(() => {
		dispatch(fetchDeliveryFees({isLocation: true}));
	}, [dispatch]);

	const locations = useSelector(getAllLocationsSelector);

	useEffect(() => {
		dispatch(fetchAllLocations());
	}, [dispatch]);

	const handleAddDeliveryFee = () => {
		setEditDeliveryFee(null);
		form.resetFields();
		setIsModalVisible(true);
	};

	const handleEditDeliveryFee = (deliveryFee) => {
		setEditDeliveryFee(deliveryFee);
		form.setFieldsValue({
			...deliveryFee,
			provinceId: deliveryFee.ToLocation, // Set the provinceId for editing
		});
		setIsModalVisible(true);
	};

	const handleDeleteDeliveryFee = async (id) => {
		await dispatch(deleteDeliveryFee(id))
			.unwrap()
			.then(() => {
				message.success('Xóa giá vận chuyển thành công!');
				dispatch(updateDeliveryFee(updatePayload));
			})
			.catch((error) => {
				message.error(error?.data?.detail || error?.detail);
			});
		await dispatch(fetchDeliveryFees({isLocation: true}));
	};
	const HandleActiveDeliveryFee = async (id, updatePayload) => {
		await dispatch(setActiveDeliveryFee(id))
			.unwrap()
			.then(() => {
				message.success('Trạng thái giá vận chuyển được cập nhật thành công!');
				dispatch(updateDeliveryFee(updatePayload)); // Assuming this action updates the Redux store
			})
			.catch((error) => {
				message.error(error?.data?.detail || error?.detail || 'Đã xảy ra lỗi!');
			});
		await dispatch(fetchDeliveryFees({isLocation: true}));
	};

	const handleSubmit = async (values) => {
		const payload = {
			fees: [
				{
					name: values.Name,
					cost: values.Cost,
					provinceId: values.provinceId,
				},
			],
		};

		if (editDeliveryFee) {
			const updatePayload = {
				feeId: editDeliveryFee.Id,
				name: values.Name,
				cost: values.Cost,
				setActive: true,
			};

			await dispatch(updateDeliveryFee(updatePayload))
				.unwrap()
				.then(() => {
					message.success('Cập nhật giá vận chuyển thành công!');
				})
				.catch((error) => {
					message.error(error?.data?.detail || error?.detail);
				});
			await dispatch(fetchDeliveryFees({isLocation: true}));
		} else {
			await dispatch(addDeliveryFee(payload))
				.unwrap()
				.then(() => {
					message.success('Thêm giá vận chuyển thành công!');
				})
				.catch((error) => {
					message.error(error?.data?.detail || error?.detail);
				});
			await dispatch(fetchDeliveryFees({isLocation: true}));
		}

		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
		form.resetFields();
	};

	const columns = [
		{
			title: 'Hình Thức Vận Chuyển',
			dataIndex: 'DeliveryMethod',
			key: 'DeliveryMethod',
		},
		{
			title: 'Tỉnh/Thành',
			dataIndex: 'Name',
			key: 'Name',
		},
		{
			title: 'Chi Phí',
			dataIndex: 'Cost',
			key: 'Cost',
			render: (text) => new Intl.NumberFormat('vi-VN').format(text) + ' VND',
		},
		{
			title: '',
			key: 'actions',
			render: (_, record) => (
				<Space className="flex space-x-2">
					<Button
						onClick={() => handleEditDeliveryFee(record)}
						type="text"
						className="bg-primary"
					>
						<EditOutlined />
					</Button>
					<Button
						onClick={() => HandleActiveDeliveryFee(record.Id)}
						className={
							record.IsEnabled
								? 'text-red hover:text-redLight'
								: 'text-green hover:text-green'
						}
						icon={
							record.IsEnabled ? (
								<CloseOutlined style={{color: 'red'}} />
							) : (
								<CheckOutlined style={{color: 'green'}} />
							)
						}
					>
						{record.IsEnabled ? 'Hủy kích hoạt' : 'Kích hoạt'}
					</Button>
				</Space>
			),
		},
	];

	return (
		<div className="p-6 bg-offWhite min-h-screen">
			<h1 className="text-2xl font-semibold mb-4 text-primary">Quản Lí Phí Vận Chuyển</h1>
			<Button
				type="primary"
				onClick={handleAddDeliveryFee}
				style={{marginBottom: 20}}
				className="bg-primary hover:bg-green text-white"
			>
				Thêm Phí Vận Chuyển
			</Button>
			{loading && <p>Loading...</p>}
			{error && <p className="text-red-500">Error: {error}</p>}

			{/* Scrollable Table */}
			<Card className="p-4 bg-white shadow-md rounded-lg mb-6 border border-lightGray">
				<Table
					rowKey="Id"
					columns={columns}
					dataSource={deliveryFees}
					pagination={false}
					loading={loading}
					scroll={{y: 400}}
					className="table-auto w-full border-separate"
				/>
			</Card>

			{/* Modal for adding/editing delivery fees */}
			<Modal
				title={editDeliveryFee ? 'Cập Nhật Phí Vận Chuyển' : 'Thêm Phí Vận Chuyển'}
				visible={isModalVisible}
				onCancel={handleCancel}
				footer={null}
				className="modal-styles"
			>
				<Form
					form={form}
					onFinish={handleSubmit}
					initialValues={editDeliveryFee}
					layout="vertical"
				>
					<Form.Item
						label="Hình Thức Vận Chuyển"
						name="DeliveryMethod"
						rules={[{required: true, message: 'Vui lòng nhập hình thức giao hàng!'}]}
					>
						<Input className="border-gray-300" />
					</Form.Item>
					<Form.Item
						label="Tỉnh/Thành"
						name="Name"
						rules={[{required: true, message: 'Vui lòng nhập tỉnh/thành!'}]}
					>
						<Input className="border-gray-300" />
					</Form.Item>
					<Form.Item
						label="Chi Phí"
						name="Cost"
						rules={[{required: true, message: 'Vui lòng nhập chi phí!'}]}
					>
						<Input type="number" className="border-gray-300" />
					</Form.Item>
					<Form.Item
						label="Đến Vị Trí"
						name="provinceId"
						rules={[{required: true, message: 'Vui lòng chọn một vị trí!'}]}
						style={{display: editDeliveryFee ? 'none' : 'block'}} // Hide when editing
					>
						<Select
							placeholder="Chọn Tỉnh"
							value={editDeliveryFee ? editDeliveryFee.ToLocationId : undefined}
							className="border-gray-300"
						>
							{locations && locations.length > 0 ? (
								locations.map((location) => (
									<Option key={location.Id} value={location.Id}>
										{location.Name}
									</Option>
								))
							) : (
								<Option disabled>No locations available</Option>
							)}
						</Select>
					</Form.Item>

					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							className="w-full bg-primary hover:bg-primaryDark text-white"
						>
							{editDeliveryFee ? 'Cập Nhật' : 'Thêm'}
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default DeliveryFeePage;
