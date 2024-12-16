import {
	CloseOutlined,
	DeleteFilled,
	EditFilled,
	PlayCircleOutlined,
	PauseOutlined,
	UploadOutlined,
	PictureOutlined,
	TagOutlined,
	DollarOutlined,
	NumberOutlined,
	SketchOutlined,
} from '@ant-design/icons';
import {Button, Form, message, Popconfirm, Space, Table, Tooltip} from 'antd';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getAllShapeSelector} from '../../../redux/selectors';
import {
	cancelPromotion,
	createFullPromotion,
	deletePromotion,
	fetchPromotions,
	fetchPromotionDetail,
	updatePromotion,
	pausePromotion,
	uploadPromotionThumbnail,
} from '../../../redux/slices/promotionSlice';
import {enumMappings} from '../../../utils/constant';
import PromotionForm from './PromotionForm/PromotionForm';

const PromotionPage = ({promotionData}) => {
	const shapes = useSelector(getAllShapeSelector);
	const dispatch = useDispatch();
	const promotions = useSelector((state) => state.promotionSlice.promotions);
	const loading = useSelector((state) => state.promotionSlice.loading);

	const [form] = Form.useForm();
	const [setPromotions] = useState([]);
	const [editingKey, setEditingKey] = useState('');
	const [editingPromotionId, setEditingPromotionId] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [targetTypes, setTargetTypes] = useState({});
	const [giftType, setGiftType] = useState({});
	const [currentEditingIndex, setCurrentEditingIndex] = useState(null);
	const [removedRequirements, setRemovedRequirements] = useState([]);
	const [removedGifts, setRemovedGifts] = useState([]);

	const [originalPromotionData, setOriginalPromotionData] = useState(null);

	useEffect(() => {
		dispatch(fetchPromotions());
	}, [dispatch]);

	const formatDate = (date) =>
		date ? moment(date, 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY HH:mm') : 'N/A';

	useEffect(() => {
		if (promotionData) {
			if (promotionData.requirements) {
				const initialTargetTypes = {};
				promotionData.requirements.forEach((req, index) => {
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
	const removeRequirement = (requirementId) => {
		if (!requirementId) return;
		setRemovedRequirements((prev) => [...prev, requirementId]);
		const updatedRequirements = form
			.getFieldValue('requirements')
			.filter((req) => req.id !== requirementId);

		form.setFieldsValue({requirements: updatedRequirements});
	};

	const removeGift = (giftId) => {
		if (!giftId) return;
		setRemovedGifts((prev) => [...prev, giftId]);
		const updatedGifts = form.getFieldValue('gifts').filter((gift) => gift.id !== giftId);

		form.setFieldsValue({gifts: updatedGifts});
	};

	const handleCreatePromotion = (values) => {
		const {
			name,
			description,
			redemptionMode,
			isExcludeQualifierProduct,
			promoCode,
			priority,
			requirements,
			gifts,
		} = values;
		const [startDateTime, endDateTime] = values.validDate;

		// Xóa trường type khỏi từng đối tượng trong gifts
		const updatedGifts = gifts.map((gift) => {
			const {type, ...rest} = gift; // Sử dụng destructuring để lấy phần còn lại
			return rest; // Trả về đối tượng mà không có trường type
		});

		// Create a new promotion object with formatted dates
		const newPromotion = {
			...values,
			key: promotions.length, // Assuming promotions is defined elsewhere
			startDateTime: startDateTime.format('DD-MM-YYYY HH:mm:ss'),
			endDateTime: endDateTime.format('DD-MM-YYYY HH:mm:ss'),
			gifts: updatedGifts, // Sử dụng updatedGifts đã được loại bỏ trường type
		};

		// Constructing the command for creating the promotion
		const createPromotionCommand = {
			startDateTime: startDateTime.format('DD-MM-YYYY HH:mm:ss'),
			endDateTime: endDateTime.format('DD-MM-YYYY HH:mm:ss'),
			name: name,
			description: description,
			promoCode: promoCode,
			redemptionMode: redemptionMode,
			isExcludeQualifierProduct: isExcludeQualifierProduct,
			priority: priority,
		};

		dispatch(createFullPromotion({createPromotionCommand, requirements, gifts: updatedGifts}))
			.unwrap()
			.then(() => {
				message.success('Tạo khuyến mãi thành công!');
				form.resetFields();
			})
			.catch((error) => {
				message.error(error?.data?.detail || error?.detail || 'Lỗi không xác định');
			});

		// setIsEditing(false);
	};

	const getTextForEnum = (enumType, value) => {
		return enumMappings[enumType]?.[value] || ' ';
	};
	const handleEdit = async (promotion, index) => {
		const promotionId = promotion.Id;
		setEditingPromotionId(promotion.Id);
		setIsEditing(true);
		setCurrentEditingIndex(index);

		await dispatch(fetchPromotionDetail(promotionId))
			.unwrap()
			.then((res) => {
				const fetchedPromotion = res;
				const startDate = fetchedPromotion.StartDate
					? moment(fetchedPromotion.StartDate, 'DD-MM-YYYY HH:mm:ss')
					: null;
				const endDate = fetchedPromotion.EndDate
					? moment(fetchedPromotion.EndDate, 'DD-MM-YYYY HH:mm:ss')
					: null;

				setOriginalPromotionData({
					...fetchedPromotion,
					StartDate: startDate,
					EndDate: endDate,
				});

				form.setFieldsValue({
					name: fetchedPromotion.Name,
					promoCode: fetchedPromotion.PromoCode,
					description: fetchedPromotion.Description,
					validDate: [startDate, endDate],
					isActive: fetchedPromotion.IsActive,
					priority: fetchedPromotion.Priority || 1,
					status: fetchedPromotion.Status || 2,
					isExcludeQualifierProduct: fetchedPromotion.IsExcludeQualifierProduct || false,
					redemptionMode: fetchedPromotion.RedemptionMode || 1,
					thumbnail: fetchedPromotion.Thumbnail,

					requirements: fetchedPromotion.PromoReqs.map((req) => {
						const diamondSpec = req.DiamondRequirementSpec || {};

						console.log('Requirement Diamond Spec:', diamondSpec); // Debugging log

						return {
							id: req.Id,
							name: req.Name,
							targetType: req.TargetType,
							operator: req.Operator,
							quantity: req.Quantity || 0,
							moneyAmount: req.Amount || 0,
							jewelryModelId: req.JewelryModelId,
							jewelryModelName: req?.Model?.Name,

							promotionId: req.PromotionId,
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
					gifts: fetchedPromotion.Gifts.map((gift) => {
						const diamondSpec = gift.DiamondRequirementSpec || {};

						console.log('Gift Diamond Spec:', diamondSpec); // Debugging log

						return {
							id: gift.Id,
							name: gift.Name,
							targetType: gift.TargetType,
							unitType: gift.UnitType,
							unitValue: gift.UnitValue || 0,
							maxAmount: gift.MaxAmout || 0,
							amount: gift.Amount || 0,
							itemCode: gift.ItemCode || '',
							promotionId: gift.PromotionId,

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
								shapesIDs: gift.DiamondRequirementSpec?.ShapesIDs || [],
							},
						};
					}),
				});
			})
			.catch((error) => {
				message.error(error?.data?.detail || error?.detail || 'Lỗi không xác định');
			});
	};

	const handleCancel = async (id) => {
		await dispatch(cancelPromotion(id))
			.unwrap()
			.then(() => {
				message.success(`Khuyến mãi có id: ${id} đã bị hủy.`);
			})
			.catch((error) => {
				message.error(error?.data?.detail || error?.detail || 'Lỗi không xác định');
			});
		await dispatch(fetchPromotions());
	};
	const handlePause = async (id) => {
		try {
			await dispatch(pausePromotion(id)).unwrap();
			message.success(`Khuyến mãi có id: ${id} đã được tạm dừng.`);
			await dispatch(fetchPromotions());
		} catch (error) {
			message.error(error?.data?.detail || error?.detail || 'Lỗi không xác định');
		}
	};
	const handleContinue = async (id) => {
		try {
			await dispatch(pausePromotion(id)).unwrap();
			message.success(`Khuyến mãi có id: ${id} đã được tiếp tục.`);
			await dispatch(fetchPromotions());
		} catch (error) {
			message.error(error?.data?.detail || error?.detail || 'Lỗi không xác định');
		}
	};
	const handleStart = async (id) => {
		try {
			await dispatch(pausePromotion(id)).unwrap();
			message.success(`Khuyến mãi có id: ${id} đã được bắt đầu.`);
			await dispatch(fetchPromotions());
		} catch (error) {
			message.error(error?.data?.detail || error?.detail || 'Lỗi không xác định');
		}
	};
	const handleUpdate = async () => {
		// Validate the form fields
		const row = await form.validateFields();
		const formattedStartDate = row.validDate?.[0]?.format('DD-MM-YYYY HH:mm:ss');
		const formattedEndDate = row.validDate?.[1]?.format('DD-MM-YYYY HH:mm:ss');

		if (!editingPromotionId) {
			message.error('No promotion selected for editing.');
			return;
		}

		const isEqual = (val1, val2) => {
			// Handle moment objects
			if (moment.isMoment(val1) && moment.isMoment(val2)) {
				return val1.isSame(val2);
			}

			// Handle arrays
			if (Array.isArray(val1) && Array.isArray(val2)) {
				if (val1.length !== val2.length) return false;
				return val1.every((item, index) => isEqual(item, val2[index]));
			}

			// Handle objects
			if (
				typeof val1 === 'object' &&
				typeof val2 === 'object' &&
				val1 !== null &&
				val2 !== null
			) {
				const keys1 = Object.keys(val1);
				const keys2 = Object.keys(val2);
				if (keys1.length !== keys2.length) return false;
				return keys1.every((key) => isEqual(val1[key], val2[key]));
			}

			// Simple value comparison
			return val1 === val2;
		};

		// Find changed fields
		const changedFields = {};
		const originalData = originalPromotionData || {};
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

		// Filter out existing requirements and gifts with IDs
		const filteredRequirements = (row.requirements || []).filter((req) => !req.id);
		const filteredGifts = (row.gifts || []).filter((gift) => !gift.id);

		// Clean the row data and include only new requirements and gifts
		const cleanedRow = removeEmptyFields({
			...row,
			requirements: filteredRequirements,
			gifts: filteredGifts,
		});

		// Check main promotion fields
		const mainFields = [
			'name',
			'promoCode',
			'description',
			'redemptionMode',
			'isExcludeQualifierProduct',
			'priority',
			'status',
		];

		mainFields.forEach((field) => {
			if (!isEqual(row[field], originalData[field])) {
				changedFields[field] = row[field];
			}
		});

		// Check date range
		if (
			!isEqual(row.validDate?.[0], originalData.StartDate) ||
			!isEqual(row.validDate?.[1], originalData.EndDate)
		) {
			changedFields.validDate = [row.validDate?.[0], row.validDate?.[1]];
		}

		// Process requirements
		const changedRequirements = (row.requirements || [])
			.filter((req) => !req.id) // Only new requirements
			.map((req) => {
				// Remove any undefined or null fields
				const cleanedReq = Object.fromEntries(
					Object.entries(req).filter(([_, v]) => v != null)
				);
				return cleanedReq;
			});

		// Process gifts
		const changedGifts = (row.gifts || [])
			.filter((gift) => !gift.id) // Only new gifts
			.map((gift) => {
				// Remove any undefined or null fields
				const cleanedGift = Object.fromEntries(
					Object.entries(gift).filter(([_, v]) => v != null)
				);
				return cleanedGift;
			});

		// Construct the final promotion data
		const promotionData = {
			...(row.name !== originalPromotionData.Name && {name: row.name}),
			...(row.promoCode !== originalPromotionData.PromoCode && {promoCode: row.promoCode}),
			...(row.description !== originalPromotionData.Description && {
				description: row.description,
			}),
			...(row.redemptionMode !== originalPromotionData.RedemptionMode && {
				redemptionMode: row.redemptionMode,
			}),
			...(row.isExcludeQualifierProduct !==
				originalPromotionData.IsExcludeQualifierProduct && {
				isExcludeQualifierProduct: row.isExcludeQualifierProduct,
			}),
			...(row.priority !== originalPromotionData.Priority && {priority: row.priority}),
			// Status is completely removed from this object
		};

		// Only include date range if it's different
		if (
			!moment(row.validDate[0]).isSame(originalPromotionData.StartDate) ||
			!moment(row.validDate[1]).isSame(originalPromotionData.EndDate)
		) {
			promotionData.updateStartEndDate = {
				startDate: formattedStartDate,
				endDate: formattedEndDate,
			};
		}
		// Process new requirements (only those without existing ID)
		const newRequirements = (row.requirements || [])
			.filter((req) => !req.id)
			.map((req) => {
				// Remove any undefined or null fields
				const cleanedReq = Object.fromEntries(
					Object.entries(req).filter(([_, v]) => v != null)
				);
				return cleanedReq;
			});

		// Process new gifts (only those without existing ID)
		const newGifts = (row.gifts || [])
			.filter((gift) => !gift.id)
			.map((gift) => {
				const cleanedGift = Object.fromEntries(
					Object.entries(gift).filter(([_, v]) => v != null)
				);
				return cleanedGift;
			});

		// Add new requirements and gifts if they exist
		if (newRequirements.length > 0) {
			promotionData.requirements = newRequirements;
		}
		if (newGifts.length > 0) {
			promotionData.gifts = newGifts;
		}

		// Include removed requirements and gifts
		if (removedRequirements.length > 0) {
			promotionData.removedRequirements = removedRequirements;
		}
		if (removedGifts.length > 0) {
			promotionData.removedGifts = removedGifts;
		}
		console.log('Updating promotion with changed data:', promotionData);
		console.log('Updating promotion with ID:', editingPromotionId); // Debugging log
		console.log('Filtered Promotion Data:', promotionData);
		// Dispatch the update action
		await dispatch(updatePromotion({promotionId: editingPromotionId, promotionData}))
			.unwrap()
			.then(() => {
				message.success('Cập nhật khuyến mãi thành công!');
				setIsEditing(false);
				setEditingKey('');
				setEditingPromotionId(null);
				form.resetFields();
			})
			.catch((error) => {
				message.error(error?.data?.detail || error?.detail || 'Lỗi không xác định');
			});
		await dispatch(fetchPromotions());
	};

	const handleDelete = async (id) => {
		await dispatch(deletePromotion(id))
			.unwrap()
			.then(() => {
				message.success(`Đã xóa khuyến mãi có id: ${id}`);
			})
			.catch((error) => {
				message.error(error?.data?.detail || error?.detail);
			});
		await dispatch(fetchPromotions());
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
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
	const addGift = (type) => {
		const currentGifts = form.getFieldValue('gifts') || []; // Use 'gifts' instead of 'gift'
		form.setFieldsValue({
			gifts: [...currentGifts, {type}], // Update to 'gifts'
		});
	};

	// Table columns definition for displaying promotions
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
													uploadPromotionThumbnail({
														promotionId: record.Id,
														imageFile: file,
													})
												)
													.unwrap()
													.then(() => {
														message.success(
															'Tải ảnh bìa lên thành công!'
														);
														dispatch(fetchPromotions());
													})
													.catch((error) => {
														message.error(
															error?.data?.detail ||
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
											uploadPromotionThumbnail({
												promotionId: record.Id,
												imageFile: file,
											})
										)
											.unwrap()
											.then(() => {
												message.success('Tải ảnh bìa lên thành công!');
												dispatch(fetchPromotions());
											})
											.catch((error) => {
												message.error(
													error?.data?.detail ||
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
			title: 'Khuyến Mãi',
			dataIndex: 'Name',
			key: 'name',
		},
		{
			title: 'Mã Khuyến Mãi',
			dataIndex: 'PromoCode',
			key: 'promoCode',
		},
		{
			title: 'Mô Tả',
			dataIndex: 'Description',
			key: 'description',
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
			title: 'Yêu Cầu',
			key: 'requirements',
			render: (_, record) => {
				const requirements = record.PromoReqs || [];

				if (requirements.length === 0)
					return <div className="text-sm text-gray-500 italic">Không có yêu cầu</div>;

				return (
					<div className="space-y-2">
						{requirements.map((req, index) => (
							<div
								key={index}
								className="bg-gray-50 rounded-lg p-3 shadow-sm transition-all hover:shadow-md"
							>
								<div className="flex flex-col items-center mb-2">
									<h4 className="font-bold text-sm text-gray-800">
										{req.Name || 'Yêu Cầu Không Xác Định'}
									</h4>
									<span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
										{getTextForEnum('TargetType', req.TargetType)}
									</span>
								</div>

								<div className="grid grid-cols-1 gap-2 text-xs text-gray-700">
									{req.Quantity !== null && req.Quantity !== undefined && (
										<div className="flex items-center">
											<span className="mr-2 font-semibold">Số Lượng:</span>
											{req.Quantity}
										</div>
									)}

									{req.Amount !== null && req.Amount !== undefined && (
										<div className="flex items-center">
											<span className="mr-2 font-semibold">Số Tiền:</span>
											{req.Amount.toLocaleString()} VNĐ
										</div>
									)}

									{req.JewelryModelId && (
										<div className="flex items-center">
											<span className="mr-2 font-semibold">
												ID Trang Sức:
											</span>
											{req.JewelryModelId}
										</div>
									)}
								</div>

								{req.Model && (
									<div className="mt-2 text-xs text-gray-600 bg-white border border-gray-100 rounded p-2">
										<div className="font-semibold mb-1">
											Chi Tiết Trang Sức:
										</div>
										<div className="space-y-1">
											{req.Model.Name && (
												<div>
													<span className="font-medium">Tên:</span>{' '}
													{req.Model.Name}
												</div>
											)}
											{req.Model.ModelCode && (
												<div>
													<span className="font-medium">Mã:</span>{' '}
													{req.Model.ModelCode}
												</div>
											)}
										</div>
									</div>
								)}

								{req.DiamondRequirementSpec && (
									<div className="mt-2 text-xs text-gray-600 bg-white border border-gray-100 rounded p-2">
										<div className="font-semibold mb-1">Yêu Cầu Kim Cương:</div>
										<div className="grid grid-cols-1 gap-1">
											{req.DiamondRequirementSpec.Origin && (
												<div>
													<span className="font-medium">Nguồn Gốc:</span>{' '}
													{getTextForEnum(
														'Origin',
														req.DiamondRequirementSpec.Origin
													)}
												</div>
											)}
											{(req.DiamondRequirementSpec.CaratFrom ||
												req.DiamondRequirementSpec.CaratTo) && (
												<div>
													<span className="font-medium">Carat:</span>{' '}
													{req.DiamondRequirementSpec.CaratFrom}-
													{req.DiamondRequirementSpec.CaratTo}
												</div>
											)}
											{req.DiamondRequirementSpec.ClarityFrom &&
												req.DiamondRequirementSpec.ClarityTo && (
													<div>
														<span className="font-medium">
															Độ Tinh Khiết:
														</span>{' '}
														{getTextForEnum(
															'Clarity',
															req.DiamondRequirementSpec.ClarityFrom
														)}
														-
														{getTextForEnum(
															'Clarity',
															req.DiamondRequirementSpec.ClarityTo
														)}
													</div>
												)}
											{req.DiamondRequirementSpec.CutFrom &&
												req.DiamondRequirementSpec.CutTo && (
													<div>
														<span className="font-medium">
															Giác Cắt:
														</span>{' '}
														{getTextForEnum(
															'Cut',
															req.DiamondRequirementSpec.CutFrom
														)}
														-
														{getTextForEnum(
															'Cut',
															req.DiamondRequirementSpec.CutTo
														)}
													</div>
												)}
											{req.DiamondRequirementSpec.ColorFrom &&
												req.DiamondRequirementSpec.ColorTo && (
													<div>
														<span className="font-medium">Màu:</span>{' '}
														{getTextForEnum(
															'Color',
															req.DiamondRequirementSpec.ColorFrom
														)}
														-
														{getTextForEnum(
															'Color',
															req.DiamondRequirementSpec.ColorTo
														)}
													</div>
												)}
										</div>
									</div>
								)}
							</div>
						))}
					</div>
				);
			},
		},
		{
			title: 'Quà',
			key: 'gifts',
			render: (_, record) => {
				const gifts = record.Gifts || [];

				if (gifts.length === 0)
					return (
						<div className="text-sm text-gray-500 italic flex items-center justify-center">
							<GiftOutlined className="mr-2 text-gray-400" />
							Không có quà
						</div>
					);

				return (
					<div className="space-y-2">
						{gifts.map((gift, index) => (
							<div
								key={index}
								className=" shadow-sm hover:shadow-md transition-all duration-300"
							>
								<div className="flex flex-col items-center mb-2">
									<h4 className="font-bold text-sm text-blue-800">
										{gift.Name || 'Quà Không Xác Định'}
									</h4>
									<span className="text-xs text-blue-600 bg-white rounded-full ">
										{getTextForEnum('TargetType', gift.TargetType) || 'N/A'}
									</span>
								</div>

								<div className="grid grid-cols-1 gap-2 text-xs text-gray-700">
									<div className="flex items-center">
										<TagOutlined className="mr-2 text-blue-500" />
										<span className="font-semibold mr-1">Loại Giảm:</span>
										{getTextForEnum('UnitType', gift.UnitType) || 'N/A'}
									</div>

									{gift.UnitValue !== null && gift.UnitValue !== undefined && (
										<div className="flex items-center">
											<DollarOutlined className="mr-2 text-green-500" />
											<span className="font-semibold mr-1">Giá Trị:</span>
											{gift.UnitValue}
										</div>
									)}

									{gift.Amount !== null && gift.Amount !== undefined && (
										<div className="flex items-center">
											<NumberOutlined className="mr-2 text-purple-500" />
											<span className="font-semibold mr-1">Số Lượng:</span>
											{gift.Amount.toLocaleString()}
										</div>
									)}
								</div>

								{gift.DiamondRequirementSpec && (
									<div className="mt-2 bg-white border border-gray-100 rounded p-2 text-xs">
										<div className="font-semibold mb-1 text-blue-700 flex items-center">
											<SketchOutlined className="mr-2" />
											Chi Tiết Kim Cương
										</div>
										<div className="grid grid-cols-1 gap-1 text-gray-600">
											{gift.DiamondRequirementSpec.Origin && (
												<div>
													<span className="font-medium">Nguồn:</span>{' '}
													{getTextForEnum(
														'Origin',
														gift.DiamondRequirementSpec.Origin
													)}
												</div>
											)}
											{(gift.DiamondRequirementSpec.CaratFrom ||
												gift.DiamondRequirementSpec.CaratTo) && (
												<div>
													<span className="font-medium">Carat:</span>{' '}
													{gift.DiamondRequirementSpec.CaratFrom}-
													{gift.DiamondRequirementSpec.CaratTo}
												</div>
											)}
											{gift.DiamondRequirementSpec.ClarityFrom &&
												gift.DiamondRequirementSpec.ClarityTo && (
													<div>
														<span className="font-medium">
															Độ Tinh:
														</span>{' '}
														{getTextForEnum(
															'Clarity',
															gift.DiamondRequirementSpec.ClarityFrom
														)}
														-
														{getTextForEnum(
															'Clarity',
															gift.DiamondRequirementSpec.ClarityTo
														)}
													</div>
												)}
											{gift.DiamondRequirementSpec.CutFrom &&
												gift.DiamondRequirementSpec.CutTo && (
													<div>
														<span className="font-medium">
															Giác Cắt:
														</span>{' '}
														{getTextForEnum(
															'Cut',
															gift.DiamondRequirementSpec.CutFrom
														)}
														-
														{getTextForEnum(
															'Cut',
															gift.DiamondRequirementSpec.CutTo
														)}
													</div>
												)}
											{gift.DiamondRequirementSpec.ColorFrom &&
												gift.DiamondRequirementSpec.ColorTo && (
													<div>
														<span className="font-medium">Màu:</span>{' '}
														{getTextForEnum(
															'Color',
															gift.DiamondRequirementSpec.ColorFrom
														)}
														-
														{getTextForEnum(
															'Color',
															gift.DiamondRequirementSpec.ColorTo
														)}
													</div>
												)}
										</div>
									</div>
								)}
							</div>
						))}
					</div>
				);
			},
		},
		{
			title: '',
			key: 'action',
			render: (_, record) => {
				const status = record.Status;
				const canEdit = status === 1 || status === 2; // Scheduled or Active
				const canPause = status === 2; // Only Active can be paused
				const canStart = status === 1; // Only Scheduled can be started
				const canContinue = status === 3; // Only Paused can be continued
				const canCancel = status === 1 || status === 3; // Scheduled and Paused can be cancelled
				const canDelete = status === 4 || status === 5; // Expired or Cancelled can be deleted

				return (
					<Space size="middle">
						{/* Edit Button (only for Scheduled or Active) */}
						{canEdit && (
							<Tooltip title="Sửa">
								<Button type="link" onClick={() => handleEdit(record)}>
									<EditFilled />
								</Button>
							</Tooltip>
						)}

						{/* Start Button (for Scheduled promotions) */}
						{canStart && (
							<Popconfirm
								title="Bạn có chắc bắt đầu khuyến mãi này không?"
								onConfirm={() => handleStart(record.Id)}
							>
								<Tooltip title="Bắt Đầu Khuyến Mãi">
									<Button type="link">
										<PlayCircleOutlined />
									</Button>
								</Tooltip>
							</Popconfirm>
						)}

						{/* Pause Button (for Active promotions) */}
						{canPause && (
							<Popconfirm
								title="Bạn có chắc tạm ngưng khuyến mãi này không?"
								onConfirm={() => handlePause(record.Id)}
							>
								<Tooltip title="Tạm Ngưng Khuyến Mãi">
									<Button type="link" danger>
										<PauseOutlined />
									</Button>
								</Tooltip>
							</Popconfirm>
						)}

						{/* Continue Button (for Paused promotions) */}
						{canContinue && (
							<Popconfirm
								title="Bạn có chắc tiếp tục khuyến mãi này không?"
								onConfirm={() => handleContinue(record.Id)}
							>
								<Tooltip title="Tiếp Tục Khuyến Mãi">
									<Button type="link">
										<PlayCircleOutlined />
									</Button>
								</Tooltip>
							</Popconfirm>
						)}

						{/* Cancel Button (for Scheduled or Active promotions) */}
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

						{/* Delete Button (for Expired or Cancelled promotions) */}
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
				{isEditing ? 'Cập Nhật Khuyến Mãi' : 'Tạo Khuyến Mãi Mới'}
			</h2>{' '}
			{/* <PromoForm /> */}
			<PromotionForm
				isEditing={isEditing}
				handleCancelEdit={handleCancelEdit}
				handleUpdate={handleUpdate}
				handleCreatePromotion={handleCreatePromotion}
				handleCancel={handleCancel}
				form={form}
				targetTypes={targetTypes}
				addRequirement={addRequirement}
				addGift={addGift}
				handleTargetTypeChange={handleTargetTypeChange}
				shapes={shapes}
				giftType={giftType}
				currentEditingIndex={currentEditingIndex}
				removeRequirement={removeRequirement}
				removeGift={removeGift}
			/>
			<h2 className="text-2xl font-semibold mt-10 mb-6">Danh Sách Khuyến Mãi</h2>
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
