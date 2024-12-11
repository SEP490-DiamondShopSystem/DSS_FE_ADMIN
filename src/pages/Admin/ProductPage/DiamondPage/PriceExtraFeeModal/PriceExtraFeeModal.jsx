import React, {useState} from 'react';
import {Modal, Form, InputNumber, Button} from 'antd';

export const PriceExtraFeeModal = ({form, isVisible, onClose, onSubmit}) => {
	const handleOk = async () => {
		try {
			const values = await form.validateFields();
			onSubmit(values); // Pass form values to the parent
			form.resetFields(); // Clear the form after submission
			onClose(); // Close the modal
		} catch (error) {
			console.error('Validation failed:', error);
		}
	};

	const handleCancel = () => {
		form.resetFields();
		onClose();
	};

	return (
		<Modal
			title="Nhập giá bù trừ và phí bổ sung"
			visible={isVisible}
			onOk={handleOk}
			onCancel={handleCancel}
			okText="Submit"
			cancelText="Cancel"
		>
			<Form form={form} layout="vertical" name="price_extra_fee_form">
				<Form.Item
					name="priceOffset"
					label="Bù trừ giá"
					rules={[{required: true, message: 'Vui lòng nhập giá bù trừ!'}]}
				>
					<InputNumber min={0} style={{width: '100%'}} placeholder="Nhập giá bù trừ" />
				</Form.Item>

				<Form.Item
					name="extraFee"
					label="Phí bổ sung"
					rules={[{required: true, message: 'Vui lòng nhập thêm phí!'}]}
				>
					<InputNumber
						min={0}
						style={{width: '100%'}}
						placeholder="Nhập thêm phí"
						formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
						parser={(value) => value.replace(/,/g, '')}
					/>
				</Form.Item>
			</Form>
		</Modal>
	);
};
