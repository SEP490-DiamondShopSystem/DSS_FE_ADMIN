import React, {useState} from 'react';
import {Modal, Form, Select, Button, Table} from 'antd';

const {Option} = Select;

const JewelryFormModal = ({
	models,
	filteredMetals,
	filteredSizes,
	selectedModel,
	selectedDiamondList,
	handleSubmit,
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
}) => {
	const handleCloseModal = () => {
		setIsCreateFormOpen(false);
		onClose();
	};

	return (
		<>
			<Modal
				title="Jewelry Request Form"
				visible={isCreateFormOpen}
				// onOk={() => form.submit()}
				onCancel={handleCloseModal}
				footer={null}
				width={800}
				centered
			>
				<Form form={form} layout="vertical" onFinish={handleSubmit}>
					<Form.Item label="Mẫu Trang Sức" name={['JewelryRequest', 'ModelId']}>
						<Select onChange={handleModelChange} placeholder="Select a model">
							{Array.isArray(models) &&
								models.map((model) => (
									<Option key={model.Id} value={model.Id}>
										{model.Name} ({model.MainDiamondCount} kim cương chính
										{model.SideDiamondOptionCount &&
											`, ${model.SideDiamondOptionCount} kim cương tấm`}
										)
									</Option>
								))}
						</Select>
					</Form.Item>

					<Form.Item label="Vật Liệu" name={['JewelryRequest', 'MentalId']}>
						<Select
							onChange={handleMetalChange}
							placeholder="Select a metal"
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
							placeholder="Select a size"
							disabled={!selectedModel || !filteredSizes.length}
						>
							{filteredSizes.map((size) => (
								<Option key={size.SizeId} value={size.SizeId}>
									{size.Size.Id} {size.Size.Unit}
								</Option>
							))}
						</Select>
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
								onChange={handleSideDiamondChange}
								placeholder="Select Side Diamond Option"
								disabled={!selectedModel}
							>
								{selectedModel.SideDiamonds.map((diamond) => (
									<Option key={diamond.Id} value={diamond.Id}>
										<strong>Setting:</strong> {diamond.SettingType},
										<strong> Shape:</strong> {diamond.ShapeName},
										<strong> Clarity:</strong> {diamond.ClarityMin} {' - '}
										{diamond.ClarityMax}, <strong>Color:</strong>{' '}
										{diamond.ColorMin} {' - '} {diamond.ColorMax},{' '}
										<strong>Carat: </strong> {diamond.CaratWeight},{' '}
										<strong> Quantity:</strong> {diamond.Quantity}
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
					)}

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
							Clear
						</Button>
						<Button type="primary" htmlType="submit">
							Tạo
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default JewelryFormModal;
