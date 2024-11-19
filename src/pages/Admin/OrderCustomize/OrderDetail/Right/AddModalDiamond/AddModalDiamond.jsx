import {Modal, Select, Form, Input, InputNumber, Switch, message} from 'antd';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getAllShapeSelector} from '../../../../../../redux/selectors';
import {getDiamondShape, handleAddDiamond} from '../../../../../../redux/slices/diamondSlice';

const {Option} = Select;

export const AddModalDiamond = ({setShowModal, showModal, selectedRequest}) => {
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

		dispatch(
			handleAddDiamond({
				diamond4c,
				details,
				measurement: measurements,
				shapeId,
				priceOffset,
				certificate: 1,
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
								.filter(
									(option) =>
										!selectedRequest?.Polish ||
										selectedRequest?.Polish?.includes(option.value)
								)
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
								.filter(
									(option) =>
										!selectedRequest?.Symmetry ||
										selectedRequest?.Symmetry?.includes(option.value)
								)
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
								.filter(
									(option) =>
										!selectedRequest?.Girdle ||
										selectedRequest?.Girdle?.includes(option.value)
								)
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
								.filter(
									(option) =>
										!selectedRequest?.Culet ||
										selectedRequest?.Culet.includes(option.value)
								)
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
					<Form.Item name="withLenghtRatio" label="Width-Length Ratio" className="w-1/4">
						<InputNumber placeholder="Enter Width-Length Ratio" className="w-full" />
					</Form.Item>

					<Form.Item name="depth" label="Depth" className="w-1/4">
						<InputNumber placeholder="Nhập Phần Trăm Depth" className="w-full" />
					</Form.Item>

					<Form.Item name="table" label="Table" className="w-1/4">
						<InputNumber placeholder="Nhập Phần Trăm Table" className="w-full" />
					</Form.Item>
				</div>

				{/* Full-width Fields */}
				<div className="flex flex-wrap gap-4">
					<Form.Item name="shapeId" label="Hình Dạng" className="w-1/3">
						<Select placeholder="Chọn Hình Dạng">
							{shapes &&
								shapes
									.filter(
										(shape) =>
											!selectedRequest?.DiamondShapeId ||
											selectedRequest?.DiamondShapeId?.includes(shape.Id)
									)
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
						name="isLabDiamond"
						label="Kim Cương Nhân Tạo"
						valuePropName="checked"
						initialValue={false}
						className="w-1/3"
					>
						<Switch />
					</Form.Item>
				</div>
			</Form>
		</Modal>
	);
};
