import {InfoCircleOutlined} from '@ant-design/icons';
import {Form, Input, InputNumber, message, Modal, Popover, Select, Switch, Tooltip} from 'antd';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getAllShapeSelector, LoadingCustomizeSelector} from '../../../../../../redux/selectors';
import {handleAddDiamondCustomize} from '../../../../../../redux/slices/customizeSlice';
import {
	getDiamondShape,
	handleEstimatePriceDiamond,
} from '../../../../../../redux/slices/diamondSlice';
import {fetchDiamondRule} from '../../../../../../redux/slices/configSlice';

const {Option} = Select;

export const AddModalDiamond = ({
	orders,
	setShowModal,
	showModal,
	selectedRequest,
	generateRandomSKU,
	changeDiamond,
	setChangeDiamond,
	filteredRequests,
	setIsModalVisible,
	setSelectedRequest,
}) => {
	const [form] = Form.useForm();
	const dispatch = useDispatch();

	const loading = useSelector(LoadingCustomizeSelector);
	const shapes = useSelector(getAllShapeSelector);

	const [estimatePrice, setEstimatePrice] = useState();
	const [diamondParams, setDiamondParams] = useState(null);
	const [offsetMin, setOffsetMin] = useState();
	const [offsetMax, setOffsetMax] = useState();

	useEffect(() => {
		dispatch(getDiamondShape());
	}, []);

	useEffect(() => {
		dispatch(fetchDiamondRule())
			.unwrap()
			.then((res) => {
				setOffsetMin(res?.MinPriceOffset);
				setOffsetMax(res?.MaxPriceOffset);
			});
	}, []);

	useEffect(() => {
		form.setFieldsValue({
			isLabDiamond: selectedRequest?.IsLabGrown,
			priceOffset: 0,
		});
	}, [selectedRequest, form]);

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

	const handleFormChange = (changedValues, allValues) => {
		const {cut, color, clarity, carat, priceOffset, shapeId, isLabDiamond} = allValues;
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
		form.resetFields();
	};

	const handleOk = (values) => {

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
			sku,
			extraFee,
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

		const createDiamond = {
			diamond4c,
			details,
			measurement: measurements,
			shapeId,
			sku,
			certificate: 1,
			priceOffset,
			extraFee,
		};

		if (orders?.Status === 1) {
			dispatch(
				handleAddDiamondCustomize({
					createDiamond,
					customizeRequestId: selectedRequest?.CustomizeRequestId,
					diamondRequestId: selectedRequest?.DiamondRequestId,
					lockPrice: lockPrice || null,
				})
			)
				.unwrap()
				.then(() => {
					message.success('Thêm Cương Kim Thành Công!');
					setShowModal(false);
					setSelectedRequest(null);
					form.resetFields();
				})
				.catch((error) => {
					message.error(error?.data?.detail);
				});
		} else {
			const updatedChangeDiamond = filteredRequests?.reduce((acc, diamond) => {
				if (diamond.DiamondRequestId === selectedRequest?.DiamondRequestId) {
					// Thay thế các trường trong đối tượng này bằng values từ form
					acc[diamond.DiamondRequestId] = {
						CustomizeRequestId: diamond?.CustomizeRequestId,
						DiamondRequestId: diamond?.DiamondRequestId,
						Position: diamond.Position,
						Cut: cut,
						Color: color,
						Clarity: clarity,
						Carat: carat,
						IsLabDiamond: isLabDiamond,
						DiamondId: null,
						DiamondShapeId: shapeId,
						Polish: polish,
						Symmetry: symmetry,
						Girdle: girdle,
						Fluorescence: fluorescence,
						Culet: culet,
						WithLenghtRatio: withLenghtRatio,
						Depth: depth,
						Table: table,
						Measurement: measurement,
						PriceOffset: priceOffset,
					};
				} else {
					acc[diamond.DiamondRequestId] = diamond; // Giữ nguyên dữ liệu không thay đổi
				}
				return acc;
			}, {});

			// Cập nhật lại state changeDiamond với giá trị mới
			setChangeDiamond(updatedChangeDiamond);
			message.success('Thông tin kim cương đã được cập nhật!');
			setShowModal(false);
			form.resetFields();
		}
	};

	const popoverContent = (
		<div>
			<p>Giá kim cương ở đây là giá đã được xác định là chính xác.</p>
			<p>Nếu chưa chắc chắn, vui lòng không nhập.</p>
		</div>
	);

	return (
		<Modal
			title={orders?.Status === 2 ? `Thay Đổi Kim Cương` : `Thêm Kim Cương`}
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
				onLoad={loading}
			>
				<label className="font-semibold">Nhập SKU</label>
				<div className="flex flex-wrap gap-4">
					<Form.Item
						name="sku"
						label="SKU"
						className="w-1/3"
						rules={[
							{required: true, message: 'Vui lòng nhập SKU.'},
							{
								pattern: /^[a-zA-Z0-9]{1,16}$/,
								message: 'SKU chỉ được chứa chữ và số, tối đa 16 ký tự.',
							},
						]}
					>
						<Input placeholder="Nhập SKU" className="w-full" maxLength={16} />
					</Form.Item>
				</div>
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
						<Select placeholder="Chọn Cut">
							{[
								{value: 1, label: 'Tốt'},
								{value: 2, label: 'Rất Tốt'},
								{value: 3, label: 'Xuất Sắc'},
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
										(value >= selectedRequest?.CaratFrom &&
											value <= selectedRequest?.CaratTo)
									) {
										return Promise.resolve();
									}
									return Promise.reject(
										new Error(
											`Giá trị phải nằm trong khoảng ${selectedRequest?.CaratFrom} đến ${selectedRequest?.CaratTo}!`
										)
									);
								},
							}),
						]}
					>
						<InputNumber
							step={0.01}
							placeholder="Chọn Carat"
							className="w-full"
							min={selectedRequest?.CaratFrom}
							max={selectedRequest?.CaratTo}
							addonBefore={
								<Tooltip
									title={`Nhập giá trị từ ${selectedRequest?.CaratFrom} đến ${selectedRequest?.CaratTo}`}
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
							{[
								{value: 1, label: 'Kém'},
								{value: 2, label: 'Trung Bình'},
								{value: 3, label: 'Tốt'},
								{value: 4, label: 'Rất Tốt'},
								{value: 5, label: 'Xuất Sắc'},
							]
								.filter((option) => {
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

					<Form.Item
						name="symmetry"
						label="Chọn Đối Xứng (Symmetry)"
						className="w-1/4"
						rules={[
							{
								required: true,
								message: 'Vui lòng chọn Symmetry!',
							},
						]}
					>
						<Select placeholder="Chọn Symmetry">
							{[
								{value: 1, label: 'Kém'},
								{value: 2, label: 'Trung Bình'},
								{value: 3, label: 'Tốt'},
								{value: 4, label: 'Rất Tốt'},
								{value: 5, label: 'Xuất Sắc'},
							]
								.filter((option) => {
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
						<Input
							placeholder="Nhập Measurement (vd: 10 x 20 x 30)"
							className="w-full"
						/>
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
							{[
								{value: 1, label: 'Cực Mỏng'},
								{value: 2, label: 'Rất Mỏng'},
								{value: 3, label: 'Mỏng'},
								{value: 4, label: 'Trung Bình'},
								{value: 5, label: 'Hơi Dày'},
								{value: 6, label: 'Dày'},
								{value: 7, label: 'Rất Dày'},
								{value: 8, label: 'Cực Dày'},
							]
								.filter((option) => {
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
							{[
								{value: 1, label: 'Không Có'},
								{value: 2, label: 'Rất Nhỏ'},
								{value: 3, label: 'Nhỏ'},
								{value: 4, label: 'Trung Bình'},
								{value: 5, label: 'Hơi Lớn'},
								{value: 6, label: 'Lớn'},
								{value: 7, label: 'Rất Lớn'},
								{value: 8, label: 'Cực Lớn'},
							]
								.filter((option) => {
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
						label="Tỷ lệ chiều rộng-chiều dài"
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
					<Form.Item
						name="shapeId"
						label="Hình Dạng"
						className="w-1/3"
						rules={[
							{
								required: true,
								message: 'Vui lòng chọn hình dạng!',
							},
						]}
					>
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
					<Form.Item
						name="isLabDiamond"
						label="Nguồn Gốc Kim Cương"
						valuePropName="checked"
						className="w-1/3 flex items-center"
					>
						<span>Tự Nhiên</span>
						<Switch
							className="mx-5"
							disabled
							checked={selectedRequest?.IsLabGrown === true}
						/>
						<span>Nhân Tạo</span>
					</Form.Item>
				</div>

				<label className="font-semibold">Cài Đặt Giá Kim Cương</label>
				<div className="flex flex-wrap gap-4">
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
					<Form.Item name="priceOffset" label="Bù Trừ Giá" className="w-1/3">
						<InputNumber
							min={offsetMin}
							max={offsetMax}
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
							<strong>Giá đúng:</strong> {formatPrice(estimatePrice?.CorrectPrice)}
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
