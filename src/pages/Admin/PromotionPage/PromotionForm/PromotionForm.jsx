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
	removeGift,
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
								label="Tên Khuyến Mãi"
								rules={[{required: true, message: 'Vui lòng nhập tên khuyến mãi'}]}
								className="mb-0"
							>
								<Input
									className="border border-gray-300 rounded-md p-2 focus:border-blue-500"
									placeholder="Nhập tên khuyến mãi"
								/>
							</Form.Item>
							<Form.Item
								name="promoCode"
								label="Mã Khuyến Mãi"
								rules={[{required: true, message: 'Vui lòng nhập mã khuyến mãi'}]}
								className="mb-0"
							>
								<Input
									className="border border-gray-300 rounded-md p-2 focus:border-blue-500"
									placeholder="Nhập mã khuyến mãi"
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								label="Ngày hoạt động"
								name="validDate"
								rules={[
									{required: true, message: 'Vui lòng nhập ngày hoạt động'},
								]}
							>
								<RangePicker
									showTime
									format="DD-MM-YYYY HH:mm"
									className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500"
								/>
							</Form.Item>
							<Form.Item
								name="description"
								label="Miêu Tả"
								rules={[{required: true, message: 'Vui lòng nhập mô tả'}]}
							>
								<Input
									className="border border-gray-300 rounded-md p-2 focus:border-blue-500"
									placeholder="Nhập mô tả khuyến mãi"
								/>
							</Form.Item>
						</Col>
					</Row>
				</Form.Item>

				<Form.Item label="Các Cài Đặt Khác" className="mb-0">
					<Row gutter={16}>
						<Col span={8}>
							<Form.Item
								name="redemptionMode"
								label="Chế Độ Sử Dụng"
								initialValue={1}
								className="mb-0"
							>
								<Select
									className="border border-gray rounded-xl"
									placeholder="Vui Lòng Chọn Chế Độ Sử Dụng!"
								>
									<Select.Option value={1}>Dùng Một Lần</Select.Option>
									<Select.Option value={2}>Dùng Nhiều Lần</Select.Option>
								</Select>
							</Form.Item>
						</Col>

						<Col span={8}>
							<Form.Item
								name="isExcludeQualifierProduct"
								label="Loại trừ sản phẩm đủ điều kiện"
								valuePropName="checked"
								initialValue={true}
								className="mb-0"
							>
								<Switch className="text-blue" />
							</Form.Item>
						</Col>

						<Col span={8}>
							<Form.Item
								name="priority"
								label="Mức Độ Ưu Tiên"
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
					isEditing={isEditing} // Pass isEditing to PromoReqForm
				/>

				{/* Gift Section */}
				<h3 className="text-lg font-semibold mt-6">Quà Tặng</h3>
				<div className="flex space-x-4 mb-4">
					<Button type="dashed" onClick={() => addGift()}>
						<PlusOutlined /> Thêm Quà
					</Button>
				</div>

				{/* Dynamic Gift List */}
				<GiftForm 
					form={form} 
					shapes={shapes} 
					Option={Option} 
					removeGift={removeGift}
					isEditing={isEditing} // Pass isEditing to GiftForm
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
							{isEditing ? 'Lưu' : 'Tạo'}
						</Button>
					</div>
				</Form.Item>
			</Form>
		</div>
	);
};

export default PromotionForm;