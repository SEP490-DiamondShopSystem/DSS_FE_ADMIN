import {Form, Input, InputNumber, Modal, Select, Switch, Tooltip, message} from 'antd';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getAllShapeSelector} from '../../../../../redux/selectors';
import {
	getDiamondShape,
	handleAddDiamond,
	handleEstimatePriceDiamond,
} from '../../../../../redux/slices/diamondSlice';
import {fetchDiamondRule} from '../../../../../redux/slices/configSlice';
import {InfoCircleOutlined} from '@ant-design/icons';
import {formatPrice} from '../../../../../utils';

const {Option} = Select;

export const AddModalDiamond = ({setShowModal, showModal}) => {
	const [form] = Form.useForm();
	const dispatch = useDispatch();

	const shapes = useSelector(getAllShapeSelector);

	const [isLabDiamond, setIsLabDiamond] = useState(false);
	const [estimatePrice, setEstimatePrice] = useState();
	const [diamondParams, setDiamondParams] = useState(null);
	const [diamond, setDiamond] = useState(null);
	const [rule, setRule] = useState();

	useEffect(() => {
		dispatch(getDiamondShape());
	}, []);

	useEffect(() => {
		dispatch(fetchDiamondRule())
			.unwrap()
			.then((res) => {
				setRule(res);
				setOffsetMin(res?.MinPriceOffset);
				setOffsetMax(res?.MaxPriceOffset);
			});
	}, [dispatch]);

	useEffect(() => {
		form.setFieldsValue({
			priceOffset: 0,
		});
	}, [form]);

	const handleAddDiamondForm = (values) => {
		Modal.confirm({
			title: 'Tạo Kim Cương',
			centered: true,
			okText: 'Xác nhận',
			cancelText: 'Hủy',
			onOk: () => handleOk(values),
		});
	};

	const handleFormChange = (changedValues, allValues) => {
		const {cut, color, clarity, carat, priceOffset, shapeId} = allValues;
		setDiamondParams({
			shapeId,
			priceOffset: priceOffset === undefined ? 0 : priceOffset,
			diamond_4C: {
				cut,
				color,
				clarity,
				carat,
				isLabDiamond: isLabDiamond,
			},
		});
	};
	useEffect(() => {
		if (!diamondParams) return;

		// Kiểm tra tất cả các tham số cần thiết
		const isValidParams = [
			diamondParams?.diamond_4C?.carat,
			diamondParams?.diamond_4C?.clarity,
			diamondParams?.diamond_4C?.color,
			diamondParams?.diamond_4C?.cut,
			diamondParams?.shapeId,
		].every(Boolean); // Kiểm tra xem tất cả điều kiện đều đúng

		if (isValidParams) {
			dispatch(handleEstimatePriceDiamond(diamondParams))
				.unwrap()
				.then((res) => {
					setEstimatePrice(res);
				})
				.catch((error) => {
					const errorMessage = error?.data?.detail || error?.detail || 'Đã xảy ra lỗi!';
					message.error(errorMessage);
				});
		} else {
			console.warn('Thiếu thông tin cần thiết để tính giá kim cương!');
		}
	}, [diamondParams, dispatch]);

	const handleCancel = () => {
		setShowModal(false);
		// form.resetFields();
	};

	// function generateRandomSKU(length = 16) {
	// 	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	// 	let sku = '';

	// 	for (let i = 0; i < length; i++) {
	// 		const randomIndex = Math.floor(Math.random() * characters.length);
	// 		sku += characters[randomIndex];
	// 	}

	// 	return sku;
	// }

	const handleSwitchChange = (checked) => {
		setIsLabDiamond(checked);
	};

	const handleOk = (values) => {
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
			extraFee,
			sku,
		} = values;
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

		dispatch(
			handleAddDiamond({
				diamond4c,
				details,
				measurement: measurements,
				shapeId,
				priceOffset,
				certificate: 1,
				sku,
				extraFee,
			})
		)
			.unwrap()
			.then((res) => {
				message.success('Thêm Cương Kim Thành Công!');
				setShowModal(false);
				form.resetFields();
			})
			.catch((error) => {
				message.error(error?.data?.detail || error?.detail);
			});
	};

	return (
		<Modal
			title="Thêm Kim Cương"
			visible={showModal}
			onOk={() => form.submit()}
			onCancel={handleCancel}
			width={1200}
			centered
		>
			<Form
				form={form}
				layout="vertical"
				onFinish={handleAddDiamondForm}
				onValuesChange={handleFormChange}
			>
				<label className="font-semibold">Nhập Mã Sê-ri</label>
				<div className="flex flex-wrap gap-4">
					<Form.Item
						name="sku"
						label="Mã Sê-ri"
						className="w-1/3"
						rules={[
							{required: true, message: 'Vui lòng nhập sê-ri.'},
							{
								pattern: /^[a-zA-Z0-9]{1,16}$/,
								message: 'Sê-ri chỉ được chứa chữ và số, tối đa 16 ký tự.',
							},
						]}
					>
						<Input placeholder="Nhập Sê-ri" className="w-full" maxLength={16} />
					</Form.Item>
				</div>

				{/* Diamond 4C Row */}
				<label className="font-semibold">Thêm 4C</label>
				<div className="flex flex-wrap gap-4">
					<Form.Item
						name="cut"
						label="Chế Tác (Cut)"
						className="w-1/5"
						rules={[
							{
								required: true,
								message: 'Vui lòng chọn Cut!',
							},
						]}
					>
						<Select placeholder="Chế Tác (Cut)">
							<Option value={1}>Tốt</Option>
							<Option value={2}>Rất Tốt</Option>
							<Option value={3}>Xuất Sắc</Option>
						</Select>
					</Form.Item>

					<Form.Item
						name="color"
						label="Màu Sắc (Color)"
						className="w-1/5"
						rules={[
							{
								required: true,
								message: 'Vui lòng chọn Color!',
							},
						]}
					>
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

					<Form.Item
						name="clarity"
						label="Độ Tinh Khuyết (Clarity)"
						className="w-1/5"
						rules={[
							{
								required: true,
								message: 'Vui lòng chọn Clarity!',
							},
						]}
					>
						<Select placeholder="Clarity">
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

					<Form.Item
						name="carat"
						label="Ly (Carat)"
						className="w-1/5"
						rules={[
							{
								required: true,
								message: 'Vui lòng nhập giá trị Carat!',
							},
							({getFieldValue}) => ({
								validator(_, value) {
									if (
										!value ||
										(value >= rule?.MinCaratRange &&
											value <= rule?.MaxCaratRange)
									) {
										return Promise.resolve();
									}
									return Promise.reject(
										new Error(
											`Giá trị phải nằm trong khoảng ${rule?.MinCaratRange} đến ${rule?.MaxCaratRange}!`
										)
									);
								},
							}),
						]}
					>
						<InputNumber
							step={0.01}
							placeholder="Chọn Ly (Carat)"
							className="w-full"
							min={rule?.MinCaratRange}
							max={rule?.MaxCaratRange}
							addonBefore={
								<Tooltip
									title={`Nhập giá trị từ ${rule?.MinCaratRange} đến ${rule?.MaxCaratRange}`}
								>
									<InfoCircleOutlined style={{color: '#1890ff'}} />
								</Tooltip>
							}
						/>
					</Form.Item>
				</div>

				{/* Details Row */}
				<label className="font-semibold">Thêm Nâng Cao</label>
				<div className="flex flex-wrap gap-4">
					<Form.Item
						name="polish"
						label="Độ Bóng (Polish)"
						className="w-1/4"
						rules={[
							{
								required: true,
								message: 'Vui lòng chọn Polish!',
							},
						]}
					>
						<Select placeholder="Chọn Polish">
							<Option value={1}>Kém</Option>
							<Option value={2}>Trung Bình</Option>
							<Option value={3}>Tốt</Option>
							<Option value={4}>Rất Tốt</Option>
							<Option value={5}>Xuất Sắc</Option>
						</Select>
					</Form.Item>

					<Form.Item
						name="symmetry"
						label="Độ Tương Xứng (Symmetry) "
						className="w-1/4"
						rules={[
							{
								required: true,
								message: 'Vui lòng chọn Symmetry!',
							},
						]}
					>
						<Select placeholder="Chọn Symmetry">
							<Option value={1}>Kém</Option>
							<Option value={2}>Trung Bình</Option>
							<Option value={3}>Tốt</Option>
							<Option value={4}>Rất Tốt</Option>
							<Option value={5}>Xuất Sắc</Option>
						</Select>
					</Form.Item>

					<Form.Item
						name="measurement"
						label="Kích Thước"
						className="w-1/4"
						rules={[
							{
								required: true,
								message: 'Vui lòng nhập Measurement!',
							},
							{
								pattern: /^\d+(\.\d+)?\s*x\s*\d+(\.\d+)?\s*x\s*\d+(\.\d+)?$/,
								message:
									'Vui lòng nhập đúng định dạng A x B x C (vd: 10 x 20 x 30)',
							},
						]}
					>
						<Input placeholder="Chọn Measurement" className="w-full" />
					</Form.Item>
				</div>
				<div className="flex flex-wrap gap-4">
					<Form.Item
						name="girdle"
						label="Viền Cạnh (Girdle)"
						className="w-1/4"
						rules={[
							{
								required: true,
								message: 'Vui lòng chọn Girdle!',
							},
						]}
					>
						<Select placeholder="Chọn Girdle">
							<Option value={1}>Cực Mỏng</Option>
							<Option value={2}>Rất Mỏng</Option>
							<Option value={3}>Mỏng</Option>
							<Option value={4}>Trung Bình</Option>
							<Option value={5}>Hơi Dày</Option>
							<Option value={6}>Dày</Option>
							<Option value={7}>Rất Dày</Option>
							<Option value={8}>Cực Dày</Option>
						</Select>
					</Form.Item>

					<Form.Item
						name="fluorescence"
						label="Huỳnh quang"
						className="w-1/4"
						rules={[
							{
								required: true,
								message: 'Vui lòng chọn Fluorescence!',
							},
						]}
					>
						<Select placeholder="Chọn Fluorescence">
							<Option value={1}>Không Có</Option>
							<Option value={2}>Mờ</Option>
							<Option value={3}>Trung Bình</Option>
							<Option value={4}>Mạnh</Option>
						</Select>
					</Form.Item>

					<Form.Item
						name="culet"
						label="Chóp Đáy (Culet)"
						className="w-1/4"
						rules={[
							{
								required: true,
								message: 'Vui lòng chọn Culet!',
							},
						]}
					>
						<Select placeholder="Chọn Culet">
							<Option value={1}>Không Có</Option>
							<Option value={2}>Rất Nhỏ</Option>
							<Option value={3}>Nhỏ</Option>
							<Option value={4}>Trung Bình</Option>
							<Option value={5}>Hơi lớn</Option>
							<Option value={6}>Lớn</Option>
							<Option value={7}>Rất Lớn</Option>
							<Option value={8}>Cực Lớn</Option>
						</Select>
					</Form.Item>
				</div>

				{/* Measurement Row */}
				<div className="flex flex-wrap gap-4">
					<Form.Item
						name="withLenghtRatio"
						label="Tỷ Lệ chiều rộng-chiều dài"
						className="w-1/4"
						rules={[
							{
								required: true,
								message: 'Vui lòng nhập tỷ lệ chiều rộng-chiều dài',
							},
						]}
					>
						<InputNumber
							placeholder="Nhập Tỷ lệ chiều rộng-chiều dài"
							className="w-full"
							step={0.01}
						/>
					</Form.Item>

					<Form.Item
						name="depth"
						label="Độ Sâu (Depth)"
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
						label="Bề Mặt (Table)"
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

				<label className="font-semibold">Cài Đặt Giá Kim Cương</label>
				<div className="flex flex-wrap gap-4">
					<Form.Item name="priceOffset" label="Bù Trừ Giá" className="w-1/3">
						<InputNumber
							min={rule?.MinPriceOffset}
							max={rule?.MaxPriceOffset}
							step={0.1}
							placeholder="Nhập giá bù trừ"
							className="w-full"
							defaultValue={0.0}
							formatter={(value) => `${value || 0.0}`}
							parser={(value) => parseFloat(value || 0.0)}
						/>
					</Form.Item>
					<Form.Item name="extraFee" label="Phí Bổ Sung">
						<InputNumber
							min={0}
							defaultValue={0}
							style={{width: '100%'}}
							placeholder="Nhập thêm phí"
							formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							parser={(value) => value.replace(/,/g, '')}
						/>
					</Form.Item>
				</div>

				{estimatePrice && (
					<div>
						<p>
							<strong>Thông báo:</strong> {estimatePrice?.Message}
						</p>
						<p>
							<strong>Giá đúng:</strong> {formatPrice(estimatePrice?.CorrectPrice)}{' '}
						</p>
						<p>
							<strong>Giá tìm thấy:</strong>{' '}
							{formatPrice(estimatePrice?.PriceFound?.Price)}
						</p>
						<p>
							<strong>Gợi ý khoảng bù kim cương hình:</strong>{' '}
							{estimatePrice?.IsFancyShape
								? estimatePrice?.FancyShapeOffsetSuggested
								: estimatePrice?.CutOffsetSuggested}
						</p>
					</div>
				)}
			</Form>
		</Modal>
	);
};
