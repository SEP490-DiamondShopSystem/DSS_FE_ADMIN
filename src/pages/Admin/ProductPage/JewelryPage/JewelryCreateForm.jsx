import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Form, Select, Button} from 'antd';
import {getAllDiamond} from '../../../../redux/slices/diamondSlice';
import {fetchAllSizes} from '../../../../redux/slices/jewelry/sizeSlice';
import {createJewelry} from '../../../../redux/slices/jewelry/jewelrySlice';
import {fetchAllJewelryModels} from '../../../../redux/slices/jewelry/jewelryModelSlice';
import {fetchAllMetals} from '../../../../redux/slices/jewelry/metalSlice';
import {
	getAllJewelryModelsSelector,
	getAllMetalsSelector,
	getAllDiamondSelector,
	getAllSizesSelector,
} from '../../../../redux/selectors';

const {Option} = Select;

const JewelryCreateForm = ({onClose}) => {
	const dispatch = useDispatch();
	const [form] = Form.useForm();
	const [isMaxDiamondsReached, setIsMaxDiamondsReached] = useState(false);
	const [selectedModel, setSelectedModel] = useState(null);
	const [selectedMetal, setSelectedMetal] = useState(null); // New state for selected metal

	// Redux selectors and data fetching
	const sizes = useSelector(getAllSizesSelector);
	useEffect(() => {
		dispatch(fetchAllSizes());
	}, [dispatch]);

	const metals = useSelector(getAllMetalsSelector);
	useEffect(() => {
		dispatch(fetchAllMetals());
	}, [dispatch]);

	const models = useSelector(getAllJewelryModelsSelector);
	useEffect(() => {
		dispatch(fetchAllJewelryModels());
	}, [dispatch]);

	const diamonds = useSelector(getAllDiamondSelector);
	useEffect(() => {
		dispatch(getAllDiamond());
	}, [dispatch]);

	// Filter metals based on selected model's supported metals
	const filteredMetals = selectedModel
		? metals.filter((metal) => selectedModel.MetalSupported.includes(metal.Name))
		: metals;

	const maxDiamonds = selectedModel ? selectedModel.MainDiamondCount : 0;

	const filteredSizes =
		selectedModel && selectedMetal
			? selectedModel.SizeMetals.filter((sizeMetal) => sizeMetal.MetalId === selectedMetal)
			: [];

	// Initialize form with default values
	useEffect(() => {
		form.setFieldsValue({
			JewelryRequest: {
				ModelId: '',
				MentalId: '',
				SizeId: '',
				status: 1, // default status
			},
			attachedDiamondIds: [],
			sideDiamondOptId: '', // move outside of JewelryRequest
		});
	}, [form]);

	// Handle model change to filter metals and populate side diamond details
	const handleModelChange = (value) => {
		const model = models.find((model) => model.Id === value);
		if (model) {
			setSelectedModel(model);
			form.setFieldsValue({
				JewelryRequest: {
					...form.getFieldsValue().JewelryRequest,
					ModelId: value,
					MentalId: '',
					SizeId: '',
				},
				sideDiamondOptId: '',
			});
		}

		// Log model change
		console.log('Selected Model:', model);
	};

	// Handle side diamond option change
	const handleSideDiamondChange = (value) => {
		console.log('Side Diamond Option Changed:', value); // Log the value when it changes
		form.setFieldsValue({
			sideDiamondOptId: value,
		});
		console.log(
			'Updated Side Diamond Option in Form State:',
			form.getFieldValue('sideDiamondOptId')
		);
	};

	// Handle metal change and update selectedMetal state
	const handleMetalChange = (value) => {
		setSelectedMetal(value); // Set the selected metal to the state
		handleChange('MentalId', value); // Update form state
	};

	// Handle generic form field changes
	const handleChange = (name, value) => {
		form.setFieldsValue({
			JewelryRequest: {
				...form.getFieldsValue().JewelryRequest,
				[name]: value,
			},
		});

		// Log individual field change
		console.log(`Changed ${name}:`, value);
	};

	// Handle form submission
	const handleSubmit = () => {
		const formValues = form.getFieldsValue();
		console.log('Form Values Before Submission:', formValues); // Log all form values before submission

		// Extract JewelryRequest and sideDiamondOptId separately
		const {JewelryRequest, attachedDiamondIds, sideDiamondOptId} = formValues;

		console.log('Extracted JewelryRequest:', JewelryRequest);
		console.log('Attached Diamonds:', attachedDiamondIds);
		console.log('Side Diamonds:', sideDiamondOptId);

		// Validation checks
		const {ModelId, SizeId, MentalId, status} = JewelryRequest;

		if (!ModelId || !SizeId || !MentalId) {
			alert('Please fill out all required fields (Model, Size, and Metal).');
			return;
		}

		const attachedDiamonds = attachedDiamondIds || [];
		if (attachedDiamonds.length > selectedModel?.MainDiamondCount) {
			alert(`You can only attach up to ${selectedModel.MainDiamondCount} diamonds.`);
			return;
		}

		// Filter out any undefined or empty fields from the data
		const finalData = {
			...(ModelId && {modelId: ModelId}),
			...(SizeId && {sizeId: SizeId}),
			...(MentalId && {metalId: MentalId}),
			...(status && {status}),
			...(attachedDiamonds.length > 0 && {attachedDiamondIds: attachedDiamonds}),
			...(sideDiamondOptId && {sideDiamondOptId}),
		};

		// Log the final data you're about to send
		console.log('Final data to be dispatched:', finalData);

		// Dispatch the createJewelry action with the correct data
		dispatch(createJewelry(finalData));

		// Reset form fields and close the modal
		form.resetFields();
		onClose();
	};

	// Disable selecting more diamonds than the max allowed
	const handleDiamondChange = (value) => {
		if (value.length <= maxDiamonds) {
			form.setFieldsValue({
				attachedDiamondIds: value,
			});
			setIsMaxDiamondsReached(value.length === maxDiamonds);
		} else {
			alert(`You can only select up to ${maxDiamonds} diamonds.`);
		}

		// Log diamond selection changes
		console.log('Selected Diamonds:', value);
	};

	return (
		<div className="p-4" style={{maxWidth: '1000px', minWidth: '900px', margin: '0 auto'}}>
			<h2 className="text-2xl font-semibold text-primary mb-4">Add New Jewelry</h2>
			<Form form={form} layout="vertical" onFinish={handleSubmit}>
				<Form.Item label="Model ID" name={['JewelryRequest', 'ModelId']}>
					<Select onChange={handleModelChange} placeholder="Select a model">
						{models.map((model) => (
							<Option key={model.Id} value={model.Id}>
								{model.Name} ({model.MainDiamondCount} main diamond
								{model.SideDiamondOptionCount &&
									`, ${model.SideDiamondOptionCount} side diamond`}
								)
							</Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item label="Metal" name={['JewelryRequest', 'MentalId']}>
					<Select
						onChange={handleMetalChange} // Update selected metal here
						placeholder="Select a metal"
						disabled={!selectedModel}
					>
						{filteredMetals.map((metal) => (
							<Option key={metal.Id} value={metal.Id}>
								{metal.Name}
							</Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item label="Size" name={['JewelryRequest', 'SizeId']}>
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

				<Form.Item label="Status" name={['JewelryRequest', 'status']}>
					<Select onChange={(value) => handleChange('status', value)}>
						<Option value={1}>Active</Option>
						<Option value={2}>Sold</Option>
						<Option value={3}>Locked</Option>
					</Select>
				</Form.Item>

				<Form.Item label="Side Diamond Options" name={'sideDiamondOptId'}>
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
									{diamond.ClarityMax}, <strong>Color:</strong> {diamond.ColorMin}{' '}
									{' - '} {diamond.ColorMax}, <strong>Carat: </strong>{' '}
									{diamond.CaratWeight}, <strong> Quantity:</strong>{' '}
									{diamond.Quantity}
								</Option>
							))}
						</Select>
					) : (
						<p>No side diamond options available for this model.</p>
					)}
				</Form.Item>

				<Form.Item label="Attached Diamonds" name={['attachedDiamondIds']}>
					<Select
						mode="multiple"
						onChange={handleDiamondChange}
						placeholder="Select diamonds"
					>
						{diamonds
							.filter((diamond) => diamond.JewelryId === null) // Filter diamonds where JewelryId is null
							.map((diamond) => (
								<Option
									key={diamond.Id}
									value={diamond.Id}
									disabled={isMaxDiamondsReached}
								>
									{diamond.Title}
								</Option>
							))}
					</Select>
				</Form.Item>

				<Form.Item className="flex justify-end">
					<Button onClick={onClose} className="mr-4">
						Cancel
					</Button>
					<Button onClick={() => form.resetFields()} className="mr-4">
						Clear
					</Button>
					<Button type="primary" htmlType="submit">
						Submit
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default JewelryCreateForm;
