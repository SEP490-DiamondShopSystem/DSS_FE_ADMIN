import {Checkbox, Form, Input, InputNumber, Modal, Radio, Select} from 'antd';
import React, {useEffect, useState} from 'react';
import {getAllUser} from '../../../../../redux/slices/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import {getAllUserSelector} from '../../../../../redux/selectors';

export const LockDiamondModal = ({isOpen, onCancel, onSubmit, lockDiamondId, form}) => {
	const dispatch = useDispatch();

	// Handle customer data
	const customerList = useSelector(getAllUserSelector);
	const [customers, setCustomers] = useState([]);

	useEffect(() => {
		// Fetch users with roleId 1
		dispatch(getAllUser({roleId: 1}));
	}, [dispatch]);

	useEffect(() => {
		// Update the customers state when customerList is fetched
		if (customerList?.Values) {
			setCustomers(customerList.Values);
		}
	}, [customerList]);

	console.log('lockDiamondId', lockDiamondId);

	return (
		<Modal
			title={`${lockDiamondId?.Status === 5 ? 'Mở Kim Cương' : 'Khóa Kim Cương'}`}
			visible={isOpen}
			onCancel={onCancel} // Close modal when cancel is clicked
			onOk={() => form.submit()} // Trigger form submission
			okText="Xác nhận"
			cancelText="Hủy"
		>
			<Form
				layout="vertical"
				onFinish={onSubmit} // Handle form submission
				form={form} // Attach form to the modal
			>
				<Form.Item name="diamondId" label="Mã Kim Cương" initialValue={lockDiamondId?.Id}>
					<Input disabled />
				</Form.Item>

				<Form.Item
					name="customerId"
					label="Khách Hàng"
					rules={[{required: true, message: 'Vui lòng chọn khách hàng!'}]}
				>
					<Select placeholder="Chọn khách hàng">
						{Array.isArray(customers) &&
							customers.map((customer) => (
								<Select.Option key={customer.Id} value={customer.Id}>
									{customer?.Email}
								</Select.Option>
							))}
					</Select>
				</Form.Item>

				<Form.Item
					name="isUnlock"
					label="Mở Khóa/Khóa Kim Cương"
					initialValue={lockDiamondId?.Status === 5 ? 'false' : 'true'}
				>
					<Radio.Group>
						<Radio disabled={lockDiamondId?.Status !== 5} value="true">
							Mở kim cương
						</Radio>
						<Radio disabled={lockDiamondId?.Status === 5} value="false">
							Khóa kim cương
						</Radio>
					</Radio.Group>
				</Form.Item>

				<Form.Item
					name="lockHour"
					label="Thời gian khóa (Giờ)"
					rules={[{required: true, message: 'Vui lòng nhập thời gian khóa!'}]}
				>
					<InputNumber min={1} max={12} placeholder="Nhập số giờ" className="w-full" />
				</Form.Item>

				<Form.Item
					name="lockedPriceForCustomer"
					label="Giá Khóa Cho Khách Hàng"
					rules={[{required: true, message: 'Vui lòng nhập giá!'}]}
				>
					<InputNumber min={0} placeholder="Nhập giá khóa" className="w-full" />
				</Form.Item>
			</Form>
		</Modal>
	);
};
