import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
	fetchAllJewelryModels,
	createJewelryModel,
	deleteJewelryModel,
	deleteSideDiamondOption,
	deleteSizeMetalFromJewelryModel,
	createSideDiamondOptionForJewelryModel,
	createSizeMetalForJewelryModel,
	updateSizeMetalForJewelryModel,
	changeVisibilityJewelryModel,
} from '../../../../redux/slices/jewelry/jewelryModelSlice';
import {
	Button,
	Checkbox,
	Image,
	Input,
	message,
	Modal,
	Popover,
	Select,
	Slider,
	Space,
	Table,
	Tag,
} from 'antd';
import {fetchAllMetals} from '../../../../redux/slices/jewelry/metalSlice';
import {fetchAllSizes} from '../../../../redux/slices/jewelry/sizeSlice';
import {fetchAllShapes} from '../../../../redux/slices/shapeSlice';
import {fetchAllEnums} from '../../../../redux/slices/jewelry/enumSlice';
import {fetchAllJewelryModelCategories} from '../../../../redux/slices/jewelry/jewelryModelCategorySlice';
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
} from '../../../../redux/selectors';
import {JewelryModelUploadForm} from './JewelryModelUploadForm';
import Loading from '../../../../components/Loading';

const JewelryModelPage = () => {
	const dispatch = useDispatch();
	const models = useSelector(getAllJewelryModelsSelector);
	const [isMainDiamondsOpen, setIsMainDiamondsOpen] = useState(false);
	const [isSizeMetalsOpen, setIsSizeMetalsOpen] = useState(false);
	const [isSideDiamondsOpen, setIsSideDiamondsOpen] = useState(false);
	const loading = useSelector(LoadingJewelryModelSelector);
	const error = useSelector(JewelryModelErrorSelector);
	const [selectedJewelryModelId, setSelectedJewelryModelId] = useState();
	const [isFormVisible, setIsFormVisible] = useState(false); // for controlling the form visibility
	const [isEditModalVisible, setIsEditModalVisible] = useState(false);
	const [name, setName] = React.useState('');
	const [category, setCategory] = React.useState('');
	const [isRhodiumFinished, setIsRhodiumFinished] = React.useState('');
	const [isEngravable, setIsEngravable] = React.useState('');
	const [currentPage, setCurrentPage] = React.useState(1);
	const [pageSize, setPageSize] = React.useState(5);
	const [totalPage, setTotalPage] = useState(0);
	const [errorCarat, setErrorCarat] = useState('');

	const [newModel, setNewModel] = useState({
		name: '',
		description: '',
		metalId: '',
		sizeId: '',
		sideDiamond: false,
	});
	const [modelSpec, setModelSpec] = useState({
		name: '',
		code: '',
		categoryId: '',
		craftManFee: '',
		width: '',
		length: '',
		isEngravable: false,
		isRhodiumFinish: false,
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
				Category: category,
				// IsRhodiumFinished: isRhodiumFinished,
				IsEngravable: isEngravable,
			})
		)
			.then((response) => {
				console.log('API response:', response); // Log the full response to the console
				// Assuming the response contains TotalPage data
				if (response && response.payload.TotalPage) {
					setTotalPage(response.payload.TotalPage);
				}
			})
			.catch((error) => {
				message.error(error?.data?.title || error?.detail);
			});
	}, [dispatch, name, category, isRhodiumFinished, isEngravable, currentPage, pageSize]);
	const metals = useSelector(getAllMetalsSelector); // Selector for getting metals from the store
	useEffect(() => {
		dispatch(fetchAllMetals());
	}, [dispatch]);
	const sizes = useSelector(getAllSizesSelector); // Selector for getting metals from the store
	useEffect(() => {
		dispatch(fetchAllSizes());
	}, [dispatch]);
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
	const handleMainDiamondChange = (index, field, value) => {
		const updatedMainDiamondSpecs = [...mainDiamondSpecs];
		updatedMainDiamondSpecs[index][field] = value;
		setMainDiamondSpecs(updatedMainDiamondSpecs);
		console.log(`Updated Main Diamond Spec [${index}] field ${field}:`, value);
	};
	const handleShapeChange = (mainIndex, shapeIndex, field, value) => {
		setMainDiamondSpecs((prevState) => {
			const updatedSpecs = [...prevState];
			updatedSpecs[mainIndex].shapeSpecs[shapeIndex][field] = value;
			return updatedSpecs;
		});
	};
	const handleSideDiamondChange = (index, field, value) => {
		// Update the side diamond specs first
		setSideDiamondSpecs((prevState) => {
			const updatedSpecs = [...prevState];
			updatedSpecs[index][field] = value;

			// Calculate CaratWeight / Quantity after updating
			const {caratWeight, quantity} = updatedSpecs[index];
			const caratPerDiamond = caratWeight && quantity ? caratWeight / quantity : 0;

			// Validation check
			if (caratPerDiamond >= 0.18) {
				setErrorCarat(
					`Carat Weight per diamond must be less than 0.18. Currently: ${caratPerDiamond.toFixed(
						2
					)}`
				);
			} else {
				setErrorCarat(''); // Clear error if the condition is met
			}

			return updatedSpecs;
		});
	};

	const handleMetalSizeChange = (index, field, value) => {
		setMetalSizeSpecs((prevState) => {
			const updatedSpecs = [...prevState];
			updatedSpecs[index][field] = value;
			return updatedSpecs;
		});
	};
	const handleAddMainDiamondSpec = () => {
		setMainDiamondSpecs([
			...mainDiamondSpecs,
			{
				settingType: '',
				quantity: '',
				shapeSpecs: [{shapeId: '', caratFrom: '', caratTo: ''}],
			},
		]);
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
		console.log(`Model clicked: ${model.Name}`);
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
				console.log('Jewelry model created successfully:', formData);
			})
			.catch((error) => {
				message.error(error?.data?.title || error?.detail);
			});
		dispatch(
			fetchAllJewelryModels({
				Currentpage: currentPage,
				PageSize: pageSize,
				Name: name,
				Category: category,
				// IsRhodiumFinished: isRhodiumFinished,
				IsEngravable: isEngravable,
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
							Category: category,
							// IsRhodiumFinished: isRhodiumFinished,
							IsEngravable: isEngravable,
						})
					);
				})
				.catch((error) => {
					message.error(
						error?.title || error?.detail || 'Mẫu trang sức đang được sử dụng'
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
			<h1 className="text-3xl font-semibold text-primary mb-6">Mẫu Trang Sức</h1>

			{/* Loading and Error Handling */}
			{loading ? (
				<Loading />
			) : (
				<div>
					{/* Models List */}
					<div className=" p-4 mb-6 bg-offWhite">
						{/* Filters */}
						<div className="mb-4 flex flex-wrap gap-4">
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Nhập tên mẫu"
								className="form-input p-2 border border-gray-300 rounded-md"
							/>
							<select
								value={category}
								onChange={(e) => setCategory(e.target.value)}
								placeholder="Nhập theo loại mẫu"
								className="form-input p-2 border border-gray-300 rounded-md"
							>
								{categories.map((category) => (
									<option key={category.id} value={category.Name}>
										{category.Name}
									</option>
								))}
							</select>
							{/* <select
								value={isRhodiumFinished}
								onChange={(e) => setIsRhodiumFinished(e.target.value === 'true')}
								className="form-select p-2 border border-gray-300 rounded-md"
							>
								<option value="">Rhodium Finished?</option>
								<option value="true">Yes</option>
								<option value="false">No</option>
							</select> */}
							<select
								value={isEngravable}
								onChange={(e) => setIsEngravable(e.target.value === 'true')}
								className="form-select p-2 border border-gray-300 rounded-md"
							>
								<option value="">Có thể khác chữ?</option>
								<option value="true">Có</option>
								<option value="false">Không</option>
							</select>
						</div>
						{loading ? (
							<p>Đang tải...</p>
						) : (
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
											-{' '}
											<span className="text-gray-600">
												{model.Description}
											</span>
											<div className="text-sm text-gray-500">
												Option kim cương tấm: {model.SideDiamondOptionCount}
											</div>
											{/* Displaying more model details conditionally */}
											{model.IsEngravable && (
												<div className="text-sm text-gray-500">
													Có khắc chữ
												</div>
											)}
											{model.IsRhodiumFinish && (
												<div className="text-sm text-gray-500">
													Mạ Rhodium
												</div>
											)}
											{model.MainDiamondCount > 0 && (
												<div className="text-sm text-gray-500">
													Kim cương chính: {model.MainDiamondCount} viên
												</div>
											)}
											{model.MetalSupported &&
												model.MetalSupported.length > 0 && (
													<div className="text-sm text-gray-500">
														Kim loại: {model.MetalSupported.join(', ')}
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
						)}{' '}
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
								{/* Model Spec Fields */}
								<div className="p-6 border border-black rounded-lg shadow-md bg-white">
									<h2 className="text-xl font-semibold text-black mb-4">
										Thông Số Mẫu Trang Sức
									</h2>
									<div className="grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-5 gap-5 p-6 border border-black rounded-lg shadow-md bg-tintWhite">
										{Object.keys(modelSpec).map((field) => (
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
												) : typeof modelSpec[field] === 'boolean' ? (
													// Render a checkbox for boolean fields
													<div className="flex items-center">
														<input
															type="checkbox"
															name={field}
															checked={modelSpec[field]}
															onChange={handleInputChange}
															className="form-checkbox h-5 w-5 text-blue transition duration-200 ease-in-out focus:ring-blue rounded focus:outline-none"
														/>
														<label
															htmlFor={field}
															className="ml-2 text-gray"
														>
															{field.replace(/([A-Z])/g, ' $1')}
														</label>
													</div>
												) : (
													// Render a text input for other fields
													<input
														placeholder={field.replace(
															/([A-Z])/g,
															' $1'
														)}
														type="text"
														name={field}
														value={modelSpec[field]}
														required
														onChange={handleInputChange}
														className="form-input w-full p-3 border border-gray rounded-md shadow-sm transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue focus:border-primary placeholder-gray"
													/>
												)}
											</div>
										))}
									</div>
								</div>

								<div className="p-6 border rounded-lg shadow-md bg-white">
									<h2 className="text-xl font-semibold mb-4">
										Thông số kim cương chính
									</h2>
									{mainDiamondSpecs.map((spec, index) => (
										<div
											key={index}
											className="mb-4 border p-4 rounded-md bg-tintWhite"
										>
											<div className="flex justify-between">
												<h3 className="font-semibold text-lg mb-2">
													Kim cương chính {index + 1}
												</h3>
												{mainDiamondSpecs.length > 1 && (
													<button
														onClick={() =>
															handleRemoveMainDiamondSpec(index)
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
														<option value="">Mẫu Thiết Kế</option>
														{enums?.SettingType &&
															Object.keys(enums.SettingType).map(
																(key) => (
																	<option
																		key={key}
																		value={
																			enums.SettingType[key]
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
												</div>

												<input
													label=""
													type="number"
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
												{spec.shapeSpecs.map((shape, shapeIndex) => (
													<div key={shapeIndex} className=" mb-2">
														<div className="flex justify-between">
															<h3 className="font-semibold text-lg mb-2">
																Hình dáng {shapeIndex + 1}
															</h3>
															{spec.shapeSpecs.length > 1 && (
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
												))}
												<button
													onClick={() => handleAddShapeSpec(index)}
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
								</div>
							</div>
							<div className="flex flex-col gap-5">
								{/* Side Diamond Specs Section */}
								<div className="p-6 border rounded-lg shadow-md bg-white">
									<h2 className="text-xl font-semibold mb-4">
										Thông số kim cương tấm
									</h2>

									{sideDiamondSpecs.map((spec, index) => (
										<div
											key={index}
											className="mb-4 border p-4 rounded-md bg-tintWhite"
										>
											<div className="flex justify-between">
												<h3 className="font-semibold text-lg mb-2">
													Kim cương tấm {index + 1}
												</h3>{' '}
												{sideDiamondSpecs.length > 1 && (
													<button
														onClick={() =>
															handleRemoveSideDiamondSpec(index)
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
															<option key={shape.id} value={shape.Id}>
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
													<option value="">Color thấp nhất</option>
													{enums?.Color &&
														Object.keys(enums.Color).map((key) => (
															<option
																key={key}
																value={enums.Color[key]}
															>
																{key.replace(/([A-Z])/g, ' $1')}
															</option>
														))}
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
														Object.keys(enums.Color).map((key) => (
															<option
																key={key}
																value={enums.Color[key]}
															>
																{key.replace(/([A-Z])/g, ' $1')}
															</option>
														))}
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
													<option value="">Clarity thấp nhất</option>
													{enums?.Clarity &&
														Object.keys(enums.Clarity).map((key) => (
															<option
																key={key}
																value={enums.Clarity[key]}
															>
																{key.replace(/([A-Z])/g, ' $1')}
															</option>
														))}
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
													<option value="">Clarity cao nhất</option>
													{enums?.Clarity &&
														Object.keys(enums.Clarity).map((key) => (
															<option
																key={key}
																value={enums.Clarity[key]}
															>
																{key.replace(/([A-Z])/g, ' $1')}
															</option>
														))}
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
																	value={enums.SettingType[key]}
																>
																	{key.replace(/([A-Z])/g, ' $1')}
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
													Hãy chắc chắn rằng trung bình mỗi viên kim cương
													tấm không vượt quá 0.18 ct
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
									</button>
								</div>

								{/* Metal Size Specs Section */}
								<div className="p-6 border rounded-lg shadow-md bg-white">
									<h2 className="text-xl font-semibold mb-4">
										Thông số kim loại
									</h2>
									{metalSizeSpecs.map((spec, index) => (
										<div
											key={index}
											className="mb-4 border p-4 rounded-md bg-gray-50  bg-tintWhite"
										>
											<div className="flex justify-between">
												<h3 className="font-semibold text-lg mb-2">
													Kim loại {index + 1}
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

												<select
													value={spec.sizeId}
													onChange={(e) =>
														handleMetalSizeChange(
															index,
															'sizeId',
															e.target.value
														)
													}
													required
													placeholder="Size ID"
													className="form-input w-full p-2 border border-gray text-black rounded-md"
												>
													{' '}
													<option value="">Chọn size</option>
													{Array.isArray(sizes) &&
														sizes.map((size) => (
															<option
																className="text-black"
																key={size.id}
																value={size.id}
															>
																{size.Value}{' '}
																{/* Display the metal name */}
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
													placeholder="Khối Lượng"
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
									</button>
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
				<div className="fixed inset-0 bg-gray bg-opacity-50 flex justify-center items-center p-3 z-50">
					<div className="bg-white p-4 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-2/3">
						<h2 className="text-3xl font-semibold text-primary mb-6 text-center">
							Chi Tiết Mẫu
						</h2>

						<div className="flex gap-8">
							{/* Cột Bên Trái */}
							<div className="flex-1">
								<p className="text-lg font-medium text-gray">
									<strong>Tên:</strong> {selectedModel.Name}
								</p>
								<p className="text-lg font-medium text-gray">
									<strong>Danh Mục:</strong> {selectedModel.Category.Name}
								</p>
								<p className="text-lg font-medium text-gray">
									<strong>Mã Mẫu:</strong> {selectedModel.ModelCode}
								</p>
								<p className="text-lg font-medium text-gray">
									<strong>Phí Chế Tác:</strong> {selectedModel.CraftmanFee} VND
								</p>
								<p className="text-lg font-medium text-gray">
									<strong>Mô Tả:</strong> {selectedModel.Description}
								</p>
								<p className="text-lg font-medium text-gray">
									<strong>Chiều Rộng:</strong> {selectedModel.Width} mm
								</p>
								<p className="text-lg font-medium text-gray">
									<strong>Có Khắc Được:</strong>{' '}
									{selectedModel.IsEngravable ? 'Có' : 'Không'}
								</p>
							</div>

							{/* Cột Bên Phải */}
							<div className="flex-1">
								<p className="text-lg font-medium text-gray">
									<strong>Số Lượng Kim Cương Chính:</strong>{' '}
									{selectedModel.MainDiamondCount}
								</p>
								<p className="text-lg font-medium text-gray">
									<strong>Số Lượng Tùy Chọn Kim Cương Phụ:</strong>{' '}
									{selectedModel.SideDiamondOptionCount}
								</p>
								{/* <p className="text-lg font-medium text-gray">
									<strong>Xi Rhodium:</strong>{' '}
									{selectedModel.IsRhodiumFinish ? 'Có' : 'Không'}
								</p> */}
								<p className="text-lg font-medium text-gray">
									<strong>Kim Loại Hỗ Trợ:</strong>{' '}
									{selectedModel.MetalSupported.join(', ')}
								</p>
							</div>
						</div>

						<div className="flex space-x-4 mt-4">
							<Button
								type="primary"
								size="large"
								onClick={() => {
									setSelectedJewelryModelId(selectedModel.Id);
									setIsEditModalVisible(true);
								}}
								className="flex-1"
							>
								Sửa Mẫu
							</Button>
							<Button
								type="primary"
								size="large"
								onClick={() => handleView(selectedModel.Id)}
								className="flex-1"
							>
								Xem Mẫu
							</Button>
						</div>

						{/* Phần Kim Cương Chính */}
						{selectedModel.MainDiamonds && selectedModel.MainDiamonds.length > 0 && (
							<div className="mt-6">
								<h3
									className="text-xl font-semibold cursor-pointer"
									onClick={() => setIsMainDiamondsOpen(!isMainDiamondsOpen)}
								>
									Kim Cương Chính {isMainDiamondsOpen ? '▲' : '▼'}
								</h3>
								{isMainDiamondsOpen && (
									<ul className="space-y-4 mt-3 pl-4 max-h-24 overflow-y-auto border rounded-md">
										{selectedModel.MainDiamonds.map((diamond, index) => (
											<li key={index} className="border-b pb-4">
												<div className="flex justify-between px-5 py-2">
													<div>
														<p className="text-gray">
															<strong>Loại:</strong>{' '}
															{diamond.SettingType}
														</p>
													</div>
													<div>
														<p className="text-gray">
															<strong>Số Lượng:</strong>{' '}
															{diamond.Quantity}
														</p>
													</div>
													<div>
														<p className="text-gray">
															<strong>
																ID Yêu Cầu Kim Cương Chính:
															</strong>{' '}
															{diamond.MainDiamondReqId || 'Không Có'}
														</p>
													</div>
													<div>
														{diamond.Shapes &&
														diamond.Shapes.length > 0 ? (
															diamond.Shapes.map(
																(shape, shapeIndex) => (
																	<div
																		key={shapeIndex}
																		className="pl-4 gap-3 flex justify-between"
																	>
																		<p className="text-gray">
																			<strong>
																				Hình Dáng:
																			</strong>{' '}
																			{shape.Shape
																				?.ShapeName ||
																				'Không Có'}
																		</p>

																		<p className="text-gray">
																			<strong>
																				Khoảng Carat:
																			</strong>{' '}
																			{shape.CaratFrom} -{' '}
																			{shape.CaratTo} carats
																		</p>
																	</div>
																)
															)
														) : (
															<p className="text-gray">
																Hình Dáng Không Có
															</p>
														)}
													</div>
												</div>
											</li>
										))}
									</ul>
								)}
							</div>
						)}

						{/* Phần Kích Thước Kim Loại */}
						{selectedModel.SizeMetals && selectedModel.SizeMetals.length > 0 && (
							<div className="mt-6">
								<h3
									className="text-xl font-semibold cursor-pointer"
									onClick={() => setIsSizeMetalsOpen(!isSizeMetalsOpen)}
								>
									Kích Thước Kim Loại {isSizeMetalsOpen ? '▲' : '▼'}
								</h3>
								{isSizeMetalsOpen && (
									<ul className="space-y-4 mt-3 pl-4 max-h-24 overflow-y-auto border rounded-md">
										{selectedModel.SizeMetals.map((sizeMetal, index) => (
											<li key={index} className="border-b pb-4">
												<div className="flex justify-between px-5 py-2">
													<div>
														<p className="text-gray">
															<strong>Kích Thước:</strong>{' '}
															{sizeMetal.Size.Value}{' '}
															{sizeMetal.Size.Unit}
														</p>
													</div>
													<div>
														<p className="text-gray">
															<strong>Kim Loại:</strong>{' '}
															{sizeMetal.Metal.Name}
														</p>
													</div>
													<div>
														<p className="text-gray">
															<strong>Trọng Lượng:</strong>{' '}
															{sizeMetal.Weight} g
														</p>
													</div>
													<div>
														<p className="text-gray">
															<strong>Giá:</strong>{' '}
															{sizeMetal.Metal.Price} VND
														</p>
													</div>
												</div>
											</li>
										))}
									</ul>
								)}
							</div>
						)}

						{/* Phần Kim Cương Phụ */}
						{selectedModel.SideDiamonds && selectedModel.SideDiamonds.length > 0 && (
							<div className="mt-6">
								<h3
									className="text-xl font-semibold cursor-pointer"
									onClick={() => setIsSideDiamondsOpen(!isSideDiamondsOpen)}
								>
									Kim Cương Phụ {isSideDiamondsOpen ? '▲' : '▼'}
								</h3>
								{isSideDiamondsOpen && (
									<ul className="space-y-4 mt-3 pl-4 max-h-24 overflow-y-auto border rounded-md">
										{selectedModel.SideDiamonds.map((sideDiamond, index) => (
											<li key={index} className="border-b pb-4">
												<div className="flex justify-between px-5 py-2">
													<div>
														<p className="text-gray">
															<strong>Trọng Lượng Carat:</strong>{' '}
															{sideDiamond.CaratWeight}
														</p>
													</div>
													<div>
														<p className="text-gray">
															<strong>Loại Gắn:</strong>{' '}
															{sideDiamond.SettingType}
														</p>
													</div>
													<div>
														<p className="text-gray">
															<strong>Số Lượng:</strong>{' '}
															{sideDiamond.Quantity}
														</p>
													</div>
													<div>
														<p className="text-gray">
															<strong>Khoảng Màu:</strong>{' '}
															{sideDiamond.ColorMin} -{' '}
															{sideDiamond.ColorMax}
														</p>
													</div>
													<div>
														<p className="text-gray">
															<strong>Khoảng Độ Tinh Khiết:</strong>{' '}
															{sideDiamond.ClarityMin} -{' '}
															{sideDiamond.ClarityMax}
														</p>
													</div>
												</div>
											</li>
										))}
									</ul>
								)}
							</div>
						)}

						{isEditModalVisible && (
							<JewelryModelEditModal
								isVisible={isEditModalVisible}
								onClose={() => setIsEditModalVisible(false)}
								model={selectedModel}
							/>
						)}
						{/* Nút Xóa và Đóng */}
						<div className="flex gap-4 mt-6">
							<Button
								type="danger"
								onClick={handleDeleteModel}
								className="flex-1 bg-red text-white rounded-md hover:bg-red-600"
							>
								Xóa Mẫu
							</Button>
							<Button
								onClick={handleCloseModal}
								className="flex-1 bg-gray text-white rounded-md hover:bg-gray-800"
							>
								Đóng
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default JewelryModelPage;
