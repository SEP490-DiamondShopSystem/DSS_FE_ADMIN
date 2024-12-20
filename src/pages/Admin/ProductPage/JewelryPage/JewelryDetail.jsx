import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {
	fetchJewelryDetail,
	changeJewelryReviewVisibility,
	deleteJewelry,
} from '../../../../redux/slices/jewelry/jewelrySlice';
import {Camera, Ruler, Star, Info, Diamond, Eye, EyeOff, X, Cannabis} from 'lucide-react';
import {useNavigate, useParams} from 'react-router-dom';
import Loading from '../../../../components/Loading';
import {DeleteFilled, LeftCircleFilled, LeftOutlined} from '@ant-design/icons';
import {Button, message, Modal, Tooltip, Tag} from 'antd';
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
	const navigate = useNavigate();
	const {id} = useParams();
	const [loading, setLoading] = useState(false);
	const [activeTab, setActiveTab] = useState('main');
	const [fetchedJewelry, setJewelry] = useState(jewelry);
	const [availableTabs, setAvailableTabs] = useState(['main']);
	const [fetch, setFetch] = useState();

	const handleToggleReviewVisibility = async () => {
		if (fetchedJewelry?.Id) {
			await dispatch(changeJewelryReviewVisibility(fetchedJewelry?.Id))
				.unwrap()
				.then((updatedJewelry) => {
					setJewelry((prevJewelry) => ({
						...prevJewelry,
						IsReviewVisible: updatedJewelry.IsReviewVisible,
					}));
				})
				.catch((error) => {
					console.error('Error toggling review visibility:', error);
				});
			await dispatch(fetchJewelryDetail(fetchedJewelry?.Id))
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
	};
	useEffect(() => {
		if (id) {
			setLoading(true);
			dispatch(fetchJewelryDetail(id))
				.unwrap()
				.then((data) => {
					setJewelry(data);
					const tabs = ['main'];
					if (
						data?.ModelCode ||
						data?.Model?.Name ||
						data?.Model?.IsEngravable !== undefined ||
						data?.D_Price ||
						data?.SD_Price ||
						data?.SoldPrice ||
						data?.SideDiamond ||
						data?.Status !== undefined ||
						data?.IsPreset !== undefined ||
						data?.EngravedText ||
						data?.EngravedFont
					) {
						tabs.push('additional');
					}
					if (data.Diamonds && data.Diamonds.length > 0) {
						tabs.push('diamonds');
					}
					if (data.Review) {
						tabs.push('review');
					}
					setAvailableTabs(tabs);
					if (!tabs.includes(activeTab)) {
						setActiveTab('main');
					}
					setLoading(false);
				})
				.catch((error) => {
					console.error('Error fetching jewelry details:', error);
					setLoading(false);
				});
		}
	}, [id, dispatch, fetch]);

	if (loading) {
		return <Loading />;
	}

	const handleDeleteClick = () => {
		Modal.confirm({
			title: 'Bạn có chắc chắn muốn xóa trang sức này?',
			content: 'Hành động này không thể hoàn tác.',
			okText: 'Đồng ý',
			okType: 'danger',
			cancelText: 'Hủy',
			onOk() {
				dispatch(deleteJewelry(id))
					.unwrap()
					.then((res) => {
						message.success('Xóa trang sức thành công!');
						navigate('/products/jewelry-list');
						setFetch(res);
					})
					.catch((error) => {
						message.error(error.data.detail || error.detail);
					});
			},
			onCancel() {},
		});
	};

	const mapEnum = (value, enumObj) => enumObj[value] || 'Chưa Có';

	const renderStatusTag = (status) => {
		const statusMap = {
			1: {color: 'blue', label: 'Hoạt động'},
			2: {color: 'gold', label: 'Đã bán'},
			3: {color: 'volcano', label: 'Bị khóa'},
			4: {color: 'gray', label: 'Không hoạt động'},
			5: {color: 'cyan', label: 'Khóa người dùng'},
			6: {color: 'purple', label: 'Đặt trước'},
		};
		const statusInfo = statusMap[status] || {color: 'default', label: 'Không xác định'};
		return <Tag color={statusInfo.color}>{statusInfo.label}</Tag>;
	};
	const renderTabContent = () => {
		switch (activeTab) {
			case 'main':
				return (
					<div className="flex flex-wrap gap-6 p-4 bg-white rounded-lg font-semibold">
						<div className="flex justify-center items-center w-60 h-60">
							<img
								src={
									fetchedJewelry?.Model?.Thumbnail?.MediaPath ||
									'/default-thumbnail.jpg'
								}
								alt={fetchedJewelry?.SerialCode}
								className="w-[150px] h-[150px] object-cover rounded-xl shadow-lg transition-transform hover:scale-105"
							/>
						</div>
						<div className="">
							<div className="bg-white p-4 rounded-lg shadow-sm">
								<div className="w-full flex justify-around mb-2">
									<Camera className="mr-2 text-primary" size={20} />
									<span className="font-semibold text-gray-700">
										Mã Trang Sức:
									</span>
									<span className="pl-2">
										{' '}
										{fetchedJewelry?.SerialCode || 'Chưa Có'}
									</span>
									<span className="pl-2">
										{' '}
										{renderStatusTag(fetchedJewelry?.Status)}
									</span>
								</div>
								<div className="flex items-center mb-2">
									<Cannabis className="mr-2 text-primary" size={20} />
									<span className="font-semibold text-gray-700">Mã Mẫu:</span>
									<span className="ml-2">
										{' '}
										{fetchedJewelry?.ModelCode || 'Chưa Có'}
									</span>
								</div>
								<div className="flex items-center mb-2">
									<Tag className="mr-2 text-primary" size={20} />
									<span className="font-semibold text-gray-700">
										Loại Trang Sức:
									</span>
									<span className="ml-2">
										{fetchedJewelry?.Model.Category?.Name || 'Chưa Có'}
									</span>
								</div>
								<div className="flex items-center mb-2">
									<Ruler className="mr-2 text-primary" size={20} />
									<span className="font-semibold text-gray-700">
										Trọng Lượng:
									</span>
									<span className="ml-2">
										{fetchedJewelry?.Weight
											? `${fetchedJewelry?.Weight} g`
											: 'Chưa Có'}
									</span>
								</div>
								<div className="flex items-center mb-2">
									<span className="mr-2 text-primary font-bold">₫</span>

									{fetchedJewelry?.SoldPrice ? (
										<div className="flex justify-between items-center">
											<span className="font-medium text-gray-700">
												Giá Đã Bán:
											</span>
											<span className="text-darkGreen text-lg font-bold">
												{fetchedJewelry.SoldPrice.toLocaleString() ||
													'Chưa Có'}{' '}
												VND
											</span>
										</div>
									) : fetchedJewelry?.TotalPrice > fetchedJewelry?.SalePrice ? (
										<div className="flex items-center">
											<span className="font-semibold mr-3 text-gray-700">
												Giá:
											</span>
											<span className="line-through mr-2 text-gray-400">
												{fetchedJewelry?.TotalPrice.toLocaleString()} VND
											</span>
											<span className="text-darkGreen text-xl">
												{fetchedJewelry?.SalePrice.toLocaleString()} VND
											</span>
										</div>
									) : (
										<span className="text-darkGreen text-xl">
											{fetchedJewelry?.SalePrice.toLocaleString()} VND
										</span>
									)}
								</div>
							</div>
							<div className="bg-white p-4 rounded-lg shadow-sm">
								<div className="flex items-center mb-2">
									<span className="mr-2 text-primary">Au</span>
									<span className="font-semibold text-gray-700">Kim Loại:</span>
									<span className="ml-2">
										{fetchedJewelry?.Metal?.Name || 'Chưa Có'}
									</span>
								</div>
								<div className="flex items-center mb-2">
									<Ruler className="mr-2 text-primary" size={20} />
									<span className="font-semibold text-gray-700">Size:</span>
									<span className="ml-2">
										{fetchedJewelry?.Size?.Value
											? `${fetchedJewelry?.Size.Value} ${fetchedJewelry?.Size?.Unit}`
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
										<div className="flex justify-between items-center mb-4">
											<h2 className="text-xl font-bold text-primary flex items-center">
												{diamond?.Title}
											</h2>
											<div className="flex flex-col items-center">
												{renderStatusTag(diamond.Status)}
												{diamond.IsLockForCustomizeRequest &&
													diamond.Status === 3 && (
														<div className="flex justify-between items-center">
															<span className="font-light text-gray">
																Khóa cho đơn thiết kế
															</span>
														</div>
													)}
												{diamond.IsLockForJewelry &&
													diamond.Status === 3 && (
														<div className="flex justify-between items-center">
															<span className="font-light text-gray">
																Gắn cho trang sức
															</span>
														</div>
													)}
											</div>
										</div>

										<div className="grid grid-cols-2 gap-3">
											{/* Basic Details */}
											<div className="space-y-3 mx-2">
												<div className="flex justify-between items-center">
													<span className="font-semibold text-gray-700">
														Hình Dáng:
													</span>
													<span>
														{diamond?.DiamondShape?.ShapeName ||
															'Chưa Có'}
													</span>
												</div>
												<div className="flex justify-between items-center">
													<span className="font-semibold text-gray-700">
														Carat:
													</span>
													<span>{diamond?.Carat || 'Chưa Có'}</span>
												</div>
												<div className="flex justify-between items-center">
													<span className="font-semibold text-gray-700">
														Độ Trong Suốt:
													</span>
													<span>
														{mapEnum(diamond?.Clarity, ClarityEnum)}
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
														Tỉ Lệ Dài Rộng:
													</span>
													<span>
														{diamond.WidthLengthRatio || 'Chưa Có'}
													</span>
												</div>
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
													<span>{diamond?.SerialCode || 'Chưa Có'}</span>
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
														Giá Gốc:
													</span>
													<span className="text-black font-bold">
														{diamond.TruePrice.toLocaleString() ||
															'Chưa Có'}{' '}
														VND
													</span>
												</div>
												{diamond.SoldPrice && (
													<div className="flex justify-between items-center">
														<span className="font-bold text-black text-xl">
															Giá Đã Bán:
														</span>
														<span className="text-darkGreen font-bold text-xl">
															{diamond.SoldPrice.toLocaleString() ||
																'Chưa Có'}{' '}
															VND
														</span>
													</div>
												)}
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
							<div className="flex justify-between items-center mb-4">
								<h3 className="text-xl font-bold text-primary flex items-center">
									<Star className="mr-2" /> Review
								</h3>
								{/* Toggle Review Visibility Button */}
								<button
									onClick={handleToggleReviewVisibility}
									className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
									aria-label={
										fetchedJewelry.Review.IsHidden
											? 'Show Review'
											: 'Hide Review'
									}
								>
									{!fetchedJewelry.Review.IsHidden ? (
										<EyeOff className="text-gray-600" size={20} />
									) : (
										<Eye className="text-gray-600" size={20} />
									)}
								</button>
							</div>
							{!fetchedJewelry.Review.IsHidden ? (
								<div className="bg-white p-4 rounded-lg shadow-md">
									<div className="flex items-center mb-3">
										<Star
											className="text-yellow-500 mr-2"
											fill="currentColor"
										/>
										<span className="font-semibold">Đánh Giá:</span>
										<span className="ml-2 text-yellow-600">
											{fetchedJewelry.Review.StarRating} / 5
										</span>
									</div>
									<p className="italic text-gray-600">
										{fetchedJewelry.Review.Content}
									</p>
									<div className="text-sm text-gray-500 mt-2">
										Ngày: {fetchedJewelry.Review.CreatedDate}
									</div>
								</div>
							) : (
								<div className="bg-white p-4 rounded-lg shadow-md text-center text-gray-500">
									Review is currently hidden
								</div>
							)}
						</div>
					)
				);
			case 'additional':
				return (
					<div className="bg-gray-50 p-4 rounded-lg">
						<h3 className="text-xl font-bold text-primary mb-4 flex items-center">
							<Info className="mr-2" /> Các Thông Tin Khác
						</h3>
						<div className="grid grid-cols-2 md:grid-cols-2 gap-4">
							{/* Model Details */}
							<div className="bg-white border p-4 rounded-lg shadow-sm">
								<h4 className="text-lg font-semibold text-primary mb-3">
									Chi Tiết Mẫu Trang Sức
								</h4>
								<div className="space-y-2">
									<div className="flex justify-between items-center">
										<span className="font-medium text-gray-700">Mã Mẫu:</span>
										<span>{fetchedJewelry.ModelCode || 'Chưa Có'}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="font-medium text-gray-700">Tên Mẫu:</span>
										<span>{fetchedJewelry.Model.Name || 'Chưa Có'}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="font-medium text-gray-700">
											Có Thể Khắc Chữ:
										</span>
										<span>
											{fetchedJewelry.Model.IsEngravable ? 'Có' : 'Không'}
										</span>
									</div>
								</div>
							</div>

							{/* Pricing Details */}
							<div className="bg-white border p-4 rounded-lg shadow-sm">
								<h4 className="text-lg font-semibold text-primary mb-3">
									Chi Tiết Giá
								</h4>
								<div className="space-y-2">
									<div className="flex justify-between items-center">
										<span className="font-medium text-gray-700">
											Giá Mẫu (Không kim cương ):
										</span>
										<span className="text-green-600">
											{fetchedJewelry.ND_Price?.toLocaleString() || 'Chưa Có'}{' '}
											VND
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="font-medium text-gray-700">
											Giá Kim Cương Chính:
										</span>
										<span className="text-green-600">
											{fetchedJewelry.D_Price?.toLocaleString() || 'Chưa Có'}{' '}
											VND
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="font-medium text-gray-700">
											Giá Kim Cương Phụ:
										</span>
										<span className="text-green-600">
											{fetchedJewelry.SD_Price?.toLocaleString() || 'Chưa Có'}{' '}
											VND
										</span>
									</div>

									<div className="flex justify-between items-center">
										<span className="font-medium text-gray-700">Giá Bán:</span>
										{fetchedJewelry?.TotalPrice > fetchedJewelry?.SalePrice ? (
											<div className="flex flex-col items-center">
												<span className="line-through text-gray">
													{fetchedJewelry?.TotalPrice.toLocaleString()}{' '}
													VND
												</span>
												<span className="text-black font-bold">
													{fetchedJewelry?.SalePrice.toLocaleString()} VND
												</span>
											</div>
										) : (
											<span className="text-black">
												{fetchedJewelry?.SalePrice.toLocaleString()} {'VND'}
											</span>
										)}
									</div>
									{fetchedJewelry?.SoldPrice && (
										<div className="flex justify-between items-center">
											<span className="font-medium text-gray-700">
												Giá Đã Bán:
											</span>
											<span className="text-darkGreen text-lg font-bold">
												{fetchedJewelry.SoldPrice?.toLocaleString() ||
													'Chưa Có'}{' '}
												VND
											</span>
										</div>
									)}
								</div>
							</div>

							{/* Diamond Side Configuration */}
							<div className="bg-white border p-4 rounded-lg shadow-sm">
								<h4 className="text-lg font-semibold text-primary mb-3">
									Cấu Hình Kim Cương Phụ
								</h4>
								<div className="space-y-2">
									<div className="flex justify-between items-center">
										<span className="font-medium text-gray-700">Số Lượng:</span>
										<span>
											{fetchedJewelry.SideDiamond?.Quantity || 'Chưa Có'}
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="font-medium text-gray-700">Carat:</span>
										<span>
											{fetchedJewelry.SideDiamond?.Carat || 'Chưa Có'}
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="font-medium text-gray-700">
											Màu (Từ - Đến):
										</span>
										<span>
											{`${mapEnum(
												fetchedJewelry.SideDiamond?.ColorMin,
												ColorEnum
											)} - ${mapEnum(
												fetchedJewelry.SideDiamond?.ColorMax,
												ColorEnum
											)}`}
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="font-medium text-gray-700">
											Độ Tinh Khiết (Từ - Đến):
										</span>
										<span>
											{`${mapEnum(
												fetchedJewelry.SideDiamond?.ClarityMin,
												ClarityEnum
											)} - ${mapEnum(
												fetchedJewelry.SideDiamond?.ClarityMax,
												ClarityEnum
											)}`}
										</span>
									</div>
								</div>
							</div>

							{/* Status & Customization */}
							<div className="bg-white border p-4 rounded-lg shadow-sm">
								<h4 className="text-lg font-semibold text-primary mb-3">
									Trạng Thái & Tùy Chỉnh
								</h4>
								<div className="space-y-2">
									<div className="flex justify-between items-center">
										<span className="font-medium text-gray-700">
											Trạng Thái:
										</span>
										<span>{renderStatusTag(fetchedJewelry.Status)}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="font-medium text-gray-700">
											Là Mẫu Preset:
										</span>
										<span>{fetchedJewelry.IsPreset ? 'Có' : 'Không'}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="font-medium text-gray-700">Khắc Chữ:</span>
										<span>{fetchedJewelry.EngravedText || 'Không'}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="font-medium text-gray-700">
											Font Khắc:
										</span>
										<span>{fetchedJewelry.EngravedFont || 'Không'}</span>
									</div>
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
		<>
			<Button
				type="text"
				className="bg-primary ml-10"
				onClick={() => navigate('/products/jewelry-list')}
			>
				<LeftOutlined /> Quay lại
			</Button>
			<div className=" inset-0 z-50 flex items-center justify-center p-4 shadow-lg">
				<div className=" rounded-2xl w-11/12 p-6 ">
					{/* Modal Content */}
					<div className="p-6">
						{/* Title */}
						<h2
							id="jewelry-detail-title"
							className="text-2xl font-bold text-primary text-center mb-6 pb-2 border-b"
						>
							{fetchedJewelry?.Title}
							<Tooltip title="Xóa trang sức">
								<Button danger className="mb-2 ml-5" onClick={handleDeleteClick}>
									<DeleteFilled />
								</Button>
							</Tooltip>
						</h2>

						{/* Tab Navigation */}
						<div className="flex mb-6 bg-gray-100 rounded-full p-1">
							{[
								{key: 'main', label: 'Thông Tin Chính', icon: Info},
								{key: 'additional', label: 'Thông Tin Khác', icon: Ruler},
								{key: 'diamonds', label: 'Kim Cương Chính', icon: Diamond},
								{key: 'review', label: 'Review', icon: Star},
							]
								.filter((tab) => availableTabs.includes(tab.key))
								.map((tab) => (
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
		</>
	);
};

export default JewelryDetail;
