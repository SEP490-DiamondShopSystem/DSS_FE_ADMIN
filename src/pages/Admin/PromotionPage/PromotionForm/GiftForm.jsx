import {MinusCircleFilled} from '@ant-design/icons';
import {Button, Col, Form, Input, InputNumber, Row, Select, Space} from 'antd';
import React from 'react';

export const GiftForm = ({form, shapes, Option}) => {
	return (
		<div>
			<Form.List name="gifts">
				{(fields, {add, remove}) => (
					<>
						{fields.map(({key, name, fieldKey, ...restField}) => {
							const unitType = form.getFieldValue(['gifts', name, 'unitType']);
							const targetType = form.getFieldValue(['gifts', name, 'targetType']);

							return (
								<Space key={key} className="flex mb-4 space-x-4" align="baseline">
									<div className="p-6 gap-x-10 flex justify-between bg-white rounded-lg shadow-lg">
										<Row gutter={[16, 16]}>
											<Col span={12} className="flex flex-col">
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
												{targetType !== 3 && (
													<Form.Item
														label="Amount"
														{...restField}
														name={[name, 'amount']}
														fieldKey={[fieldKey, 'amount']}
														rules={[
															{
																required: targetType !== 3,
																message: 'Amount is required',
															},
														]}
														labelCol={{span: 24}}
														wrapperCol={{span: 24}}
													>
														<InputNumber
															className="w-full"
															placeholder="Enter amount"
														/>
													</Form.Item>
												)}
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
														onChange={(value) => {
															form.setFieldsValue({
																[`gifts[${name}].amount`]:
																	value === 3 ? undefined : '',
																[`gifts[${name}].diamondRequirementSpec`]:
																	value === 2 ? {} : undefined,
																[`gifts[${name}].itemId`]:
																	value === 1 ? '' : undefined,
															});
														}}
													>
														<Option value={1}>Jewelry Model</Option>
														<Option value={2}>Diamond</Option>
														<Option value={3}>Order</Option>
													</Select>
												</Form.Item>
												<div className="p-4 border rounded-md bg-gray-50">
													<Form.Item
														label="Unit type"
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
															<Option value={1}>Percentage</Option>
															<Option value={2}>Value</Option>
															<Option value={3}>Free Product</Option>
														</Select>
													</Form.Item>
													<Form.Item
														label="Unit Value"
														{...restField}
														name={[name, 'unitValue']}
														fieldKey={[fieldKey, 'unitValue']}
														rules={[
															{
																required: true,
																type: 'number',
																min: unitType === 1 ? 1 : 1000,
																max:
																	unitType === 1
																		? 100
																		: undefined,
																message:
																	unitType === 1
																		? 'Percentage must be between 1 and 100'
																		: 'Value must be at least 1000',
															},
															{
																validator: (_, value) =>
																	unitType === 2 &&
																	value % 1000 !== 0
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
												</div>
											</Col>
											<Col span={12}>
												<Form.Item
													label="Quantity"
													{...restField}
													name={[name, 'quantity']}
													fieldKey={[fieldKey, 'quantity']}
													rules={[
														{
															required: true,
															message: 'Quantity is required',
														},
													]}
													labelCol={{span: 24}}
													wrapperCol={{span: 24}}
												>
													<InputNumber min={1} className="w-full" />
												</Form.Item>
												{targetType === 1 && (
													<Form.Item
														label="Item ID"
														{...restField}
														name={[name, 'itemId']}
														fieldKey={[fieldKey, 'itemId']}
														rules={[
															{
																required: targetType === 1,
																message:
																	'Item ID is required for Jewelry Model',
															},
														]}
													>
														<Input />
													</Form.Item>
												)}
											</Col>
										</Row>
										{targetType === 2 && (
											<Row span={12}>
												<div className="flex gap-5">
													<div className="p-4 border rounded-md bg-gray-50">
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
													</div>
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
																	message: 'Carat To is required',
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
																		<Option value={1}>K</Option>
																		<Option value={2}>J</Option>
																		<Option value={3}>I</Option>
																		<Option value={4}>H</Option>
																		<Option value={5}>G</Option>
																		<Option value={6}>F</Option>
																		<Option value={7}>E</Option>
																		<Option value={8}>D</Option>
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
																		<Option value={1}>K</Option>
																		<Option value={2}>J</Option>
																		<Option value={3}>I</Option>
																		<Option value={4}>H</Option>
																		<Option value={5}>G</Option>
																		<Option value={6}>F</Option>
																		<Option value={7}>E</Option>
																		<Option value={8}>D</Option>
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
																	message: 'Cut From is required',
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
																	message: 'Cut To is required',
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
											</Row>
										)}
										<Button type="link" onClick={() => remove(name)}>
											<MinusCircleFilled />
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
