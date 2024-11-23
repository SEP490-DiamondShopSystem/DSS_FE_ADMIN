import {Modal, Select, Form, Input, InputNumber, Switch, message} from 'antd';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getAllShapeSelector} from '../../../../../redux/selectors';
import {getDiamondShape, handleAddDiamond} from '../../../../../redux/slices/diamondSlice';
import {
	uploadDiamondThumbnail,
	uploadCertificates,
	uploadDiamondImages,
} from '../../../../../redux/slices/filesSlice';

const {Option} = Select;

export const AddModalDiamond = ({setShowModal, showModal}) => {
	const [form] = Form.useForm();
	const dispatch = useDispatch();

	const shapes = useSelector(getAllShapeSelector);

	const [isLabDiamond, setIsLabDiamond] = useState();

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

	function generateRandomSKU(length = 16) {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let sku = '';

		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * characters.length);
			sku += characters[randomIndex];
		}

		return sku;
	}

	const handleSwitchChange = (checked) => {
		setIsLabDiamond(checked);
		console.log(checked);
	};

	const handleOk = (values) => {
		console.log('Form Values:', values);
		const {
			cut,
			color,
			clarity,
			carat,
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

		console.log('isLabDiamond', isLabDiamond);

		const diamond4c = {
			cut,
			color,
			clarity,
			carat,
			isLabDiamond: isLabDiamond,
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
				sku: generateRandomSKU(16),
			})
		)
			.unwrap()
			.then((res) => {
				message.success('Thêm Cương Kim Thành Công!');
				setShowModal(false);
				form.resetFields();
			})
			.catch((error) => {
				message.error(error?.data?.title || error?.title);
			});
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
							min={0.18}
							max={30}
						/>
					</Form.Item>
				</div>

				{/* Details Row */}
				<label className="font-semibold">Thêm Nâng Cao</label>
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
								shapes?.map((shape) => (
									<Option key={shape.Id} value={shape.Id}>
										{shape.ShapeName}
									</Option>
								))}
						</Select>
					</Form.Item>

					<Form.Item name="priceOffset" label="Giá Offset" className="w-1/3">
						<InputNumber
							min={0.0}
							step={0.1}
							placeholder="Nhập Giá Offset"
							className="w-full"
							defaultValue={0.0}
							formatter={(value) => `${value || 0.0}`}
							parser={(value) => parseFloat(value || 0.0)}
						/>
					</Form.Item>
				</div>
				<div>
					<Form.Item
						name="isLabDiamond"
						label="Nguồn Gốc Kim Cương"
						valuePropName="checked"
						className="w-1/3 flex items-center"
					>
						<span>Tự Nhiên</span>
						<Switch
							className="mx-5"
							checked={isLabDiamond}
							onChange={handleSwitchChange}
						/>
						<span>Nhân Tạo</span>
					</Form.Item>
				</div>
			</Form>
		</Modal>
	);
};
