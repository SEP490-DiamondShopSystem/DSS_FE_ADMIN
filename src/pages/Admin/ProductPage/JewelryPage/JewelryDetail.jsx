import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {fetchJewelryDetail} from '../../../../redux/slices/jewelry/jewelrySlice';
import {Camera, Ruler, Star, Info, Diamond, Tag, X} from 'lucide-react';
const ClarityEnum = {
	1: 'SI2',
	2: 'SI1',
	3: 'VS2',
	4: 'VS1',
	5: 'VVS2',
	6: 'VVS1',
	7: 'IF',
	8: 'FL',
};

const CutEnum = {
	1: 'Tốt',
	2: 'Rất Tốt',
	3: 'Xuất Sắc',
};

const SymmetryEnum = {
	1: 'Kém',
	2: 'Trung Bình',
	3: 'Tốt',
	4: 'Rất Tốt',
	5: 'Xuất Sắc',
};

const CuletEnum = {
	1: 'Không có',
	2: 'Cực Nhỏ',
	3: 'Nhỏ',
	4: 'Trung Bình',
	5: 'Hơi Lớn',
	6: 'Lớn',
	7: 'Rất Lớn',
	8: 'Cực Lớn',
};

const ColorEnum = {
	1: 'K',
	2: 'J',
	3: 'I',
	4: 'H',
	5: 'G',
	6: 'F',
	7: 'E',
	8: 'D',
};

const FluorescenceEnum = {
	1: 'Không Có',
	2: 'Nhạt',
	3: 'Trung Bình',
	4: 'Mạnh',
};

const GirdleEnum = {
	1: 'Cực Mỏng',
	2: 'Rất Mỏng',
	3: 'Mỏng',
	4: 'Trung Bình',
	5: 'Hơi Dày',
	6: 'Dày',
	7: 'Rất Dày',
	8: 'Cực Dày',
};

const PolishEnum = {
	1: 'Kém',
	2: 'Tốt',
	3: 'Rất Tốt',
	4: 'Xuất Sắc',
};

