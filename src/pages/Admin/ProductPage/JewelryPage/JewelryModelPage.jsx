import React, {useEffect, useState} from 'react';
import {Search, Filter, X} from 'lucide-react';
import {useDispatch, useSelector} from 'react-redux';
import {
	fetchAllJewelryModels,
	createJewelryModel,
	deleteJewelryModel,
} from '../../../../redux/slices/jewelry/jewelryModelSlice';
import {message, Collapse, Input, Select, InputNumber} from 'antd';
import {fetchAllMetals} from '../../../../redux/slices/jewelry/metalSlice';
import {fetchAllSizes} from '../../../../redux/slices/jewelry/sizeSlice';
import {fetchAllShapes} from '../../../../redux/slices/shapeSlice';
import {fetchAllEnums} from '../../../../redux/slices/jewelry/enumSlice';
import {fetchAllJewelryModelCategories} from '../../../../redux/slices/jewelry/jewelryModelCategorySlice';
import {fetchJewelryModelRule} from '../../../../redux/slices/configSlice';
import JewelryModelEditModal from './JewelryModelEditModal';
import {
	getAllJewelryModelsSelector,
	getJewelryModelDetailSelector,
	LoadingJewelryModelSelector,
	JewelryModelErrorSelector,
	getAllMetalsSelector,
	getAllSizesSelector,
	getAllJewelryModelCategoriesSelector,
	getAllEnumsSelector,
	getAllDiamondShapesSelector,
	selectModelRule,
} from '../../../../redux/selectors';
import {JewelryModelUploadForm} from './JewelryModelUploadForm';
import Loading from '../../../../components/Loading';
import ModelDetailsView from './ModelDetailView';
import {Helmet} from 'react-helmet';

