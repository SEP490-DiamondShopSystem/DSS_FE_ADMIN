import React, {useEffect, useState} from 'react';
import {Table, Button, Input, Form, Modal, message, Select} from 'antd';
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

	// Fetch delivery fees with the isLocation parameter set to true
	useEffect(() => {
		dispatch(fetchDeliveryFees({isLocation: true}));
	}, [dispatch]);

	const locations = useSelector(getAllLocationsSelector);

	useEffect(() => {
		console.log('Fetching locations...');
		dispatch(fetchAllLocations());
	}, [dispatch]);

	useEffect(() => {
		console.log('Locations updated:', locations);
	}, [locations]);

	const handleAddDeliveryFee = () => {
		setEditDeliveryFee(null);
		form.resetFields();
		setIsModalVisible(true);
	};

	const handleEditDeliveryFee = (deliveryFee) => {
		setEditDeliveryFee(deliveryFee);
		form.setFieldsValue({
			...deliveryFee,
			provinceId: deliveryFee.ToLocationId, // Set the provinceId for editing
		});
		setIsModalVisible(true);
	};

	// Handle deletion of a delivery fee
	const handleDeleteDeliveryFee = async (id) => {
		dispatch(deleteDeliveryFee(id));
		message.success('Delivery Fee deleted successfully!');
        await dispatch(updateDeliveryFee(updatePayload));

	};

	// Handle form submission for adding/updating delivery fees
    const handleSubmit = async (values) => {
        // Construct the payload for adding a delivery fee (POST)
        const payload = {
          fees: [
            {
              name: values.Name,          // Fee name
              cost: values.Cost,          // Fee cost
              provinceId: values.provinceId, // The selected location
            },
          ],
        };
      
        if (editDeliveryFee) {
          // When editing, construct the payload for updating (PUT)
          const updatePayload = {
            feeId: editDeliveryFee.Id,  // Use the existing delivery fee ID
            name: values.Name,          // Fee name
            cost: values.Cost,          // Fee cost
            setActive: true,             // Assuming the fee is being set to active
          };
      
          try {
            // Dispatch the update action with the correct payload
            await dispatch(updateDeliveryFee(updatePayload));
            // Fetch the updated delivery fees list
            await dispatch(fetchDeliveryFees({ isLocation: true }));
            message.success('Delivery Fee updated successfully!');
          } catch (error) {
            message.error('Failed to update Delivery Fee!');
          }
        } else {
          // When adding new, dispatch the add request (POST) with the constructed payload
          try {
            await dispatch(addDeliveryFee(payload));
            // Fetch the updated delivery fees list
            await dispatch(fetchDeliveryFees({ isLocation: true }));
            message.success('Delivery Fee added successfully!');
          } catch (error) {
            message.error('Failed to add Delivery Fee!');
          }
        }
      
        // Close the modal after submit
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
			render: (text) => new Intl.NumberFormat('vi-VN').format(text) + ' VND', // Format number and append " VND"
		},
		{
			title: 'Actions',
			key: 'actions',
			render: (_, record) => (
				<span>
					<Button onClick={() => handleEditDeliveryFee(record)} type="link">
						Edit
					</Button>
					<Button
						onClick={() => handleDeleteDeliveryFee(record.Id)} // Pass the Id for deletion
						type="link"
						danger
					>
						Delete
					</Button>
				</span>
			),
		},
	];

	return (
		<div style={{padding: 20}}>
			<h1>Manage Delivery Fees</h1>
			<Button type="primary" onClick={handleAddDeliveryFee} style={{marginBottom: 20}}>
				Add New Delivery Fee
			</Button>
			{loading && <p>Loading...</p>}
			{error && <p style={{color: 'red'}}>Error: {error}</p>}

			{/* Scrollable Table */}
			<Table
				rowKey="Id"
				columns={columns}
				dataSource={deliveryFees}
				pagination={false}
				loading={loading}
				scroll={{y: 400}} // Set a fixed height for scroll, adjust as needed
			/>

			{/* Modal for adding/editing delivery fees */}
			<Modal
				title={editDeliveryFee ? 'Edit Delivery Fee' : 'Add New Delivery Fee'}
				visible={isModalVisible}
				onCancel={handleCancel}
				footer={null}
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
						<Input />
					</Form.Item>
					<Form.Item
						label="Name"
						name="Name"
						rules={[{required: true, message: 'Please input the name!'}]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label="Cost"
						name="Cost"
						rules={[{required: true, message: 'Please input the cost!'}]}
					>
						<Input type="number" />
					</Form.Item>
					<Form.Item
						label="To Location"
						name="provinceId"
						rules={[{required: true, message: 'Please select a location!'}]}
					>
						<Select placeholder="Select a province">
							{locations && locations.length > 0 ? (
								locations.map((location) => (
									<Option key={location.Id} value={location.Id}>
										{location.Name}
									</Option>
								))
							) : (
								<Option disabled>No locations available</Option> // Handle case when no locations are available
							)}
						</Select>
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit">
							{editDeliveryFee ? 'Update' : 'Add'}
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default DeliveryFeePage;
