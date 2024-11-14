import {MinusCircleOutlined} from '@ant-design/icons';
import {Button, Col, Form, Input, InputNumber, Row, Select, Space} from 'antd';
import React from 'react';

export const DiscountReqForm = ({form, shapes, Option, removeRequirement}) => {
	const handleTargetTypeChange = (targetType, name, setFieldsValue) => {
		const isOrder = targetType === 3;
		const isDiamond = targetType === 2;
		const isJewelryModel = targetType === 1;

		// Set default values or clear fields based on target type
		setFieldsValue({
			[`requirements[${name}].quantity`]: isOrder ? undefined : '',
			[`requirements[${name}].moneyAmount`]: '',
			[`requirements[${name}].diamondRequirementSpec`]: isDiamond ? {} : undefined,
			[`requirements[${name}].discountId`]: isJewelryModel ? '' : undefined,
		});
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
													label="Jewelry Model Id"
													{...restField}
													name={[name, 'jewelryModelID']}
													fieldKey={[fieldKey, 'jewelryModelID']}
													rules={[
														{
															required: false,
															message: 'Model Id is required',
														},
													]}
													labelCol={{span: 24}}
													wrapperCol={{span: 24}}
												>
													<Input
														className="w-full"
														placeholder="Jewelry Model Id"
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
															</>
														)}
													</Select>
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
														<InputNumber min={1} className="w-full" />
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
													<Form.Item
														label="Discount ID"
														{...restField}
														name={[name, 'discountId']}
														fieldKey={[fieldKey, 'discountId']}
														rules={[
															{
																required: false,
																message: 'Discount ID is required',
															},
														]}
													>
														<Input />
													</Form.Item>
												)}
											</Col>
										</Row>
										<Button
											type="link"
											onClick={() => {
												remove(name);
												removeRequirement(requirement?.id); // Pass the actual requirement ID
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
