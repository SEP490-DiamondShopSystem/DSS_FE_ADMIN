import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Col, DatePicker, Form, Input, InputNumber, Row, Select, Switch} from 'antd';
import React from 'react';
import {DiscountReqForm} from './DiscountReqForm';

const {RangePicker} = DatePicker;
const {Option} = Select;

const DiscountForm = ({
	isEditing,
	form,
	handleUpdate,
	handleCreateDiscount,
	handleCancelEdit,
	handleCancel,
	handleTargetTypeChange,
	targetTypes,
	addRequirement,
	addGift,
	shapes,
	removeRequirement, // Receive removeRequirement as a prop
}) => {
	return (
		<div>
			<Form
				form={form}
				onFinish={isEditing ? handleUpdate : handleCreateDiscount}
				layout="vertical"
				className="space-y-6"
			>
				{/* Discount Title and Apply Fields */}

				<Form.Item label="Chi Tiết Giảm Giá" className="mb-0">
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="name"
								label="Discount Name"
								rules={[{required: true, message: 'Please enter a discount name'}]}
								className="mb-0"
							>
								<Input
									className="border border-gray-300 rounded-md p-2 focus:border-blue-500"
									placeholder="Enter discount name"
								/>
							</Form.Item>
							<Form.Item
								name="discountCode"
								label="DiscountCode"
								rules={[{required: true, message: 'Please enter a discountCode'}]}
							>
								<Input
									className="border border-gray-300 rounded-md p-2 focus:border-blue-500"
									placeholder="Enter discountCode"
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								label="Valid Date"
								name="validDate"
								rules={[
									{required: true, message: 'Please select a valid date range'},
								]}
							>
								<RangePicker
									showTime
									format="DD-MM-YYYY HH:mm"
									className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500"
								/>
							</Form.Item>
							<Form.Item
								name="discountPercent"
								label="DiscountPercent"
								rules={[
									{required: true, message: 'Please enter a DiscountPercent'},
								]}
							>
								<Input
									className="border border-gray-300 rounded-md p-2 focus:border-blue-500"
									placeholder="Enter discountCode"
								/>
							</Form.Item>
						</Col>
					</Row>
				</Form.Item>

				{/* Requirement Section */}
				<h3 className="text-xl font-semibold mt-6">Các Yêu Cầu</h3>
				<div className="flex space-x-4 mb-4">
					<Button type="dashed" onClick={() => addRequirement()}>
						<PlusOutlined /> Thêm Yêu Cầu
					</Button>
				</div>

				{/* Dynamic Requirement List */}
				<DiscountReqForm
					form={form}
					shapes={shapes}
					Option={Option}
					removeRequirement={removeRequirement} // Passing the function as a prop
				/>

				{/* Submit Button */}
				<Form.Item>
					<div className="flex justify-end space-x-4">
						{isEditing && (
							<Button
								type="default"
								onClick={handleCancelEdit}
								className="bg-gray-100 text-gray-700 hover:bg-gray-200"
							>
								Hủy
							</Button>
						)}
						<Button
							type="primary"
							htmlType="submit"
							className="bg-blue-500 text-white hover:bg-blue-600"
						>
							{isEditing ? 'Save' : 'Create'}
						</Button>
					</div>
				</Form.Item>
			</Form>
		</div>
	);
};

export default DiscountForm;
