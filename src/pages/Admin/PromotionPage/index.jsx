import React, {useState} from 'react';
import {
	Button,
	Form,
	Input,
	DatePicker,
	Upload,
	Table,
	Popconfirm,
	message,
	Space,
	InputNumber,
	Select,
	Switch,
	Row,
	Col,
} from 'antd';
import {PlusOutlined, MinusCircleOutlined} from '@ant-design/icons';
import moment from 'moment';

const {RangePicker} = DatePicker;
const {Option} = Select;

const PromotionPage = () => {
	const [form] = Form.useForm();
	const [promotions, setPromotions] = useState([]);
	const [editingKey, setEditingKey] = useState('');
	const [isEditing, setIsEditing] = useState(false);

	// Handle form submission to create or update a promotion
	const handleCreatePromotion = (values) => {
		const newPromotion = {
			...values,
			key: promotions.length,
			validDate: `${values.validDate[0].format('YYYY-MM-DD')} to ${values.validDate[1].format(
				'YYYY-MM-DD'
			)}`,
		};
		setPromotions([...promotions, newPromotion]);
		message.success('Promotion created successfully!');
		form.resetFields();
		setIsEditing(false);
	};

	const handleEdit = (record) => {
		setIsEditing(true);
		setEditingKey(record.key);
		const [startDate, endDate] = record.validDate.split(' to ');
		form.setFieldsValue({
			...record,
			validDate: [moment(startDate), moment(endDate)],
		});
	};

	const handleUpdate = async () => {
		try {
			const row = await form.validateFields();
			const newData = [...promotions];
			const index = newData.findIndex((item) => item.key === editingKey);
			if (index > -1) {
				const item = newData[index];
				const updatedPromotion = {
					...item,
					...row,
					validDate: `${row.validDate[0].format(
						'YYYY-MM-DD'
					)} to ${row.validDate[1].format('YYYY-MM-DD')}`,
				};
				newData.splice(index, 1, updatedPromotion);
				setPromotions(newData);
				setEditingKey('');
				setIsEditing(false);
				form.resetFields();
				message.success('Promotion updated successfully!');
			}
		} catch (err) {
			message.error('Please correct the form errors.');
		}
	};

	const handleDeletePromotion = (key) => {
		const newData = promotions.filter((item) => item.key !== key);
		setPromotions(newData);
		message.success('Promotion deleted successfully!');
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
		setEditingKey('');
		form.resetFields();
	};

	// Add a new requirement row based on the selected type
	const addRequirement = (type) => {
		const currentRequirements = form.getFieldValue('require') || [];
		form.setFieldsValue({
			require: [...currentRequirements, {type}],
		});
	};
	const addGift = (type) => {
		const currentGifts = form.getFieldValue('gifts') || []; // Use 'gifts' instead of 'gift'
		form.setFieldsValue({
			gifts: [...currentGifts, {type}], // Update to 'gifts'
		});
	};

	// Table columns definition for displaying promotions
	const columns = [
		{
			title: 'Title',
			dataIndex: 'title',
			editable: true,
		},
		{
			title: 'Apply',
			dataIndex: 'apply',
			editable: true,
		},
		{
			title: 'Valid Date',
			dataIndex: 'validDate',
		},
		{
			title: 'Action',
			render: (_, record) => (
				<span>
					<Button
						type="link"
						disabled={editingKey !== '' && editingKey !== record.key}
						onClick={() => handleEdit(record)}
					>
						Edit
					</Button>
					<Popconfirm
						title="Sure to delete?"
						onConfirm={() => handleDeletePromotion(record.key)}
					>
						<Button type="link" danger>
							Delete
						</Button>
					</Popconfirm>
				</span>
			),
		},
	];

	return (
		<div className="p-6">
			<h2 className="text-2xl font-semibold mb-6">
				{isEditing ? 'Edit Promotion' : 'Create New Promotion'}
			</h2>
			<Form
				form={form}
				onFinish={isEditing ? handleUpdate : handleCreatePromotion}
				layout="vertical"
				className="space-y-4"
			>
				{/* Promotion Title and Apply Fields */}

				<Form.Item label="Promotion Details" className="mb-0">
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="name"
								label="Promotion Name"
								rules={[{required: true, message: 'Please enter a promotion name'}]}
								className="mb-0"
							>
								<Input
									className="border border-gray-300 rounded-md p-2"
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
									format="YYYY-MM-DD HH:mm"
									className="w-full border border-gray-300 rounded-md"
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
						className="border border-gray-300 rounded-md p-2"
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
				<h3 className="text-lg font-semibold">Requirements</h3>
				<div className="flex space-x-4 mb-4">
					<Button type="dashed" onClick={() => addRequirement('diamond')}>
						<PlusOutlined /> Add Diamond Requirement
					</Button>
					<Button type="dashed" onClick={() => addRequirement('jewelry')}>
						<PlusOutlined /> Add Jewelry Model Requirement
					</Button>
				</div>

				{/* Dynamic Requirement List */}
				<Form.List name="require">
					{(fields, {remove}) => (
						<>
							{fields.map(({key, name, fieldKey, ...restField}) => {
								const requirementType = form.getFieldValue([
									'require',
									name,
									'type',
								]);
								return (
									<Space
										key={key}
										className="flex mb-4 space-x-4"
										align="baseline"
									>
										{/* Fields for Diamond Requirement */}
										{requirementType === 'diamond' && (
											<>
												<Form.Item
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
													<Input placeholder="Diamond Requirement Name" />
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'targetType']}
													fieldKey={[fieldKey, 'targetType']}
													initialValue={2} // Diamond requirement targetType
												>
													<Input type="hidden" />
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'operator']}
													fieldKey={[fieldKey, 'operator']}
													initialValue={1} // Always 1
												>
													<Input type="hidden" />
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'quantity']}
													fieldKey={[fieldKey, 'quantity']}
													rules={[
														{
															required: true,
															message: 'Quantity is required',
														},
													]}
												>
													<InputNumber placeholder="Quantity" min={1} />
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'diamondRequirementSpec.origin']}
													fieldKey={[
														fieldKey,
														'diamondRequirementSpec.origin',
													]}
													rules={[
														{
															required: true,
															message: 'Origin is required',
														},
													]}
												>
													<Select placeholder="Select Origin">
														<Option value={1}>Natural</Option>
														<Option value={2}>Lab</Option>
														<Option value={3}>Both</Option>
													</Select>
												</Form.Item>

												<Form.Item
													{...restField}
													name={[
														name,
														'diamondRequirementSpec.shapesIDs',
													]}
													fieldKey={[
														fieldKey,
														'diamondRequirementSpec.shapesIDs',
													]}
													rules={[
														{
															required: true,
															message: 'Shape IDs are required',
														},
													]}
												>
													<Input placeholder="Shape IDs (comma-separated)" />
												</Form.Item>

												<Form.Item
													{...restField}
													name={[
														name,
														'diamondRequirementSpec.caratFrom',
													]}
													fieldKey={[
														fieldKey,
														'diamondRequirementSpec.caratFrom',
													]}
													rules={[
														{
															required: true,
															message: 'Carat From is required',
														},
													]}
												>
													<InputNumber placeholder="Carat From" min={0} />
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'diamondRequirementSpec.caratTo']}
													fieldKey={[
														fieldKey,
														'diamondRequirementSpec.caratTo',
													]}
													rules={[
														{
															required: true,
															message: 'Carat To is required',
														},
													]}
												>
													<InputNumber placeholder="Carat To" min={0} />
												</Form.Item>

												<Form.Item
													{...restField}
													name={[
														name,
														'diamondRequirementSpec.clarityFrom',
													]}
													fieldKey={[
														fieldKey,
														'diamondRequirementSpec.clarityFrom',
													]}
													rules={[
														{
															required: true,
															message: 'Clarity From is required',
														},
													]}
												>
													<InputNumber
														placeholder="Clarity From"
														min={1}
														max={8}
													/>
												</Form.Item>

												<Form.Item
													{...restField}
													name={[
														name,
														'diamondRequirementSpec.clarityTo',
													]}
													fieldKey={[
														fieldKey,
														'diamondRequirementSpec.clarityTo',
													]}
													rules={[
														{
															required: true,
															message: 'Clarity To is required',
														},
													]}
												>
													<InputNumber
														placeholder="Clarity To"
														min={1}
														max={8}
													/>
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'diamondRequirementSpec.cutFrom']}
													fieldKey={[
														fieldKey,
														'diamondRequirementSpec.cutFrom',
													]}
													rules={[
														{
															required: true,
															message: 'Cut From is required',
														},
													]}
												>
													<InputNumber
														placeholder="Cut From"
														min={1}
														max={4}
													/>
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'diamondRequirementSpec.cutTo']}
													fieldKey={[
														fieldKey,
														'diamondRequirementSpec.cutTo',
													]}
													rules={[
														{
															required: true,
															message: 'Cut To is required',
														},
													]}
												>
													<InputNumber
														placeholder="Cut To"
														min={1}
														max={4}
													/>
												</Form.Item>

												<Form.Item
													{...restField}
													name={[
														name,
														'diamondRequirementSpec.colorFrom',
													]}
													fieldKey={[
														fieldKey,
														'diamondRequirementSpec.colorFrom',
													]}
													rules={[
														{
															required: true,
															message: 'Color From is required',
														},
													]}
												>
													<InputNumber
														placeholder="Color From"
														min={1}
														max={8}
													/>
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'diamondRequirementSpec.colorTo']}
													fieldKey={[
														fieldKey,
														'diamondRequirementSpec.colorTo',
													]}
													rules={[
														{
															required: true,
															message: 'Color To is required',
														},
													]}
												>
													<InputNumber
														placeholder="Color To"
														min={1}
														max={8}
													/>
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'moneyAmount']}
													fieldKey={[fieldKey, 'moneyAmount']}
													rules={[{required: false}]}
												>
													<Input type="hidden" />
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'isPromotion']}
													fieldKey={[fieldKey, 'isPromotion']}
													initialValue={true}
												>
													<Input type="hidden" />
												</Form.Item>
											</>
										)}

										{/* Fields for Jewelry Model Requirement */}
										{requirementType === 'jewelry' && (
											<>
												<Form.Item
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
													<Input placeholder="Jewelry Model Requirement Name" />
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'targetType']}
													fieldKey={[fieldKey, 'targetType']}
													initialValue={1} // Jewelry model requirement targetType
												>
													<Input type="hidden" />
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'operator']}
													fieldKey={[fieldKey, 'operator']}
													initialValue={1} // Always 1
												>
													<Input type="hidden" />
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'quantity']}
													fieldKey={[fieldKey, 'quantity']}
													rules={[
														{
															required: true,
															message: 'Quantity is required',
														},
													]}
												>
													<Input placeholder="Quantity (leave blank if not needed)" />
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'moneyAmount']}
													fieldKey={[fieldKey, 'moneyAmount']}
													rules={[
														{
															required: true,
															message: 'Money Amount is required',
														},
													]}
												>
													<InputNumber
														placeholder="Money Amount"
														min={0}
													/>
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'jewelryModelID']}
													fieldKey={[fieldKey, 'jewelryModelID']}
													rules={[
														{
															required: true,
															message: 'Jewelry Model ID is required',
														},
													]}
												>
													<Input placeholder="Jewelry Model ID" />
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'diamondRequirementSpec']}
													fieldKey={[fieldKey, 'diamondRequirementSpec']}
													initialValue={null}
												>
													<Input type="hidden" />
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'isPromotion']}
													fieldKey={[fieldKey, 'isPromotion']}
													initialValue={true}
												>
													<Input type="hidden" />
												</Form.Item>
											</>
										)}
										<MinusCircleOutlined
											onClick={() => remove(name)}
											className="text-red-500"
										/>
									</Space>
								);
							})}
						</>
					)}
				</Form.List>
				{/* Gift Section */}
				<h3 className="text-lg font-semibold mt-6">Gifts</h3>
				<div className="flex space-x-4 mb-4">
					<Button type="dashed" onClick={() => addGift('diamond')}>
						<PlusOutlined /> Add Diamond Gift
					</Button>
					<Button type="dashed" onClick={() => addGift('jewelry')}>
						<PlusOutlined /> Add Jewelry Model Gift
					</Button>
				</div>

				{/* Dynamic Gift List */}
				<Form.List name="gifts">
					{(fields, {remove}) => (
						<>
							{fields.map(({key, name, fieldKey, ...restField}) => {
								const giftType = form.getFieldValue(['gifts', name, 'type']);
								return (
									<Space
										key={key}
										className="flex mb-4 space-x-4"
										align="baseline"
									>
										{/* Fields for Diamond Requirement */}
										{giftType === 'diamond' && (
											<>
												<Form.Item
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
													<Input placeholder="Diamond Requirement Name" />
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'targetType']}
													fieldKey={[fieldKey, 'targetType']}
													initialValue={2} // Diamond requirement targetType
												>
													<Input type="hidden" />
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'operator']}
													fieldKey={[fieldKey, 'operator']}
													initialValue={1} // Always 1
												>
													<Input type="hidden" />
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'quantity']}
													fieldKey={[fieldKey, 'quantity']}
													rules={[
														{
															required: true,
															message: 'Quantity is required',
														},
													]}
												>
													<InputNumber placeholder="Quantity" min={1} />
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'diamondRequirementSpec.origin']}
													fieldKey={[
														fieldKey,
														'diamondRequirementSpec.origin',
													]}
													rules={[
														{
															required: true,
															message: 'Origin is required',
														},
													]}
												>
													<Select placeholder="Select Origin">
														<Option value={1}>Natural</Option>
														<Option value={2}>Lab</Option>
														<Option value={3}>Both</Option>
													</Select>
												</Form.Item>

												<Form.Item
													{...restField}
													name={[
														name,
														'diamondRequirementSpec.shapesIDs',
													]}
													fieldKey={[
														fieldKey,
														'diamondRequirementSpec.shapesIDs',
													]}
													rules={[
														{
															required: true,
															message: 'Shape IDs are required',
														},
													]}
												>
													<Input placeholder="Shape IDs (comma-separated)" />
												</Form.Item>

												<Form.Item
													{...restField}
													name={[
														name,
														'diamondRequirementSpec.caratFrom',
													]}
													fieldKey={[
														fieldKey,
														'diamondRequirementSpec.caratFrom',
													]}
													rules={[
														{
															required: true,
															message: 'Carat From is required',
														},
													]}
												>
													<InputNumber placeholder="Carat From" min={0} />
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'diamondRequirementSpec.caratTo']}
													fieldKey={[
														fieldKey,
														'diamondRequirementSpec.caratTo',
													]}
													rules={[
														{
															required: true,
															message: 'Carat To is required',
														},
													]}
												>
													<InputNumber placeholder="Carat To" min={0} />
												</Form.Item>

												<Form.Item
													{...restField}
													name={[
														name,
														'diamondRequirementSpec.clarityFrom',
													]}
													fieldKey={[
														fieldKey,
														'diamondRequirementSpec.clarityFrom',
													]}
													rules={[
														{
															required: true,
															message: 'Clarity From is required',
														},
													]}
												>
													<InputNumber
														placeholder="Clarity From"
														min={1}
														max={8}
													/>
												</Form.Item>

												<Form.Item
													{...restField}
													name={[
														name,
														'diamondRequirementSpec.clarityTo',
													]}
													fieldKey={[
														fieldKey,
														'diamondRequirementSpec.clarityTo',
													]}
													rules={[
														{
															required: true,
															message: 'Clarity To is required',
														},
													]}
												>
													<InputNumber
														placeholder="Clarity To"
														min={1}
														max={8}
													/>
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'diamondRequirementSpec.cutFrom']}
													fieldKey={[
														fieldKey,
														'diamondRequirementSpec.cutFrom',
													]}
													rules={[
														{
															required: true,
															message: 'Cut From is required',
														},
													]}
												>
													<InputNumber
														placeholder="Cut From"
														min={1}
														max={4}
													/>
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'diamondRequirementSpec.cutTo']}
													fieldKey={[
														fieldKey,
														'diamondRequirementSpec.cutTo',
													]}
													rules={[
														{
															required: true,
															message: 'Cut To is required',
														},
													]}
												>
													<InputNumber
														placeholder="Cut To"
														min={1}
														max={4}
													/>
												</Form.Item>

												<Form.Item
													{...restField}
													name={[
														name,
														'diamondRequirementSpec.colorFrom',
													]}
													fieldKey={[
														fieldKey,
														'diamondRequirementSpec.colorFrom',
													]}
													rules={[
														{
															required: true,
															message: 'Color From is required',
														},
													]}
												>
													<InputNumber
														placeholder="Color From"
														min={1}
														max={8}
													/>
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'diamondRequirementSpec.colorTo']}
													fieldKey={[
														fieldKey,
														'diamondRequirementSpec.colorTo',
													]}
													rules={[
														{
															required: true,
															message: 'Color To is required',
														},
													]}
												>
													<InputNumber
														placeholder="Color To"
														min={1}
														max={8}
													/>
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'moneyAmount']}
													fieldKey={[fieldKey, 'moneyAmount']}
													rules={[{required: false}]}
												>
													<Input type="hidden" />
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'isPromotion']}
													fieldKey={[fieldKey, 'isPromotion']}
													initialValue={true}
												>
													<Input type="hidden" />
												</Form.Item>
											</>
										)}

										{/* Fields for Jewelry Model Requirement */}
										{giftType === 'jewelry' && (
											<>
												<Form.Item
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
													<Input placeholder="Jewelry Model Gift Name" />
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'targetType']}
													fieldKey={[fieldKey, 'targetType']}
													initialValue={1} // Jewelry model requirement targetType
												>
													<Input type="hidden" />
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'operator']}
													fieldKey={[fieldKey, 'operator']}
													initialValue={1} // Always 1
												>
													<Input type="hidden" />
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'quantity']}
													fieldKey={[fieldKey, 'quantity']}
													rules={[
														{
															required: true,
															message: 'Quantity is required',
														},
													]}
												>
													<Input placeholder="Quantity (leave blank if not needed)" />
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'moneyAmount']}
													fieldKey={[fieldKey, 'moneyAmount']}
													rules={[
														{
															required: true,
															message: 'Money Amount is required',
														},
													]}
												>
													<InputNumber
														placeholder="Money Amount"
														min={0}
													/>
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'jewelryModelID']}
													fieldKey={[fieldKey, 'jewelryModelID']}
													rules={[
														{
															required: true,
															message: 'Jewelry Model ID is required',
														},
													]}
												>
													<Input placeholder="Jewelry Model ID" />
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'diamondRequirementSpec']}
													fieldKey={[fieldKey, 'diamondRequirementSpec']}
													initialValue={null}
												>
													<Input type="hidden" />
												</Form.Item>

												<Form.Item
													{...restField}
													name={[name, 'isPromotion']}
													fieldKey={[fieldKey, 'isPromotion']}
													initialValue={true}
												>
													<Input type="hidden" />
												</Form.Item>
											</>
										)}

										<MinusCircleOutlined
											onClick={() => remove(name)}
											className="text-red-500"
										/>
									</Space>
								);
							})}
						</>
					)}
				</Form.List>

				{/* Submit Button */}
				<Form.Item>
					<div className="flex justify-end space-x-4">
						{isEditing && (
							<Button type="default" onClick={handleCancelEdit}>
								Cancel
							</Button>
						)}
						<Button type="primary" htmlType="submit">
							{isEditing ? 'Save' : 'Create'}
						</Button>
					</div>
				</Form.Item>
			</Form>

			{/* Display List of Promotions */}
			<h2 className="text-2xl font-semibold mt-10 mb-6">Promotions List</h2>
			<Table columns={columns} dataSource={promotions} />
		</div>
	);
};

export default PromotionPage;
