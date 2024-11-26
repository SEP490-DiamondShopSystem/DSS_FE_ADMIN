import {CloseOutlined, DeleteFilled, EditFilled, PauseOutlined} from '@ant-design/icons';
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
				message.success('Promotion created successfully!');
				form.resetFields();
			})
			.catch((error) => {
				message.error(error?.data?.title || error?.detail);
			});

		// setIsEditing(false);
	};

	const getTextForEnum = (enumType, value) => {
		return enumMappings[enumType]?.[value] || ' ';
	};
	const handleEdit = (promotion, index) => {
		const promotionId = promotion.Id;
		setEditingPromotionId(promotion.Id);
		setIsEditing(true);
		setCurrentEditingIndex(index);

		dispatch(fetchPromotionDetail(promotionId))
			.unwrap()
			.then((res) => {
				const fetchedPromotion = res;
				const startDate = fetchedPromotion.StartDate
					? moment(fetchedPromotion.StartDate, 'DD-MM-YYYY HH:mm:ss')
					: null;
				const endDate = fetchedPromotion.EndDate
					? moment(fetchedPromotion.EndDate, 'DD-MM-YYYY HH:mm:ss')
					: null;

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
							amount: gift.Amount || 0,
							itemId: gift.ItemId || '',
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
				message.error(error?.data?.title || error?.detail);
			});
	};

	const handleCancel = async (id) => {
		await dispatch(cancelPromotion(id))
			.unwrap()
			.then(() => {
				message.success(`Promotion with id: ${id} has been canceled.`);
			})
			.catch((error) => {
				message.error(error?.data?.title || error?.detail);
			});
	};
	const handlePause = async (id) => {
		await dispatch(pausePromotion(id))
			.unwrap()
			.then(() => {
				message.success(`Promotion with id: ${id} has been paused.`);
			})
			.catch((error) => {
				message.error(error?.data?.title || error?.detail);
			});
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

		// Construct the final promotion data
		const promotionData = {
			...cleanedRow,
			updateStartEndDate: {startDate: formattedStartDate, endDate: formattedEndDate},
			...(removedRequirements.length > 0 && {removedRequirements}), // Include only if not empty
			...(removedGifts.length > 0 && {removedGifts}), // Include only if not empty
		};

		console.log('Updating promotion with ID:', editingPromotionId); // Debugging log
		console.log('Filtered Promotion Data:', promotionData);

		// Dispatch the update action
		await dispatch(updatePromotion({promotionId: editingPromotionId, promotionData}))
			.unwrap()
			.then(() => {
				message.success('Promotion updated successfully!');
			})
			.catch((error) => {
				message.error(error?.data?.title || error?.detail);
			});
		setIsEditing(false);
		setEditingKey('');
		setEditingPromotionId(null); // Reset editing ID
		form.resetFields(); // Clear all fields
		await dispatch(fetchPromotions());
	};

	const handleDelete = (id) => {
		dispatch(deletePromotion(id))
			.unwrap()
			.then(() => {
				message.success(`Deleted promotion with id: ${id}`);
			})
			.catch((error) => {
				message.error(error?.data?.title || error?.detail);
			});
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
			title: 'Priority',
			dataIndex: 'Priority',
			key: 'priority',
		},
		{
			title: 'Số Tiền',
			dataIndex: 'moneyAmount',
			key: 'moneyAmount',
		},
		{
			title: 'Yêu Cầu',
			key: 'requirements',
			render: (_, record) =>
				record.PromoReqs?.map((req, index) => (
					<div key={index}>
						<span>{req.Name}</span> - Số Lượng: {req.Quantity}
					</div>
				)) || 'No Requirements',
		},
		{
			title: 'Quà',
			key: 'gifts',
			render: (_, record) =>
				record.Gifts?.map((gift, index) => (
					<div key={index}>
						<span>{gift.Name}</span> - Carat Từ: {gift.CaratFrom}, Carat đến:{' '}
						{gift.CaratTo}
					</div>
				)) || 'No Gifts',
		},
		{
			title: '',
			key: 'action',
			render: (_, record) => {
				const status = record.Status;
				const isActive = status === 1 || status === 3; // Active status
				const canPause = status === 2; // Pause status
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
				{isEditing ? 'Edit Promotion' : 'Create New Promotion'}
			</h2>
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

			{/* <PromoForm /> */}

			{/* Display List of Promotions */}
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
