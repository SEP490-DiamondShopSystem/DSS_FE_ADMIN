import React, {useState} from 'react';
import {Modal, Form, Select, Button, Table, Input} from 'antd';
import JewelryModelList from '../../../PromotionPage/JewelryModelList';
const {Option} = Select;

const JewelryFormModal = ({
	filteredMetals,
	filteredSizes,
	handleSubmit: parentHandleSubmit, // Rename to avoid confusion
	handleModelChange,
	handleMetalChange,
	handleChange,
	handleSideDiamondChange,
	showModal,
	onClose,
	form,
	setSelectedDiamondList,
	isCreateFormOpen,
	setIsCreateFormOpen,
	selectedDiamondList,
}) => {
	const [isMainDiamondsOpen, setIsMainDiamondsOpen] = useState(false);
	const [isSizeMetalsOpen, setIsSizeMetalsOpen] = useState(false);
	const [isSideDiamondsOpen, setIsSideDiamondsOpen] = useState(false);
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	const [modelToConfirm, setModelToConfirm] = useState(null);
	const [selectedModel, setSelectedModel] = useState(null);
	const [isModelListModalOpen, setIsModelListModalOpen] = useState(false);

	const handleCloseModal = () => {
		setIsCreateFormOpen(false);
		onClose();
	};

	const handleModelSelect = (model) => {
		// Set the selected model in the form
		setSelectedModel(model);
		form.setFieldsValue({
			JewelryRequest: {
				...form.getFieldValue('JewelryRequest'),
				ModelId: model.Id,
			},
		});

		// Call the parent's handleModelChange with the full model
		handleModelChange(model);

		// Close the model list modal
		setIsModelListModalOpen(false);
	};
	const handleCloseConfirmModal = () => {
		setIsConfirmModalOpen(false);
	};
	const handleShowModelList = () => {
		setIsModelListModalOpen(true);
	};

	const handleSideDiamondChangeLocal = (value) => {
		handleSideDiamondChange(value);
	};
	const handleSubmit = (values) => {
		// Optional: Add any client-side validations
		parentHandleSubmit(values);
	};
	return (
		<>
			<Modal
				title="Mẫu yêu cầu trang sức"
				visible={isCreateFormOpen}
				onOk={() => form.submit()}
				onCancel={handleCloseModal}
				footer={null}
				width={800}
				centered
			>
				<Form form={form} layout="vertical" width={1600} onFinish={handleSubmit}>
					<Form.Item label="Mẫu Trang Sức" name={['JewelryRequest', 'ModelId']}>
						<div className="flex items-center">
							<Button onClick={handleShowModelList} className="mr-4">
								Chọn Mẫu Trang Sức
							</Button>
							{selectedModel && (
								<div>
									<strong>{selectedModel.Name}</strong> (
									{selectedModel.MainDiamondCount} kim cương chính
									{selectedModel.SideDiamondOptionCount &&
										`, ${selectedModel.SideDiamondOptionCount} kim cương tấm`}
									)
								</div>
							)}
						</div>
					</Form.Item>
					<Form.Item label="Vật Liệu" name={['JewelryRequest', 'MentalId']}>
						<Select
							onChange={handleMetalChange}
							placeholder="Chọn vật liệu"
							disabled={!selectedModel}
						>
							{Array.isArray(filteredMetals) &&
								filteredMetals.map((metal) => (
									<Option key={metal.Id} value={metal.Id}>
										{metal.Name}
									</Option>
								))}
						</Select>
					</Form.Item>
					<Form.Item label="Kích Thước" name={['JewelryRequest', 'SizeId']}>
						<Select
							onChange={(value) => handleChange('SizeId', value)}
							placeholder="Chọn kích thước"
							disabled={!selectedModel || !filteredSizes.length}
						>
							{filteredSizes.map((size) => (
								<Option key={size.SizeId} value={size.SizeId}>
									{size.Size.Value} {size.Size.Unit}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						label="Mã Mẫu"
						name={['JewelryRequest', 'ModelCode']}
						rules={[
							{
								pattern: /^[A-Z0-9_-]+$/,
								message: 'Chỉ cho phép chữ in hoa, số, gạch dưới và gạch ngang',
							},
						]}
					>
						<Input
							onChange={(e) => {
								const uppercaseValue = e.target.value.toUpperCase();
								const sanitizedValue = uppercaseValue.replace(/[^A-Z0-9_-]/g, '');
								form.setFieldsValue({
									JewelryRequest: {
										ModelCode: sanitizedValue,
									},
								});
								handleChange('ModelCode', sanitizedValue); // Use sanitizedValue here
							}}
							placeholder="Nhập mã mẫu (CHỈ IN HOA)"
						/>
					</Form.Item>
					<Form.Item label="Trạng Thái" name={['JewelryRequest', 'status']}>
						<Select onChange={(value) => handleChange('status', value)}>
							<Option value={1}>Active</Option>
							<Option value={2}>Sold</Option>
							<Option value={3}>Locked</Option>
						</Select>
					</Form.Item>
					<Form.Item label="Lựa Chọn Kim Cương Tấm" name={'sideDiamondOptId'}>
						{selectedModel?.SideDiamonds?.length ? (
							<Select
								onChange={handleSideDiamondChangeLocal}
								placeholder="Chọn kim cương tấm"
								disabled={!selectedModel}
							>
								{selectedModel.SideDiamonds.map((diamond) => (
									<Option key={diamond.Id} value={diamond.Id}>
										<strong>Setting:</strong> {diamond.SettingType},
										<strong> Hình Dáng:</strong> {diamond.ShapeName},
										<strong> Độ Tinh Khiết:</strong> {diamond.ClarityMin}{' '}
										{' - '}
										{diamond.ClarityMax}, <strong>Màu:</strong>{' '}
										{diamond.ColorMin} {' - '} {diamond.ColorMax},{' '}
										<strong>Carat: </strong> {diamond.CaratWeight},{' '}
										<strong> Số Lượng:</strong> {diamond.Quantity}
									</Option>
								))}
							</Select>
						) : (
							<p>Không có tùy chọn kim cương tấm có sẵn cho mẫu này.</p>
						)}
					</Form.Item>
					{selectedModel && <Button onClick={showModal}>Chọn Kim Cương Theo Chấu</Button>}
					{selectedDiamondList && selectedDiamondList.length > 0 && (
						<div className="mb-5">
							<Table
								dataSource={selectedDiamondList.map((diamond, i) => ({
									key: i,
									index: i + 1,
									diamondForFilterId: diamond.diamondForFilterId,
									diamondListTitle: diamond.diamondListTitle || 'N/A',
								}))}
								columns={[
									{
										title: 'Chấu',
										dataIndex: 'index',
										key: 'index',
										render: (text) => `Chấu ${text}`,
									},
									{
										title: 'Kim Cương',
										dataIndex: 'diamondListTitle',
										key: 'diamondListTitle',
									},
								]}
								pagination={false}
							/>
						</div>
					)}{' '}
					<Form.Item className="flex justify-end">
						<Button onClick={handleCloseModal} className="mr-4">
							Hủy
						</Button>
						<Button
							onClick={() => {
								form.resetFields();
								setSelectedDiamondList([]);
							}}
							className="mx-4"
						>
							Xóa tất cả
						</Button>
						<Button type="primary" htmlType="submit">
							Tạo
						</Button>
					</Form.Item>
				</Form>
			</Modal>

			{/* Model List Modal */}
			<Modal
				title="Chọn Mẫu Trang Sức"
				visible={isModelListModalOpen}
				onCancel={() => setIsModelListModalOpen(false)}
				footer={null}
				width="90%"
				style={{top: 20}}
			>
				<JewelryModelList onSelectModel={handleModelSelect} />
			</Modal>
		</>
	);
};

export default JewelryFormModal;
