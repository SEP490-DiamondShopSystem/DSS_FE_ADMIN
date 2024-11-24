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
import {Button} from 'antd';

const JewelryModelList = ({onSelectModel}) => {
	const dispatch = useDispatch();
	const models = useSelector(getAllJewelryModelsSelector);
	const [isMainDiamondsOpen, setIsMainDiamondsOpen] = useState(false);
	const [isSizeMetalsOpen, setIsSizeMetalsOpen] = useState(false);
	const [isSideDiamondsOpen, setIsSideDiamondsOpen] = useState(false);
	const loading = useSelector(LoadingJewelryModelSelector);
	const error = useSelector(JewelryModelErrorSelector);
	const categories = useSelector(getAllJewelryModelCategoriesSelector);
	const [name, setName] = React.useState('');
	const [category, setCategory] = React.useState('');
	const [isRhodiumFinished, setIsRhodiumFinished] = React.useState('');
	const [isEngravable, setIsEngravable] = React.useState('');
	const [currentPage, setCurrentPage] = React.useState(1);
	const [pageSize, setPageSize] = React.useState(5);
	const [totalPage, setTotalPage] = useState(0);
	const [errorCarat, setErrorCarat] = useState('');

	const [showModal, setShowModal] = useState(false);
	const [selectedModel, setSelectedModel] = useState(null);

	// Fetch Models and Categories
	useEffect(() => {
		dispatch(
			fetchAllJewelryModels({
				Currentpage: currentPage,
				PageSize: pageSize,
				Name: name,
				Category: category,
				IsRhodiumFinished: isRhodiumFinished,
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
	useEffect(() => {
		dispatch(fetchAllJewelryModelCategories());
	}, [dispatch]);

	const handleModelClick = (model) => {
		setSelectedModel(model);
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setSelectedModel(null);
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
	const handleSelectModel = () => {
		if (onSelectModel && selectedModel) {
			onSelectModel({
				Id: selectedModel.Id,
				Name: selectedModel.Name,
				SizeMetals: selectedModel.SizeMetals,
				MetalSupported: selectedModel.MetalSupported,
				MainDiamonds: selectedModel.MainDiamonds,
				MainDiamondCount: selectedModel.MainDiamondCount,
				ModelCode: selectedModel.ModelCode,
				SideDiamondOptionCount: selectedModel.SideDiamondOptionCount,
				SideDiamonds: selectedModel.SideDiamonds,
			}); // Pass selected model ID and Name to parent
			setShowModal(false); // Close modal after selection
		}
	};

	if (loading) return <div>Đang tải...</div>;
	if (error) return <div>Lỗi: {error}</div>;
	if (!models || !Array.isArray(models)) return <div>No models available</div>;

	return (
		<div className="p-4 bg-white max-w-6xl mx-auto">
			<h1 className="text-2xl font-semibold mb-4">Các Mẫu Trang Sức</h1>
			<div className="p-4 mb-6 bg-offWhite rounded-lg shadow-md">
				{/* Filters */}
				<div className="mb-4 flex flex-wrap gap-4">
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Filter by Name"
						className="form-input p-2 border border-gray-300 rounded-md"
					/>
					<select
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						placeholder="Filter by Category"
						className="form-input p-2 border border-gray-300 rounded-md"
					>
						{categories.map((category) => (
							<option key={category.id} value={category.Name}>
								{category.Name}
							</option>
						))}
					</select>
					<select
						value={isRhodiumFinished}
						onChange={(e) => setIsRhodiumFinished(e.target.value === 'true')}
						className="form-select p-2 border border-gray-300 rounded-md"
					>
						<option value="">Xi Rhodium?</option>
						<option value="true">Có</option>
						<option value="false">Không</option>
					</select>
					<select
						value={isEngravable}
						onChange={(e) => setIsEngravable(e.target.value === 'true')}
						className="form-select p-2 border border-gray-300 rounded-md"
					>
						<option value="">Có Thể Khắc?</option>
						<option value="true">Có</option>
						<option value="false">Không</option>
					</select>
				</div>
				{loading ? (
					<p>Đang Tải...</p>
				) : error ? (
					<p className="text-red-500">Lỗi Tải Mẫu Trang Sức: {error}</p>
				) : (
					<ul>
						{models.map((model) => (
							<li
								key={model.Id}
								className="py-2 flex px-4 justify-between bg-white rounded-lg shadow-md mb-3 border border-lightGray cursor-pointer hover:border-primary hover:shadow-lg transition duration-300 ease-in-out"
								onClick={() => handleModelClick(model)}
							>
								<div className="mt-2 justify-center self-center">
									{model.Thumbnail?.MediaPath ? (
										<img
											src={model.Thumbnail.MediaPath} // Fixed the property name here
											alt={model.Thumbnail.MediaName} // Fixed the property name here
											className="w-16 h-16 object-cover rounded-full" // Updated for rounded images
										/>
									) : (
										<div className="w-16 h-16 bg-gray-300 flex items-center justify-center rounded-full">
											<span className="text-gray-600">Không có hình ảnh</span>{' '}
											{/* Fallback when no thumbnail */}
										</div>
									)}
								</div>

								<div className="ml-3 flex gap-6 w-full">
									<div className="flex items-center p-5 w-full">
										<strong className="text-sm font-semibold text-black">
											{model.Name}
										</strong>
										<span className="text-xs text-gray-600 ml-2">
											{model.Description}
										</span>
									</div>

									<div className="text-xs text-gray-500 mt-1 w-full flex">
										<div className="p-3">
											<span className="font-medium">Kim cương tấm: </span>
											{model.SideDiamond ? 'Yes' : 'No'}
										</div>
										{model.IsEngravable && (
											<div className="p-3">
												<span className="font-medium">Có thể Khắc: </span>{' '}
												Có
											</div>
										)}
										{model.IsRhodiumFinish && (
											<div className="p-3">
												<span className="font-medium">Xi Rhodium: </span> Có
											</div>
										)}
										{model.MainDiamondCount > 0 && (
											<div className="p-3">
												<span className="font-medium">
													Kim Cương Chính:{' '}
												</span>
												{model.MainDiamondCount}{' '}
												{model.MainDiamondCount > 1 ? 'stones' : 'stone'}
											</div>
										)}
										{model.MetalSupported?.length > 0 && (
											<div className="p-3">
												<span className="font-medium">Kim Loại: </span>
												{model.MetalSupported.join(', ')}
											</div>
										)}
										{model.CraftmanFee > 0 && (
											<div className="p-3">
												<span className="font-medium">Phí Chế Tác: </span>$
												{model.CraftmanFee}
											</div>
										)}
									</div>

									<div className="mt-2">
										{model.ThumbnailPath && (
											<img
												src={model.ThumbnailPath}
												alt={model.Name}
												className="w-16 h-16 object-cover rounded-md shadow-sm"
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
					<span className="text-lg">{`Page ${currentPage} of ${totalPage}`}</span>
					<button
						onClick={handleNextPage}
						disabled={currentPage === totalPage}
						className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primaryDark disabled:opacity-50"
					>
						Sau
					</button>
					<select
						value={pageSize}
						onChange={(e) => setPageSize(Number(e.target.value), setCurrentPage(1))}
						className="form-select p-2 border border-gray rounded-md"
					>
						<option value="5">5 mỗi trang</option>
						<option value="10">10 mỗi trang</option>
						<option value="20">20 mỗi trang</option>
					</select>
				</div>
			</div>

			{showModal && selectedModel && (
				<div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg">
						<h2 className="text-2xl font-semibold mb-4">Chi Tiết Mẫu Trang Sức</h2>
						<p>
							<strong>Name:</strong> {selectedModel.Name}
						</p>
						<p>
							<strong>Description:</strong> {selectedModel.Description}
						</p>
						<p>
							<strong>Category:</strong> {selectedModel.Category?.Name}
						</p>
						<div className="mt-4 flex justify-end gap-4">
							<Button onClick={handleCloseModal}>Đóng</Button>
							<Button type="primary" onClick={handleSelectModel}>
								Chọn Mẫu Trang Sức Này
							</Button>
						</div>
					</div>
				</div>
			)}
			{showModal && selectedModel && (
				<div className="fixed inset-0 bg-gray bg-opacity-50 flex justify-center items-center p-3 z-50">
					<div className="bg-white p-4 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-2/3">
						<h2 className="text-3xl font-semibold text-primary mb-6 text-center">
							Chi Tiết Mẫu Trang Sức{' '}
						</h2>

						<div className="flex gap-8">
							{/* Left Column */}
							<div className="flex-1">
								<p className="text-lg font-medium text-gray">
									<strong>Tên:</strong> {selectedModel.Name}
								</p>
								<p className="text-lg font-medium text-gray">
									<strong>Phân Loại:</strong> {selectedModel.Category.Name}
								</p>
								<p className="text-lg font-medium text-gray">
									<strong>Mã Mẫu Trang Sức:</strong> {selectedModel.ModelCode}
								</p>
								<p className="text-lg font-medium text-gray">
									<strong>Phí Chế Tác:</strong> {selectedModel.CraftmanFee} VND
								</p>
								<p className="text-lg font-medium text-gray">
									<strong>Mô Tả:</strong> {selectedModel.Description}
								</p>
								<p className="text-lg font-medium text-gray">
									<strong>Ngang:</strong> {selectedModel.Width} mm
								</p>
								<p className="text-lg font-medium text-gray">
									<strong>Có Thể Khắc:</strong>{' '}
									{selectedModel.IsEngravable ? 'Yes' : 'No'}
								</p>
							</div>

							{/* Right Column */}
							<div className="flex-1">
								<p className="text-lg font-medium text-gray">
									<strong>Số Lượng Kim Cương Chính:</strong>{' '}
									{selectedModel.MainDiamondCount}
								</p>
								<p className="text-lg font-medium text-gray">
									<strong>Số Lượng Kim Cương Tấm:</strong>{' '}
									{selectedModel.SideDiamondOptionCount}
								</p>
								<p className="text-lg font-medium text-gray">
									<strong>Xi Rhodium:</strong>{' '}
									{selectedModel.IsRhodiumFinish ? 'Yes' : 'No'}
								</p>
								<p className="text-lg font-medium text-gray">
									<strong>Hỗ Trợ các kim loại:</strong>{' '}
									{selectedModel.MetalSupported.join(', ')}
								</p>
							</div>
						</div>
						{/* Main Diamonds Section */}
						{selectedModel.MainDiamonds && selectedModel.MainDiamonds.length > 0 && (
							<div className="mt-6 ">
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
															<strong>Mẫu Thiết Kế:</strong>{' '}
															{diamond.SettingType}
														</p>
													</div>
													<div>
														<p className="text-gray">
															<strong>Só Lượng:</strong>{' '}
															{diamond.Quantity}
														</p>
													</div>
													<div>
														<p className="text-gray">
															<strong>ID Yêu Cầu Của Kim Cương Chính:</strong>{' '}
															{diamond.MainDiamondReqId || 'N/A'}
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
																			<strong>Hình Dáng:</strong>{' '}
																			{shape.Shape
																				?.ShapeName ||
																				'N/A'}
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
																 Không Có Hình Dáng
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

						{/* Size Metals Section */}
						{selectedModel.SizeMetals && selectedModel.SizeMetals.length > 0 && (
							<div className="mt-6  ">
								<h3
									className="text-xl font-semibold cursor-pointer"
									onClick={() => setIsSizeMetalsOpen(!isSizeMetalsOpen)}
								>
									Size Metals {isSizeMetalsOpen ? '▲' : '▼'}
								</h3>
								{isSizeMetalsOpen && (
									<ul className="space-y-4 mt-3 pl-4 max-h-24 overflow-y-auto  border rounded-md">
										{selectedModel.SizeMetals.map((sizeMetal, index) => (
											<li key={index} className="border-b pb-4">
												<div className="flex justify-between px-5 py-2">
													<div>
														<p className="text-gray">
															<strong>Size:</strong>{' '}
															{sizeMetal.Size.Value}{' '}
															{sizeMetal.Size.Unit}
														</p>
													</div>
													<div>
														<p className="text-gray">
															<strong>Metal:</strong>{' '}
															{sizeMetal.Metal.Name}
														</p>
													</div>
													<div>
														<p className="text-gray">
															<strong>Weight:</strong>{' '}
															{sizeMetal.Weight} g
														</p>
													</div>
													<div>
														<p className="text-gray">
															<strong>Price:</strong>{' '}
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

						{/* Side Diamonds Section */}
						{selectedModel.SideDiamonds && selectedModel.SideDiamonds.length > 0 && (
							<div className="mt-6 ">
								<h3
									className="text-xl font-semibold cursor-pointer"
									onClick={() => setIsSideDiamondsOpen(!isSideDiamondsOpen)}
								>
									Side Diamonds {isSideDiamondsOpen ? '▲' : '▼'}
								</h3>
								{isSideDiamondsOpen && (
									<ul className="space-y-4 mt-3 pl-4 max-h-24 overflow-y-auto border rounded-md ">
										{selectedModel.SideDiamonds.map((sideDiamond, index) => (
											<li key={index} className="border-b pb-4">
												<div className="flex justify-between px-5 py-2">
													<div>
														<p className="text-gray">
															<strong>Carat Weight:</strong>{' '}
															{sideDiamond.CaratWeight}
														</p>
													</div>
													<div>
														<p className="text-gray">
															<strong>Setting Type:</strong>{' '}
															{sideDiamond.SettingType}
														</p>
													</div>
													<div>
														<p className="text-gray">
															<strong>Quantity:</strong>{' '}
															{sideDiamond.Quantity}
														</p>
													</div>
													<div>
														<p className="text-gray">
															<strong>Color Range:</strong>{' '}
															{sideDiamond.ColorMin} -{' '}
															{sideDiamond.ColorMax}
														</p>
													</div>
													<div>
														<p className="text-gray">
															<strong>Clarity Range:</strong>{' '}
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

						{/* Close Button */}
						<div className="mt-4 flex justify-end gap-4">
							<Button onClick={handleCloseModal}>Close</Button>
							<Button type="primary" onClick={handleSelectModel}>
								Chọn Mẫu Trang Sức Này
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default JewelryModelList;
