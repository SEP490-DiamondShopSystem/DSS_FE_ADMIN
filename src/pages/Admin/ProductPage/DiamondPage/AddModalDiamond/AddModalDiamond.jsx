import {Modal, Select, Form, Input, InputNumber, Switch, message} from 'antd';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getAllShapeSelector} from '../../../../../redux/selectors';
import {getDiamondShape, handleAddDiamond} from '../../../../../redux/slices/diamondSlice';

const {Option} = Select;

export const AddModalDiamond = ({setShowModal, showModal}) => {
	const [form] = Form.useForm();
	const dispatch = useDispatch();

	const shapes = useSelector(getAllShapeSelector);

	useEffect(() => {
		dispatch(getDiamondShape());
	}, []);

	console.log('shape', shapes);

	const handleCancel = () => {
		setShowModal(false);
		// form.resetFields();
	};

	const onFinish = (values) => {
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
			<Form form={form} layout="vertical" onFinish={onFinish}>
				{/* Diamond 4C Row */}
				<div className="flex flex-wrap gap-4">
					<Form.Item name="cut" label="Cut" className="w-1/5">
						<Select placeholder="Chọn Cut">
							<Option value={1}>Good</Option>
							<Option value={2}>Very Good</Option>
							<Option value={3}>Excellent</Option>
						</Select>
					</Form.Item>

					<Form.Item name="color" label="Color" className="w-1/5">
						<Select placeholder="Chọn Color">
							<Option value={8}>D</Option>
							<Option value={7}>E</Option>
							<Option value={6}>F</Option>
							<Option value={5}>G</Option>
							<Option value={4}>H</Option>
							<Option value={3}>I</Option>
							<Option value={2}>J</Option>
							<Option value={1}>K</Option>
						</Select>
					</Form.Item>

					<Form.Item name="clarity" label="Clarity" className="w-1/5">
						<Select placeholder="Chọn Clarity">
							<Option value={8}>FL</Option>
							<Option value={7}>IF</Option>
							<Option value={6}>VVS1</Option>
							<Option value={5}>VVS2</Option>
							<Option value={4}>VS1</Option>
							<Option value={3}>VS2</Option>
							<Option value={2}>S11</Option>
							<Option value={1}>S12</Option>
						</Select>
					</Form.Item>

					<Form.Item name="carat" label="Carat" className="w-1/5">
						<InputNumber
							step={0.01}
							placeholder="Chọn Carat Weight"
							className="w-full"
						/>
					</Form.Item>
				</div>

				{/* Details Row */}
				<div className="flex flex-wrap gap-4">
					<Form.Item name="polish" label="Polish" className="w-1/4">
						<Select placeholder="Chọn Polish">
							<Option value={1}>Poor</Option>
							<Option value={2}>Fair</Option>
							<Option value={3}>Good</Option>
							<Option value={4}>Very Good</Option>
							<Option value={5}>Excellent</Option>
						</Select>
					</Form.Item>

					<Form.Item name="symmetry" label="Symmetry" className="w-1/4">
						<Select placeholder="Chọn Symmetry">
							<Option value={1}>Poor</Option>
							<Option value={2}>Fair</Option>
							<Option value={3}>Good</Option>
							<Option value={4}>Very Good</Option>
							<Option value={5}>Excellent</Option>
						</Select>
					</Form.Item>

					<Form.Item name="measurement" label="Measurement" className="w-1/4">
						<Input placeholder="Chọn Measurement" className="w-full" />
					</Form.Item>
				</div>
				<div className="flex flex-wrap gap-4">
					<Form.Item name="girdle" label="Girdle" className="w-1/4">
						<Select placeholder="Chọn Girdle">
							<Option value={1}>Extremely Thin</Option>
							<Option value={2}>Very Thin</Option>
							<Option value={3}>Thin</Option>
							<Option value={4}>Medium</Option>
							<Option value={5}>Slightly Thick</Option>
							<Option value={6}>Thick</Option>
							<Option value={7}>Very Thick</Option>
							<Option value={8}>Extremely Thick</Option>
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
							<Option value={1}>None</Option>
							<Option value={2}>Very Small</Option>
							<Option value={3}>Small</Option>
							<Option value={4}>Medium</Option>
							<Option value={5}>Slightly Large</Option>
							<Option value={6}>Large</Option>
							<Option value={7}>Very Large</Option>
							<Option value={8}>Extremely Large</Option>
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
								shapes?.map((shape) => (
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