const JewelryDetail = ({jewelry, onClose}) => {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [activeTab, setActiveTab] = useState('main');
	const [fetchedJewelry, setJewelry] = useState(jewelry);

	useEffect(() => {
		if (jewelry?.Id) {
			setLoading(true);
			dispatch(fetchJewelryDetail(jewelry.Id))
				.unwrap()
				.then((data) => {
					setJewelry(data);
					setLoading(false);
				})
				.catch((error) => {
					console.error('Error fetching jewelry details:', error);
					setLoading(false);
				});
		}
	}, [jewelry?.Id, dispatch]);

	if (loading) {
		return (
			<div
				className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-auto animate-fadeIn"
				aria-labelledby="jewelry-detail-title"
				aria-modal="true"
				role="dialog"
			>
				<div className="animate-pulse">
					<Diamond className="w-16 h-16 text-primary animate-bounce" />
					<p className="text-white mt-4 text-center">Đang tải...</p>
				</div>
			</div>
		);
	}

	const mapEnum = (value, enumObj) => enumObj[value] || 'Chưa Có';

	const renderTabContent = () => {
		switch (activeTab) {
			case 'main':
				return (
					<div className="flex flex-wrap gap-6 p-4 bg-white rounded-lg">
						<div className="flex justify-center items-center w-60 h-60">
							<img
								src={
									fetchedJewelry.Model.Thumbnail?.MediaPath ||
									'/default-thumbnail.jpg'
								}
								alt={fetchedJewelry.SerialCode}
								className="w-[150px] h-[150px] object-cover rounded-xl shadow-lg transition-transform hover:scale-105"
							/>
						</div>
						<div className="space-y-3">
							<div className="bg-white p-4 rounded-lg shadow-sm">
								<div className="flex items-center mb-2">
									<Camera className="mr-2 text-primary" size={20} />
									<span className="font-semibold text-gray-700">Mã Mẫu:</span>
									<span className="ml-2">
										{fetchedJewelry.ModelCode || 'Chưa Có'}
									</span>
								</div>
								<div className="flex items-center mb-2">
									<Tag className="mr-2 text-primary" size={20} />
									<span className="font-semibold text-gray-700">
										Loại Trang Sức:
									</span>
									<span className="ml-2">
										{fetchedJewelry.Model.Category?.Name || 'Chưa Có'}
									</span>
								</div>
								<div className="flex items-center mb-2">
									<Ruler className="mr-2 text-primary" size={20} />
									<span className="font-semibold text-gray-700">
										Trọng Lượng:
									</span>
									<span className="ml-2">
										{fetchedJewelry.Weight
											? `${fetchedJewelry.Weight} g`
											: 'Chưa Có'}
									</span>
								</div>
								<div className="flex items-center mb-2">
									<span className="mr-2 text-primary font-bold">₫</span>
									<span className="font-semibold text-gray-700">Giá:</span>
									<span className="ml-2 text-green-600 font-bold">
										{fetchedJewelry.TotalPrice?.toLocaleString() || 'Chưa Có'}{' '}
										VND
									</span>
								</div>
							</div>
							<div className="bg-white p-4 rounded-lg shadow-sm">
								<div className="flex items-center mb-2">
									<span className="mr-2 text-primary">Au</span>
									<span className="font-semibold text-gray-700">Kim Loại:</span>
									<span className="ml-2">
										{fetchedJewelry.Metal?.Name || 'Chưa Có'}
									</span>
								</div>
								<div className="flex items-center mb-2">
									<Ruler className="mr-2 text-primary" size={20} />
									<span className="font-semibold text-gray-700">Size:</span>
									<span className="ml-2">
										{fetchedJewelry.Size?.Value
											? `${fetchedJewelry.Size.Value} ${fetchedJewelry.Size.Unit}`
											: 'Chưa Có'}
									</span>
								</div>
							</div>
						</div>
					</div>
				);

			case 'diamonds':
				return (
					fetchedJewelry.Diamonds?.length > 0 && (
						<div className="bg-gray-50 p-4 rounded-lg">
							<h3 className="text-xl font-bold text-primary mb-4 flex items-center">
								<Diamond className="mr-2" /> Chi Tiết Kim Cương Chính
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
								{fetchedJewelry.Diamonds.map((diamond, index) => (
									<div
										key={index}
										className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow  border"
									>
										<div className="grid grid-cols-2 gap-3">
											{/* Basic Details */}
											<div className="space-y-3 mx-2">
												<div className="flex justify-between items-center">
													<span className="font-semibold text-gray-700">
														Hình Dáng:
													</span>
													<span>
														{diamond.DiamondShape?.ShapeName ||
															'Chưa Có'}
													</span>
												</div>
												<div className="flex justify-between items-center">
													<span className="font-semibold text-gray-700">
														Carat:
													</span>
													<span>{diamond.Carat || 'Chưa Có'}</span>
												</div>
												<div className="flex justify-between items-center">
													<span className="font-semibold text-gray-700">
														Độ Trong Suốt:
													</span>
													<span>
														{mapEnum(diamond.Clarity, ClarityEnum)}
													</span>
												</div>
												<div className="flex justify-between items-center">
													<span className="font-semibold text-gray-700">
														Màu:
													</span>
													<span>{mapEnum(diamond.Color, ColorEnum)}</span>
												</div>
												<div className="flex justify-between items-center">
													<span className="font-semibold text-gray-700">
														Chất lượng cắt:
													</span>
													<span>{mapEnum(diamond.Culet, CuletEnum)}</span>
												</div>
												<div className="flex justify-between items-center">
													<span className="font-semibold text-gray-700">
														Chóp đáy:
													</span>
													<span>{mapEnum(diamond.Cut, CutEnum)}</span>
												</div>
												<div className="flex justify-between items-center">
													<span className="font-semibold text-gray-700">
														Kích Thước:
													</span>
													<span>{diamond.Measurement || 'Chưa Có'}</span>
												</div>
												<div className="flex justify-between items-center">
													<span className="font-semibold text-gray-700">
														Độ Sâu:
													</span>
													<span>{diamond.Depth || 'Chưa Có'}%</span>
												</div>
											</div>

											{/* Additional Details */}
											<div className="space-y-3 mx-2">
												<div className="flex justify-between items-center">
													<span className="font-semibold text-gray-700">
														Bàn Cắt:
													</span>
													<span>{diamond.Table || 'Chưa Có'}%</span>
												</div>
												<div className="flex justify-between items-center">
													<span className="font-semibold text-gray-700">
														Độ Đối Xứng:
													</span>
													<span>
														{mapEnum(diamond.Symmetry, SymmetryEnum)}
													</span>
												</div>
												<div className="flex justify-between items-center">
													<span className="font-semibold text-gray-700">
														Độ Mài Bóng:
													</span>
													<span>
														{mapEnum(diamond.Polish, PolishEnum)}
													</span>
												</div>
												<div className="flex justify-between items-center">
													<span className="font-semibold text-gray-700">
														Huỳnh Quang:
													</span>
													<span>
														{mapEnum(
															diamond.Fluorescence,
															FluorescenceEnum
														)}
													</span>
												</div>
												<div className="flex justify-between items-center">
													<span className="font-semibold text-gray-700">
														Mã Số:
													</span>
													<span>{diamond.SerialCode || 'Chưa Có'}</span>
												</div>
												<div className="flex justify-between items-center">
													<span className="font-semibold text-gray-700">
														Nhân Tạo:
													</span>
													<span>
														{diamond.IsLabDiamond ? 'Có' : 'Không'}
													</span>
												</div>
												<div className="flex justify-between items-center">
													<span className="font-semibold text-gray-700">
														Giá:
													</span>
													<span className="text-green-600 font-bold">
														{diamond.DiamondPrice?.Price?.toLocaleString() ||
															'Chưa Có'}{' '}
														VND
													</span>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)
				);

			case 'review':
				return (
					fetchedJewelry.Review && (
						<div className="bg-gray-50 p-4 rounded-lg">
							<h3 className="text-xl font-bold text-primary mb-4 flex items-center">
								<Star className="mr-2" /> Review
							</h3>
							<div className="bg-white p-4 rounded-lg shadow-md">
								<div className="flex items-center mb-3">
									<Star className="text-yellow-500 mr-2" fill="currentColor" />
									<span className="font-semibold">Đánh Giá:</span>
									<span className="ml-2 text-yellow-600">
										{fetchedJewelry.Review.StarRating} / 5
									</span>
								</div>
								<p className="italic text-gray-600">
									{fetchedJewelry.Review.Content}
								</p>
							</div>
						</div>
					)
				);

			case 'additional':
				return (
					<div className="bg-gray-50 p-4 rounded-lg">
						<h3 className="text-xl font-bold text-primary mb-4 flex items-center">
							<Info className="mr-2" /> Các Thông Tin Khác
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="bg-white p-4 rounded-lg shadow-sm">
								<div className="flex justify-between items-center mb-2">
									<span className="font-semibold text-gray-700">Back Type:</span>
									<span>{fetchedJewelry.Model.BackType || 'Chưa Có'}</span>
								</div>
								<div className="flex justify-between items-center mb-2">
									<span className="font-semibold text-gray-700">Clasp Type:</span>
									<span>{fetchedJewelry.Model.ClaspType || 'Chưa Có'}</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="font-semibold text-gray-700">Chain Type:</span>
									<span>{fetchedJewelry.Model.ChainType || 'Chưa Có'}</span>
								</div>
							</div>
						</div>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn"
			aria-labelledby="jewelry-detail-title"
			aria-modal="true"
			role="dialog"
		>
			<div className="bg-white rounded-lg shadow-xl  w-2/3 max-w-[50%] md:max-w-[400px] max-h-[80vh] overflow-y-auto relative">
				{/* Close Button */}
				<button
					onClick={onClose}
					className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none transition-colors"
					aria-label="Close"
				>
					<X className="w-6 h-6 text-gray-700" />
				</button>
				{/* Modal Content */}
				<div className="p-6">
					{/* Title */}
					<h2
						id="jewelry-detail-title"
						className="text-2xl font-bold text-primary text-center mb-6 pb-2 border-b"
					>
						{fetchedJewelry.SerialCode}
					</h2>

					{/* Tab Navigation */}
					<div className="flex mb-6 bg-gray-100 rounded-full p-1">
						{[
							{key: 'main', label: 'Thông Tin Chính', icon: Info},
							{key: 'additional', label: 'Thông Tin Khác', icon: Ruler},
							{key: 'diamonds', label: 'Kim Cương Chính', icon: Diamond},
							{key: 'review', label: 'Review', icon: Star},
						].map((tab) => (
							<button
								key={tab.key}
								className={`flex-1 p-3 rounded-full flex items-center justify-center transition-colors ${
									activeTab === tab.key
										? 'bg-primary text-white'
										: 'text-gray-600 hover:bg-gray-200'
								}`}
								onClick={() => setActiveTab(tab.key)}
							>
								<tab.icon className="mr-2" size={20} />
								<span className="hidden md:inline">{tab.label}</span>
							</button>
						))}
					</div>

					{/* Render Tab Content */}
					{renderTabContent()}
				</div>
			</div>
		</div>
	);
};

export default JewelryDetail;
