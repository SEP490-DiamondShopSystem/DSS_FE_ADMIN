import {MinusCircleOutlined} from '@ant-design/icons';
import {Button, Col, Form, Input, InputNumber, Row, Select, Space, Modal} from 'antd';
import React, {useState} from 'react';
import JewelryModelList from '../JewelryModelList';

export const PromoReqForm = ({form, shapes, Option, removeRequirement}) => {
	const [isPopupVisible, setIsPopupVisible] = useState(false);
	const [selectedModel, setSelectedModel] = useState(null);

	const [moneyAmount, setMoneyAmount] = useState(null);
	const handleAmountChange = (value) => {
		setMoneyAmount(value);
	};
	const [quantity, setQuantity] = useState(null);
	const handleQuantityChange = (value) => {
		setQuantity(value);
	};
	const handleTargetTypeChange = (targetType, name, setFieldsValue) => {
		const isOrder = targetType === 3;
		const isDiamond = targetType === 2;
		const isJewelryModel = targetType === 1;

		// Set default values or clear fields based on target type
		setFieldsValue({
			[`requirements[${name}].quantity`]: isOrder ? undefined : '',
			[`requirements[${name}].moneyAmount`]: '',
			[`requirements[${name}].diamondRequirementSpec`]: isDiamond ? {} : undefined,
			[`requirements[${name}].promotionId`]: isJewelryModel ? '' : undefined,
		});
	};
	const handleSelectModel = (model, fieldKey) => {
		setSelectedModel(model?.Id);
		form.setFieldsValue({
			requirements: form
				.getFieldValue('requirements')
				.map((req, index) =>
					index === fieldKey ? {...req, jewelryModelID: model?.Id} : req
				),
		});
		setIsPopupVisible(false);
	};

	return (
		<div>
			<Form.List name="requirements">
				{(fields, {add, remove}) => (
					<>
						{fields.map(({key, name, fieldKey, ...restField}) => {
							const requirement = form.getFieldValue(['requirements', name]);

							return (
								<Space key={key} className="flex mb-4 space-x-4" align="baseline">
									<div className="p-6 gap-x-10 flex justify-between bg-white rounded-lg shadow-lg">
										<Row gutter={[16, 16]}>
											<Col span={12}>
												<Form.Item
													label="Tên"
													{...restField}
													name={[name, 'name']}
													fieldKey={[fieldKey, 'name']}
													rules={[
														{
															required: true,
															message: 'Vui Lòng Nhập Tên',
														},
													]}
													labelCol={{span: 24}}
													wrapperCol={{span: 24}}
												>
													<Input className="w-full" placeholder="Tên" />
												</Form.Item>
												<Form.Item
													label="Operator"
													{...restField}
													name={[name, 'operator']}
													fieldKey={[fieldKey, 'operator']}
													initialValue={1}
													labelCol={{span: 24}}
													wrapperCol={{span: 24}}
												>
													<Input
														className="w-full"
														min={1}
														placeholder="1"
														disabled
													/>
												</Form.Item>
												<Form.Item
													label="Giá Trị"
													{...restField}
													name={[name, 'moneyAmount']}
													fieldKey={[fieldKey, 'moneyAmount']}
													rules={[
														{
															required: false,
															message: 'Amount is required',
														},
													]}
													labelCol={{span: 24}}
													wrapperCol={{span: 24}}
												>
													<InputNumber
														className="w-full"
														placeholder="Enter Money amount"
														onChange={(value) =>
															handleAmountChange(value)
														}
														disabled={quantity !== null} // Disable if quantity is filled
													/>
												</Form.Item>
												<Form.Item
													label="Đối Tượng Áp Dụng"
													{...restField}
													name={[name, 'targetType']}
													fieldKey={[fieldKey, 'targetType']}
													labelCol={{span: 24}}
													wrapperCol={{span: 24}}
												>
													<Select
														className="w-full"
														onChange={(value) =>
															handleTargetTypeChange(
																value,
																name,
																form.setFieldsValue
															)
														}
													>
														{Option && (
															<>
																<Option value={1}>Trang Sức</Option>
																<Option value={2}>Kim Cương</Option>
																<Option value={3}>Hóa Đơn</Option>
															</>
														)}
													</Select>
												</Form.Item>
											</Col>
											<Col span={12}>
												<Form.Item
													label="Số Lượng"
													{...restField}
													name={[name, 'quantity']}
													fieldKey={[fieldKey, 'quantity']}
													rules={[
														{
															required: false,
															message: 'Quantity is required',
														},
													]}
													labelCol={{span: 24}}
													wrapperCol={{span: 24}}
												>
													<InputNumber
														min={1}
														className="w-full"
														onChange={(value) =>
															handleQuantityChange(value)
														}
														disabled={moneyAmount !== null} // Disable if moneyAmount is filled
													/>
												</Form.Item>

												{form.getFieldValue([
													'requirements',
													name,
													'targetType',
												]) === 2 && (
													<div className="flex gap-5">
														<Form.Item
															label="Nguồn Gốc"
															{...restField}
															name={[
																name,
																'diamondRequirementSpec',
																'origin',
															]}
															fieldKey={[
																fieldKey,
																'diamondRequirementSpec',
																'origin',
															]}
															rules={[
																{
																	required: false,
																	message:
																		'Vui Lòng Chọn Nguồn Gốc',
																},
															]}
															labelCol={{span: 24}}
															wrapperCol={{span: 24}}
														>
															<Select className="w-full">
																{Option ? (
																	<>
																		<Option value={1}>
																			Tự Nhiên
																		</Option>
																		<Option value={2}>
																			Nhân Tạo
																		</Option>
																		<Option value={3}>
																			Cả hai
																		</Option>
																	</>
																) : null}
															</Select>
														</Form.Item>
														<Form.Item
															label="Hình Dáng"
															{...restField}
															name={[
																name,
																'diamondRequirementSpec',
																'shapesIDs',
															]}
															fieldKey={[
																fieldKey,
																'diamondRequirementSpec',
																'shapesIDs',
															]}
															rules={[
																{
																	required: false,
																	message:
																		'Shape IDs are required',
																},
															]}
														>
															<Select mode="multiple">
																{shapes?.map((shape) => (
																	<Option
																		key={shape.Id}
																		value={shape.Id}
																	>
																		{shape.ShapeName}
																	</Option>
																))}
															</Select>
														</Form.Item>
														<div className="p-4 border rounded-md bg-gray-50">
															<Form.Item
																label="Carat Từ"
																{...restField}
																name={[
																	name,
																	'diamondRequirementSpec',
																	'caratFrom',
																]}
																fieldKey={[
																	fieldKey,
																	'diamondRequirementSpec',
																	'caratFrom',
																]}
																rules={[
																	{
																		required: false,
																		message:
																			'Carat From is required',
																	},
																]}
															>
																<InputNumber
																	className="w-full"
																	min={0}
																/>
															</Form.Item>
															<Form.Item
																label="Carat Đến"
																{...restField}
																name={[
																	name,
																	'diamondRequirementSpec',
																	'caratTo',
																]}
																fieldKey={[
																	fieldKey,
																	'diamondRequirementSpec',
																	'caratTo',
																]}
																rules={[
																	{
																		required: false,
																		message:
																			'Carat To is required',
																	},
																]}
															>
																<InputNumber
																	className="w-full"
																	min={0}
																/>
															</Form.Item>
														</div>
														<div className="p-4 border rounded-md bg-gray-50">
															<Form.Item
																label="Clarity Từ"
																{...restField}
																name={[
																	name,
																	'diamondRequirementSpec',
																	'clarityFrom',
																]}
																fieldKey={[
																	fieldKey,
																	'diamondRequirementSpec',
																	'clarityFrom',
																]}
																rules={[
																	{
																		required: false,
																		message:
																			'Clarity From is required',
																	},
																]}
															>
																<Select className="w-full">
																	{Option ? (
																		<>
																			<Option value={1}>
																				S12
																			</Option>
																			<Option value={2}>
																				S11
																			</Option>
																			<Option value={3}>
																				VS2
																			</Option>
																			<Option value={4}>
																				VS1
																			</Option>
																			<Option value={5}>
																				VVS2
																			</Option>
																			<Option value={6}>
																				VVS1
																			</Option>
																			<Option value={7}>
																				IF
																			</Option>
																			<Option value={8}>
																				FL
																			</Option>
																		</>
																	) : null}
																</Select>
															</Form.Item>
															<Form.Item
																label="Clarity Đến"
																{...restField}
																name={[
																	name,
																	'diamondRequirementSpec',
																	'clarityTo',
																]}
																fieldKey={[
																	fieldKey,
																	'diamondRequirementSpec',
																	'clarityTo',
																]}
																rules={[
																	{
																		required: false,
																		message:
																			'Clarity To is required',
																	},
																]}
															>
																<Select className="w-full">
																	{Option ? (
																		<>
																			<Option value={1}>
																				S12
																			</Option>
																			<Option value={2}>
																				S11
																			</Option>
																			<Option value={3}>
																				VS2
																			</Option>
																			<Option value={4}>
																				VS1
																			</Option>
																			<Option value={5}>
																				VVS2
																			</Option>
																			<Option value={6}>
																				VVS1
																			</Option>
																			<Option value={7}>
																				IF
																			</Option>
																			<Option value={8}>
																				FL
																			</Option>
																		</>
																	) : null}
																</Select>
															</Form.Item>
														</div>
														<div className="p-4 border rounded-md bg-gray-50">
															<Form.Item
																label="Color Từ"
																{...restField}
																name={[
																	name,
																	'diamondRequirementSpec',
																	'colorFrom',
																]}
																fieldKey={[
																	fieldKey,
																	'diamondRequirementSpec',
																	'colorFrom',
																]}
															>
																<Select>
																	{Option ? (
																		<>
																			<Option value={1}>
																				K
																			</Option>
																			<Option value={2}>
																				J
																			</Option>
																			<Option value={3}>
																				I
																			</Option>
																			<Option value={4}>
																				H
																			</Option>
																			<Option value={5}>
																				G
																			</Option>
																			<Option value={6}>
																				F
																			</Option>
																			<Option value={7}>
																				E
																			</Option>
																			<Option value={8}>
																				D
																			</Option>
																		</>
																	) : null}
																</Select>
															</Form.Item>
															<Form.Item
																label="Color Đến"
																{...restField}
																name={[
																	name,
																	'diamondRequirementSpec',
																	'colorTo',
																]}
																fieldKey={[
																	fieldKey,
																	'diamondRequirementSpec',
																	'colorTo',
																]}
															>
																<Select>
																	{Option ? (
																		<>
																			<Option value={1}>
																				K
																			</Option>
																			<Option value={2}>
																				J
																			</Option>
																			<Option value={3}>
																				I
																			</Option>
																			<Option value={4}>
																				H
																			</Option>
																			<Option value={5}>
																				G
																			</Option>
																			<Option value={6}>
																				F
																			</Option>
																			<Option value={7}>
																				E
																			</Option>
																			<Option value={8}>
																				D
																			</Option>
																		</>
																	) : null}
																</Select>
															</Form.Item>
														</div>
														<div className="p-4 border rounded-md bg-gray-50">
															<Form.Item
																label="Cut Từ"
																{...restField}
																name={[
																	name,
																	'diamondRequirementSpec',
																	'cutFrom',
																]}
																fieldKey={[
																	fieldKey,
																	'diamondRequirementSpec',
																	'cutFrom',
																]}
																rules={[
																	{
																		required: false,
																		message:
																			'Cut From is required',
																	},
																]}
															>
																<Select className="w-full">
																	{Option ? (
																		<>
																			<Option value={1}>
																				Good
																			</Option>
																			<Option value={2}>
																				Very Good
																			</Option>
																			<Option value={3}>
																				Excellent
																			</Option>
																		</>
																	) : null}
																</Select>
															</Form.Item>
															<Form.Item
																label="Cut Đến"
																{...restField}
																name={[
																	name,
																	'diamondRequirementSpec',
																	'cutTo',
																]}
																fieldKey={[
																	fieldKey,
																	'diamondRequirementSpec',
																	'cutTo',
																]}
																rules={[
																	{
																		required: false,
																		message:
																			'Cut To is required',
																	},
																]}
															>
																<Select className="w-full">
																	{Option ? (
																		<>
																			<Option value={1}>
																				Good
																			</Option>
																			<Option value={2}>
																				Very Good
																			</Option>
																			<Option value={3}>
																				Excellent
																			</Option>
																		</>
																	) : null}
																</Select>
															</Form.Item>
														</div>
													</div>
												)}
												{form.getFieldValue([
													'requirements',
													name,
													'targetType',
												]) === 1 && (
													<>
														<Form.Item
															{...restField}
															label="Mẫu Trang Sức"
															name={[name, 'jewelryModelID']}
															fieldKey={[fieldKey, 'jewelryModelID']}
															rules={[
																{
																	required: true,
																	message:
																		'Vui lòng chọn mẫu trang sức',
																},
															]}
														>
															<Input
																readOnly
																value={form.getFieldValue([
																	'requirements',
																	name,
																	'jewelryModelID',
																])}
															/>
														</Form.Item>
														<Button
															onClick={() => setIsPopupVisible(true)}
														>
															Chọn Mẫu Trang Sức
														</Button>
													</>
												)}
											</Col>
										</Row>
										<Modal
											open={isPopupVisible}
											onCancel={() => setIsPopupVisible(false)}
											footer={null}
											width="80%"
										>
											<JewelryModelList
												onSelectModel={(model) =>
													handleSelectModel(model, name)
												}
											/>
										</Modal>
										<Button
											type="link"
											onClick={() => {
												remove(name);
												removeRequirement(requirement?.id);
											}}
										>
											<MinusCircleOutlined /> Remove
										</Button>
									</div>
								</Space>
							);
						})}
					</>
				)}
			</Form.List>
		</div>
	);
};
