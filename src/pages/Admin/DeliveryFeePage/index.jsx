import React, {useEffect, useState} from 'react';
import {Table, Button, Input, Form, Modal, message, Select, Card} from 'antd';
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
		dispatch(deleteDeliveryFee(id))
			.unwrap()
			.then((res) => {
				message.success('Delivery Fee deleted successfully!');
				dispatch(updateDeliveryFee(updatePayload));
			})
			.catch((error) => {
				message.error(error?.data?.title || error?.detail);
			});
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

			try {
				await dispatch(updateDeliveryFee(updatePayload))
					.unwrap()
					.then((res) => {
						message.success('Delivery Fee updated successfully!');
					})
					.catch((error) => {
						message.error(error?.data?.title || error?.detail);
					});
				await dispatch(fetchDeliveryFees({isLocation: true}));
			} catch (error) {
				message.error(error?.data?.title || error?.detail);
			}
		} else {
			try {
				await dispatch(addDeliveryFee(payload))
					.unwrap()
					.then((res) => {
						message.success('Delivery Fee added successfully!');
					})
					.catch((error) => {
						message.error(error?.data?.title || error?.detail);
					});
				await dispatch(fetchDeliveryFees({isLocation: true}));
			} catch (error) {
				message.error(error?.data?.title || error?.detail);
			}
		}

		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
		form.resetFields();
	};

	const columns = [
		{
			title: 'Delivery Method',
			dataIndex: 'DeliveryMethod',
			key: 'DeliveryMethod',
		},
		{
			title: 'Name',
			dataIndex: 'Name',
			key: 'Name',
		},
		{
			title: 'Cost',
			dataIndex: 'Cost',
			key: 'Cost',
			render: (text) => new Intl.NumberFormat('vi-VN').format(text) + ' VND',
		},
		{
			title: 'Actions',
			key: 'actions',
			render: (_, record) => (
				<div className="flex space-x-2">
					<Button
						onClick={() => handleEditDeliveryFee(record)}
						type="link"
						className="text-primary hover:text-primaryDark"
					>
						Edit
					</Button>
					<Button
						onClick={() => handleDeleteDeliveryFee(record.Id)}
						type="link"
						danger
						className="text-red hover:text-redLight"
					>
						Delete
					</Button>
				</div>
			),
		},
	];

	return (
		<div className="p-6 bg-offWhite min-h-screen">
			<h1 className="text-2xl font-semibold mb-4 text-primary">Manage Delivery Fees</h1>
			<Button
				type="primary"
				onClick={handleAddDeliveryFee}
				style={{marginBottom: 20}}
				className="bg-primary hover:bg-green text-white"
			>
				Add New Delivery Fee
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
				title={editDeliveryFee ? 'Edit Delivery Fee' : 'Add New Delivery Fee'}
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
						label="Delivery Method"
						name="DeliveryMethod"
						rules={[{required: true, message: 'Please input the delivery method!'}]}
					>
						<Input className="border-gray-300" />
					</Form.Item>
					<Form.Item
						label="Name"
						name="Name"
						rules={[{required: true, message: 'Please input the name!'}]}
					>
						<Input className="border-gray-300" />
					</Form.Item>
					<Form.Item
						label="Cost"
						name="Cost"
						rules={[{required: true, message: 'Please input the cost!'}]}
					>
						<Input type="number" className="border-gray-300" />
					</Form.Item>
					<Form.Item
						label="To Location"
						name="provinceId"
						rules={[{required: true, message: 'Please select a location!'}]}
						style={{display: editDeliveryFee ? 'none' : 'block'}} // Hide when editing
					>
						<Select
							placeholder="Select a province"
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
							{editDeliveryFee ? 'Update' : 'Add'}
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default DeliveryFeePage;
