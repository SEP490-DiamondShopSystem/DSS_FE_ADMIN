import React, {useState, useEffect} from 'react';
import {Modal, Form, Select, InputNumber, Switch, message} from 'antd';
import {useDispatch} from 'react-redux';
import {createSideDiamondOptionForJewelryModel} from '../../../../redux/slices/jewelry/jewelryModelSlice';

const {Option} = Select;

const AddSideDiamondOptionModal = ({isVisible, onClose, model, availableShapes}) => {
	const dispatch = useDispatch();
	const [form] = Form.useForm();
	const [isLoading, setIsLoading] = useState(false);
	const [averageCaratError, setAverageCaratError] = useState(null);

	// Existing enums remain the same...

	// Custom validator for carat weight
	const validateAverageCaratWeight = () => {
		const caratWeight = form.getFieldValue('caratWeight');
		const quantity = form.getFieldValue('quantity');

		if (caratWeight && quantity) {
			const averageCarat = caratWeight / quantity;
			if (averageCarat > 0.18) {
				setAverageCaratError('Average carat weight must be under 0.18 ct');
				return Promise.reject(new Error('Average carat weight must be under 0.18 ct'));
			} else {
				setAverageCaratError(null);
			}
		}
		return Promise.resolve();
	};

	// Add effects to validate carat weight when carat or quantity changes
	useEffect(() => {
		form.validateFields(['caratWeight', 'quantity']);
	}, [form.getFieldValue('caratWeight'), form.getFieldValue('quantity')]);

	// Enums from the provided configuration
	const enums = {
		Shapes: {
			1: 'Round',
			2: 'Princess',
			3: 'Cushion',
			4: 'Emerald',
			5: 'Oval',
			6: 'Radiant',
			7: 'Asscher',
			8: 'Marquise',
			9: 'Heart',
			10: 'Pear',
		},
		Origin: {
			1: 'Tự Nhiên',
			2: 'Nhân Tạo',
			3: 'Cả Hai',
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
	};

	const handleSubmit = () => {
		form.validateFields()
			.then((values) => {
				setIsLoading(true);

				const payload = {
					modelId: model.Id,
					sideDiamondSpec: {
						shapeId: values.shapeId,
						colorMin: values.colorMin,
						colorMax: values.colorMax,
						clarityMin: values.clarityMin,
						clarityMax: values.clarityMax,
						settingType: values.settingType,
						caratWeight: values.caratWeight,
						quantity: values.quantity,
						isLabDiamond: values.isLabDiamond || false,
					},
				};

				dispatch(createSideDiamondOptionForJewelryModel(payload))
					.unwrap()
					.then(() => {
						message.success('Side Diamond Option added successfully');
						onClose();
						form.resetFields();
					})
					.catch((error) => {
						message.error(
							error?.data?.detail  || 'Failed to add side diamond option'
						);
					})
					.finally(() => {
						setIsLoading(false);
					});
			})
			.catch((errorInfo) => {
			});
	};

	return (
		<Modal
			title="Thêm lựa chọn kim cương tấm"
			visible={isVisible}
			onOk={handleSubmit}
			onCancel={() => {
				onClose();
				form.resetFields();
			}}
			confirmLoading={isLoading}
			okText="Thêm"
			cancelText="Hủy"
			width={600}
		>
			<Form
				form={form}
				layout="vertical"
				initialValues={{
					settingType: 0,
					origin: 1,
					quantity: 1,
				}}
			>
				<Form.Item
					name="shapeId"
					label="Hình dáng kim cương"
					rules={[{required: true, message: 'Please select a diamond shape'}]}
				>
					<Select placeholder="Select Diamond Shape">
						{Object.entries(enums.Shapes).map(([key, value]) => (
							<Option key={key} value={parseInt(key)}>
								{value}
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item
					name="origin"
					label="Nguồn gốc kim cương"
					rules={[{required: true, message: 'Please select diamond origin'}]}
				>
					<Select placeholder="Select Diamond Origin">
						{Object.entries(enums.Origin).map(([key, value]) => (
							<Option key={key} value={parseInt(key)}>
								{value}
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item
					name="caratWeight"
					label="Carat"
					rules={[
						{required: true, message: 'Please enter carat weight'},
						{type: 'number', min: 0, message: 'Carat weight must be positive'},
					
					]}
				>
					<InputNumber
						style={{width: '100%'}}
						placeholder="Enter Carat Weight"
						step={0.01}
						min={0}
					/>
				</Form.Item>
				<Form.Item
					name="quantity"
					label="Số Lượng"
					rules={[
						{required: true, message: 'Vui lòng nhập số lượng'},
						{type: 'number', min: 1, message: 'Số lượng phải lớn hơn 1'},
						{validator: validateAverageCaratWeight},
					]}
				>
					<InputNumber style={{width: '100%'}} placeholder="Nhập số lượng" min={1} />
				</Form.Item>
				{averageCaratError && (
					<div style={{color: 'red', marginBottom: '10px'}}>{averageCaratError}</div>
				)}
				<Form.Item
					name="settingType"
					label="Loại cài đặt"
					rules={[{required: true, message: 'Please select a setting type'}]}
				>
					<Select placeholder="Select Setting Type">
						{Object.entries(enums.SettingType).map(([key, value]) => (
							<Option key={key} value={parseInt(key)}>
								{value}
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item
					name="colorMin"
					label="Màu (Thấp nhất)"
					rules={[{required: true, message: 'Please select minimum color'}]}
				>
					<Select placeholder="Select Minimum Color">
						{Object.entries(enums.Color).map(([key, value]) => (
							<Option key={key} value={parseInt(key)}>
								{value}
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item
					name="colorMax"
					label="Màu (Cao nhất)"
					rules={[{required: true, message: 'Please select maximum color'}]}
				>
					<Select placeholder="Select Maximum Color">
						{Object.entries(enums.Color).map(([key, value]) => (
							<Option key={key} value={parseInt(key)}>
								{value}
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item
					name="clarityMin"
					label="Độ trong suốt (Thấp nhất)"
					rules={[{required: true, message: 'Please select minimum clarity'}]}
				>
					<Select placeholder="Select Minimum Clarity">
						{Object.entries(enums.Clarity).map(([key, value]) => (
							<Option key={key} value={parseInt(key)}>
								{value}
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item
					name="clarityMax"
					label="Độ trong suốt (Cao nhất)"
					rules={[{required: true, message: 'Please select maximum clarity'}]}
				>
					<Select placeholder="Select Maximum Clarity">
						{Object.entries(enums.Clarity).map(([key, value]) => (
							<Option key={key} value={parseInt(key)}>
								{value}
							</Option>
						))}
					</Select>
				</Form.Item>{' '}
				<Form.Item name="isLabDiamond" label="Kim Cương Nhân Tạo" valuePropName="checked">
					<Switch />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default AddSideDiamondOptionModal;
