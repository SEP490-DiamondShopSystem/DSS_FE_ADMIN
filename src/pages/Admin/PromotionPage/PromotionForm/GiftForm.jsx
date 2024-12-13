import {MinusCircleOutlined} from '@ant-design/icons';
import {Button, Col, Form, Input, InputNumber, Row, Select, Space, Modal} from 'antd';
import React, {useState} from 'react';
import JewelryModelList from '../JewelryModelList';

export const GiftForm = ({form, shapes, Option, removeGift}) => {
	const [isPopupVisible, setIsPopupVisible] = useState(false);
	const [selectedModel, setSelectedModel] = useState(null);

	const handleSelectModel = (model, fieldKey) => {
		setSelectedModel(model?.Id);
		form.setFieldsValue({
			gifts: form
				.getFieldValue('gifts')
				.map((gift, index) => (index === fieldKey ? {...gift, itemCode: model?.ModelCode} : gift)),
		});
		setIsPopupVisible(false);
	};

	return (
		<div>
			<Form.List name="gifts">
				{(fields, {add, remove}) => (
					<>
						{fields.map(({key, name, fieldKey, ...restField}) => {
							const gift = form.getFieldValue(['gifts', name]);
							const unitType = form.getFieldValue(['gifts', name, 'unitType']);
							const targetType = form.getFieldValue(['gifts', name, 'targetType']);

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
															message: 'Name is required',
														},
													]}
													labelCol={{span: 24}}
													wrapperCol={{span: 24}}
												>
													<Input className="w-full" placeholder="Tên" />
												</Form.Item>
												{targetType !== 3 && (
													<Form.Item
														className="w-full"
														label="Số Lượng"
														{...restField}
														name={[name, 'amount']}
														fieldKey={[fieldKey, 'amount']}
														rules={[
															{
																required: targetType !== 3,
																message: 'Amount is required',
															},
														]}
														initialValue={1} // Always set to 1
														labelCol={{span: 24}}
														wrapperCol={{span: 24}}
													>
														<InputNumber
															className="w-full"
															placeholder="Enter amount"
															disabled
															/>
													</Form.Item>
												)}
												<Form.Item
													className="w-full"
													label="Đối Tượng Áp Dụng"
													{...restField}
													name={[name, 'targetType']}
													fieldKey={[fieldKey, 'targetType']}
													labelCol={{span: 24}}
													wrapperCol={{span: 24}}
												>
													<Select
														className="w-full"
														onChange={(value) => {
															form.setFieldsValue({
																[`gifts[${name}].amount`]:
																	value === 3 ? undefined : '',
																[`gifts[${name}].diamondRequirementSpec`]:
																	value === 2 ? {} : undefined,
																[`gifts[${name}].itemCode`]:
																	value === 1 ? '' : undefined,
															});
														}}
													>
														<Option value={1}>Trang Sức</Option>
														<Option value={2}>Kim Cương</Option>
														<Option value={3}>Hóa Đơn</Option>
													</Select>
												</Form.Item>

												<Form.Item
													className="w-full"
													label="Loại Khuyến Mãi"
													{...restField}
													name={[name, 'unitType']}
													fieldKey={[fieldKey, 'unitType']}
													labelCol={{span: 24}}
													wrapperCol={{span: 24}}
												>
													<Select
														className="w-full"
														onChange={(value) => {
															form.setFieldsValue({
																[`gifts[${name}].unitValueAddon`]:
																	value === 1
																		? '%'
																		: value === 2
																		? 'VND'
																		: '',
															});
														}}
													>
														<Option value={1}>Phần Trăm</Option>
														<Option value={2}>Giá Trị</Option>
													</Select>
												</Form.Item>
												<Form.Item
													className="w-full"
													label="Giá Trị Khuyến Mãi"
													{...restField}
													name={[name, 'unitValue']}
													fieldKey={[fieldKey, 'unitValue']}
													rules={[
														{
															required: true,
															type: 'number',
															min: unitType === 1 ? 1 : 1000,
															max: unitType === 1 ? 100 : undefined,
															message:
																unitType === 1
																	? 'Percentage must be between 1 and 100'
																	: 'Value must be at least 1000',
														},
														{
															validator: (_, value) =>
																unitType === 2 && value % 1000 !== 0
																	? Promise.reject(
																			new Error(
																				'Value should be in multiples of 1000'
																			)
																	  )
																	: Promise.resolve(),
														},
													]}
													labelCol={{span: 24}}
													wrapperCol={{span: 24}}
												>
													<InputNumber
														className="w-full"
														addonAfter={form.getFieldValue([
															`gifts[${name}].unitValueAddon`,
														])}
													/>
												</Form.Item>
											</Col>
											<Col span={12}>
												{targetType === 1 && (
													<>
														<Form.Item
															{...restField}
															label="Mẫu Trang Sức"
															name={[name, 'itemCode']}
															fieldKey={[fieldKey, 'itemCode']}
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
																	'gifts',
																	name,
																	'itemCode',
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
										{targetType === 2 && (
											<Row span={12}>
												<div className="flex gap-5 flex-col">
													<div className="flex gap-5 w-full">
														<Form.Item
															className="w-full"
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
																	message: 'Origin is required',
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
																			Cả Hai
																		</Option>
																	</>
																) : null}
															</Select>
														</Form.Item>
														<Form.Item
															className="w-full"
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
													</div>
													<div className="flex gap-5">
														<div className="p-4 border rounded-md bg-gray-50">
															<Form.Item
																label="Carat From"
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
																label="Carat To"
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
																label="Clarity From"
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
																label="Clarity To"
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
																label="Color From"
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
																label="Color To"
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
																label="Cut From"
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
																label="Cut To"
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
												</div>
											</Row>
										)}
										<Button
											type="link"
											onClick={() => {
												remove(name);
												removeGift(gift?.id); // Pass the actual requirement ID
											}}
										>
											<MinusCircleOutlined /> Remove
										</Button>
									</div>
								</Space>
							);
						})}
						{/* <Form.Item>
								<Button
									type="dashed"
									onClick={() => add()}
									block
									icon={<PlusOutlined />}
								>
									Add Gift
								</Button>
							</Form.Item> */}
					</>
				)}
			</Form.List>
		</div>
	);
};
