import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {
	Button,
	Checkbox,
	Col,
	DatePicker,
	Form,
	Input,
	InputNumber,
	Row,
	Select,
	Space,
	Switch,
} from 'antd';
import React from 'react';
import {GiftForm} from './GiftForm';
import {PromoReqForm} from './PromoReqForm';

const {RangePicker} = DatePicker;
const {Option} = Select;

const PromotionForm = ({
	isEditing,
	form,
	handleUpdate,
	handleCreatePromotion,
	handleCancelEdit,
	handleCancel,
	handleTargetTypeChange,
	targetTypes,
	addRequirement,
	addGift,
	shapes,
	removeRequirement,
	removeGift, // Receive removeRequirement as a prop
}) => {
	return (
		<div>
			<Form
				form={form}
				onFinish={isEditing ? handleUpdate : handleCreatePromotion}
				layout="vertical"
				className="space-y-6"
			>
				{/* Promotion Title and Apply Fields */}

				<Form.Item label="Chi Tiết Khuyến Mãi" className="mb-0">
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="name"
								label="Promotion Name"
								rules={[{required: true, message: 'Please enter a promotion name'}]}
								className="mb-0"
							>
								<Input
									className="border border-gray-300 rounded-md p-2 focus:border-blue-500"
									placeholder="Enter promotion name"
								/>
							</Form.Item>
							<Form.Item
								name="promoCode"
								label="Promotion Code"
								rules={[{required: true, message: 'Please enter a promotion code'}]}
								className="mb-0"
							>
								<Input
									className="border border-gray-300 rounded-md p-2 focus:border-blue-500"
									placeholder="Enter promotion code"
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
									className="w-full border border-gray-300 rounded-md focus:border-blue-500"
								/>
							</Form.Item>
						</Col>
					</Row>
				</Form.Item>

				<Form.Item
					name="description"
					label="Description"
					rules={[{required: true, message: 'Please enter a description'}]}
				>
					<Input
						className="border border-gray-300 rounded-md p-2 focus:border-blue-500"
						placeholder="Enter description"
					/>
				</Form.Item>

				<Form.Item label="Additional Settings" className="mb-0">
					<Row gutter={16}>
						<Col span={8}>
							<Form.Item
								name="redemptionMode"
								label="Redemption Mode"
								initialValue={1} // Always set to 1
								className="mb-0"
							>
								<InputNumber
									min={1}
									className="border border-gray-300 rounded-md"
									placeholder="1"
									disabled
								/>
							</Form.Item>
						</Col>

						<Col span={8}>
							<Form.Item
								name="isExcludeQualifierProduct"
								label="Exclude Qualifier Product"
								valuePropName="checked"
								initialValue={true} // Always set to true
								className="mb-0"
							>
								<Switch className="text-blue-600" />
							</Form.Item>
						</Col>

						<Col span={8}>
							<Form.Item
								name="priority"
								label="Priority"
								initialValue={1} // Always set to 1
								className="mb-0"
							>
								<InputNumber
									min={1}
									className="border border-gray-300 rounded-md"
									placeholder="1"
									disabled
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
				<PromoReqForm
					form={form}
					shapes={shapes}
					Option={Option}
					removeRequirement={removeRequirement}
				/>

				{/* Gift Section */}
				<h3 className="text-lg font-semibold mt-6">Quà Tặng</h3>
				<div className="flex space-x-4 mb-4">
					<Button type="dashed" onClick={() => addGift()}>
						<PlusOutlined /> Thêm Quà
					</Button>
				</div>

				{/* Dynamic Gift List */}
				<GiftForm form={form} shapes={shapes} Option={Option} removeGift={removeGift} />
				{/* Submit Button */}
				<Form.Item>
					<div className="flex justify-end space-x-4">
						{isEditing && (
							<Button
								type="default"
								onClick={handleCancelEdit}
								className="bg-gray-100 text-gray-700 hover:bg-gray-200"
							>
								Cancel
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

export default PromotionForm;
