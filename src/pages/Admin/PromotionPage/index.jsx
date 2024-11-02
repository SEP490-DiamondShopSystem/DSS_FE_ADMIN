import {CloseOutlined, DeleteFilled, EditFilled} from '@ant-design/icons';
import {Button, Form, message, Popconfirm, Space, Table, Tooltip} from 'antd';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getAllShapeSelector} from '../../../redux/selectors';
import {getDiamondShape} from '../../../redux/slices/diamondSlice';
import {
	cancelPromotion,
	createFullPromotion,
	deletePromotion,
	fetchPromotions,
	updatePromotion,
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

	console.log('shapes', shapes);

	useEffect(() => {
		dispatch(fetchPromotions());
	}, [dispatch]);
	useEffect(() => {
		dispatch(getDiamondShape());
	}, [dispatch]);

	const formatDate = (date) =>
		date ? moment(date, 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY HH:mm') : 'N/A';

	useEffect(() => {
		if (promotionData) {
			if (promotionData.require) {
				const initialTargetTypes = {};
				promotionData.require.forEach((req, index) => {
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

	const handleCreatePromotion = (values) => {
		const {
			name,
			description,
			redemptionMode,
			isExcludeQualifierProduct,
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
			redemptionMode: redemptionMode,
			isExcludeQualifierProduct: isExcludeQualifierProduct,
			priority: priority,
		};

		dispatch(
			createFullPromotion({createPromotionCommand, requirements, gifts: updatedGifts})
		).then((res) => {
			if (res.payload !== undefined) {
				message.success('Promotion created successfully!');
				form.resetFields();
			}
		});

		// setIsEditing(false);
	};

	const getTextForEnum = (enumType, value) => {
		return enumMappings[enumType]?.[value] || 'Unknown';
	};
	const handleEdit = (promotion, index) => {
		handleTargetTypeChange();
		setEditingPromotionId(promotion.Id);
		setIsEditing(true);
		setCurrentEditingIndex(index);

		form.setFieldsValue({
			name: promotion.Name,
			description: promotion.Description,
			validDate: [
				moment(promotion.StartDate, 'DD-MM-YYYY HH:mm:ss'),
				moment(promotion.EndDate, 'DD-MM-YYYY HH:mm:ss'),
			],
			redemptionMode: promotion.RedemptionMode || 1,
			isExcludeQualifierProduct: promotion.IsExcludeQualifierProduct || false,
			priority: promotion.Priority || 1,
			thumbnail: promotion.thumbnail,

			// Nested requirements (PromoReqs)
			require: promotion.PromoReqs.map((req) => ({
				id: req.Id,
				name: req.Name,
				targetType: req.TargetType,
				operator: req.Operator,
				quantity: req.Quantity,
				amount: req.Amount,
				modelId: req.ModelId,
				origin: getTextForEnum('DiamondOrigin', req.DiamondOrigin), // Map origin to displayable text
				caratFrom: req.CaratFrom,
				caratTo: req.CaratTo,
				clarityFrom: getTextForEnum('Clarity', req.ClarityFrom), // Map clarity to displayable text
				clarityTo: getTextForEnum('Clarity', req.ClarityTo),
				cutFrom: getTextForEnum('Cut', req.CutFrom), // Map cut to displayable text
				cutTo: getTextForEnum('Cut', req.CutTo),
				colorFrom: getTextForEnum('Color', req.ColorFrom), // Map color to displayable text
				colorTo: getTextForEnum('Color', req.ColorTo),
				shapesIDs: req.PromoReqShapes,
				type: req.Type || 'diamond',
			})),

			// Nested gifts (Gifts)
			gifts: promotion.Gifts.map((gift) => ({
				id: gift.Id,
				name: gift.Name,
				targetType: gift.TargetType,
				unitType: gift.UnitType,
				unitValue: gift.UnitValue,
				amount: gift.Amount,
				itemId: gift.ItemId,
				shapesIDs: gift.DiamondGiftShapes,
				origin: getTextForEnum('DiamondOrigin', gift.DiamondOrigin),
				caratFrom: gift.CaratFrom,
				caratTo: gift.CaratTo,
				clarityFrom: getTextForEnum('Clarity', gift.ClarityFrom),
				clarityTo: getTextForEnum('Clarity', gift.ClarityTo),
				cutFrom: getTextForEnum('Cut', gift.CutFrom),
				cutTo: getTextForEnum('Cut', gift.CutTo),
				colorFrom: getTextForEnum('Color', gift.ColorFrom),
				colorTo: getTextForEnum('Color', gift.ColorTo),

				type: gift.Type || 'diamond',
			})),
		});
	};
	const handleCancel = async (id) => {
		try {
			await dispatch(cancelPromotion(id)); // Use your actual cancelPromotion logic
			message.success(`Promotion with id: ${id} has been canceled.`);
		} catch (error) {
			message.error('Failed to cancel the promotion. Please try again.');
		}
	};
	const handleUpdate = async () => {
		try {
			// Validate the form fields
			const row = await form.validateFields();

			// Format the valid date range
			const formattedDateRange = {
				startDate: row.validDate[0].format('DD-MM-YYYY'),
				endDate: row.validDate[1].format('DD-MM-YYYY'),
			};

			// Create updated promotion data
			const updatedPromotion = {
				...row,
				validDate: `${formattedDateRange.startDate} to ${formattedDateRange.endDate}`,
			};

			// Dispatch the update promotion action
			await dispatch(
				updatePromotion({id: editingKey, data: JSON.stringify(updatedPromotion)})
			);

			// Update local state with the new data for immediate UI feedback
			const newData = [...promotions];
			const index = newData.findIndex((item) => item.key === editingKey);
			if (index > -1) {
				const item = newData[index];
				newData.splice(index, 1, {...item, ...updatedPromotion});
				setPromotions(newData);
			}

			// Clear editing state and reset form
			setEditingKey('');
			setIsEditing(false);
			form.resetFields();
			message.success('Promotion updated successfully!');
		} catch (err) {
			// Handle errors
			message.error('Please correct the form errors.');
		}
	};

	const handleDelete = (id) => {
		dispatch(deletePromotion(id))
			.then(() => {
				message.success(`Deleted promotion with id: ${id}`);
			})
			.catch((error) => {
				message.error(`Failed to delete promotion: ${error.message}`);
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
		const currentRequirements = form.getFieldValue('require') || [];
		form.setFieldsValue({
			require: [...currentRequirements, {type}],
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
			dataIndex: 'IsActive',
			key: 'status',
			render: (isActive) => (isActive ? 'Active' : 'Inactive'),
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
						<span>{req.Name}</span> - Quantity: {req.Quantity}
					</div>
				)) || 'No Requirements',
		},
		{
			title: 'Quà',
			key: 'gifts',
			render: (_, record) =>
				record.Gifts?.map((gift, index) => (
					<div key={index}>
						<span>{gift.Name}</span> - Carat From: {gift.CaratFrom}, Carat To:{' '}
						{gift.CaratTo}
					</div>
				)) || 'No Gifts',
		},
		{
			title: '',
			key: 'action',
			render: (_, record, index) => (
				<Space size="middle">
					<Tooltip title="Sửa">
						<Button type="link" onClick={() => handleEdit(record, index)}>
							<EditFilled />
						</Button>
					</Tooltip>
					<Popconfirm title="Xác Nhận Xóa?" onConfirm={() => handleDelete(record.Id)}>
						<Tooltip title="Xóa">
							<Button type="link" danger>
								<DeleteFilled />
							</Button>
						</Tooltip>
					</Popconfirm>
					<Popconfirm
						title="Are you sure you want to cancel this promotion?"
						onConfirm={() => handleCancel(record.Id)}
					>
						<Tooltip title="Ngừng Khuyến Mãi">
							<Button type="link" danger>
								<CloseOutlined />
							</Button>
						</Tooltip>
					</Popconfirm>
				</Space>
			),
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
			/>

			{/* <PromoForm /> */}

			{/* Display List of Promotions */}
			<h2 className="text-2xl font-semibold mt-10 mb-6">Promotions List</h2>
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
