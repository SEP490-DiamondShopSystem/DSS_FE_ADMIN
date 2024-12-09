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
import {Button, Tooltip, Skeleton, Empty, Tag} from 'antd';

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

	const handleImageError = (e) => {
		e.target.src = DEFAULT_PLACEHOLDER_IMAGE;
		e.target.onerror = null; // Prevent infinite loop if placeholder also fails
	};

	// Render Functions
	const renderModelCard = (model) => (
		<div
			key={model.Id}
			onClick={() => handleModelSelect(model)}
			className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border flex flex-col min-h-[320px]"
		>
			<div className="relative flex-grow">
				{model.Thumbnail?.MediaPath ? (
					<img
						src={model.Thumbnail.MediaPath}
						alt={model.Name}
						className="w-full h-48 object-cover rounded-t-lg"
						onError={handleImageError}
					/>
				) : (
					<div className="w-full h-48 flex items-center justify-center rounded-t-lg text-gray-500 bg-tintWhite">
						Chưa có hình ảnh
					</div>
				)}
				<div className="absolute top-2 right-2">
					{model.IsEngravable && (
						<Tag color="blue" className="mb-1">
							Khắc được
						</Tag>
					)}
					{model.IsRhodiumFinish && <Tag color="purple">Xi Rhodium</Tag>}
				</div>
			</div>
			<div className="p-4 flex flex-col justify-between flex-grow">
				<h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">{model.Name}</h3>
				<div className="flex justify-between text-sm text-gray-600">
					<span>Kim Cương: {model.MainDiamondCount}</span>
					<span>Phí: {model.CraftmanFee} VND</span>
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
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
				<div className="bg-white rounded-2xl w-11/12 md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-y-auto p-6 relative">
					<button
						onClick={() => setSelectedModel(null)}
						className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
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
									onError={handleImageError}
									className="w-full rounded-lg shadow-md object-cover"
								/>
							</div>
						</div>

						<div className="md:w-2/3">
							<h2 className="text-2xl font-bold mb-4">{selectedModel.Name}</h2>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="font-semibold">Danh Mục</p>
									<p>{selectedModel.Category?.Name}</p>
								</div>
								<div>
									<p className="font-semibold">Mã Mẫu</p>
									<p>{selectedModel.ModelCode}</p>
								</div>
								<div>
									<p className="font-semibold">Kim Cương Chính</p>
									<p>{selectedModel.MainDiamondCount} viên</p>
								</div>
								<div>
									<p className="font-semibold">Phí Chế Tác</p>
									<p>{selectedModel.CraftmanFee} VND</p>
								</div>
							</div>
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
