import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Checkbox, Col, Form, Input, InputNumber, Row, Select, Space} from 'antd';
import React from 'react';

export const RequirementForm = ({targetTypes, handleTargetTypeChange, shapes, Option}) => {
	return (
		<div>
			<Form.List name="require">
				{(fields, {add, remove}) => (
					<>
						{fields.map(({key, name, fieldKey, ...restField}, index) => {
							const targetType = targetTypes[index];
							return (
								<Space key={key} className="flex mb-4 space-x-4" align="baseline">
									<>
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
													>
														<Input />
													</Form.Item>

													<Form.Item
														{...restField}
														name={[name, 'targetType']}
														fieldKey={[fieldKey, 'targetType']}
														label="Target Type"
														rules={[
															{
																required: true,
																message:
																	'Please select a target type',
															},
														]}
													>
														<Select
															onChange={(value) =>
																handleTargetTypeChange(index, value)
															}
														>
															<Option value={1}>Trang Sức</Option>
															<Option value={2}>Kim Cương</Option>
															<Option value={3}>Hóa Đơn</Option>
														</Select>
													</Form.Item>

													<Form.Item
														label="Jewelry Model ID"
														{...restField}
														name={[name, 'jewelryModelID']}
														fieldKey={[fieldKey, 'jewelryModelID']}
														rules={[
															{
																required: false,
																message:
																	'Jewelry Model ID is required',
															},
														]}
													>
														<Input />
													</Form.Item>

													<Form.Item
														{...restField}
														name={[name, 'operator']}
														fieldKey={[fieldKey, 'operator']}
														initialValue={1}
													>
														<Input type="hidden" />
													</Form.Item>
												</Col>
												<Col span={12}>
													<Form.Item
														label="Money Amount"
														{...restField}
														name={[name, 'moneyAmount']}
														fieldKey={[fieldKey, 'moneyAmount']}
														rules={[
															{
																required: false,
																message: 'Money Amount is required',
															},
														]}
													>
														<InputNumber
															min={0}
															formatter={(value) =>
																value
																	?.toString()
																	.replace(
																		/\B(?=(\d{3})+(?!\d))/g,
																		','
																	)
															}
															parser={(value) =>
																value?.replace(/,/g, '')
															}
															addonAfter="VND"
														/>
													</Form.Item>
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
													>
														<InputNumber min={1} />
													</Form.Item>
												</Col>
											</Row>
											<Row span={12}>
												{(targetType === 2 || targetType === null) && (
													<>
														<Row gutter={[16, 16]} className="mx-20">
															<Col span={24}>
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
															</Col>
															<Col span={12}>
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
																	style={{width: 120}}
																	rules={[
																		{
																			required: false,
																			message:
																				'Origin is required',
																		},
																	]}
																>
																	<Select>
																		<Option value={1}>
																			Tự Nhiên
																		</Option>
																		<Option value={2}>
																			Nhân Tạo
																		</Option>
																		<Option value={3}>
																			Cả hai
																		</Option>
																	</Select>
																</Form.Item>
															</Col>
														</Row>

														{/* Carat Range */}
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
															>
																<InputNumber
																	className="w-full"
																	min={0}
																	max={5}
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
															>
																<InputNumber
																	className="w-full"
																	min={0}
																	max={5}
																/>
															</Form.Item>
														</div>
														<div className="p-4 border rounded-md bg-gray-50">
															{/* Clarity Range */}
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
															>
																<Select className="w-full">
																	<Option value={1}>S12</Option>
																	<Option value={2}>S11</Option>
																	<Option value={3}>VS2</Option>
																	<Option value={4}>VS1</Option>
																	<Option value={5}>VVS2</Option>
																	<Option value={6}>VVS1</Option>
																	<Option value={7}>IF</Option>
																	<Option value={8}>FL</Option>
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
															>
																<Select className="w-full">
																	<Option value={1}>S12</Option>
																	<Option value={2}>S11</Option>
																	<Option value={3}>VS2</Option>
																	<Option value={4}>VS1</Option>
																	<Option value={5}>VVS2</Option>
																	<Option value={6}>VVS1</Option>
																	<Option value={7}>IF</Option>
																	<Option value={8}>FL</Option>
																</Select>
															</Form.Item>
														</div>
														<div className="p-4 border rounded-md bg-gray-50">
															{/* Cut Range */}
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
															>
																<Select>
																	<Option value={1}>Good</Option>
																	<Option value={2}>
																		Very Good
																	</Option>
																	<Option value={3}>
																		Excellent
																	</Option>
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
															>
																<Select>
																	<Option value={1}>Good</Option>
																	<Option value={2}>
																		Very Good
																	</Option>
																	<Option value={3}>
																		Excellent
																	</Option>
																	<Option value={4}>
																		No Cut
																	</Option>
																</Select>
															</Form.Item>
														</div>
														{/* Color Range */}
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
																	<Option value={1}>K</Option>
																	<Option value={2}>J</Option>
																	<Option value={3}>I</Option>
																	<Option value={4}>H</Option>
																	<Option value={5}>G</Option>
																	<Option value={6}>F</Option>
																	<Option value={7}>E</Option>
																	<Option value={8}>D</Option>
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
																	<Option value={1}>K</Option>
																	<Option value={2}>J</Option>
																	<Option value={3}>I</Option>
																	<Option value={4}>H</Option>
																	<Option value={5}>G</Option>
																	<Option value={6}>F</Option>
																	<Option value={7}>E</Option>
																	<Option value={8}>D</Option>
																</Select>
															</Form.Item>
														</div>
														<Form.Item
															{...restField}
															name={[name, 'isPromotion']}
															fieldKey={[fieldKey, 'isPromotion']}
														>
															<Checkbox value={false}>
																Is Promotion
															</Checkbox>
														</Form.Item>
													</>
												)}
											</Row>
											<MinusCircleOutlined
												className="dynamic-delete-button"
												onClick={() => remove(name)}
											/>
										</div>
									</>
								</Space>
							);
						})}
						<Form.Item>
							<Button
								type="dashed"
								onClick={() => add()}
								block
								icon={<PlusOutlined />}
							>
								Thêm Yêu Cầu
							</Button>
						</Form.Item>
					</>
				)}
			</Form.List>
		</div>
	);
};
