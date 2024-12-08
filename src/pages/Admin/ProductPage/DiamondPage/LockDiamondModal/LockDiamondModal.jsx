import {Checkbox, Form, Input, InputNumber, Modal, Popover, Radio, Select} from 'antd';
import React, {useEffect, useState} from 'react';
import {getAllUser} from '../../../../../redux/slices/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import {getAllUserSelector} from '../../../../../redux/selectors';
import {InfoCircleOutlined} from '@ant-design/icons';

export const LockDiamondModal = ({isOpen, onCancel, onSubmit, lockDiamondId, form}) => {
	const dispatch = useDispatch();

	const customerList = useSelector(getAllUserSelector);
	const [customers, setCustomers] = useState([]);
	const [searchValue, setSearchValue] = useState('');

	useEffect(() => {
		// Fetch all users with roleId 1
		dispatch(getAllUser({roleId: 1, size: 100}));
	}, [dispatch]);

	useEffect(() => {
		// Set customers when customerList updates
		if (customerList?.Values) {
			setCustomers(customerList.Values);
		}
	}, [customerList]);

	useEffect(() => {
		// Update form fields when lockDiamondId changes
		if (lockDiamondId) {
			form.setFieldsValue({
				diamondId: lockDiamondId?.Id || null,
				customerId: lockDiamondId?.ProductLock?.AccountId || null,
				isUnlock: lockDiamondId?.ProductLock !== null ? 'true' : 'false',
				lockHour: null,
				lockedPriceForCustomer: null,
			});
		}
	}, [lockDiamondId, form]);

	const handleSearch = (value) => {
		setSearchValue(value);
	};

	const filteredCustomers = customers?.filter((customer) =>
		customer?.Email?.toLowerCase().includes(searchValue.toLowerCase())
	);

	const popoverContent = (
		<div>
			<p>Giá kim cương ở đây là giá đã được xác định là chính xác.</p>
			<p>Nếu chưa chắc chắn, vui lòng không nhập.</p>
		</div>
	);

	return (
		<Modal
			title={`${lockDiamondId?.Status !== 5 ? 'Mở Kim Cương' : 'Khóa Kim Cương'}`}
			visible={isOpen}
			onCancel={onCancel}
			onOk={() => form.submit()}
			okText="Xác nhận"
			cancelText="Hủy"
		>
			<Form layout="vertical" onFinish={onSubmit} form={form}>
				<Form.Item name="diamondId" label="Mã Kim Cương">
					<Input disabled />
				</Form.Item>

				<Form.Item
					name="customerId"
					label="Khách Hàng"
					rules={[{required: true, message: 'Vui lòng chọn khách hàng!'}]}
				>
					<Select
						placeholder="Chọn khách hàng"
						showSearch
						disabled={lockDiamondId?.ProductLock !== null}
						onSearch={handleSearch}
						filterOption={false}
						value={form.getFieldValue('customerId')}
					>
						{Array.isArray(filteredCustomers) &&
							filteredCustomers.map((customer) => (
								<Select.Option key={customer.Id} value={customer.Id}>
									{customer?.Email}
								</Select.Option>
							))}
					</Select>
				</Form.Item>

				<Form.Item name="isUnlock" label="Mở Khóa/Khóa Kim Cương">
					<Radio.Group>
						<Radio disabled={lockDiamondId?.ProductLock === null} value="true">
							Mở kim cương
						</Radio>
						<Radio disabled={lockDiamondId?.ProductLock !== null} value="false">
							Khóa kim cương
						</Radio>
					</Radio.Group>
				</Form.Item>

				{lockDiamondId?.ProductLock === null && (
					<>
						<Form.Item
							name="lockHour"
							label="Thời gian khóa (Giờ)"
							rules={[{required: true, message: 'Vui lòng nhập thời gian khóa!'}]}
						>
							<InputNumber
								min={1}
								max={24}
								placeholder="Nhập số giờ"
								className="w-full"
							/>
						</Form.Item>

						<Form.Item
							name="lockedPriceForCustomer"
							label="Giá Khóa Cho Khách Hàng"
							rules={[{required: true, message: 'Vui lòng nhập giá!'}]}
						>
							<InputNumber
								min={0}
								placeholder="Nhập giá khóa"
								className="w-full"
								formatter={(value) =>
									`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
								}
								parser={(value) => value.replace(/,/g, '')}
								addonAfter={
									<Popover
										content={popoverContent}
										title="Thông tin giá kim cương"
									>
										<InfoCircleOutlined
											style={{color: '#1890ff', cursor: 'pointer'}}
										/>
									</Popover>
								}
							/>
						</Form.Item>
					</>
				)}
			</Form>
		</Modal>
	);
};