const JewelryModelPage = () => {
	const dispatch = useDispatch();
	const models = useSelector(getAllJewelryModelsSelector);
	const loading = useSelector(LoadingJewelryModelSelector);
	const error = useSelector(JewelryModelErrorSelector);
	const [selectedJewelryModelId, setSelectedJewelryModelId] = useState();
	const [isFormVisible, setIsFormVisible] = useState(false); // for controlling the form visibility
	const [isEditModalVisible, setIsEditModalVisible] = useState(false);
	// State for search parameters
	const [searchName, setSearchName] = useState('');
	const [searchCode, setSearchCode] = useState('');
	const [searchCategory, setSearchCategory] = useState('');
	const [searchIsEngravable, setSearchIsEngravable] = useState('');
	const [searchMainDiamondQuantity, setSearchMainDiamondQuantity] = useState('');

	// Actual state used for fetching
	const [name, setName] = useState('');
	const [code, setCode] = useState('');
	const [category, setCategory] = useState('');
	const [isEngravable, setIsEngravable] = useState('');
	const [mainDiamondQuantity, setMainDiamondQuantity] = useState('');
	const [currentPage, setCurrentPage] = React.useState(1);
	const [pageSize, setPageSize] = React.useState(5);
	const [totalPage, setTotalPage] = useState(0);
	const [errorCarat, setErrorCarat] = useState('');
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // For the delete confirmation popup
	const [jewelryModelRule, setJewelryModelRule] = useState({
		MaximumMainDiamond: 3,
		MaximumSideDiamondOption: 5,
	});
	const [selectedUnit, setSelectedUnit] = useState('milimeter'); // Initial unit
	const [filteredSizes, setFilteredSizes] = useState([]);
	useEffect(() => {
		// Fetch jewelry model rules
		dispatch(fetchJewelryModelRule())
			.unwrap()
			.then((rules) => {
				setJewelryModelRule(rules);
			})
			.catch((error) => {
				message.error('Failed to fetch jewelry model rules');
				console.error(error);
			});
	}, [dispatch]);
	const [newModel, setNewModel] = useState({
		name: '',
		description: '',
		metalId: '',
		sizeId: '',
		sideDiamond: false,
	});
	const vietnameseFieldNames = {
		name: 'Tên Mẫu',
		code: 'Mã Mẫu',
		categoryId: 'Loại Trang Sức',
		craftManFee: 'Phí Thợ (VND)',
		isEngravable: 'Khắc Chữ',
		width: 'Chiều Rộng (mm)',
		// length: 'Chiều Dài',
		backType: 'Loại Gài',
		claspType: 'Loại Khóa',
		chainType: 'Loại Dây Chuyền',
	};
	const [modelSpec, setModelSpec] = useState({
		name: '',
		code: '',
		categoryId: '',
		craftManFee: '',
		isEngravable: false,
		width: '',
		// length: '',
		backType: '',
		claspType: '',
		chainType: '',
	});
	const [showModal, setShowModal] = useState(false);
	const [selectedModel, setSelectedModel] = useState(null);

	// Main Diamond Specs state
	const [mainDiamondSpecs, setMainDiamondSpecs] = useState([
		{
			settingType: '',
			quantity: '',
			shapeSpecs: [
				{
					shapeId: '',
					caratFrom: '',
					caratTo: '',
				},
			],
		},
	]);

	const [sideDiamondSpecs, setSideDiamondSpecs] = useState([
		{
			shapeId: '',
			colorMin: '',
			colorMax: '',
			clarityMin: '',
			clarityMax: '',
			settingType: '',
			caratWeight: '',
			quantity: '',
		},
	]);

	const [metalSizeSpecs, setMetalSizeSpecs] = useState([
		{
			metalId: '',
			sizeId: '',
			weight: '',
		},
	]);
	const handleSearch = () => {
		// Update the actual search parameters
		setName(searchName);
		setCategory(searchCategory);
		setIsEngravable(searchIsEngravable);

		// Reset to first page when performing a new search
		setCurrentPage(1);

		// Dispatch fetch action with search parameters
		dispatch(
			fetchAllJewelryModels({
				Currentpage: 1,
				PageSize: pageSize,
				Name: searchName,
				Code: searchCode,
				Category: searchCategory,
				IsEngravable: searchIsEngravable,
				MainDiamondQuantity: searchMainDiamondQuantity,
			})
		)
			.then((response) => {
				if (response && response.payload.TotalPage) {
					setTotalPage(response.payload.TotalPage);
				}
			})
			.catch((error) => {
				message.error(error?.data?.detail || error?.detail);
			});
	};
	const handleNextPage = () => {
		if (currentPage < totalPage) {
			setCurrentPage((prev) => prev + 1);
		}
	};

	const handlePreviousPage = () => {
		if (currentPage >= 1) {
			setCurrentPage((prev) => prev - 1);
		}
	};
	useEffect(() => {
		dispatch(
			fetchAllJewelryModels({
				Currentpage: currentPage,
				PageSize: pageSize,
				Name: name,
				Code: code,
				Category: category,
				IsEngravable: isEngravable,
				MainDiamondQuantity: mainDiamondQuantity,
			})
		)
			.then((response) => {
				// Assuming the response contains TotalPage data
				if (response && response.payload.TotalPage) {
					setTotalPage(response.payload.TotalPage);
				}
			})
			.catch((error) => {
				message.error(error?.data?.detail || error?.detail);
			});
	}, [dispatch, name, code, category, isEngravable, currentPage, pageSize]);
	const metals = useSelector(getAllMetalsSelector); // Selector for getting metals from the store
	useEffect(() => {
		dispatch(fetchAllMetals());
	}, [dispatch]);
	const sizes = useSelector(getAllSizesSelector); // Selector for getting metals from the store
	useEffect(() => {
		dispatch(fetchAllSizes(sizes));
	}, [dispatch]);

	useEffect(() => {
		if (sizes && Array.isArray(sizes)) {
			const initialUnitData = sizes.find((unit) => unit.Unit === selectedUnit);
			if (initialUnitData) {
				setFilteredSizes(initialUnitData.Sizes);
			}
		}
	}, [sizes, selectedUnit]);
	const enums = useSelector(getAllEnumsSelector); // Selector for getting metals from the store
	useEffect(() => {
		dispatch(fetchAllEnums());
	}, [dispatch]);
	const shapes = useSelector(getAllDiamondShapesSelector); // Selector for getting metals from the store
	useEffect(() => {
		dispatch(fetchAllShapes());
	}, [dispatch]);
	const categories = useSelector(getAllJewelryModelCategoriesSelector); // Selector for getting metals from the store
	useEffect(() => {
		dispatch(fetchAllJewelryModelCategories());
	}, [dispatch]);
	const selectedCategory = categories.find((cat) => cat.id === parseInt(modelSpec.categoryId));
	const handleInputChange = (e) => {
		const {name, value, type, checked} = e.target;
		if (type === 'checkbox') {
			setModelSpec((prevState) => ({
				...prevState,
				[name]: checked,
			}));
		} else {
			setModelSpec((prevState) => ({
				...prevState,
				[name]: value,
			}));
		}
	};
	const handleUnitChange = (e) => {
		const newUnit = e.target.value;
		setSelectedUnit(newUnit);
		const unitData = sizes.find((unit) => unit.Unit === newUnit);
		if (unitData) {
			setFilteredSizes(unitData.Sizes);
			// Set the initial size value for the new unit
			handleMetalSizeChange(index, 'sizeId', unitData.Sizes[0]?.Id || '');
		}
	};
	const handleMainDiamondChange = (index, field, value) => {
		const maxDiamonds = jewelryModelRule.MaximumMainDiamond || 3;

		if (field === 'quantity') {
			const otherSpecsQuantity = mainDiamondSpecs.reduce(
				(sum, spec, i) => (i === index ? sum : sum + (Number(spec.quantity) || 0)),
				0
			);

			if (Number(value) + otherSpecsQuantity <= maxDiamonds) {
				const updatedSpecs = [...mainDiamondSpecs];
				updatedSpecs[index] = {
					...updatedSpecs[index],
					[field]: value,
				};
				setMainDiamondSpecs(updatedSpecs);
			} else {
				message.warning(`Tổng số lượng kim cương chính không được vượt quá ${maxDiamonds}`);
			}
		} else {
			const updatedSpecs = [...mainDiamondSpecs];
			updatedSpecs[index] = {
				...updatedSpecs[index],
				[field]: value,
			};
			setMainDiamondSpecs(updatedSpecs);
		}
	};
	const handleShapeChange = (mainIndex, shapeIndex, field, value) => {
		setMainDiamondSpecs((prevState) => {
			const updatedSpecs = [...prevState];
			updatedSpecs[mainIndex].shapeSpecs[shapeIndex][field] = value;
			return updatedSpecs;
		});
	};
	const handleSideDiamondChange = (index, field, value) => {
		const maxSideDiamonds = jewelryModelRule.MaximumSideDiamondOption || 5;

		if (index >= 0 && index < maxSideDiamonds) {
			setSideDiamondSpecs((prevState) => {
				const updatedSpecs = [...prevState];
				updatedSpecs[index][field] = value;

				const {caratWeight, quantity} = updatedSpecs[index];
				const caratPerDiamond = caratWeight && quantity ? caratWeight / quantity : 0;

				if (caratPerDiamond >= 0.18) {
					setErrorCarat(
						`Carat trung bình cho một viên kim cương tấm phải dưới 0.18ct. Hiện tại trung bình một viên là: ${caratPerDiamond.toFixed(
							2
						)} ct`
					);
				} else {
					setErrorCarat('');
				}

				return updatedSpecs;
			});
		} else {
			message.warning(`Chỉ được phép tối đa ${maxSideDiamonds} lựa chọn kim cương tấm`);
		}
	};

	const handleMetalSizeChange = (index, field, value) => {
		setMetalSizeSpecs((prevState) => {
			const updatedSpecs = [...prevState];
			updatedSpecs[index][field] = value;
			return updatedSpecs;
		});
	};
	const handleAddMainDiamondSpec = () => {
		const maxDiamonds = jewelryModelRule.MaximumMainDiamond || 3;

		const totalQuantity = mainDiamondSpecs.reduce(
			(sum, spec) => sum + (Number(spec.quantity) || 0),
			0
		);

		if (mainDiamondSpecs.length < maxDiamonds && totalQuantity < maxDiamonds) {
			setMainDiamondSpecs([
				...mainDiamondSpecs,
				{
					settingType: '',
					quantity: '',
					shapeSpecs: [{shapeId: '', caratFrom: '', caratTo: ''}],
				},
			]);
		} else {
			message.warning(`Chỉ được phép tối đa ${maxDiamonds} kim cương chính`);
		}
	};
	const handleAddShapeSpec = (index) => {
		const newShapeSpec = {shapeId: '', caratFrom: '', caratTo: ''};
		setMainDiamondSpecs((prevState) => {
			const updatedSpecs = [...prevState];
			updatedSpecs[index].shapeSpecs.push(newShapeSpec);
			return updatedSpecs;
		});
	};
	const handleAddMetalSizeSpec = () => {
		setMetalSizeSpecs([...metalSizeSpecs, {metalId: '', sizeId: '', weight: ''}]);
	};
	const handleAddSideDiamondSpec = () => {
		const maxSideDiamonds = jewelryModelRule.MaximumSideDiamondOption || 5;

		// Check if current number of side diamond specs is less than max allowed
		if (sideDiamondSpecs.length < maxSideDiamonds) {
			setSideDiamondSpecs([
				...sideDiamondSpecs,
				{
					shapeId: '',
					colorMin: '',
					colorMax: '',
					clarityMin: '',
					clarityMax: '',
					settingType: '',
					caratWeight: '',
					quantity: '',
				},
			]);
		} else {
			message.warning(`Chỉ được phép tối đa ${maxSideDiamonds} lựa chọn kim cương tấm`);
		}
	};

	const handleRemoveMainDiamondSpec = (index) => {
		setMainDiamondSpecs(mainDiamondSpecs.filter((_, i) => i !== index));
	};

	const handleRemoveShapeSpec = (mainIndex, shapeIndex) => {
		setMainDiamondSpecs((prevState) => {
			const updatedSpecs = [...prevState];
			updatedSpecs[mainIndex].shapeSpecs.splice(shapeIndex, 1);
			return updatedSpecs;
		});
	};
	const handleRemoveSideDiamondSpec = (index) => {
		setSideDiamondSpecs(sideDiamondSpecs.filter((_, i) => i !== index));
	};

	const handleRemoveMetalSizeSpec = (index) => {
		setMetalSizeSpecs(metalSizeSpecs.filter((_, i) => i !== index));
	};

	const handleModelClick = (model) => {
		setSelectedModel(model);
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setSelectedModel(null);
	};
	const handleView = (jewelryModelId) => {
		setSelectedJewelryModelId(jewelryModelId); // Set the selected diamondId
		setIsFormVisible(true); // Show the form
	};
	const handleSubmit = (e) => {
		e.preventDefault(); // Prevent default form submission behavior

		const filterEmptyFields = (obj) => {
			return Object.fromEntries(
				Object.entries(obj).filter(
					([_, value]) => value !== '' && value !== null && value !== undefined
				)
			);
		};

		const filteredModelSpec = filterEmptyFields(modelSpec);

		// Filter out mainDiamondSpecs that lack required shapeSpecs fields
		const filteredMainDiamondSpecs = mainDiamondSpecs
			.map((spec) => ({
				...filterEmptyFields(spec),
				shapeSpecs: spec.shapeSpecs
					.map(filterEmptyFields)
					.filter(
						(shapeSpec) => shapeSpec.shapeId && shapeSpec.caratFrom && shapeSpec.caratTo
					),
			}))
			.filter((spec) => spec.settingType && spec.quantity && spec.shapeSpecs.length > 0);

		// Filter out sideDiamondSpecs that lack required fields
		const filteredSideDiamondSpecs = sideDiamondSpecs
			.map(filterEmptyFields)
			.filter(
				(spec) =>
					spec.shapeId &&
					spec.colorMin &&
					spec.colorMax &&
					spec.clarityMin &&
					spec.clarityMax
			);

		const filteredMetalSizeSpecs = metalSizeSpecs.map(filterEmptyFields);

		// Build formData object, only including populated mainDiamondSpecs and sideDiamondSpecs
		const formData = {
			modelSpec: filteredModelSpec,
			metalSizeSpecs: filteredMetalSizeSpecs,
			...(filteredMainDiamondSpecs.length > 0 && {
				mainDiamondSpecs: filteredMainDiamondSpecs,
			}),
			...(filteredSideDiamondSpecs.length > 0 && {
				sideDiamondSpecs: filteredSideDiamondSpecs,
			}),
		};

		// Dispatch the createJewelryModel action with formData
		dispatch(createJewelryModel(formData))
			.unwrap()
			.then((formData) => {
				message.success('Tạo mẫu trang sức thành công');
			})
			.catch((error) => {
				message.error(error?.data?.detail || error?.detail);
			});
		dispatch(
			fetchAllJewelryModels({
				Currentpage: currentPage,
				PageSize: pageSize,
				Name: name,
				Code: code,
				Category: category,
				IsEngravable: isEngravable,
				MainDiamondQuantity: mainDiamondQuantity,
			})
		);
	};
	const handleDeleteModel = async () => {
		if (selectedModel) {
			await dispatch(deleteJewelryModel(selectedModel.Id))
				.unwrap()
				.then(async () => {
					message.success('Xóa Mẫu Trang Sức Thành Công!');
					setShowModal(false);
					// Refresh the list of jewelry models
					await dispatch(
						fetchAllJewelryModels({
							Currentpage: currentPage,
							PageSize: pageSize,
							Name: name,
							Code: code,
							Category: category,
							IsEngravable: isEngravable,
							MainDiamondQuantity: mainDiamondQuantity,
						})
					);
				})
				.catch((error) => {
					message.error(
						error?.detail || error?.detail || 'Mẫu trang sức đang được sử dụng'
					);
				});
		}
	};
	const handleClear = () => {
		setModelSpec(initialModelSpec);
		setMainDiamondSpecs(initialMainDiamondSpecs);
		setSideDiamondSpecs(initialSideDiamondSpecs);
		setMetalSizeSpecs(initialMetalSizeSpecs);
	};

	// Check if models is not an array
	if (!Array.isArray(models)) {
		return <div>No models available</div>;
	}

	return (
		<div className="p-6 bg-white min-h-screen">
			<Helmet>
				<title>Quản Lí Mẫu Trang Sức</title>
			</Helmet>
			<h1 className="text-3xl font-semibold text-primary mb-6">Mẫu Trang Sức</h1>
			{loading ? (
				<Loading />
			) : (
				<div>
					<div className=" p-4 mb-6 bg-offWhite">
						<div className="mb-4 grid grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-4">
							<input
								type="text"
								value={searchName}
								onChange={(e) => setSearchName(e.target.value)}
								placeholder="Tên mẫu"
								className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
							/>
							<input
								type="text"
								value={searchCode}
								onChange={(e) => setSearchCode(e.target.value)}
								placeholder="Mã mẫu"
								className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
							/>
							<select
								value={searchCategory}
								onChange={(e) => setSearchCategory(e.target.value)}
								className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
							>
								<option value="">Loại trang sức</option>
								{categories.map((category) => (
									<option key={category.id} value={category.Name}>
										{category.Name}
									</option>
								))}
							</select>
							<select
								value={searchIsEngravable}
								onChange={(e) => setSearchIsEngravable(e.target.value)}
								className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
							>
								<option value="">Khắc chữ?</option>
								<option value="true">Có</option>
								<option value="false">Không</option>
							</select>
							<input
								type="text"
								value={searchMainDiamondQuantity}
								onChange={(e) => setSearchMainDiamondQuantity(e.target.value)}
								placeholder="Số lượng kim cương chính"
								className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
							/>
							<button
								onClick={handleSearch}
								className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-all shadow-md"
							>
								Tìm kiếm
							</button>
						</div>
						{loading ? (
							<p>Đang tải...</p>
						) : (
							<div>
								<ul>
									{models.map((model) => (
										<li
											key={model.Id}
											className="py-3 flex px-4 bg-white rounded-lg shadow-md mb-4 border border-lightGray cursor-pointer"
											onClick={() => handleModelClick(model)}
										>
											<div className="mt-2">
												{model.Thumbnail?.MediaPath ? (
													<img
														src={model.Thumbnail.MediaPath} // Fixed the property name here
														alt={model.Thumbnail.MediaName} // Fixed the property name here
														className="w-32 h-32 object-cover rounded-md" // You can adjust these values to fit your layout
													/>
												) : (
													<div className="w-32 h-32 bg-gray-300 flex items-center justify-center rounded-md">
														<span className="text-gray-600">
															Chưa có hình ảnh
														</span>{' '}
														{/* Fallback when no thumbnail */}
													</div>
												)}
											</div>

											<div className="ml-4">
												<strong className="text-xl text-black">
													{model.Name}
												</strong>{' '}
												<div className="text-xl text-black">
													Mã Mẫu: {model.ModelCode}
												</div>
												{model.MainDiamondCount > 0 && (
													<div className="text-sm text-gray-500">
														Số lượng kim cương chính:{' '}
														{model.MainDiamondCount} viên
													</div>
												)}
												<div className="text-sm text-gray-500">
													Số lượng lựa chọn kim cương tấm:{' '}
													{model.SideDiamondOptionCount}
												</div>
												{/* Displaying more model details conditionally */}
												{model.IsEngravable && (
													<div className="text-sm text-gray-500">
														Có khắc chữ
													</div>
												)}
												{model.MetalSupported &&
													model.MetalSupported.length > 0 && (
														<div className="text-sm text-gray-500">
															Kim loại:{' '}
															{model.MetalSupported.join(', ')}
														</div>
													)}
												{model.CraftmanFee > 0 && (
													<div className="text-sm text-gray-500">
														Giá gia công: ${model.CraftmanFee}
													</div>
												)}
												{/* Optionally, display a preview or more images */}
												<div className="mt-2">
													{model.ThumbnailPath && (
														<img
															src={model.ThumbnailPath}
															alt={model.Name}
															className="w-32 h-32 object-cover"
														/>
													)}
												</div>
											</div>
										</li>
									))}
								</ul>
								<div className="pagination-controls flex justify-center space-x-4 mt-4">
									<button
										onClick={handlePreviousPage}
										disabled={currentPage === 1}
										className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primaryDark disabled:opacity-50"
									>
										Trước
									</button>
									<span className="text-lg">{`Trang ${currentPage} / ${totalPage}`}</span>
									<button
										onClick={handleNextPage}
										disabled={currentPage === totalPage}
										className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primaryDark disabled:opacity-50"
									>
										Sau
									</button>
									<select
										value={pageSize}
										onChange={(e) =>
											setPageSize(Number(e.target.value), setCurrentPage(1))
										}
										className="form-select p-2 border border-gray rounded-md"
									>
										<option value="5">5 mỗi trang</option>
										<option value="10">10 mỗi trang</option>
										<option value="20">20 mỗi trang</option>
									</select>
								</div>
							</div>
						)}{' '}
						<JewelryModelUploadForm
							jewelryModelId={selectedJewelryModelId}
							visible={isFormVisible}
							onClose={() => setIsFormVisible(false)} // Close the form
						/>
					</div>

					{/* Create New Model Form */}
					<div className="border-t p-4 mt-6 bg-offWhite">
						<h2 className="text-2xl font-semibold text-primary">
							Tạo Mẫu Trang Sức Mới
						</h2>
						<div className="flex gap-5">
							<div className="flex flex-col gap-5">
								<div className="p-6 border border-black rounded-lg shadow-md bg-white">
									<h2 className="text-xl font-semibold text-black mb-4">
										Thông Số Mẫu Trang Sức
									</h2>
									<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-5 p-6 border border-black rounded-lg shadow-md bg-tintWhite">
										{Object.keys(modelSpec).map((field) => {
											// Define category-specific visible fields
											const categorySpecificFields = {
												1: ['isEngravable', 'width'], // Ring
												2: [
													'length',
													'chainType',
													'claspType',
													'isEngravable',
												], // Necklace
												3: ['length', 'claspType', 'isEngravable'], // Bracelace
												4: ['backType', 'isEngravable'], // Earring
											};

											// Only show fields relevant to the selected category or always visible fields
											if (
												modelSpec.categoryId !== '' &&
												field !== 'categoryId' &&
												field !== 'name' &&
												field !== 'code' &&
												field !== 'craftManFee' &&
												!categorySpecificFields[
													modelSpec.categoryId
												]?.includes(field)
											) {
												return null;
											}

											return (
												<div key={field} className="mb-4">
													{field === 'categoryId' ? (
														// Render a dropdown for categoryId
														<select
															name="categoryId"
															value={modelSpec.categoryId}
															onChange={handleInputChange}
															required
															className="form-input w-full p-2 border border-gray text-black rounded-md"
														>
															<option value="">
																Chọn loại trang sức
															</option>
															{categories.map((category) => (
																<option
																	key={category.id}
																	value={category.Id}
																>
																	{category.Name}
																</option>
															))}
														</select>
													) : field === 'chainType' ? (
														// Custom dropdown for chain type (only for Necklace)
														<select
															name="chainType"
															value={modelSpec.chainType}
															onChange={handleInputChange}
															className="form-input w-full p-2 border border-gray text-black rounded-md"
														>
															<option value="">
																Chọn loại dây chuyền
															</option>
															<option value="2">Hạt</option>
															<option value="3">Byzantine</option>
															<option value="0">Dây Cáp</option>
															<option value="5">
																Dây Xích Phẳng
															</option>
															<option value="4">Dây Figaro</option>
															<option value="1">Dây Thừng</option>
														</select>
													) : field === 'claspType' ? (
														// Custom dropdown for clasp type (for Necklace and Bracelace)
														<select
															name="claspType"
															value={modelSpec.claspType}
															onChange={handleInputChange}
															className="form-input w-full p-2 border border-gray text-black rounded-md"
														>
															<option value="">Chọn loại khóa</option>
															<option value="3">Khóa Thùng</option>
															<option value="2">Khóa Gài</option>
															<option value="9">Khóa Vòng Tay</option>
															<option value="1">Khóa Móc</option>
															<option value="7">Khóa Từ Tính</option>
															<option value="4">Khóa Hộp Mở</option>
															<option value="8">
																Khóa Ngọc Trai
															</option>
															<option value="6">Khóa Chữ S</option>
															<option value="0">Khóa Lò Xo</option>
															<option value="5">Khóa Gài Chéo</option>
														</select>
													) : field === 'backType' ? (
														// Custom dropdown for back type (only for Earring)
														<select
															name="backType"
															value={modelSpec.backType}
															onChange={handleInputChange}
															className="form-input w-full p-2 border border-gray text-black rounded-md"
														>
															<option value="">Chọn loại gài</option>
															<option value="0">Gài Ấn</option>
															<option value="1">Gài Vặn</option>
															<option value="2">
																Gài Khóa An Toàn
															</option>
														</select>
													) : typeof modelSpec[field] === 'boolean' ? (
														// Render a checkbox for boolean fields
														<div className="flex items-center">
															<input
																type="checkbox"
																name={field}
																checked={modelSpec[field]}
																onChange={handleInputChange}
																className="form-checkbox h-5 w-5 text-blue transition duration-200 ease-in-out focus:ring-blue rounded focus:outline-none"
															/>{' '}
															<label
																htmlFor={field}
																className="m-3 text-gray"
															>
																{vietnameseFieldNames[field] ||
																	field.replace(
																		/([A-Z])/g,
																		' $1'
																	)}
															</label>
														</div>
													) : (
														// Render a text input for other fields
														<input
															placeholder={
																vietnameseFieldNames[field] ||
																field.replace(/([A-Z])/g, ' $1')
															}
															type="text"
															name={field}
															value={modelSpec[field]}
															required={
																field !== 'width' &&
																field !== 'length'
															}
															onChange={handleInputChange}
															className="form-input w-full p-3 border border-gray rounded-md shadow-sm transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue focus:border-primary placeholder-gray"
														/>
													)}
												</div>
											);
										})}
									</div>
								</div>

								<div className="p-6 border rounded-lg shadow-md bg-white">
									<Collapse
										defaultActiveKey={[]}
										ghost
										className="bg-white border rounded-lg shadow-md"
									>
										<Collapse.Panel
											header={
												<h2 className="text-xl font-semibold">
													Thông số kim cương chính
												</h2>
											}
											key="mainDiamond"
										>
											{mainDiamondSpecs.map((spec, index) => (
												<div
													key={index}
													className="mb-4 border p-4 rounded-lg bg-tintWhite"
												>
													<div className="flex justify-between">
														<h3 className="font-semibold text-lg mb-2">
															Kim cương chính thứ {index + 1}
														</h3>
														{mainDiamondSpecs.length > 1 && (
															<button
																onClick={() =>
																	handleRemoveMainDiamondSpec(
																		index
																	)
																}
																className="text-red"
															>
																- Xóa
															</button>
														)}
													</div>
													<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
														<div>
															<select
																label="Mẫu Thiết Kế"
																type="number"
																value={spec.settingType}
																onChange={(e) =>
																	handleMainDiamondChange(
																		index,
																		'settingType',
																		e.target.value
																	)
																}
																placeholder="Mẫu Thiết Kế"
																className="form-input w-full p-2 border border-gray-300 rounded-md"
															>
																{' '}
																<option value="">
																	Mẫu Thiết Kế
																</option>
																{enums?.SettingType &&
																	Object.keys(
																		enums.SettingType
																	).map((key) => (
																		<option
																			key={key}
																			value={
																				enums.SettingType[
																					key
																				]
																			}
																		>
																			{key.replace(
																				/([A-Z])/g,
																				' $1'
																			)}
																		</option>
																	))}
															</select>
														</div>

														<input
															label=""
															type="number"
															min="1"
															value={spec.quantity}
															onChange={(e) =>
																handleMainDiamondChange(
																	index,
																	'quantity',
																	e.target.value
																)
															}
															placeholder="Số Lượng"
															className="form-input w-full p-2 border border-gray-300 rounded-md"
														/>
													</div>

													{/* Shape Specs */}
													<div className="ml-4">
														<h4 className="font-semibold mb-2">
															Thông Số Hình Dáng
														</h4>
														{spec.shapeSpecs.map(
															(shape, shapeIndex) => (
																<div
																	key={shapeIndex}
																	className=" mb-2"
																>
																	<div className="flex justify-between">
																		<h3 className="font-semibold text-lg mb-2">
																			Hình dáng{' '}
																			{shapeIndex + 1}
																		</h3>
																		{spec.shapeSpecs.length >
																			1 && (
																			<button
																				onClick={() =>
																					handleRemoveShapeSpec(
																						index,
																						shapeIndex
																					)
																				}
																				className="text-red"
																			>
																				- Xóa
																			</button>
																		)}
																	</div>
																	<div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
																		<select
																			value={shape.shapeId}
																			onChange={(e) =>
																				handleShapeChange(
																					index,
																					shapeIndex,
																					'shapeId',
																					e.target.value
																				)
																			}
																			placeholder=" ID"
																			className="form-input w-full p-2 border border-gray-300 rounded-md"
																		>
																			<option value="">
																				Chọn Hình Dáng
																			</option>
																			{Array.isArray(
																				shapes
																			) &&
																				shapes.map(
																					(shape) => (
																						<option
																							key={
																								shape.id
																							}
																							value={
																								shape.Id
																							}
																						>
																							{
																								shape.ShapeName
																							}
																						</option>
																					)
																				)}
																		</select>
																		<input
																			type="number"
																			value={shape.caratFrom}
																			onChange={(e) =>
																				handleShapeChange(
																					index,
																					shapeIndex,
																					'caratFrom',
																					e.target.value
																				)
																			}
																			placeholder="Carat thấp nhất"
																			className="form-input w-full p-2 border border-gray-300 rounded-md"
																		/>
																		<input
																			type="number"
																			value={shape.caratTo}
																			onChange={(e) =>
																				handleShapeChange(
																					index,
																					shapeIndex,
																					'caratTo',
																					e.target.value
																				)
																			}
																			placeholder="Carat cao nhất"
																			className="form-input w-full p-2 border border-gray rounded-md"
																		/>
																	</div>
																</div>
															)
														)}
														<button
															onClick={() =>
																handleAddShapeSpec(index)
															}
															className="text-blue"
														>
															+ Thêm hình dáng khác
														</button>
													</div>
												</div>
											))}
											<button
												onClick={handleAddMainDiamondSpec}
												className="text-blue"
											>
												+ Thêm bộ thông số khác
											</button>
										</Collapse.Panel>
									</Collapse>
								</div>
							</div>
							<div className="flex flex-col gap-5">
								<div className="p-6 border rounded-lg shadow-md bg-white">
									<Collapse
										defaultActiveKey={[]}
										ghost
										className="bg-white border rounded-lg shadow-md"
									>
										<Collapse.Panel
											header={
												<h2 className="text-xl font-semibold">
													Thông số kim cương tấm
												</h2>
											}
											key="sideDiamond"
										>
											{sideDiamondSpecs.map((spec, index) => (
												<div
													key={index}
													className="mb-4 border p-4 rounded-lg bg-tintWhite"
												>
													<div className="flex justify-between">
														<h3 className="font-semibold text-lg mb-2">
															Lựa chọn kim cương tấm thứ {index + 1}
														</h3>{' '}
														{sideDiamondSpecs.length > 1 && (
															<button
																onClick={() =>
																	handleRemoveSideDiamondSpec(
																		index
																	)
																}
																className="text-red"
															>
																- Xóa
															</button>
														)}
													</div>
													<div className="grid grid-cols-4 gap-4 ">
														<select
															value={spec.shapeId}
															onChange={(e) =>
																handleSideDiamondChange(
																	index,
																	'shapeId',
																	e.target.value
																)
															}
															placeholder="ID"
															className="form-input w-full p-2 border border-gray-300 rounded-md"
														>
															<option value="">
																Chọn Hình Dáng Kim Cương
															</option>
															{Array.isArray(shapes) &&
																shapes.map((shape) => (
																	<option
																		key={shape.id}
																		value={shape.Id}
																	>
																		{shape.ShapeName}
																	</option>
																))}
														</select>

														<select
															value={spec.colorMin}
															onChange={(e) =>
																handleSideDiamondChange(
																	index,
																	'colorMin',
																	e.target.value
																)
															}
															placeholder="Color thấp nhất"
															className="form-input w-full p-2 border border-gray-300 rounded-md"
														>
															{' '}
															<option value="">
																Color thấp nhất
															</option>
															{enums?.Color &&
																Object.keys(enums.Color).map(
																	(key) => (
																		<option
																			key={key}
																			value={enums.Color[key]}
																		>
																			{key.replace(
																				/([A-Z])/g,
																				' $1'
																			)}
																		</option>
																	)
																)}
														</select>
														<select
															value={spec.colorMax}
															onChange={(e) =>
																handleSideDiamondChange(
																	index,
																	'colorMax',
																	e.target.value
																)
															}
															placeholder="Color cao nhất"
															className="form-input w-full p-2 border border-gray-300 rounded-md"
														>
															{' '}
															<option value="">Color cao nhất</option>
															{enums?.Color &&
																Object.keys(enums.Color).map(
																	(key) => (
																		<option
																			key={key}
																			value={enums.Color[key]}
																		>
																			{key.replace(
																				/([A-Z])/g,
																				' $1'
																			)}
																		</option>
																	)
																)}
														</select>
														<select
															value={spec.clarityMin}
															placeholder="Clarity thấp nhất"
															onChange={(e) =>
																handleSideDiamondChange(
																	index,
																	'clarityMin',
																	e.target.value
																)
															}
															className="form-input w-full p-2 border border-gray-300 rounded-md"
														>
															{' '}
															<option value="">
																Clarity thấp nhất
															</option>
															{enums?.Clarity &&
																Object.keys(enums.Clarity).map(
																	(key) => (
																		<option
																			key={key}
																			value={
																				enums.Clarity[key]
																			}
																		>
																			{key.replace(
																				/([A-Z])/g,
																				' $1'
																			)}
																		</option>
																	)
																)}
														</select>
														<select
															value={spec.clarityMax}
															onChange={(e) =>
																handleSideDiamondChange(
																	index,
																	'clarityMax',
																	e.target.value
																)
															}
															placeholder="Clarity cao nhất"
															className="form-input w-full p-2 border border-gray-300 rounded-md"
														>
															{' '}
															<option value="">
																Clarity cao nhất
															</option>
															{enums?.Clarity &&
																Object.keys(enums.Clarity).map(
																	(key) => (
																		<option
																			key={key}
																			value={
																				enums.Clarity[key]
																			}
																		>
																			{key.replace(
																				/([A-Z])/g,
																				' $1'
																			)}
																		</option>
																	)
																)}
														</select>
														<select
															value={spec.settingType}
															onChange={(e) =>
																handleSideDiamondChange(
																	index,
																	'settingType',
																	e.target.value
																)
															}
															placeholder="Mẫu Thiết Kế"
															className="form-input w-full p-2 border border-gray-300 rounded-md"
														>
															{' '}
															<option value="">Mẫu thiết kế</option>
															{enums?.SettingType &&
																Object.keys(enums.SettingType).map(
																	(key) => (
																		<option
																			key={key}
																			value={
																				enums.SettingType[
																					key
																				]
																			}
																		>
																			{key.replace(
																				/([A-Z])/g,
																				' $1'
																			)}
																		</option>
																	)
																)}
														</select>

														<input
															type="number"
															value={spec.caratWeight}
															onChange={(e) =>
																handleSideDiamondChange(
																	index,
																	'caratWeight',
																	e.target.value
																)
															}
															placeholder="Trọng lượng Carat"
															className="form-input w-full p-2 border border-gray-300 rounded-md"
														/>
														<input
															type="number"
															value={spec.quantity}
															onChange={(e) =>
																handleSideDiamondChange(
																	index,
																	'quantity',
																	e.target.value
																)
															}
															placeholder="Số Lượng"
															className="form-input w-full p-2 border border-gray-300 rounded-md"
														/>
													</div>
													{errorCarat && (
														<p className="text-red text-sm mt-1">
															{errorCarat}
														</p>
													)}
													{!errorCarat && (
														<p className="text-gray text-sm mt-2">
															Hãy chắc chắn rằng trung bình mỗi viên
															kim cương tấm không vượt quá 0.18 ct
														</p>
													)}
													{/* Repeat other fields for each side diamond spec */}
												</div>
											))}
											<button
												onClick={handleAddSideDiamondSpec}
												className="text-blue-600"
											>
												+ Thêm bộ thông số khác
											</button>{' '}
										</Collapse.Panel>
									</Collapse>
								</div>

								<div className="p-6 border rounded-lg shadow-md bg-white">
									<Collapse
										defaultActiveKey={[]}
										ghost
										className="bg-white border rounded-lg shadow-md"
									>
										<Collapse.Panel
											header={
												<h2 className="text-xl font-semibold">
													Thông số kim loại
												</h2>
											}
											key="metalSize"
										>
											{metalSizeSpecs.map((spec, index) => (
												<div
													key={index}
													className="mb-4 border p-4 rounded-lg  bg-tintWhite"
												>
													<div className="flex justify-between">
														<h3 className="font-semibold text-lg mb-2">
															Lựa chọn kim loại thứ {index + 1}
														</h3>{' '}
														{metalSizeSpecs.length > 1 && (
															<button
																onClick={() =>
																	handleRemoveMetalSizeSpec(index)
																}
																className="text-red"
															>
																- Xóa
															</button>
														)}
													</div>
													<div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
														<select
															value={spec.metalId}
															onChange={(e) =>
																handleMetalSizeChange(
																	index,
																	'metalId',
																	e.target.value
																)
															}
															required
															className="form-input w-full p-2 border border-gray text-black rounded-md"
														>
															<option value="">Chọn kim loại</option>
															{Array.isArray(metals) &&
																metals.map((metal) => (
																	<option
																		className="text-black"
																		key={metal.id}
																		value={metal.Id}
																	>
																		{metal.Name}{' '}
																		{/* Display the metal name */}
																	</option>
																))}
														</select>

														{/* Unit Selector */}
														<select
															value={selectedUnit}
															onChange={handleUnitChange}
															className="form-input w-full p-2 border border-gray text-black rounded-md"
														>
															{sizes.map((unitData) => (
																<option
																	key={unitData.Unit}
																	value={unitData.Unit}
																>
																	{unitData.Unit}
																</option>
															))}
														</select>

														{/* Size Selector */}
														<select
															value={spec.sizeId}
															onChange={(e) =>
																handleMetalSizeChange(
																	index,
																	'sizeId',
																	e.target.value
																)
															}
															className="form-input w-full p-2 border border-gray text-black rounded-md"
														>
															{filteredSizes.map((size) => (
																<option
																	key={size.Id}
																	value={size.Id}
																>
																	{size.Value} {selectedUnit}
																</option>
															))}
														</select>

														<input
															type="number"
															value={spec.weight}
															onChange={(e) =>
																handleMetalSizeChange(
																	index,
																	'weight',
																	e.target.value
																)
															}
															required
															placeholder="Khối Lượng( grams)"
															className="form-input w-full p-2 border border-gray-300 rounded-md"
														/>
													</div>
												</div>
											))}
											<button
												onClick={handleAddMetalSizeSpec}
												className="text-blue-600"
											>
												+ Thêm bộ thông số khác
											</button>{' '}
										</Collapse.Panel>
									</Collapse>
								</div>
							</div>
						</div>
					</div>
					<div className="flex justify-end gap-4 mt-6">
						<button
							onClick={handleClear}
							className="py-2 px-6 text-white bg-gray rounded-md hover:bg-gray hover:text-white focus:outline-none"
						>
							Cài Lại
						</button>
						<button
							type="submit"
							onClick={handleSubmit}
							className="py-2 px-6 text-white bg-primary rounded-md hover:bg-secondary focus:outline-none"
						>
							Tạo
						</button>
					</div>
				</div>
			)}

			{/* Modal for Jewelry Model Detail */}
			{showModal && selectedModel && (
				<ModelDetailsView
					selectedModel={selectedModel}
					onEdit={() => {
						setIsEditModalVisible(true);
					}}
					onView={() => handleView(selectedModel.Id)}
					onDelete={() => {
						handleDeleteModel();
					}}
					onClose={handleCloseModal}
				/>
			)}

			{selectedModel && (
				<JewelryModelEditModal
					isVisible={isEditModalVisible}
					onClose={() => {
						setIsEditModalVisible(false);
					}}
					model={selectedModel}
				/>
			)}
		</div>
	);
};

export default JewelryModelPage;
