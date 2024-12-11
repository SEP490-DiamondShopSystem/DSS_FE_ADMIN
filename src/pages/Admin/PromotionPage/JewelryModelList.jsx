import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchAllJewelryModels} from '../../../redux/slices/jewelry/jewelryModelSlice';
import {fetchAllJewelryModelCategories} from '../../../redux/slices/jewelry/jewelryModelCategorySlice';

import {
	getAllJewelryModelsSelector,
	LoadingJewelryModelSelector,
	JewelryModelErrorSelector,
	getAllJewelryModelCategoriesSelector,
} from '../../../redux/selectors';
import {FilterOutlined, CloseOutlined, InfoCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Tooltip, Skeleton, Empty, Tag, Collapse, Divider} from 'antd';
const {Panel} = Collapse;

const DEFAULT_PLACEHOLDER_IMAGE = '/images/default-jewelry-placeholder.png';

const JewelryModelList = ({onSelectModel}) => {
	const dispatch = useDispatch();
	const models = useSelector(getAllJewelryModelsSelector);
	const loading = useSelector(LoadingJewelryModelSelector);
	const error = useSelector(JewelryModelErrorSelector);
	const categories = useSelector(getAllJewelryModelCategoriesSelector);

	// State Management
	const [filters, setFilters] = useState({
		name: '',
		category: '',
		isRhodiumFinished: null,
		isEngravable: null,
	});
	const [tempFilters, setTempFilters] = useState({...filters});
	const [pagination, setPagination] = useState({
		currentPage: 1,
		pageSize: 6,
		totalPages: 0,
	});
	const [showFilters, setShowFilters] = useState(false);
	const [selectedModel, setSelectedModel] = useState(null);

	// Fetch Data Effects
	useEffect(() => {
		dispatch(fetchAllJewelryModelCategories());
	}, [dispatch]);

	useEffect(() => {
		dispatch(
			fetchAllJewelryModels({
				Currentpage: pagination.currentPage,
				PageSize: pagination.pageSize,
				...filters,
			})
		).then((response) => {
			if (response?.payload?.TotalPage) {
				setPagination((prev) => ({
					...prev,
					totalPages: response.payload.TotalPage,
				}));
			}
		});
	}, [dispatch, filters, pagination.currentPage, pagination.pageSize]);

	// Handlers
	const handleTempFilterChange = (key, value) => {
		setTempFilters((prev) => ({...prev, [key]: value}));
	};

	const handleApplyFilters = () => {
		setFilters(tempFilters);
		setPagination((prev) => ({...prev, currentPage: 1}));
	};

	const handleModelSelect = (model) => {
		setSelectedModel(model);
	};

	// Render Functions
	const renderModelCard = (model) => (
		<div
			key={model.Id}
			onClick={() => handleModelSelect(model)}
			className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border flex min-h-[400px] mt-6"
		>
			<div className="absolute top-2 right-2">
				{model.IsEngravable && (
					<Tag color="blue" className="mb-1">
						Khắc được
					</Tag>
				)}
			</div>
			<div className="relative flex-grow">
				{model.Thumbnail?.MediaPath ? (
					<img
						src={model.Thumbnail.MediaPath}
						alt={model.Name}
						className="w-full h-20 object-cover rounded-t-xl"
					/>
				) : (
					<div className="w-full h-20 flex items-center justify-center rounded-t-xl text-gray-500 bg-tintWhite">
						Chưa có hình ảnh
					</div>
				)}
			</div>
			<div className="p-4 flex flex-col justify-between flex-grow">
				<h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">{model.Name}</h3>
				<p className="text-sm text-gray-600 mb-1">
					Loại: {model.Category?.Name || 'Không rõ'}
				</p>
				<p className="text-sm text-gray-600 mb-1">
					Kim loại hỗ trợ: {model.MetalSupported?.join(', ') || 'Không rõ'}
				</p>
				<p className="text-sm text-gray-600 mb-1">
					Tùy chọn kim cương phụ: {model.SideDiamondOptionCount || 0}
				</p>
				<div className="flex justify-between text-sm text-gray-600">
					<span>Kim cương chính: {model.MainDiamondCount || 0}</span>
					<span>Phí gia công: {model.CraftmanFee?.toLocaleString('vi-VN') || '0'} VND</span>
				</div>
			</div>
		</div>
	);

	const renderFilters = () => (
		<div
			className={`transition-all duration-300 ${
				showFilters ? 'max-h-96' : 'max-h-0 overflow-hidden'
			}`}
		>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
				<input
					type="text"
					placeholder="Tên mẫu"
					value={tempFilters.name}
					onChange={(e) => handleTempFilterChange('name', e.target.value)}
					className="p-2 border rounded-md"
				/>
				<select
					value={tempFilters.category}
					onChange={(e) => handleTempFilterChange('category', e.target.value)}
					className="p-2 border rounded-md"
				>
					<option value="">Tất cả danh mục</option>
					{categories.map((cat) => (
						<option key={cat.id} value={cat.Name}>
							{cat.Name}
						</option>
					))}
				</select>
				<select
					value={tempFilters.isEngravable ?? ''}
					onChange={(e) =>
						handleTempFilterChange(
							'isEngravable',
							e.target.value === '' ? null : e.target.value === 'true'
						)
					}
					className="p-2 border rounded-md"
				>
					<option value="">Khắc Được</option>
					<option value="true">Có</option>
					<option value="false">Không</option>
				</select>
			</div>
			<div className="flex justify-end p-4">
				<Button type="primary" onClick={handleApplyFilters}>
					Áp dụng bộ lọc
				</Button>
			</div>
		</div>
	);

	const renderPagination = () => (
		<div className="flex justify-center items-center space-x-4 mt-6">
			<Button
				disabled={pagination.currentPage === 1}
				onClick={() =>
					setPagination((prev) => ({...prev, currentPage: prev.currentPage - 1}))
				}
			>
				Trước
			</Button>
			<span>
				Trang {pagination.currentPage} / {pagination.totalPages}
			</span>
			<Button
				disabled={pagination.currentPage === pagination.totalPages}
				onClick={() =>
					setPagination((prev) => ({...prev, currentPage: prev.currentPage + 1}))
				}
			>
				Sau
			</Button>
		</div>
	);

	const renderModelDetails = () =>
		selectedModel && (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
				<div className="bg-white rounded-2xl w-11/12 md:w-3/4 lg:w-2/3 max-h-3/4 p-6 ">
					<button
						onClick={() => setSelectedModel(null)}
						className="absolute top-4 left-4 text-gray hover:text-gray-900"
					>
						<CloseOutlined className="text-2xl" />
					</button>
					<div className="flex flex-col md:flex-row gap-6">
						<div className="md:w-1/3">
							<div className="min-h-[300px] min-w-[300px] flex items-center justify-center">
								<img
									src={
										selectedModel.Thumbnail?.MediaPath ||
										DEFAULT_PLACEHOLDER_IMAGE
									}
									alt={selectedModel.Name}
									className="w-full rounded-lg shadow-md object-cover"
								/>
							</div>
						</div>

						<div className="md:w-2/3 overflow-y-visible h-">
							<h2 className="text-2xl font-bold mb-4">{selectedModel.Name}</h2>

							{/* Basic Model Information */}
							<div className="grid grid-cols-2 gap-4 mb-4">
								<div>
									<p className="font-semibold">Danh Mục</p>
									<p>{selectedModel.Category?.Name}</p>
								</div>
								<div>
									<p className="font-semibold">Mã Mẫu</p>
									<p>{selectedModel.ModelCode}</p>
								</div>
								<div>
									<p className="font-semibold">Phí Chế Tác</p>
									<p>{selectedModel.CraftmanFee.toLocaleString()} VND</p>
								</div>
								<div>
									<div>
										{selectedModel.IsEngravable && (
											<Tag color="blue" className="mb-1">
												Có Thể Khắc
											</Tag>
										)}
									</div>
								</div>
								<div className="mb-2">
									<p className="font-semibold">Số Lượng Kim Cương Chính</p>
									<p>{selectedModel.MainDiamondCount} viên</p>
								</div>
								<div className="mb-2">
									<p className="font-semibold">Số Lượng Kim Cương Phụ</p>
									<p>{selectedModel.SideDiamondOptionCount} viên</p>
								</div>
								<div className="grid grid-cols-2 gap-2">
									{selectedModel.Width !== null && (
										<div>
											<p className="font-semibold">Độ Rộng</p>
											<p>{selectedModel.Width} mm</p>
										</div>
									)}
									{selectedModel.Length !== null && (
										<div>
											<p className="font-semibold">Chiều Dài</p>
											<p>{selectedModel.Length} mm</p>
										</div>
									)}
									{selectedModel.ChainType && (
										<div>
											<p className="font-semibold">Loại Dây Chuyền</p>
											<p>{selectedModel.ChainType}</p>
										</div>
									)}
									{selectedModel.ClaspType && (
										<div>
											<p className="font-semibold">Loại Khóa</p>
											<p>{selectedModel.ClaspType}</p>
										</div>
									)}
								</div>
							</div>

							{/* Detailed Specifications Collapse */}
							<Collapse defaultActiveKey={['1']} accordion>
								{/* Main Diamond Specifications */}
								<Panel header="Thông Số Kim Cương Chính" key="1">
									<div>
										{selectedModel.MainDiamonds &&
										selectedModel.MainDiamonds.length > 0 ? (
											selectedModel.MainDiamonds.map((mainDiamond, index) => (
												<div
													key={mainDiamond.Id}
													className="border-b pb-4 mb-4"
												>
													<h3 className="text-lg font-semibold mb-2">
														Kim Cương Chính {index + 1}
													</h3>
													<div className="grid grid-cols-3 gap-2">
														{/* <div>
															<p className="font-semibold">Carat</p>
															<p>{mainDiamond.CaratWeight} ct</p>
														</div> */}
														{/* <div>
															<p className="font-semibold">
																Độ Tinh Khiết
															</p>
															<p>{`${mainDiamond.ClarityMin} - ${mainDiamond.ClarityMax}`}</p>
														</div>
														<div>
															<p className="font-semibold">Màu Sắc</p>
															<p>{`${mainDiamond.ColorMin} - ${mainDiamond.ColorMax}`}</p>
														</div> */}
														<div>
															<p className="font-semibold">
																Hình Dạng
															</p>
															<div>
																{mainDiamond.Shapes.map((shape) => (
																	<Tag
																		key={shape.Shape.Id}
																		color="green"
																	>
																		{shape.Shape.ShapeName}
																	</Tag>
																))}
															</div>
														</div>
														<div>
															<p className="font-semibold">
																Khoảng Carat Cho Phép
															</p>
															<p>{`${mainDiamond.Shapes[0].CaratFrom} - ${mainDiamond.Shapes[0].CaratTo} ct`}</p>
														</div>
														<div>
															<p className="font-semibold">
																Số Lượng
															</p>
															<p>{mainDiamond.Quantity} viên</p>
														</div>
													</div>
												</div>
											))
										) : (
											<p>Không có thông tin kim cương chính</p>
										)}
									</div>
								</Panel>

								{/* Side Diamonds */}
								{selectedModel.SideDiamonds &&
									selectedModel.SideDiamonds.length > 0 && (
										<Panel header="Kim Cương Phụ" key="2">
											<div className="grid grid-cols-3 gap-2">
												{selectedModel.SideDiamonds.map(
													(sideDiamond, index) => (
														<div key={sideDiamond.Id}>
															<p className="font-semibold">
																Kim Cương {index + 1}
															</p>
															<p>
																Carat: {sideDiamond.CaratWeight} ct
															</p>
															<p>
																Hình Dạng:{' '}
																{sideDiamond.Shape.ShapeName}
															</p>
															<p>
																Độ Tinh Khiết:{' '}
																{`${sideDiamond.ClarityMin} - ${sideDiamond.ClarityMax}`}
															</p>
															<p>
																Màu Sắc:{' '}
																{`${sideDiamond.ColorMin} - ${sideDiamond.ColorMax}`}
															</p>
														</div>
													)
												)}
											</div>
										</Panel>
									)}

								{/* Metal Options */}
								<Panel header="Lựa Chọn Kim Loại" key="3">
									<div>
										<p className="font-semibold mb-2">Kim Loại Hỗ Trợ</p>
										<div className="flex flex-wrap gap-2">
											{selectedModel.MetalSupported.map((metal) => (
												<Tag key={metal} color="purple">
													{metal}
												</Tag>
											))}
										</div>
									</div>
									{selectedModel.SizeMetals && (
										<div className="mt-4">
											<p className="font-semibold mb-2">Kích Thước Sẵn Có</p>
											<div className="grid grid-cols-4 gap-2 max-h-3 overflow-y-scroll">
												{' '}
												{selectedModel.SizeMetals.map((sizeMetalOption) => (
													<div
														key={`${sizeMetalOption.SizeId}-${sizeMetalOption.MetalId}`}
														className="border rounded p-2 text-center"
													>
														<p>
															{sizeMetalOption.Size.Value}{' '}
															{sizeMetalOption.Size.Unit}
														</p>
														<p className="text-sm text-gray-600">
															{sizeMetalOption.Metal.Name}
															{sizeMetalOption.Metal.Price && (
																<span className="ml-2 text-gray-500">
																	(
																	{sizeMetalOption.Metal.Price.toLocaleString()}{' '}
																	VND)
																</span>
															)}
														</p>
														<p className="text-xs text-gray-500">
															Trọng Lượng: {sizeMetalOption.Weight} g
														</p>
													</div>
												))}
											</div>
										</div>
									)}
								</Panel>
							</Collapse>

							<div className="mt-4">
								<p className="font-semibold">Mô Tả</p>
								<p className="text-gray-600">{selectedModel.Description}</p>
							</div>

							<Button
								type="primary"
								icon={<PlusOutlined />}
								className="mt-4"
								onClick={() => {
									onSelectModel?.(selectedModel);
									setSelectedModel(null);
								}}
							>
								Chọn Mẫu Này
							</Button>
						</div>
					</div>
				</div>
			</div>
		);
	// Main Render
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold text-gray-800">Bộ Sưu Tập Trang Sức</h1>
				<Tooltip title="Lọc mẫu trang sức">
					<Button icon={<FilterOutlined />} onClick={() => setShowFilters(!showFilters)}>
						Bộ Lọc
					</Button>
				</Tooltip>
			</div>

			{renderFilters()}

			{loading ? (
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{[...Array(6)].map((_, index) => (
						<Skeleton key={index} active avatar paragraph={{rows: 2}} />
					))}
				</div>
			) : error ? (
				<div className="text-center">
					<p className="text-red-500">{error}</p>
				</div>
			) : models?.length > 0 ? (
				<>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{models.map(renderModelCard)}
					</div>
					{renderPagination()}
				</>
			) : (
				<Empty description="Không tìm thấy mẫu trang sức" />
			)}

			{renderModelDetails()}
		</div>
	);
};

export default JewelryModelList;
