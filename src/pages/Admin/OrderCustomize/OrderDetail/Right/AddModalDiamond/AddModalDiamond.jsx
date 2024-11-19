import {InfoCircleOutlined} from '@ant-design/icons';
import {Form, Input, InputNumber, message, Modal, Popover, Select, Switch} from 'antd';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getAllShapeSelector} from '../../../../../../redux/selectors';
import {handleAddDiamondCustomize} from '../../../../../../redux/slices/customizeSlice';
import {getDiamondShape} from '../../../../../../redux/slices/diamondSlice';

const {Option} = Select;

export const AddModalDiamond = ({
	setShowModal,
	showModal,
	selectedRequest,
	handleSaveDiamond,
	handleDiamondSelectChange,
	generateRandomSKU,
}) => {
	const [form] = Form.useForm();
	const dispatch = useDispatch();

	const shapes = useSelector(getAllShapeSelector);

	useEffect(() => {
		dispatch(getDiamondShape());
	}, []);

	const handleAddDiamondForm = (values) => {
		Modal.confirm({
			title: 'Vui Lòng Kiểm Tra Lại Thông Tin',
			content: 'Bạn có chắc chắn muốn tiếp tục?',
			okText: 'Xác nhận',
			cancelText: 'Hủy',
			onOk: () => handleOk(values),
		});
	};

	const handleCancel = () => {
		setShowModal(false);
		// form.resetFields();
	};

	const handleOk = (values) => {
		console.log('Form Values:', values);
		const {
			cut,
			color,
			clarity,
			carat,
			isLabDiamond,
			depth,
			fluorescence,
			girdle,
			measurement,
			polish,
			priceOffset,
			shapeId,
			symmetry,
			table,
			withLenghtRatio,
			lockPrice,
			culet,
		} = values;

		const diamond4c = {
			cut,
			color,
			clarity,
			carat,
			isLabDiamond,
		};

		const details = {
			polish,
			symmetry,
			girdle,
			fluorescence,
			culet,
		};

		const measurements = {
			withLenghtRatio,
			depth,
			table,
			measurement,
		};
		// console.log('diamond4c', diamond4c);
		const createDiamond = {
			diamond4c,
			details,
			measurement: measurements,
			shapeId,
			sku: generateRandomSKU(16),
			certificate: 1,
			priceOffset,
		};

		dispatch(
			handleAddDiamondCustomize({
				createDiamond,
				customizeRequestId: selectedRequest?.CustomizeRequestId,
				diamondRequestId: selectedRequest?.DiamondRequestId,
				lockPrice: lockPrice || null,
			})
		).then((res) => {
			if (res.payload !== undefined) {
				message.success('Thêm Cương Kim Thành Công!');
				setShowModal(false);
				form.resetFields();
			} else {
				message.error('Kim tra lại thông số kim cương!');
			}
		});
		// Do something with the values, like sending them to an API
	};

	const popoverContent = (
		<div>
			<p>Giá kim cương ở đây là giá đã được xác định là chính xác.</p>
			<p>Nếu chưa chắc chắn, vui lòng không nhập.</p>
		</div>
	);

	return (
		<Modal
			title="Thêm Kim Cương"
			visible={showModal}
			onOk={() => form.submit()}
			onCancel={handleCancel}
			width={800}
		>
			<Form form={form} layout="vertical" onFinish={handleAddDiamondForm}>
				{/* Diamond 4C Row */}
				<label className="font-semibold">Thêm 4C</label>
				<div className="flex flex-wrap gap-4">
					<Form.Item name="cut" label="Cut" className="w-1/5">
						<Select placeholder="Chọn Cut">
							{[
								{value: 1, label: 'Good'},
								{value: 2, label: 'Very Good'},
								{value: 3, label: 'Excellent'},
							]
								.filter(
									(option) =>
										option.value >= selectedRequest?.CutFrom &&
										option.value <= selectedRequest?.CutTo
								)
								.map((option) => (
									<Option key={option.value} value={option.value}>
										{option.label}
									</Option>
								))}
						</Select>
					</Form.Item>

					<Form.Item name="color" label="Color" className="w-1/5">
						<Select placeholder="Chọn Color">
							{[
								{value: 8, label: 'D'},
								{value: 7, label: 'E'},
								{value: 6, label: 'F'},
								{value: 5, label: 'G'},
								{value: 4, label: 'H'},
								{value: 3, label: 'I'},
								{value: 2, label: 'J'},
								{value: 1, label: 'K'},
							]
								.filter(
									(option) =>
										option.value >= selectedRequest?.ColorFrom &&
										option.value <= selectedRequest?.ColorTo
								)
								.map((option) => (
									<Option key={option.value} value={option.value}>
										{option.label}
									</Option>
								))}
						</Select>
					</Form.Item>

					<Form.Item name="clarity" label="Clarity" className="w-1/5">
						<Select placeholder="Chọn Clarity">
							{[
								{value: 8, label: 'FL'},
								{value: 7, label: 'IF'},
								{value: 6, label: 'VVS1'},
								{value: 5, label: 'VVS2'},
								{value: 4, label: 'VS1'},
								{value: 3, label: 'VS2'},
								{value: 2, label: 'S11'},
								{value: 1, label: 'S12'},
							]
								.filter(
									(option) =>
										option.value >= selectedRequest?.ClarityFrom &&
										option.value <= selectedRequest?.ClarityTo
								)
								.map((option) => (
									<Option key={option.value} value={option.value}>
										{option.label}
									</Option>
								))}
						</Select>
					</Form.Item>

					<Form.Item name="carat" label="Carat" className="w-1/5">
						<InputNumber
							step={0.01}
							placeholder="Chọn Carat Weight"
							className="w-full"
							min={selectedRequest?.CaratFrom}
							max={selectedRequest?.CaratTo}
						/>
					</Form.Item>
				</div>

				{/* Details Row */}
				<label className="font-semibold">Thêm Nâng Cao</label>
				<div className="flex flex-wrap gap-4">
					<Form.Item name="polish" label="Polish" className="w-1/4">
						<Select placeholder="Chọn Polish">
							{[
								{value: 1, label: 'Poor'},
								{value: 2, label: 'Fair'},
								{value: 3, label: 'Good'},
								{value: 4, label: 'Very Good'},
								{value: 5, label: 'Excellent'},
							]
								.filter((option) => {
									// If Polish is an array, use includes; if it's a single value, check directly
									if (Array.isArray(selectedRequest?.Polish)) {
										return (
											!selectedRequest?.Polish ||
											selectedRequest?.Polish.includes(option.value)
										);
									} else {
										return (
											!selectedRequest?.Polish ||
											selectedRequest?.Polish === option.value
										);
									}
								})
								.map((option) => (
									<Option key={option.value} value={option.value}>
										{option.label}
									</Option>
								))}
						</Select>
					</Form.Item>

					<Form.Item name="symmetry" label="Symmetry" className="w-1/4">
						<Select placeholder="Chọn Symmetry">
							{[
								{value: 1, label: 'Poor'},
								{value: 2, label: 'Fair'},
								{value: 3, label: 'Good'},
								{value: 4, label: 'Very Good'},
								{value: 5, label: 'Excellent'},
							]
								.filter((option) => {
									// If Symmetry is an array, use includes; if it's a single value, compare directly
									if (Array.isArray(selectedRequest?.Symmetry)) {
										return (
											!selectedRequest?.Symmetry ||
											selectedRequest?.Symmetry.includes(option.value)
										);
									} else {
										return (
											!selectedRequest?.Symmetry ||
											selectedRequest?.Symmetry === option.value
										);
									}
								})
								.map((option) => (
									<Option key={option.value} value={option.value}>
										{option.label}
									</Option>
								))}
						</Select>
					</Form.Item>

					<Form.Item name="measurement" label="Measurement" className="w-1/4">
						<Input placeholder="Chọn Measurement" className="w-full" />
					</Form.Item>
				</div>
				<div className="flex flex-wrap gap-4">
					<Form.Item name="girdle" label="Girdle" className="w-1/4">
						<Select placeholder="Chọn Girdle">
							{[
								{value: 1, label: 'Extremely Thin'},
								{value: 2, label: 'Very Thin'},
								{value: 3, label: 'Thin'},
								{value: 4, label: 'Medium'},
								{value: 5, label: 'Slightly Thick'},
								{value: 6, label: 'Thick'},
								{value: 7, label: 'Very Thick'},
								{value: 8, label: 'Extremely Thick'},
							]
								.filter((option) => {
									// Check if Girdle is an array or a single value
									if (Array.isArray(selectedRequest?.Girdle)) {
										return (
											!selectedRequest?.Girdle ||
											selectedRequest?.Girdle.includes(option.value)
										);
									} else {
										return (
											!selectedRequest?.Girdle ||
											selectedRequest?.Girdle === option.value
										);
									}
								})
								.map((option) => (
									<Option key={option.value} value={option.value}>
										{option.label}
									</Option>
								))}
						</Select>
					</Form.Item>

					<Form.Item name="fluorescence" label="Fluorescence" className="w-1/4">
						<Select placeholder="Chọn Fluorescence">
							<Option value={1}>None</Option>
							<Option value={2}>Faint</Option>
							<Option value={3}>Medium</Option>
							<Option value={4}>Strong</Option>
						</Select>
					</Form.Item>

					<Form.Item name="culet" label="Culet" className="w-1/4">
						<Select placeholder="Chọn Culet">
							{[
								{value: 1, label: 'None'},
								{value: 2, label: 'Very Small'},
								{value: 3, label: 'Small'},
								{value: 4, label: 'Medium'},
								{value: 5, label: 'Slightly Large'},
								{value: 6, label: 'Large'},
								{value: 7, label: 'Very Large'},
								{value: 8, label: 'Extremely Large'},
							]
								.filter((option) => {
									// Check if Culet is an array or a single value
									if (Array.isArray(selectedRequest?.Culet)) {
										return (
											!selectedRequest?.Culet ||
											selectedRequest?.Culet.includes(option.value)
										);
									} else {
										return (
											!selectedRequest?.Culet ||
											selectedRequest?.Culet === option.value
										);
									}
								})
								.map((option) => (
									<Option key={option.value} value={option.value}>
										{option.label}
									</Option>
								))}
						</Select>
					</Form.Item>
				</div>

				{/* Measurement Row */}
				<div className="flex flex-wrap gap-4">
					<Form.Item
						name="withLenghtRatio"
						label="Width-Length Ratio"
						className="w-1/4"
						rules={[{required: true, message: 'Vui lòng nhập Width-Length Ratio'}]}
					>
						<InputNumber
							placeholder="Enter Width-Length Ratio (%)"
							className="w-full"
							min={0}
							max={100}
							formatter={(value) => `${value}%`}
							parser={(value) => value.replace('%', '')}
						/>
					</Form.Item>

					<Form.Item
						name="depth"
						label="Depth"
						className="w-1/4"
						rules={[{required: true, message: 'Vui lòng nhập Depth'}]}
					>
						<InputNumber
							placeholder="Nhập Phần Trăm Depth (%)"
							className="w-full"
							min={0}
							max={100}
							formatter={(value) => `${value}%`}
							parser={(value) => value.replace('%', '')}
						/>
					</Form.Item>

					<Form.Item
						name="table"
						label="Table"
						className="w-1/4"
						rules={[{required: true, message: 'Vui lòng nhập Table'}]}
					>
						<InputNumber
							placeholder="Nhập Phần Trăm Table (%)"
							className="w-full"
							min={0}
							max={100}
							formatter={(value) => `${value}%`}
							parser={(value) => value.replace('%', '')}
						/>
					</Form.Item>
				</div>

				{/* Full-width Fields */}
				<div className="flex flex-wrap gap-4">
					<Form.Item name="shapeId" label="Hình Dạng" className="w-1/3">
						<Select placeholder="Chọn Hình Dạng">
							{shapes &&
								shapes
									.filter((shape) => {
										// Check if DiamondShapeId is an array or a single value
										if (Array.isArray(selectedRequest?.DiamondShapeId)) {
											return (
												!selectedRequest?.DiamondShapeId ||
												selectedRequest?.DiamondShapeId.includes(shape.Id)
											);
										} else {
											return (
												!selectedRequest?.DiamondShapeId ||
												selectedRequest?.DiamondShapeId === shape.Id
											);
										}
									})
									.map((shape) => (
										<Option key={shape.Id} value={shape.Id}>
											{shape.ShapeName}
										</Option>
									))}
						</Select>
					</Form.Item>

					<Form.Item name="priceOffset" label="Giá Offset" className="w-1/3">
						<InputNumber min={0} placeholder="Nhập Giá Offset" className="w-full" />
					</Form.Item>
				</div>
				<div>
					<Form.Item
						name="lockPrice"
						label="Giá Kim Cương"
						className="w-2/3"
						initialValue={null}
						rules={[
							{type: 'number', min: 0, message: 'Giá phải là số lớn hơn hoặc bằng 0'},
						]}
					>
						<InputNumber
							className="w-full"
							formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							parser={(value) => value.replace(/,/g, '')}
							addonAfter={
								<Popover content={popoverContent} title="Thông tin giá kim cương">
									<InfoCircleOutlined
										style={{color: '#1890ff', cursor: 'pointer'}}
									/>
								</Popover>
							}
						/>
					</Form.Item>
				</div>
				<div>
					<Form.Item
						name="isLabDiamond"
						label="Nguồn Gốc Kim Cương"
						valuePropName="checked"
						initialValue={
							selectedRequest?.IsLabGrown === null
								? false
								: selectedRequest?.IsLabGrown
						}
						className="w-1/3 flex items-center"
					>
						<span>Tự Nhiên</span>
						<Switch
							className="mx-5"
							disabled={
								selectedRequest?.IsLabGrown === null ||
								selectedRequest?.IsLabGrown === false
							}
						/>
						<span>Nhân Tạo</span>
					</Form.Item>
				</div>
			</Form>
		</Modal>
	);
};
