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
	const [isMainDiamondsOpen, setIsMainDiamondsOpen] = useState(false);
	const [isSizeMetalsOpen, setIsSizeMetalsOpen] = useState(false);
	const [isSideDiamondsOpen, setIsSideDiamondsOpen] = useState(false);
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	const [modelToConfirm, setModelToConfirm] = useState(null);

	const handleModelSelection = (modelId) => {
		const model = models.find((m) => m.Id === modelId);
		setModelToConfirm(model);
		setIsConfirmModalOpen(true);
	};

	const confirmModelSelection = () => {
		handleModelChange(modelToConfirm.Id); // Call the original handler with confirmed model
		setIsConfirmModalOpen(false);
	};
	const handleCloseConfirmation = () => {
		setIsConfirmModalOpen(false);
	};
	return (
		<>
			<Modal
				title="Jewelry Request Form"
				visible={isCreateFormOpen}
				onOk={() => form.submit()}
				onCancel={handleCloseModal}
				footer={null}
				width={800}
				centered
			>
				<Form form={form} layout="vertical" width={1600} onFinish={handleSubmit}>
					<Form.Item label="Mẫu Trang Sức" name={['JewelryRequest', 'ModelId']}>
						<Select onChange={handleModelSelection} placeholder="Select a model">
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
					{/* Confirmation Modal */}
					<Modal
						title="Confirm Model Selection"
						visible={isConfirmModalOpen}
						onCancel={handleCloseModal}
						footer={null}
						centered
						className="rounded-lg shadow-lg"
					>
						{modelToConfirm && (
							<div className="fixed inset-0 bg-gray bg-opacity-50 flex justify-center items-center p-3 z-50">
								<div className="bg-white p-4 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-2/3">
									<h2 className="text-3xl font-bold text-primary text-center">
										Chi Tiết Mẫu Trang Sức
									</h2>
									<div className="flex gap-8">
										{/* Left Column */}
										<div className="flex-1">
											<p className="text-lg font-medium text-gray">
												<strong>Tên:</strong> {modelToConfirm.Name}
											</p>
											<p className="text-lg font-medium text-gray">
												<strong>Phân Loại:</strong>{' '}
												{modelToConfirm.Category.Name}
											</p>
											<p className="text-lg font-medium text-gray">
												<strong>Mã Mẫu Trang Sức:</strong>{' '}
												{modelToConfirm.ModelCode}
											</p>
											<p className="text-lg font-medium text-gray">
												<strong>Phí Chế Tác:</strong>{' '}
												{modelToConfirm.CraftmanFee} VND
											</p>
											<p className="text-lg font-medium text-gray">
												<strong>Mô Tả:</strong> {modelToConfirm.Description}
											</p>
											<p className="text-lg font-medium text-gray">
												<strong>Ngang:</strong> {modelToConfirm.Width} mm
											</p>
											<p className="text-lg font-medium text-gray">
												<strong>Có Thể Khắc:</strong>{' '}
												{modelToConfirm.IsEngravable ? 'Yes' : 'No'}
											</p>
										</div>

										{/* Right Column */}
										<div className="flex-1">
											<p className="text-lg font-medium text-gray">
												<strong>Số Lượng Kim Cương Chính:</strong>{' '}
												{modelToConfirm.MainDiamondCount}
											</p>
											<p className="text-lg font-medium text-gray">
												<strong>Số Lượng Kim Cương Tấm:</strong>{' '}
												{modelToConfirm.SideDiamondOptionCount}
											</p>
											<p className="text-lg font-medium text-gray">
												<strong>Xi Rhodium:</strong>{' '}
												{modelToConfirm.IsRhodiumFinish ? 'Yes' : 'No'}
											</p>
											<p className="text-lg font-medium text-gray">
												<strong>Hỗ Trợ các kim loại:</strong>{' '}
												{modelToConfirm.MetalSupported.join(', ')}
											</p>
										</div>
									</div>
									{/* Main Diamonds Section */}
									{modelToConfirm.MainDiamonds &&
										modelToConfirm.MainDiamonds.length > 0 && (
											<div className="mt-6 ">
												<h3
													className="text-xl font-semibold cursor-pointer"
													onClick={() =>
														setIsMainDiamondsOpen(!isMainDiamondsOpen)
													}
												>
													Kim Cương Chính {isMainDiamondsOpen ? '▲' : '▼'}
												</h3>
												{isMainDiamondsOpen && (
													<ul className="space-y-4 mt-3 pl-4 max-h-24 overflow-y-auto border rounded-md">
														{modelToConfirm.MainDiamonds.map(
															(diamond, index) => (
																<li
																	key={index}
																	className="border-b pb-4"
																>
																	<div className="flex justify-between px-5 py-2">
																		<div>
																			<p className="text-gray">
																				<strong>
																					Mẫu Thiết Kế:
																				</strong>{' '}
																				{
																					diamond.SettingType
																				}
																			</p>
																		</div>
																		<div>
																			<p className="text-gray">
																				<strong>
																					Só Lượng:
																				</strong>{' '}
																				{diamond.Quantity}
																			</p>
																		</div>
																		<div>
																			<p className="text-gray">
																				<strong>
																					ID Yêu Cầu Của
																					Kim Cương Chính:
																				</strong>{' '}
																				{diamond.MainDiamondReqId ||
																					'N/A'}
																			</p>
																		</div>
																		<div>
																			{diamond.Shapes &&
																			diamond.Shapes.length >
																				0 ? (
																				diamond.Shapes.map(
																					(
																						shape,
																						shapeIndex
																					) => (
																						<div
																							key={
																								shapeIndex
																							}
																							className="pl-4 gap-3 flex justify-between"
																						>
																							<p className="text-gray">
																								<strong>
																									Hình
																									Dáng:
																								</strong>{' '}
																								{shape
																									.Shape
																									?.ShapeName ||
																									'N/A'}
																							</p>

																							<p className="text-gray">
																								<strong>
																									Khoảng
																									Carat:
																								</strong>{' '}
																								{
																									shape.CaratFrom
																								}{' '}
																								-{' '}
																								{
																									shape.CaratTo
																								}{' '}
																								carats
																							</p>
																						</div>
																					)
																				)
																			) : (
																				<p className="text-gray">
																					Không Có Hình
																					Dáng
																				</p>
																			)}
																		</div>
																	</div>
																</li>
															)
														)}
													</ul>
												)}
											</div>
										)}
									{/* Size Metals Section */}
									{modelToConfirm.SizeMetals &&
										modelToConfirm.SizeMetals.length > 0 && (
											<div className="mt-6  ">
												<h3
													className="text-xl font-semibold cursor-pointer"
													onClick={() =>
														setIsSizeMetalsOpen(!isSizeMetalsOpen)
													}
												>
													Size Metals {isSizeMetalsOpen ? '▲' : '▼'}
												</h3>
												{isSizeMetalsOpen && (
													<ul className="space-y-4 mt-3 pl-4 max-h-24 overflow-y-auto  border rounded-md">
														{modelToConfirm.SizeMetals.map(
															(sizeMetal, index) => (
																<li
																	key={index}
																	className="border-b pb-4"
																>
																	<div className="flex justify-between px-5 py-2">
																		<div>
																			<p className="text-gray">
																				<strong>
																					Size:
																				</strong>{' '}
																				{
																					sizeMetal.Size
																						.Value
																				}{' '}
																				{
																					sizeMetal.Size
																						.Unit
																				}
																			</p>
																		</div>
																		<div>
																			<p className="text-gray">
																				<strong>
																					Metal:
																				</strong>{' '}
																				{
																					sizeMetal.Metal
																						.Name
																				}
																			</p>
																		</div>
																		<div>
																			<p className="text-gray">
																				<strong>
																					Weight:
																				</strong>{' '}
																				{sizeMetal.Weight} g
																			</p>
																		</div>
																		<div>
																			<p className="text-gray">
																				<strong>
																					Price:
																				</strong>{' '}
																				{
																					sizeMetal.Metal
																						.Price
																				}{' '}
																				VND
																			</p>
																		</div>
																	</div>
																</li>
															)
														)}
													</ul>
												)}
											</div>
										)}
									{/* Side Diamonds Section */}
									{modelToConfirm.SideDiamonds &&
										modelToConfirm.SideDiamonds.length > 0 && (
											<div className="mt-6 ">
												<h3
													className="text-xl font-semibold cursor-pointer"
													onClick={() =>
														setIsSideDiamondsOpen(!isSideDiamondsOpen)
													}
												>
													Side Diamonds {isSideDiamondsOpen ? '▲' : '▼'}
												</h3>
												{isSideDiamondsOpen && (
													<ul className="space-y-4 mt-3 pl-4 max-h-24 overflow-y-auto border rounded-md ">
														{modelToConfirm.SideDiamonds.map(
															(sideDiamond, index) => (
																<li
																	key={index}
																	className="border-b pb-4"
																>
																	<div className="flex justify-between px-5 py-2">
																		<div>
																			<p className="text-gray">
																				<strong>
																					Carat Weight:
																				</strong>{' '}
																				{
																					sideDiamond.CaratWeight
																				}
																			</p>
																		</div>
																		<div>
																			<p className="text-gray">
																				<strong>
																					Setting Type:
																				</strong>{' '}
																				{
																					sideDiamond.SettingType
																				}
																			</p>
																		</div>
																		<div>
																			<p className="text-gray">
																				<strong>
																					Quantity:
																				</strong>{' '}
																				{
																					sideDiamond.Quantity
																				}
																			</p>
																		</div>
																		<div>
																			<p className="text-gray">
																				<strong>
																					Color Range:
																				</strong>{' '}
																				{
																					sideDiamond.ColorMin
																				}{' '}
																				-{' '}
																				{
																					sideDiamond.ColorMax
																				}
																			</p>
																		</div>
																		<div>
																			<p className="text-gray">
																				<strong>
																					Clarity Range:
																				</strong>{' '}
																				{
																					sideDiamond.ClarityMin
																				}{' '}
																				-{' '}
																				{
																					sideDiamond.ClarityMax
																				}
																			</p>
																		</div>
																	</div>
																</li>
															)
														)}
													</ul>
												)}
											</div>
										)}
									<div className="flex justify-end p-5">
										<Button
											key="cancel"
											onClick={() => handleCloseConfirmation(false)}
										>
											Hủy
										</Button>
										,
										<Button
											key="confirm"
											type="primary"
											onClick={confirmModelSelection}
										>
											Chọn Mẫu Trang Sức Này
										</Button>
									</div>
									,
								</div>
							</div>
						)}
					</Modal>
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
		</>
	);
};

export default JewelryFormModal;
