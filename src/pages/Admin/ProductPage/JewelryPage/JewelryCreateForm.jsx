import React, {useEffect, useState} from 'react';

import {Checkbox, Form, message, Modal, Select, Slider, Space, Table} from 'antd';
import debounce from 'lodash/debounce';
import {useDispatch, useSelector} from 'react-redux';
import {
	getAllDiamondSelector,
	getAllJewelryModelsSelector,
	getAllMetalsSelector,
	getAllSizesSelector,
	GetDiamondFilterSelector,
} from '../../../../redux/selectors';
import {getAllDiamond, getDiamondFilter} from '../../../../redux/slices/diamondSlice';
import {fetchAllJewelryModels} from '../../../../redux/slices/jewelry/jewelryModelSlice';
import {fetchAllMetals} from '../../../../redux/slices/jewelry/metalSlice';
import {fetchAllSizes} from '../../../../redux/slices/jewelry/sizeSlice';
import JewelryFormModal from './JewelryFormModal/JewelryFormModal';
import {createJewelry} from '../../../../redux/slices/jewelry/jewelrySlice';
import {DiamondList} from './DiamondList/DiamondList';

const {Option} = Select;

const JewelryCreateForm = ({onClose, isCreateFormOpen, setIsCreateFormOpen}) => {
	const dispatch = useDispatch();
	const [form] = Form.useForm();

	const [isMaxDiamondsReached, setIsMaxDiamondsReached] = useState(false);
	const [selectedModel, setSelectedModel] = useState(null);
	const [selectedMetal, setSelectedMetal] = useState(null);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [mainDiamondSelected, setMainDiamondSelected] = useState(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [filters, setFilters] = useState({});
	const [shape, setShape] = useState('');
	const [pageSize, setPageSize] = useState(100);
	const [start, setStart] = useState(0);
	const [checked, setChecked] = useState(false);
	const [checkedDiamondJewelry, setCheckedDiamondJewelry] = useState(false);
	const [diamondList, setDiamondList] = useState();
	const [currentDiamondId, setCurrentDiamondId] = useState(null);
	const [selectedDiamondList, setSelectedDiamondList] = useState([]);

	const mainDiamonds = selectedModel?.MainDiamonds;

	const getDiamondForFilter = (index) => {
		if (index >= 0 && index < selectedModel?.MainDiamonds?.length) {
			return selectedModel?.MainDiamonds[index];
		}
		return null; // Nếu chỉ số không hợp lệ, trả về null
	};

	const diamondForFilter = getDiamondForFilter(selectedIndex);

	const filterShape = diamondForFilter?.Shapes?.find((id) => id?.ShapeId === shape);

	const filterLimits = useSelector(GetDiamondFilterSelector);
	useEffect(() => {
		dispatch(getDiamondFilter());
	}, []);

	useEffect(() => {
		if (filterLimits) {
			setFilters({
				shape: shape,
				carat: {
					minCarat: filterLimits?.Carat?.Min,
					maxCarat: filterLimits?.Carat?.Max,
				},
			});
		}
	}, [filterLimits]);

	const sizes = useSelector(getAllSizesSelector);
	useEffect(() => {
		dispatch(fetchAllSizes());
	}, [dispatch]);

	const metals = useSelector(getAllMetalsSelector);
	useEffect(() => {
		dispatch(fetchAllMetals());
	}, [dispatch]);

	const models = useSelector(getAllJewelryModelsSelector);
	useEffect(() => {
		dispatch(fetchAllJewelryModels());
	}, [dispatch]);

	const diamonds = useSelector(getAllDiamondSelector);
	useEffect(() => {
		if (diamonds) {
			setDiamondList(diamonds.Values);
		}
	}, [diamonds]);

	const fetchDiamondData = debounce(() => {
		dispatch(
			getAllDiamond({
				pageSize,
				start,
				shapeId: shape,
				caratFrom: filters?.carat?.minCarat,
				caratTo: filters?.carat?.maxCarat,
				isLab: checked,
				includeJewelryDiamond: checkedDiamondJewelry,
			})
		);
	}, 500);

	useEffect(() => {
		fetchDiamondData();

		return () => fetchDiamondData.cancel();
	}, [dispatch, filters, shape, checked, checkedDiamondJewelry]);

	const handleShapeChange = (value) => {
		setShape(value);
	};

	const handleFilterChange = (type, value) => {
		setFilters((prev) => ({
			...prev,
			[type]: value,
		}));
	};

	const handleCaratChange = (value) => {
		handleFilterChange('carat', {minCarat: value[0], maxCarat: value[1]});
	};

	const handleChangeCheckbox = (e) => {
		setChecked(e.target.checked);
	};
	const handleChangeCheckboxDiamondJewelry = (e) => {
		setCheckedDiamondJewelry(e.target.checked);
	};

	const saveSelectedDiamond = (
		selectedDiamonds,
		diamondForFilterId,
		diamondListId,
		diamondListTitle
	) => {
		// Tìm index của diamondForFilter trong array
		const existingIndex = selectedDiamonds.findIndex(
			(item) => item.diamondForFilterId === diamondForFilterId
		);

		const newDiamond = {
			diamondForFilterId,
			diamondListId,
			diamondListTitle,
		};

		if (existingIndex !== -1) {
			// Nếu đã tồn tại, thay thế bằng diamond mới
			const updatedDiamonds = [...selectedDiamonds];
			updatedDiamonds[existingIndex] = newDiamond;
			return updatedDiamonds;
		} else {
			// Nếu không, thêm mới vào array
			return [...selectedDiamonds, newDiamond];
		}
	};

	// Hàm xử lý khi chọn diamond từ danh sách
	const handleDiamondSelectChange = (diamond) => {
		console.log('diamondSelect', diamond);

		// Cập nhật currentDiamondId
		setCurrentDiamondId(diamond);

		// Lấy diamondForFilter hiện tại
		const diamondForFilterId = diamondForFilter?.Id;

		if (diamondForFilterId) {
			// Lưu diamond vào selectedDiamondList
			setSelectedDiamondList((prevList) =>
				saveSelectedDiamond(prevList, diamondForFilterId, diamond.Id, diamond.Title)
			);
		}
	};

	// Filter metals based on selected model's supported metals
	const filteredMetals = selectedModel
		? metals.filter((metal) => selectedModel.MetalSupported.includes(metal.Name))
		: metals;

	const maxDiamonds = selectedModel ? selectedModel.MainDiamondCount : 0;

	const filteredSizes =
		selectedModel && selectedMetal
			? selectedModel.SizeMetals.filter((sizeMetal) => sizeMetal.MetalId === selectedMetal)
			: [];

	// Initialize form with default values
	useEffect(() => {
		form.setFieldsValue({
			JewelryRequest: {
				ModelId: '',
				MentalId: '',
				SizeId: '',
				status: 1, // default status
			},
			attachedDiamondIds: [],
			sideDiamondOptId: '', // move outside of JewelryRequest
		});
	}, [form]);

	// Handle model change to filter metals and populate side diamond details
	const handleModelChange = (value) => {
		const model = models.find((model) => model.Id === value);
		if (model) {
			setSelectedModel(model);
			form.setFieldsValue({
				JewelryRequest: {
					...form.getFieldsValue().JewelryRequest,
					ModelId: value,
					MentalId: '',
					SizeId: '',
				},
				sideDiamondOptId: '',
			});
			setSelectedDiamondList([]);
		}

		// Log model change
		console.log('Selected Model:', model);
	};

	// Handle side diamond option change
	const handleSideDiamondChange = (value) => {
		console.log('Side Diamond Option Changed:', value); // Log the value when it changes
		form.setFieldsValue({
			sideDiamondOptId: value,
		});
		console.log(
			'Updated Side Diamond Option in Form State:',
			form.getFieldValue('sideDiamondOptId')
		);
	};

	// Handle metal change and update selectedMetal state
	const handleMetalChange = (value) => {
		setSelectedMetal(value); // Set the selected metal to the state
		handleChange('MentalId', value); // Update form state
	};

	// Handle generic form field changes
	const handleChange = (name, value) => {
		form.setFieldsValue({
			JewelryRequest: {
				...form.getFieldsValue().JewelryRequest,
				[name]: value,
			},
		});

		// Log individual field change
		console.log(`Changed ${name}:`, value);
	};

	// Handle form submission
	const handleSubmit = () => {
		const formValues = form.getFieldsValue();
		console.log('Form Values Before Submission:', formValues); // Log all form values before submission

		// Extract JewelryRequest and sideDiamondOptId separately
		const {JewelryRequest, attachedDiamondIds, sideDiamondOptId} = formValues;

		// Validation checks
		const {ModelId, SizeId, MentalId, status} = JewelryRequest;

		if (!ModelId || !SizeId || !MentalId) {
			alert('Please fill out all required fields (Model, Size, and Metal).');
			return;
		}

		const attachedDiamonds = attachedDiamondIds || [];
		if (attachedDiamonds.length > selectedModel?.MainDiamondCount) {
			alert(`You can only attach up to ${selectedModel.MainDiamondCount} diamonds.`);
			return;
		}

		// Filter out any undefined or empty fields from the data
		const finalData = {
			...(ModelId && {modelId: ModelId}),
			...(SizeId && {sizeId: SizeId}),
			...(MentalId && {metalId: MentalId}),
			...(status && {status}),
			...(selectedDiamondList.length > 0 && {
				attachedDiamondIds: selectedDiamondList.map((diamond) => diamond.diamondListId),
			}),
			...(sideDiamondOptId && {sideDiamondOptId}),
		};

		// Log the final data you're about to send
		console.log('attachedDiamonds:', attachedDiamonds);
		console.log('Final data to be dispatched:', finalData);

		dispatch(createJewelry(finalData)).then((res) => {
			console.log('res', res);

			if (res.payload) {
				message.success('Tạo trang sức thành công!');
				form.resetFields();
				onClose();
			} else {
				message.warning('Xảy ra lỗi khi tạo trang sức!');
			}
		});
	};

	// Disable selecting more diamonds than the max allowed
	const handleDiamondChange = (value) => {
		setSelectedIndex(value);
		setCurrentDiamondId(null);
		console.log('Selected Diamonds:', value);
	};

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	console.log('selectedDiamondList', selectedDiamondList);

	return (
		<div className="p-4">
			<JewelryFormModal
				models={models}
				filteredMetals={filteredMetals}
				filteredSizes={filteredSizes}
				selectedModel={selectedModel}
				selectedDiamondList={selectedDiamondList}
				handleSubmit={handleSubmit}
				handleModelChange={handleModelChange}
				handleMetalChange={handleMetalChange}
				handleChange={handleChange}
				handleSideDiamondChange={handleSideDiamondChange}
				onClose={onClose}
				form={form}
				showModal={showModal}
				setSelectedDiamondList={setSelectedDiamondList}
				isCreateFormOpen={isCreateFormOpen}
				setIsCreateFormOpen={setIsCreateFormOpen}
			/>

			<Modal
				title="Yêu Cầu Kim Cương"
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
				okText="Gửi Yêu Cầu"
				cancelText="Hủy"
				style={{minWidth: 1000}}
			>
				<p></p>
				<div className="my-10">
					<label className="mr-5">Chấu vỏ trang sức</label>
					<Select
						// mode="multiple"
						onChange={handleDiamondChange}
						placeholder="Chọn chấu"
						className="w-64"
					>
						{Array.isArray(mainDiamonds) &&
							mainDiamonds.map((diamond, i) => (
								<Select.Option
									key={diamond.Id}
									value={i} // value vẫn là 0 và 1 (nếu cần sử dụng cho logic khác)
								>
									{`Chấu ${i + 1}`}
								</Select.Option>
							))}
					</Select>
				</div>
				<label className="font-semibold">Kim Cương Đã Chọn</label>
				{selectedDiamondList.length > 0 && (
					<div className="mb-5">
						<Table
							dataSource={selectedDiamondList.map((diamond, i) => ({
								key: i,
								index: i + 1,
								diamondForFilterId: diamond.diamondForFilterId,
								diamondListTitle: diamond.diamondListTitle || 'N/A',
							}))}
							columns={[
								{
									title: 'Chấu',
									dataIndex: 'index',
									key: 'index',
									render: (text) => `Chấu ${text}`,
								},
								{
									title: 'Kim Cương',
									dataIndex: 'diamondListTitle',
									key: 'diamondListTitle',
								},
							]}
							pagination={false} // Tắt phân trang nếu không cần
						/>
					</div>
				)}

				<Space wrap className="">
					<div className="min-w-44">
						<p>Hình Dạng</p>
						<Select
							defaultValue=""
							placeholder="Shape"
							style={{width: 120}}
							allowClear
							onChange={handleShapeChange}
						>
							{diamondForFilter &&
								diamondForFilter?.Shapes?.map((shape) => (
									<Option key={shape.ShapeId} value={shape.ShapeId}>
										{shape?.Shape?.ShapeName}
									</Option>
								))}
						</Select>
					</div>
					{filterShape && (
						<div className="ml-10 min-w-44">
							<p className="mb-4">Carat:</p>
							<Slider
								range
								value={[filters?.carat?.minCarat, filters?.carat?.maxCarat]}
								step={0.1}
								min={filterShape?.CaratFrom || filterLimits?.Carat?.Min}
								max={filterShape?.CaratTo || filterLimits?.Carat?.Max}
								onChange={handleCaratChange}
							/>
						</div>
					)}

					<div className="ml-10">
						<Checkbox checked={checked} onChange={handleChangeCheckbox}>
							Kim Cương Nhân Tạo
						</Checkbox>
					</div>
					<div className="ml-10">
						<Checkbox
							checked={checkedDiamondJewelry}
							onChange={handleChangeCheckboxDiamondJewelry}
						>
							Kim Cương Đã Đính
						</Checkbox>
					</div>
				</Space>
				<div>
					<DiamondList
						diamond={diamondList}
						handleDiamondSelectChange={handleDiamondSelectChange}
						currentDiamondId={currentDiamondId}
						shape={shape}
					/>
				</div>
			</Modal>
		</div>
	);
};

export default JewelryCreateForm;