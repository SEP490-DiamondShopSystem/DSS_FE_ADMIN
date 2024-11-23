import {MinusCircleFilled} from '@ant-design/icons';
import {Button, Col, Form, Input, InputNumber, Row, Select, Space, Modal} from 'antd';
import React, {useState} from 'react';
import JewelryModelList from '../JewelryModelList';

export const PromoReqForm = ({form, shapes, Option}) => {
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
	const handleFieldChange = (fieldName, value) => {
		if (value) {
			if (fieldName === 'moneyAmount') {
				form.setFieldsValue({quantity: undefined});
			} else if (fieldName === 'quantity') {
				form.setFieldsValue({moneyAmount: undefined});
			}
		}
	};
	const [isPopupVisible, setIsPopupVisible] = useState(false);
	const [selectedModel, setSelectedModel] = useState(null);

	const handleSelectModel = (model) => {
		console.log('Model Selected in Parent:', model);
		setSelectedModel(model)
		setIsPopupVisible(false);
	};

	return (
		<div>
			<Form.List name="requirements">
				{(fields, {add, remove}) => (
					<>
						{fields.map(({key, name, fieldKey, ...restField}) => {
							return (
								<Space key={key} className="flex mb-4 space-x-4" align="baseline">
									<div className="p-6 gap-x-10 flex justify-between bg-white rounded-lg shadow-lg">
										<Row gutter={[16, 16]}>
											<Col span={12}>
												<Form.Item
													label="Name"
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
													<Input
														className="w-full"
														placeholder="Enter name"
													/>
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
													label="Amount"
													name="moneyAmount"
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
														placeholder="Enter amount"
														onChange={(value) =>
															handleFieldChange('moneyAmount', value)
														}
														disabled={!!form.getFieldValue('quantity')}
													/>
												</Form.Item>
												<Form.Item
													label="Target type"
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
																<Option value={1}>
																	Jewelry Model
																</Option>
																<Option value={2}>Diamond</Option>
																<Option value={3}>Order</Option>
															</>
														)}
													</Select>
												</Form.Item>
												<Form.Item
													label="Promotion ID"
													{...restField}
													name={[name, 'promotionId']}
													fieldKey={[fieldKey, 'promotionId']}
													rules={[
														{
															required: false,
															message: 'Promotion ID is required',
														},
													]}
												>
													<Input />
												</Form.Item>
											</Col>
											<Col span={12}>
												{form.getFieldValue([
													'requirements',
													name,
													'targetType',
												]) !== 3 && (
													<Form.Item
														label="Quantity"
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
																handleFieldChange('quantity', value)
															}
															disabled={
																!!form.getFieldValue('moneyAmount')
															}
														/>
													</Form.Item>
												)}
												{form.getFieldValue([
													'requirements',
													name,
													'targetType',
												]) === 2 && (
													<div className="flex gap-5">
														<Form.Item
															label="Origin"
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
																			Natural
																		</Option>
																		<Option value={2}>
																			Lab
																		</Option>
																		<Option value={3}>
																			Both
																		</Option>
																	</>
																) : null}
															</Select>
														</Form.Item>
														<Form.Item
															label="Shape"
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
																name={[name, 'cutFrom']}
																fieldKey={[fieldKey, 'cutFrom']}
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
												)}
												{form.getFieldValue([
													'requirements',
													name,
													'targetType',
												]) === 1 && (
													<>
														<Form.Item
															label="Jewelry Model ID"
															name="jewelryModelId"
															rules={[
																{
																	required: true,
																	message:
																		'Please select a Jewelry Model',
																},
															]}
														>
															<div className="flex items-center gap-2">
																<Input
																	readOnly
																	value={selectedModel?.Id}
																	placeholder={
																		selectedModel?.Name
																	}
																/>
																<Button
																	onClick={() =>
																		setIsPopupVisible(true)
																	}
																>
																	Select Model
																</Button>
															</div>
														</Form.Item>
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
											<JewelryModelList onSelectModel={handleSelectModel} />
										</Modal>
										<Button type="link" onClick={() => remove(name)}>
											<MinusCircleFilled />
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
