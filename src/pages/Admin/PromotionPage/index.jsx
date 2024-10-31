import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Slider} from 'antd';
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
	Tooltip,
} from 'antd';
import {PlusOutlined, MinusCircleOutlined} from '@ant-design/icons';
import moment from 'moment';
import {
	fetchPromotions,
	createFullPromotion,
	createPromotion,
	updatePromotion,
	updatePromotionGifts,
	updatePromotionRequirements,
	updatePromotionThumbnail,
	deletePromotion,
	cancelPromotion,
	uploadPromotionThumbnail,
} from '../../../redux/slices/promotionSlice';
const {RangePicker} = DatePicker;
const {Option} = Select;

const PromotionPage = ({promotionData}) => {
	const [form] = Form.useForm();
	const [setPromotions] = useState([]);
	const [editingKey, setEditingKey] = useState('');
	const [editingPromotionId, setEditingPromotionId] = useState(null); 
	const [isEditing, setIsEditing] = useState(false); 
	const [targetTypes, setTargetTypes] = useState({}); 
	const [giftType, setGiftType] = useState({});

	const dispatch = useDispatch();
	const promotions = useSelector((state) => state.promotionSlice.promotions); 
	const loading = useSelector((state) => state.promotionSlice.loading); 

	useEffect(() => {
		dispatch(fetchPromotions());
	}, [dispatch]);

	const formatDate = (date) =>
		date ? moment(date, 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY HH:mm') : 'N/A';

	useEffect(() => {
		if (promotionData) {
			if (promotionData.require) {
				const initialTargetTypes = {};
				promotionData.require.forEach((req, index) => {
					initialTargetTypes[index] = req.targetType;
				});
				setTargetTypes(initialTargetTypes);
			}

			if (promotionData.gift) {
				const initialGiftTypes = {};
				promotionData.gift.forEach((gift, index) => {
					initialGiftTypes[index] = gift.targetType;
				});
				setGiftType(initialGiftTypes);
			}

			form.setFieldsValue(promotionData);
		}
	}, [promotionData, form]);

	const handleTargetTypeChange = (index, value) => {
		setTargetTypes((prev) => ({...prev, [index]: value})); 
	};
	const handleCreatePromotion = (values) => {
		const [startDateTime, endDateTime] = values.validDate;
		const newPromotion = {
			...values,
			key: promotions.length,
			startDateTime: startDateTime.format('DD-MM-YYYY HH:mm:ss'),
			endDateTime: endDateTime.format('DD-MM-YYYY HH:mm:ss'),
		};
		dispatch(createFullPromotion(newPromotion));
		message.success('Promotion created successfully!');
		form.resetFields();
		setIsEditing(false);
	};
	const enumMappings = {
		DiamondOrigin: {
			1: 'Natural',
			2: 'Lab',
			3: 'Both',
		},
		Operator: {
			1: 'Equal or Larger',
			2: 'Larger',
		},
		PriorityLevel: {
			0: 'Low',
			1: 'Medium',
			2: 'High',
		},
		BackType: {
			0: 'Push Back',
			1: 'Screw Back',
			2: 'Secure Lock Back',
		},
		ChainType: {
			0: 'Cable',
			1: 'Rope',
			2: 'Bead',
			3: 'Byzantine',
			4: 'Figaro',
			5: 'Curb',
		},
		ClaspType: {
			0: 'Spring Ring',
			1: 'Lobster Claw',
			2: 'Bayonet',
			3: 'Barrel',
			4: 'Open Box',
			5: 'Toggle',
			6: 'S Hook',
			7: 'Magnetic',
			8: 'Pearl',
			9: 'Bracelet Catch',
		},
		SettingType: {
			0: 'Prong',
			1: 'Bezel',
			2: 'Tension',
			3: 'Pave',
			4: 'Bar',
			5: 'Flush',
		},
		Clarity: {
			1: 'S12',
			2: 'S11',
			3: 'VS2',
			4: 'VS1',
			5: 'VVS2',
			6: 'VVS1',
			7: 'IF',
			8: 'FL',
		},
		Color: {
			1: 'K',
			2: 'J',
			3: 'I',
			4: 'H',
			5: 'G',
			6: 'F',
			7: 'E',
			8: 'D',
		},
		Culet: {
			1: 'None',
			2: 'Very Small',
			3: 'Small',
			4: 'Medium',
			5: 'Slightly Large',
			6: 'Large',
			7: 'Very Large',
			8: 'Extremely Large',
		},
		Cut: {
			1: 'Good',
			2: 'Very Good',
			3: 'Excellent',
			4: 'No Cut',
		},
		Fluorescence: {
			1: 'None',
			2: 'Faint',
			3: 'Medium',
			4: 'Strong',
		},
		Girdle: {
			1: 'Extremely Thin',
			2: 'Very Thin',
			3: 'Thin',
			4: 'Medium',
			5: 'Slightly Thick',
			6: 'Thick',
			7: 'Very Thick',
			8: 'Extremely Thick',
		},
		Polish: {
			1: 'Poor',
			2: 'Fair',
			3: 'Good',
			4: 'Very Good',
			5: 'Excellent',
		},
		Symmetry: {
			1: 'Poor',
			2: 'Fair',
			3: 'Good',
			4: 'Very Good',
			5: 'Excellent',
		},
	};
	const getTextForEnum = (enumType, value) => {
		return enumMappings[enumType]?.[value] || 'Unknown';
	};
	const handleEdit = (promotion) => {
		handleTargetTypeChange();
		setEditingPromotionId(promotion.Id);
		setIsEditing(true);

		form.setFieldsValue({
			name: promotion.Name,
			description: promotion.Description,
			validDate: [
				moment(promotion.StartDate, 'DD-MM-YYYY HH:mm:ss'),
				moment(promotion.EndDate, 'DD-MM-YYYY HH:mm:ss'),
			],
			redemptionMode: promotion.RedemptionMode || 1,
			isExcludeQualifierProduct: promotion.IsExcludeQualifierProduct || false,
			priority: promotion.Priority || 1,
			thumbnail: promotion.thumbnail,

			// Nested requirements (PromoReqs)
			require: promotion.PromoReqs.map((req) => ({
				id: req.Id,
				name: req.Name,
				targetType: req.TargetType,
				operator: req.Operator,
				quantity: req.Quantity,
				amount: req.Amount,
				modelId: req.ModelId,
				origin: getTextForEnum('DiamondOrigin', req.DiamondOrigin), // Map origin to displayable text
				caratFrom: req.CaratFrom,
				caratTo: req.CaratTo,
				clarityFrom: getTextForEnum('Clarity', req.ClarityFrom), // Map clarity to displayable text
				clarityTo: getTextForEnum('Clarity', req.ClarityTo),
				cutFrom: getTextForEnum('Cut', req.CutFrom), // Map cut to displayable text
				cutTo: getTextForEnum('Cut', req.CutTo),
				colorFrom: getTextForEnum('Color', req.ColorFrom), // Map color to displayable text
				colorTo: getTextForEnum('Color', req.ColorTo),
				shapesIDs: req.PromoReqShapes,
				type: req.Type || 'diamond',
			})),

			// Nested gifts (Gifts)
			gifts: promotion.Gifts.map((gift) => ({
				id: gift.Id,
				name: gift.Name,
				targetType: gift.TargetType,
				unitType: gift.UnitType,
				unitValue: gift.UnitValue,
				amount: gift.Amount,
				itemId: gift.ItemId,
				shapesIDs: gift.DiamondGiftShapes,
				origin: getTextForEnum('DiamondOrigin', gift.DiamondOrigin),
				caratFrom: gift.CaratFrom,
				caratTo: gift.CaratTo,
				clarityFrom: getTextForEnum('Clarity', gift.ClarityFrom),
				clarityTo: getTextForEnum('Clarity', gift.ClarityTo),
				cutFrom: getTextForEnum('Cut', gift.CutFrom),
				cutTo: getTextForEnum('Cut', gift.CutTo),
				colorFrom: getTextForEnum('Color', gift.ColorFrom),
				colorTo: getTextForEnum('Color', gift.ColorTo),

				type: gift.Type || 'diamond',
			})),
		});
	};
	const handleCancel = async (id) => {
		try {
			await dispatch(cancelPromotion(id)); // Use your actual cancelPromotion logic
			message.success(`Promotion with id: ${id} has been canceled.`);
		} catch (error) {
			message.error('Failed to cancel the promotion. Please try again.');
		}
	};
	const handleUpdate = async () => {
		try {
			// Validate the form fields
			const row = await form.validateFields();
			
			// Format the valid date range
			const formattedDateRange = {
				startDate: row.validDate[0].format('DD-MM-YYYY'),
				endDate: row.validDate[1].format('DD-MM-YYYY'),
			};
	
			// Create updated promotion data
			const updatedPromotion = {
				...row,
				validDate: `${formattedDateRange.startDate} to ${formattedDateRange.endDate}`,
			};
	
			// Dispatch the update promotion action
			await dispatch(updatePromotion({ id: editingKey, data: JSON.stringify(updatedPromotion) }));
	
			// Update local state with the new data for immediate UI feedback
			const newData = [...promotions];
			const index = newData.findIndex((item) => item.key === editingKey);
			if (index > -1) {
				const item = newData[index];
				newData.splice(index, 1, { ...item, ...updatedPromotion });
				setPromotions(newData);
			}
	
			// Clear editing state and reset form
			setEditingKey('');
			setIsEditing(false);
			form.resetFields();
			message.success('Promotion updated successfully!');
			
		} catch (err) {
			// Handle errors
			message.error('Please correct the form errors.');
		}
	};
	

	const handleDelete = (id) => {
		dispatch(deletePromotion(id))
			.then(() => {
				message.success(`Deleted promotion with id: ${id}`);
			})
			.catch((error) => {
				message.error(`Failed to delete promotion: ${error.message}`);
			});
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
		setEditingKey('');
		handleTargetTypeChange(null);
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
			title: 'Promotion Name',
			dataIndex: 'Name',
			key: 'name',
		},
		{
			title: 'Description',
			dataIndex: 'Description',
			key: 'description',
		},
		{
			title: 'Start Date',
			dataIndex: 'StartDate',
			key: 'startDate',
			render: (text) => formatDate(text),
		},
		{
			title: 'End Date',
			dataIndex: 'EndDate',
			key: 'endDate',
			render: (text) => formatDate(text),
		},
		{
			title: 'Status',
			dataIndex: 'IsActive',
			key: 'status',
			render: (isActive) => (isActive ? 'Active' : 'Inactive'),
		},
		{
			title: 'Priority',
			dataIndex: 'Priority',
			key: 'priority',
		},
		{
			title: 'Moeney Amount',
			dataIndex: 'moneyAmount',
			key: 'moneyAmount',
		},
		{
			title: 'Requirements',
			key: 'requirements',
			render: (_, record) =>
				record.PromoReqs?.map((req, index) => (
					<div key={index}>
						<span>{req.Name}</span> - Quantity: {req.Quantity}
					</div>
				)) || 'No Requirements',
		},
		{
			title: 'Gifts',
			key: 'gifts',
			render: (_, record) =>
				record.Gifts?.map((gift, index) => (
					<div key={index}>
						<span>{gift.Name}</span> - Carat From: {gift.CaratFrom}, Carat To:{' '}
						{gift.CaratTo}
					</div>
				)) || 'No Gifts',
		},
		{
			title: 'Action',
			key: 'action',
			render: (_, record) => (
				<Space size="middle">
			<Button type="link" onClick={() => handleEdit(record)}>
				Edit
			</Button>
			<Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.Id)}>
				<Button type="link" danger>
					Delete
				</Button>
			</Popconfirm>
			<Popconfirm title="Are you sure you want to cancel this promotion?" onConfirm={() => handleCancel(record.Id)}>
				<Button type="link" danger>
					Cancel Promo
				</Button>
			</Popconfirm>
		</Space>
			),
		},
	];

	return (
		<div className="p-8 bg-white shadow-md rounded-lg">
			<h2 className="text-2xl font-bold mb-6">
				{isEditing ? 'Edit Promotion' : 'Create New Promotion'}
			</h2>
			<Form
				form={form}
				onFinish={isEditing ? handleUpdate : handleCreatePromotion}
				layout="vertical"
				className="space-y-6"
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
				<div className="flex space-x-4 mb-4">
					<Button type="dashed" onClick={() => addRequirement('diamond')}>
						<PlusOutlined /> Add Requirement
					</Button>
				</div>

				{/* Dynamic Requirement List */}
				<Form.List name="require">
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
																	required: false,
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
																	Jewelry_Model
																</Option>
																<Option value={2}>Diamond</Option>
																<Option value={3}>Order</Option>
															</Select>
														</Form.Item>

														<Form.Item
															{...restField}
															name={[name, 'operator']}
															fieldKey={[fieldKey, 'operator']}
															initialValue={1} // Always 1
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

														<Form.Item
															label="shapesIDs"
															{...restField}
															name={[name, 'shapesIDs']}
															fieldKey={[fieldKey, 'shapesIDs']}
															rules={[
																{
																	required: false,
																	message:
																		'Shape IDs are required',
																},
															]}
														>
															<Input />
														</Form.Item>
													</Col>
												</Row>
												<Row span={12}>
													{(targetType === 2 || targetType === null) && (
														<>
															{' '}
															<Form.Item
																label="Origin"
																{...restField}
																name={[name, 'origin']}
																fieldKey={[fieldKey, 'origin']}
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
																	<Option value={2}>Lab</Option>
																	<Option value={3}>Both</Option>
																</Select>
															</Form.Item>
															{/* Carat Range */}
															<div className="p-4 border rounded-md bg-gray-50">
																<Form.Item
																	label="Carat From"
																	{...restField}
																	name={[name, 'caratFrom']}
																	fieldKey={[
																		fieldKey,
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
																	name={[name, 'caratTo']}
																	fieldKey={[fieldKey, 'caratTo']}
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
																	name={[name, 'clarityFrom']}
																	fieldKey={[
																		fieldKey,
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
																	name={[name, 'clarityTo']}
																	fieldKey={[
																		fieldKey,
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
																	name={[name, 'cutTo']}
																	fieldKey={[fieldKey, 'cutTo']}
																	rules={[
																		{
																			required: false,
																			message:
																				'Cut To is required',
																		},
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
																	name={[name, 'colorFrom']}
																	fieldKey={[
																		fieldKey,
																		'colorFrom',
																	]}
																	rules={[
																		{
																			required: false,
																			message:
																				'Color From is required',
																		},
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
																	name={[name, 'colorTo']}
																	fieldKey={[fieldKey, 'colorTo']}
																	rules={[
																		{
																			required: false,
																			message:
																				'Color To is required',
																		},
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
																name={[name, 'moneyAmount']}
																fieldKey={[fieldKey, 'moneyAmount']}
																rules={[{required: false}]}
															>
																<Input type="hidden" />
															</Form.Item>
														</>
													)}
												</Row>
											</div>
											<Form.Item
												{...restField}
												name={[name, 'isPromotion']}
												fieldKey={[fieldKey, 'isPromotion']}
												initialValue={true}
											>
												<Input type="hidden" />
											</Form.Item>
										</>
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
						<PlusOutlined /> Add Gift
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
										{/* Fields for Diamond Gift */}
										{giftType === 'diamond' && (
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
																	<Option value={2}>
																		Diamond
																	</Option>
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
																	min={
																		form.getFieldValue([
																			`gifts[${name}].unitType`,
																		]) === 1
																			? 1
																			: 0
																	}
																	max={
																		form.getFieldValue([
																			`gifts[${name}].unitType`,
																		]) === 1
																			? 100
																			: undefined
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
																		message:
																			'Quantity is required',
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
																label="Origin"
																{...restField}
																name={[name, 'origin']}
																fieldKey={[fieldKey, 'origin']}
																rules={[
																	{
																		required: false,
																		message:
																			'Origin is required',
																	},
																]}
																labelCol={{span: 24}}
																wrapperCol={{span: 24}}
															>
																<Select className="w-full">
																	<Option value={1}>
																		Natural
																	</Option>
																	<Option value={2}>Lab</Option>
																	<Option value={3}>Both</Option>
																</Select>
															</Form.Item>
														</Col>
													</Row>
													<Row span={12}>
														{/* Carat Range */}
														<div className="p-4 border rounded-md bg-gray-50">
															<Form.Item
																label="Carat From"
																{...restField}
																name={[name, 'caratFrom']}
																fieldKey={[fieldKey, 'caratFrom']}
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
																name={[name, 'caratTo']}
																fieldKey={[fieldKey, 'caratTo']}
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
																name={[name, 'clarityFrom']}
																fieldKey={[fieldKey, 'clarityFrom']}
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
																name={[name, 'clarityTo']}
																fieldKey={[fieldKey, 'clarityTo']}
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
																name={[name, 'cutTo']}
																fieldKey={[fieldKey, 'cutTo']}
																rules={[
																	{
																		required: false,
																		message:
																			'Cut To is required',
																	},
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
																name={[name, 'colorFrom']}
																fieldKey={[fieldKey, 'colorFrom']}
																rules={[
																	{
																		required: false,
																		message:
																			'Color From is required',
																	},
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
																name={[name, 'colorTo']}
																fieldKey={[fieldKey, 'colorTo']}
																rules={[
																	{
																		required: false,
																		message:
																			'Color To is required',
																	},
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
															initialValue={true}
														>
															<Input type="hidden" />
														</Form.Item>
													</Row>
												</div>
											</>
										)}
										<MinusCircleOutlined
											onClick={() => remove(name)}
											className="text-red-500 hover:text-red-700 cursor-pointer"
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

			{/* Display List of Promotions */}
			<h2 className="text-2xl font-semibold mt-10 mb-6">Promotions List</h2>
			<Table
				columns={columns}
				dataSource={promotions}
				loading={loading}
				rowKey="id"
				className="hover:bg-gray-100"
			/>
		</div>
	);
};

export default PromotionPage;
