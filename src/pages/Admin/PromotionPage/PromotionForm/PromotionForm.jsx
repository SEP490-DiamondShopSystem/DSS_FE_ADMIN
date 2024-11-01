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
}) => {
	console.log('targetTypes', targetTypes);

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
								label="Promotion Name"
								rules={[{required: true, message: 'Please enter a promotion name'}]}
								className="mb-0"
							>
								<Input
									className="border border-gray-300 rounded-md p-2 focus:border-blue-500"
									placeholder="Enter promotion name"
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="validDate"
								label="Valid Date Range"
								rules={[
									{required: true, message: 'Please select a valid date range'},
								]}
								className="mb-0"
							>
								<RangePicker
									showTime
									format="DD-MM-YYYY HH:mm"
									className="w-full border border-gray-300 rounded-md focus:border-blue-500"
								/>
							</Form.Item>
						</Col>
					</Row>
				</Form.Item>

				<Form.Item
					name="description"
					label="Description"
					rules={[{required: true, message: 'Please enter a description'}]}
				>
					<Input
						className="border border-gray-300 rounded-md p-2 focus:border-blue-500"
						placeholder="Enter description"
					/>
				</Form.Item>

				<Form.Item label="Additional Settings" className="mb-0">
					<Row gutter={16}>
						<Col span={8}>
							<Form.Item
								name="redemptionMode"
								label="Redemption Mode"
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
						<Col span={8}>
							<Form.Item
								name="isExcludeQualifierProduct"
								label="Exclude Qualifier Product"
								valuePropName="checked"
								initialValue={true} // Always set to true
								className="mb-0"
							>
								<Switch className="text-blue-600" />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item
								name="priority"
								label="Priority"
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
				<h3 className="text-xl font-semibold mt-6">Requirements</h3>
				{/* <div className="flex space-x-4 mb-4">
					<Button type="dashed" onClick={() => addRequirement('diamond')}>
						<PlusOutlined /> Thêm Yêu Cầu
					</Button>
				</div> */}

				{/* Dynamic Requirement List */}
				<Form.List name="requirements">
					{(fields, {add, remove}) => (
						<>
							{fields.map(({key, name, fieldKey, ...restField}, index) => {
								const targetType = targetTypes[index];
								return (
									<Space
										key={key}
										className="flex mb-4 space-x-4"
										align="baseline"
									>
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
																	handleTargetTypeChange(
																		index,
																		value
																	)
																}
															>
																<Option value={1}>
																	Jewelry Model
																</Option>
																<Option value={2}>Diamond</Option>
																<Option value={3}>Order</Option>
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
																	message:
																		'Money Amount is required',
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
															<Row
																gutter={[16, 16]}
																className="mx-20"
															>
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
																			{shapes?.map(
																				(shape) => (
																					<Option
																						key={
																							shape.Id
																						}
																						value={
																							shape.Id
																						}
																					>
																						{
																							shape.ShapeName
																						}
																					</Option>
																				)
																			)}
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
																				Natural
																			</Option>
																			<Option value={2}>
																				Lab
																			</Option>
																			<Option value={3}>
																				Both
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
																		<Option value={1}>
																			Good
																		</Option>
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
																		<Option value={1}>
																			Good
																		</Option>
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
																<Checkbox>Is Promotion</Checkbox>
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
									Add Requirement
								</Button>
							</Form.Item>
						</>
					)}
				</Form.List>

				{/* Gift Section */}
				<h3 className="text-lg font-semibold mt-6">Gifts</h3>
				<div className="flex space-x-4 mb-4">
					<Button type="dashed" onClick={() => addGift('diamond')}>
						<PlusOutlined /> Thêm Quà
					</Button>
				</div>

				{/* Dynamic Gift List */}
				<Form.List name="gifts">
					{(fields, {add, remove}) => (
						<>
							{fields.map(({key, name, fieldKey, ...restField}) => {
								const giftType = form.getFieldValue(['gifts', name, 'type']);
								const unitType = form.getFieldValue(['gifts', name, 'unitType']);

								return (
									<Space
										key={key}
										className="flex mb-4 space-x-4"
										align="baseline"
									>
										{giftType === 'diamond' && (
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
																	required: false,
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
															label="Amount"
															{...restField}
															name={[name, 'amount']}
															fieldKey={[fieldKey, 'amount']}
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
															<Select className="w-full">
																<Option value={1}>
																	Jewelry Model
																</Option>
																<Option value={2}>Diamond</Option>
																<Option value={3}>Order</Option>
															</Select>
														</Form.Item>
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
																<Option value={1}>
																	Percentage
																</Option>
																<Option value={2}>Value</Option>
																<Option value={3}>
																	Free Product
																</Option>
															</Select>
														</Form.Item>
													</Col>
													<Col span={12}>
														<Form.Item
															label="Unit Value"
															{...restField}
															name={[name, 'unitValue']}
															fieldKey={[fieldKey, 'unitValue']}
															rules={[
																{
																	required: false,
																	message:
																		'Unit Value is required',
																},
															]}
															labelCol={{span: 24}}
															wrapperCol={{span: 24}}
														>
															<InputNumber
																min={unitType === 1 ? 1 : 0}
																max={
																	unitType === 1 ? 100 : undefined
																}
																addonAfter={form.getFieldValue([
																	`gifts[${name}].unitValueAddon`,
																])}
																className="w-full"
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
															labelCol={{span: 24}}
															wrapperCol={{span: 24}}
														>
															<InputNumber
																min={1}
																className="w-full"
															/>
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
																<Option value={1}>Natural</Option>
																<Option value={2}>Lab</Option>
																<Option value={3}>Both</Option>
															</Select>
														</Form.Item>
														<Form.Item
															label="Item ID"
															{...restField}
															name={[name, 'itemId']}
															fieldKey={[fieldKey, 'itemId']}
															rules={[
																{
																	required: false,
																	message: 'Item ID is required',
																},
															]}
														>
															<Input />
														</Form.Item>
													</Col>
												</Row>

												<Row span={12}>
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
															rules={[
																{
																	required: false,
																	message:
																		'Clarity To is required',
																},
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
																	message: 'Cut From is required',
																},
															]}
														>
															<Select className="w-full">
																<Option value={1}>Good</Option>
																<Option value={2}>Very Good</Option>
																<Option value={3}>Excellent</Option>
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
																<Option value={1}>Good</Option>
																<Option value={2}>Very Good</Option>
																<Option value={3}>Excellent</Option>
															</Select>
														</Form.Item>
													</div>
												</Row>
												<Button type="link" onClick={() => remove(name)}>
													Remove gift
												</Button>
											</div>
										)}
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

				{/* Submit Button */}
				<Form.Item>
					<div className="flex justify-end space-x-4">
						{isEditing && (
							<Button
								type="default"
								onClick={handleCancelEdit}
								className="bg-gray-100 text-gray-700 hover:bg-gray-200"
							>
								Cancel
							</Button>
						)}
						<Button
							type="primary"
							htmlType="submit"
							className="bg-blue-500 text-white hover:bg-blue-600"
						>
							{isEditing ? 'Save' : 'Create'}
						</Button>
					</div>
				</Form.Item>
			</Form>
		</div>
	);
};

export default PromotionForm;
