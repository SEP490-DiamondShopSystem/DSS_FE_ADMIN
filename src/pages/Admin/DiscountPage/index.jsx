import {
	CloseOutlined,
	DeleteFilled,
	EditFilled,
	PlayCircleOutlined,
	PauseOutlined,
	PictureOutlined,
	UploadOutlined,
} from '@ant-design/icons';
import {Button, Form, message, Popconfirm, Space, Table, Tooltip} from 'antd';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getAllShapeSelector} from '../../../redux/selectors';
import {
	cancelDiscount,
	createFullDiscount,
	deleteDiscount,
	fetchDiscounts,
	fetchDiscountDetail,
	pauseDiscount,
	updateDiscount,
	uploadDiscountThumbnail,
} from '../../../redux/slices/discountSlice';
import {enumMappings} from '../../../utils/constant';
import DiscountForm from './DiscountForm/DiscountForm';

const DiscountPage = ({discountData}) => {
	const shapes = useSelector(getAllShapeSelector);
	const dispatch = useDispatch();
	const discounts = useSelector((state) => state.discountSlice.discounts);
	const loading = useSelector((state) => state.discountSlice.loading);

	const [form] = Form.useForm();
	const [setDiscounts] = useState([]);
	const [editingKey, setEditingKey] = useState('');
	const [editingDiscountId, setEditingDiscountId] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [targetTypes, setTargetTypes] = useState({});
	const [giftType, setGiftType] = useState({});
	const [currentEditingIndex, setCurrentEditingIndex] = useState(null);
	const [removedRequirements, setRemovedRequirements] = useState([]);

	const [originalDiscountData, setOriginalDiscountData] = useState(null);

	useEffect(() => {
		dispatch(fetchDiscounts());
	}, [dispatch]);

	const formatDate = (date) =>
		date ? moment(date, 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY HH:mm') : 'N/A';

	useEffect(() => {
		if (discountData) {
			if (discountData.requirements) {
				const initialTargetTypes = {};
				discountData.requirements.forEach((req, index) => {
					initialTargetTypes[index] = req.targetType;
				});
				setTargetTypes(initialTargetTypes);
			}
			form.setFieldsValue(discountData);
		}
	}, [discountData, form]);

	const handleTargetTypeChange = (index, value) => {
		setTargetTypes((prev) => ({...prev, [index]: value}));
	};
	const removeRequirement = (requirementId) => {
		if (!requirementId) return;
		setRemovedRequirements((prev) => [...prev, requirementId]);
		const updatedRequirements = form
			.getFieldValue('requirements')
			.filter((req) => req.id !== requirementId);

		form.setFieldsValue({requirements: updatedRequirements});
	};

	const handleCreateDiscount = (values) => {
		const {name, discountPercent, discountCode, requirements} = values;
		const [startDateTime, endDateTime] = values.validDate;

		const createDiscount = {
			startDate: startDateTime.format('DD-MM-YYYY HH:mm:ss'),
			endDate: endDateTime.format('DD-MM-YYYY HH:mm:ss'),
			name: name,
			discountPercent: discountPercent,
			discountCode: discountCode,
		};

		dispatch(createFullDiscount({createDiscount, requirements}))
			.unwrap()
			.then(() => {
				message.success('Tạo Giảm Giá Thành Công!');
				form.resetFields();
			})
			.catch((error) => {
				message.error(error?.data?.title || error?.detail || 'Lỗi không xác định');
			});
	};

	const getTextForEnum = (enumType, value) => {
		return enumMappings[enumType]?.[value] || ' ';
	};
	const handleEdit = (discount, index) => {
		const discountId = discount.Id;
		setEditingDiscountId(discount.Id);
		setIsEditing(true);
		setCurrentEditingIndex(index);

		dispatch(fetchDiscountDetail(discountId))
			.unwrap()
			.then((res) => {
				const fetchedDiscount = res;
				const startDate = fetchedDiscount.StartDate
					? moment(fetchedDiscount.StartDate, 'DD-MM-YYYY HH:mm:ss')
					: null;
				const endDate = fetchedDiscount.EndDate
					? moment(fetchedDiscount.EndDate, 'DD-MM-YYYY HH:mm:ss')
					: null;
				setOriginalDiscountData({
					...fetchedDiscount,
					StartDate: startDate,
					EndDate: endDate,
				});
				form.setFieldsValue({
					name: fetchedDiscount.Name,
					validDate: [startDate, endDate],
					isActive: fetchedDiscount.IsActive,
					status: fetchedDiscount.Status || 2,
					discountCode: fetchedDiscount.DiscountCode,
					discountPercent: fetchedDiscount.DiscountPercent,
					thumbnail: fetchedDiscount.Thumbnail,

					requirements: fetchedDiscount.DiscountReq.map((req) => {
						const diamondSpec = req.DiamondRequirementSpec || {};

						console.log('Requirement Diamond Spec:', diamondSpec); // Debugging log

						return {
							id: req.Id,
							name: req.Name,
							targetType: req.TargetType,
							operator: req.Operator,
							quantity: req.Quantity || 0,
							jewelryModelId: req.jewelryModelId,
							promotionId: req.PromotionId,
							discountId: req.DiscountId,
							diamondRequirementSpec: {
								origin: diamondSpec.Origin
									? getTextForEnum('Origin', diamondSpec.Origin)
									: '',
								caratFrom: diamondSpec.CaratFrom ?? '',
								caratTo: diamondSpec.CaratTo ?? '',
								clarityFrom: diamondSpec.ClarityFrom
									? getTextForEnum('Clarity', diamondSpec.ClarityFrom)
									: '',
								clarityTo: diamondSpec.ClarityTo
									? getTextForEnum('Clarity', diamondSpec.ClarityTo)
									: '',
								cutFrom: diamondSpec.CutFrom
									? getTextForEnum('Cut', diamondSpec.CutFrom)
									: '',
								cutTo: diamondSpec.CutTo
									? getTextForEnum('Cut', diamondSpec.CutTo)
									: '',
								colorFrom: diamondSpec.ColorFrom
									? getTextForEnum('Color', diamondSpec.ColorFrom)
									: '',
								colorTo: diamondSpec.ColorTo
									? getTextForEnum('Color', diamondSpec.ColorTo)
									: '',
								shapesIDs: diamondSpec.ShapesIDs || [],
							},
						};
					}),
				});
			})

			.catch((error) => {
				message.error(error?.data?.title || error?.detail);
			});
	};
	const handlePause = async (id, currentStatus) => {
		const action = currentStatus === 2 ? 'tạm dừng' : 'tiếp tục';
		await dispatch(pauseDiscount(id))
			.unwrap()
			.then(() => {
				message.success(`Mã giảm giá với id: ${id} đã được ${action} thành công.`);
				dispatch(fetchDiscounts());
			})
			.catch((error) => {
				message.error(error?.data?.title || error?.detail);
			});
	};

	const handleCancel = async (id) => {
		await dispatch(cancelDiscount(id))
			.unwrap()
			.then(() => {
				message.success(`Mã giảm giá với id: ${id} đã được bị hủy.`);
			})
			.catch((error) => {
				message.error(error?.data?.title || error?.detail);
			});
		await dispatch(fetchDiscounts());
	};
	const handleUpdate = async () => {
		const row = await form.validateFields();

		// Get the original startDate and endDate from the editing discount
		const originalStartDate = form
			.getFieldValue('validDate')?.[0]
			?.format('DD-MM-YYYY HH:mm:ss');
		const originalEndDate = form.getFieldValue('validDate')?.[1]?.format('DD-MM-YYYY HH:mm:ss');

		// Get the new startDate and endDate
		const newStartDate = row.validDate[0].format('DD-MM-YYYY HH:mm:ss');
		const newEndDate = row.validDate[1].format('DD-MM-YYYY HH:mm:ss');

		// Determine if dates have changed
		const hasDateChanged = newStartDate !== originalStartDate || newEndDate !== originalEndDate;

		// Prepare additional requirements to be added
		const addedRequirements = row.requirements
			.filter((req) => !req.id) // Only include requirements without an id
			.map((req) => ({
				name: req.name,
				targetType: req.targetType,
				operator: req.operator,
				quantity: req.quantity || 1,
				jewelryModelId: req.jewelryModelId,
				promotionId: req.promotionId,
				diamondRequirementSpec: req.diamondRequirementSpec,
			}));

		if (!editingDiscountId) {
			message.error('Discount ID is missing!');
			return;
		}

		// Remove fields without values
		const removeEmptyFields = (obj) => {
			return Object.fromEntries(
				Object.entries(obj).filter(
					([_, value]) =>
						value !== undefined &&
						value !== null &&
						(Array.isArray(value) ? value.length > 0 : true) &&
						(typeof value === 'object' && !Array.isArray(value)
							? Object.keys(removeEmptyFields(value)).length > 0
							: true)
				)
			);
		};

		// Clean the row data
		const cleanedRow = removeEmptyFields({
			...row,
			requirements: addedRequirements, // Only include new requirements
		});

		// Prepare the discount data for updating
		const discountData = {
			...cleanedRow,
			...(hasDateChanged && {
				// Include updateStartEndDate only if the dates have changed
				updateStartEndDate: {
					startDate: newStartDate,
					endDate: newEndDate,
				},
			}),
			...(removedRequirements.length > 0 && {removedRequirements}), // Include only if not empty
		};

		// Dispatch the update action
		await dispatch(updateDiscount({discountId: editingDiscountId, discountData}))
			.unwrap()
			.then(() => {
				message.success('Cập giảm giá thành công!');
				form.resetFields(); // Clear all fields in the form
			})
			.catch((error) => {
				message.error(error?.data?.title || error?.detail);
			});

		// Refresh the discount list and reset states

		await dispatch(fetchDiscounts());
		setIsEditing(false);
		setRemovedRequirements([]); // Reset removed requirements after update
	};

	const handleDelete = async (id) => {
		dispatch(deleteDiscount(id))
			.unwrap()
			.then(() => {
				message.success(`Đã xóa giảm giá có id: ${id}`);
			})
			.catch((error) => {
				message.error(error?.data?.title || error?.detail);
			});
		await dispatch(fetchDiscounts());
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
		discountPercent;
		setEditingKey('');
		handleTargetTypeChange(null);
		form.resetFields();
	};

	// Add a new requirement row based on the selected type
	const addRequirement = (type) => {
		const currentRequirements = form.getFieldValue('requirements') || [];
		form.setFieldsValue({
			requirements: [...currentRequirements, {type}],
		});
	};

	// Table columns definition for displaying discounts
	const columns = [
		{
			title: 'Thumbnail',
			key: 'thumbnail',
			render: (_, record) => {
				return (
					<div className="flex flex-col items-center space-y-2">
						{record.Thumbnail ? (
							<div className="relative group">
								<img
									src={record?.Thumbnail?.MediaPath}
									alt={record?.Thumbnail?.MediaName}
									className="w-16 h-16 object-cover rounded-md shadow-sm group-hover:opacity-70 transition-all duration-300"
									onError={(e) => {
										console.error('Image load error:', e);
										e.target.style.display = 'none';
									}}
								/>
								<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-md">
									<input
										type="file"
										accept="image/*"
										className="hidden"
										id={`thumbnail-upload-${record.Id}`}
										onChange={(e) => {
											const file = e.target.files[0];
											if (file) {
												dispatch(
													uploadDiscountThumbnail({
														discountId: record.Id,
														imageFile: file,
													})
												)
													.unwrap()
													.then(() => {
														message.success(
															'Tải ảnh bìa lên thành công!'
														);
														dispatch(fetchDiscounts());
													})
													.catch((error) => {
														message.error(
															error?.data?.title ||
																error?.detail ||
																'Tải lên thất bại!'
														);
													});
											}
										}}
									/>
									<Button
										type="text"
										className="text-white hover:text-blue-200"
										onClick={(e) => {
											// Prevent event propagation
											e.stopPropagation();

											// Use optional chaining and provide a fallback
											const fileInput = document.getElementById(
												`thumbnail-upload-${record.Id}`
											);
											if (fileInput) {
												fileInput.click();
											} else {
												message.error(
													'Không thể tải ảnh. Vui lòng thử lại sau.'
												);
											}
										}}
									>
										<EditFilled />
									</Button>
								</div>
							</div>
						) : (
							<div className="w-16 h-16 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md">
								<PictureOutlined className="text-gray-400" />
							</div>
						)}
						<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-md">
							<input
								type="file"
								accept="image/*"
								className="hidden"
								id={`thumbnail-upload-${record.Id}`}
								onChange={(e) => {
									const file = e.target.files[0];
									if (file) {
										dispatch(
											uploadDiscountThumbnail({
												discountId: record.Id,
												imageFile: file,
											})
										)
											.unwrap()
											.then(() => {
												message.success('Tải ảnh bìa lên thành công!');
												dispatch(fetchDiscounts());
											})
											.catch((error) => {
												message.error(
													error?.data?.title ||
														error?.detail ||
														'Tải lên thất bại!'
												);
											});
									}
								}}
							/>
							<Button
								type="text"
								className="text-white hover:text-blue-200"
								onClick={(e) => {
									// Prevent event propagation
									e.stopPropagation();

									// Use optional chaining and provide a fallback
									const fileInput = document.getElementById(
										`thumbnail-upload-${record.Id}`
									);
									if (fileInput) {
										fileInput.click();
									} else {
										message.error('Không thể tải ảnh. Vui lòng thử lại sau.');
									}
								}}
							>
								<EditFilled />
							</Button>
						</div>
						<Button
							type="link"
							size="small"
							className="text-xs"
							icon={<UploadOutlined />}
							onClick={(e) => {
								// Prevent event propagation
								e.stopPropagation();

								// Use optional chaining and provide a fallback
								const fileInput = document.getElementById(
									`thumbnail-upload-${record.Id}`
								);
								if (fileInput) {
									fileInput.click();
								} else {
									message.error('Không thể tải ảnh. Vui lòng thử lại.');
								}
							}}
						>
							Tải ảnh bìa
						</Button>
					</div>
				);
			},
		},
		{
			title: 'Tên',
			dataIndex: 'Name',
			key: 'name',
		},
		{
			title: 'Mã Giảm Giá',
			dataIndex: 'DiscountCode',
			key: 'discountCode',
		},
		{
			title: 'Bắt Đầu',
			dataIndex: 'StartDate',
			key: 'startDate',
			render: (text) => formatDate(text),
		},
		{
			title: 'Kết Thúc',
			dataIndex: 'EndDate',
			key: 'endDate',
			render: (text) => formatDate(text),
		},
		{
			title: 'Trạng Thái',
			dataIndex: 'Status',
			key: 'status',
			render: (text) => getTextForEnum('Status', text),
		},
		{
			title: 'Giá Trị Giảm',
			dataIndex: 'DiscountPercent',
			key: 'discountPercent',
			render: (text) => text + ' %',
		},
		{
			title: 'Promotion Details',
			key: 'promotionDetails',
			render: (_, record) => {
				const req = record.DiscountReq?.[0]; // Displaying only the first requirement
				return (
					<div>
						{req && (
							<div>
								<ul>
									{req.Name && <li>Tên Yêu Cầu: {req.Name}</li>}
									{req.Amount && <li>Amount: {req.Amount}</li>}
									{req.Operator && <li>Operator: {req.Operator}</li>}
									{req.DiamondRequirementSpec?.CaratFrom !== undefined &&
										req.DiamondRequirementSpec?.CaratTo !== undefined && (
											<li>
												Carat: {req.DiamondRequirementSpec.CaratFrom} -{' '}
												{req.DiamondRequirementSpec.CaratTo}
											</li>
										)}
									{req.DiamondRequirementSpec?.ClarityFrom &&
										req.DiamondRequirementSpec?.ClarityTo && (
											<li>
												Độ Tinh Khiết:{' '}
												{getTextForEnum(
													'Clarity',
													req.DiamondRequirementSpec.ClarityFrom
												)}{' '}
												-{' '}
												{getTextForEnum(
													'Clarity',
													req.DiamondRequirementSpec.ClarityTo
												)}
											</li>
										)}
									{req.DiamondRequirementSpec?.ColorFrom &&
										req.DiamondRequirementSpec?.ColorTo && (
											<li>
												Màu:{' '}
												{getTextForEnum(
													'Color',
													req.DiamondRequirementSpec.ColorFrom
												)}{' '}
												-{' '}
												{getTextForEnum(
													'Color',
													req.DiamondRequirementSpec.ColorTo
												)}
											</li>
										)}
									{req.DiamondRequirementSpec?.CutFrom &&
										req.DiamondRequirementSpec?.CutTo && (
											<li>
												Giác Cắt:{' '}
												{getTextForEnum(
													'Cut',
													req.DiamondRequirementSpec.CutFrom
												)}{' '}
												-{' '}
												{getTextForEnum(
													'Cut',
													req.DiamondRequirementSpec.CutTo
												)}
											</li>
										)}
									{req.DiamondRequirementSpec?.Origin && (
										<li>
											Nguồn Gốc:{' '}
											{getTextForEnum(
												'Origin',
												req.DiamondRequirementSpec.Origin
											)}
										</li>
									)}
									{req.DiamondRequirementSpec?.ShapesIDs?.length > 0 && (
										<li>
											Hình Dạng Kim Cương:{' '}
											{req.DiamondRequirementSpec.ShapesIDs.join(', ')}
										</li>
									)}
									{req.Model && (
										<li>
											Model:
											<ul>
												{req.Model.Id && <li>ID: {req.Model.Id}</li>}
												{req.Model.Name && <li>Tên: {req.Model.Name}</li>}
												{req.Model.ModelCode && (
													<li>Mã Model: {req.Model.ModelCode}</li>
												)}
												{req.Model.CraftmanFee && (
													<li>Phí Thợ: {req.Model.CraftmanFee}</li>
												)}
											</ul>
										</li>
									)}
									{req.Model?.Category && (
										<li>
											Category:
											<ul>
												{req.Model.Category.Id && (
													<li>ID: {req.Model.Category.Id}</li>
												)}
												{req.Model.Category.Name && (
													<li>Tên: {req.Model.Category.Name}</li>
												)}
												{req.Model.Category.Description && (
													<li>Mô Tả: {req.Model.Category.Description}</li>
												)}
												{req.Model.Category?.Thumbnail?.MediaPath && (
													<img
														src={req.Model.Category.Thumbnail.MediaPath}
														alt="Category Thumbnail"
													/>
												)}
											</ul>
										</li>
									)}
								</ul>
							</div>
						)}
					</div>
				);
			},
		},

		{
			title: '',
			key: 'action',
			render: (_, record) => {
				const status = record.Status;
				const isActive = status === 1 || status === 3; // Active status
				const canPause = status === 2; // Pause status
				const canContinue = status === 3; // Allow continuing for status 3

				const canCancel = status === 1 || status === 3; // Cancel status
				const canDelete = status === 5 || status === 4; // Delete status

				return (
					<Space size="middle">
						{/* Edit Button */}
						<Tooltip title="Sửa">
							<Button type="link" onClick={() => handleEdit(record)}>
								<EditFilled />
							</Button>
						</Tooltip>

						{/* Pause Button (only if Status is 2) */}
						{/* Pause Button (only if Status is 2) */}
						{(canPause || canContinue) && (
							<Popconfirm
								title={
									canPause
										? 'Bạn có chắc tạm ngưng khuyến mãi này không?'
										: 'Bạn có chắc tiếp tục khuyến mãi này không?'
								}
								onConfirm={() => handlePause(record.Id)}
							>
								<Tooltip
									title={
										canPause ? 'Tạm Ngưng Khuyến Mãi' : 'Tiếp Tục Khuyến Mãi'
									}
								>
									<Button type="link" danger={canPause}>
										{canPause ? <PauseOutlined /> : <PlayCircleOutlined />}
									</Button>
								</Tooltip>
							</Popconfirm>
						)}

						{/* Cancel Button (only if Status is 1 or 3) */}
						{canCancel && (
							<Popconfirm
								title="Bạn có chắc hủy khuyến mãi này không?"
								onConfirm={() => handleCancel(record.Id)}
							>
								<Tooltip title="Hủy Khuyến Mãi">
									<Button type="link" danger>
										<CloseOutlined />
									</Button>
								</Tooltip>
							</Popconfirm>
						)}

						{/* Delete Button (only if Status is 5 or 4) */}
						{canDelete && (
							<Popconfirm
								title="Xác Nhận Xóa?"
								onConfirm={() => handleDelete(record.Id)}
							>
								<Tooltip title="Xóa">
									<Button type="link" danger>
										<DeleteFilled />
									</Button>
								</Tooltip>
							</Popconfirm>
						)}
					</Space>
				);
			},
		},
	];

	return (
		<div className="p-8 bg-white shadow-md rounded-lg">
			<h2 className="text-2xl font-bold mb-6">
				{isEditing ? 'Edit Discount' : 'Create New Discount'}
			</h2>
			<DiscountForm
				isEditing={isEditing}
				handleCancelEdit={handleCancelEdit}
				handleUpdate={handleUpdate}
				handleCreateDiscount={handleCreateDiscount}
				handleCancel={handleCancel}
				form={form}
				targetTypes={targetTypes}
				addRequirement={addRequirement}
				handleTargetTypeChange={handleTargetTypeChange}
				shapes={shapes}
				giftType={giftType}
				currentEditingIndex={currentEditingIndex}
				removeRequirement={removeRequirement} // Passing the function as a prop
			/>

			{/* Display List of Discounts */}
			<h2 className="text-2xl font-semibold mt-10 mb-6">Discount List</h2>
			<Table
				columns={columns}
				dataSource={discounts}
				loading={loading}
				rowKey="id"
				className="hover:bg-gray-100"
			/>
		</div>
	);
};

export default DiscountPage;
