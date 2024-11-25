import {CloseOutlined, DeleteFilled, EditFilled, PauseOutlined} from '@ant-design/icons';
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
			F;
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

		// Create a new discount object with formatted dates
		const newDiscount = {
			...values,
			key: discounts.length, // Assuming discounts is defined elsewhere
			startDateTime: startDateTime.format('DD-MM-YYYY HH:mm:ss'),
			endDateTime: endDateTime.format('DD-MM-YYYY HH:mm:ss'),
		};

		// Constructing the command for creating the discount
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
				message.error(error?.data?.title || error?.detail);
			});
		// setIsEditing(false);
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
	const handlePause = async (id) => {
		await dispatch(pauseDiscount(id))
			.unwrap()
			.then(() => {
				message.success(`Mã giảm giá với id: ${id} đã được bị hủy.`);
			})
			.catch((error) => {
				message.error(error?.data?.title || error?.detail);
			}); // Use your actual cancelDiscount logic
		await dispatch(fetchDiscounts());
	};
	const handleCancel = async (id) => {
		await dispatch(cancelDiscount(id))
			.unwrap()
			.then(() => {
				message.success(`Mã giảm giá với id: ${id} đã được bị hủy.`);
			})
			.catch((error) => {
				message.error(error?.data?.title || error?.detail);
			}); // Use your actual cancelDiscount logic
		await dispatch(fetchDiscounts());
	};
	const handleUpdate = async () => {
		const row = await form.validateFields();
		const formattedStartDate = row.validDate[0].format('DD-MM-YYYY HH:mm:ss');
		const formattedEndDate = row.validDate[1].format('DD-MM-YYYY HH:mm:ss');

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

		// Filter out existing requirements and gifts with IDs
		const filteredRequirements = (row.requirements || []).filter((req) => !req.id);
		// Clean the row data and include only new requirements and gifts
		const cleanedRow = removeEmptyFields({
			...row,
			requirements: filteredRequirements,
		});

		const discountData = {
			...cleanedRow,
			updateStartEndDate: {startDate: formattedStartDate, endDate: formattedEndDate},
			...(removedRequirements.length > 0 && {removedRequirements}), // Include only if not empty
		};

		await dispatch(updateDiscount({discountId: editingDiscountId, discountData}))
			.unwrap()
			.then(() => {
				message.success('Cập giảm giá thành công!');
			})
			.catch((error) => {
				message.error(error?.data?.title || error?.detail);
			});

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
		},
		{
			title: 'Số Tiền',
			dataIndex: 'moneyAmount',
			key: 'moneyAmount',
		},
		{
			title: 'Yêu Cầu',
			key: 'discountReq',
			render: (_, record) =>
				record.DiscountReq?.map((req, index) => (
					<div key={index}>
						<span>{req.Name}</span> - Quantity: {req.Quantity}
					</div>
				)) || 'No Requirements',
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
