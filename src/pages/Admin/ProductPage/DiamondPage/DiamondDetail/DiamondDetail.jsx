import {Button, Tag} from 'antd';
import React from 'react';
import {formatPrice} from '../../../../../utils';
import {LockOutlined, UnlockOutlined} from '@ant-design/icons';

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

const statusMapping = {
	1: {label: 'Đang bán', color: 'green'},
	2: {label: 'Đã bán', color: 'blue'},
	3: {label: 'Đã khóa', color: 'volcano'},
	4: {label: 'Hết hàng', color: 'red'},
	5: {label: 'Khóa cho khách hàng', color: 'purple'},
	6: {label: 'Đặt trước', color: 'geekblue'},
};

const DiamondDetail = ({diamond, handleView, id, handleLockDiamondView}) => {
	if (!diamond) {
		return <p className="text-center text-gray-500">Không có dữ liệu kim cương</p>;
	}

	const {
		Title,
		Carat,
		Color,
		Clarity,
		Cut,
		Symmetry,
		Fluorescence,
		Price,
		SalePrice,
		Measurement,
		IsLabDiamond,
		SerialCode,
		Thumbnail,
		Culet,
		Depth,
		Table,
		Girdle,
		Polish,
		DiamondShape,
		TruePrice,
		Discount,
		DiscountPrice,
		Status,
	} = diamond;

	const {label, color} = statusMapping[Status] || {label: 'Không xác định', color: 'default'};

	return (
		<div className="mx-auto p-8 bg-gradient-to-r from-white to-lightGray rounded-xl shadow-xl">
			{/* Phần tiêu đề */}
			<div className="flex flex-col md:flex-row md:items-center mb-8">
				{/* Ảnh */}
				<div className="flex-shrink-0 w-full md:w-1/3 relative group mr-5">
					{Thumbnail ? (
						<img
							src={Thumbnail?.MediaPath}
							alt={Title}
							className="rounded-lg shadow-lg object-cover w-full h-64 transition-transform duration-300 group-hover:scale-105"
						/>
					) : (
						<div className="bg-gray-200 w-full h-64 flex items-center justify-center rounded-lg">
							<span className="text-gray-500">Không có ảnh</span>
						</div>
					)}
					<div className="absolute bottom-2 right-2 text-white bg-primary px-2 py-1 rounded-md text-xs shadow-md">
						{IsLabDiamond ? 'Kim cương nhân tạo' : 'Kim cương tự nhiên'}
					</div>
				</div>

				{/* Tiêu đề và Giá */}
				<div className="md:ml-8 flex-1 mt-6 md:mt-0">
					<h1 className="text-4xl font-bold text-gray-800 mb-4">{Title}</h1>
					<p className="text-gray-500 text-base mb-6 font-semibold ">
						Mã SKU: {SerialCode}
					</p>
					<p className="text-gray-500 text-base mb-6 font-semibold">
						Trạng Thái:
						<Tag className="ml-1" color={color}>
							{label?.toUpperCase()}
						</Tag>
					</p>
					<div className="flex items-center">
						<h2 className="text-2xl font-semibold ">{formatPrice(SalePrice)}</h2>
						{TruePrice !== SalePrice && (
							<p className="text-gray-400 text-lg ml-4 line-through">
								{formatPrice(TruePrice)}
							</p>
						)}
					</div>
					{diamond?.ProductLock && (
						<div className="flex items-center">
							<p className="text-gray-500 text-base mb-6 font-semibold ">
								Kim Cương Đã Khóa Cho Khách: {diamond?.ProductLock?.Account?.Email}
							</p>
						</div>
					)}
				</div>
			</div>

			{/* Chi tiết kim cương */}
			<div className="text-lg font-semibold">Chi tiết kim cương</div>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-gray-700 text-sm">
				<div>
					<p className="font-medium text-gray">Ly (Carat)</p>
					<p>{Carat}</p>
				</div>
				<div>
					<p className="font-medium text-gray">Màu sắc (Color)</p>
					<p>{ColorEnum[Color] || 'Không xác định'}</p>
				</div>
				<div>
					<p className="font-medium text-gray">Độ trong suốt (Clarity)</p>
					<p>{ClarityEnum[Clarity] || 'Không xác định'}</p>
				</div>
				<div>
					<p className="font-medium text-gray">Chất lượng cắt (Cut)</p>
					<p>{CutEnum[Cut] || 'Không xác định'}</p>
				</div>
				<div>
					<p className="font-medium text-gray">Độ đối xứng (Symmetry)</p>
					<p>{SymmetryEnum[Symmetry] || 'Không xác định'}</p>
				</div>
				<div>
					<p className="font-medium text-gray">Huỳnh quang</p>
					<p>{FluorescenceEnum[Fluorescence] || 'Không xác định'}</p>
				</div>
				<div>
					<p className="font-medium text-gray">Kích thước</p>
					<p>{Measurement}</p>
				</div>
				<div>
					<p className="font-medium text-gray">Độ bóng (Polish)</p>
					<p>{PolishEnum[Polish] || 'Không xác định'}</p>
				</div>
				<div>
					<p className="font-medium text-gray">Viền cạnh (Girdle)</p>
					<p>{GirdleEnum[Girdle] || 'Không xác định'}</p>
				</div>
				<div>
					<p className="font-medium text-gray">Chóp đáy (Culet)</p>
					<p>{CuletEnum[Culet] || 'Không xác định'}</p>
				</div>
				<div>
					<p className="font-medium text-gray">Độ sâu %</p>
					<p>{Depth}</p>
				</div>
				<div>
					<p className="font-medium text-gray">Bảng đáy %</p>
					<p>{Table}</p>
				</div>
				<div>
					<p className="font-medium text-gray">Hình dáng</p>
					<p>{DiamondShape?.ShapeName}</p>
				</div>
				<div>
					<p className="font-medium text-gray">Giá trị thật</p>
					<p>{formatPrice(TruePrice)}</p>
				</div>
				<div>
					<p className="font-medium text-gray">Giảm giá</p>
					<p>{formatPrice(Discount) || 'Không có'}</p>
				</div>
				<div>
					<p className="font-medium text-gray">Giá sau giảm</p>
					<p>{DiscountPrice ? formatPrice(DiscountPrice) : 'Không có'}</p>
				</div>
			</div>

			<div className="mt-10 text-center">
				<Button
					type="text"
					className="bg-blue-500 py-3 px-8 rounded-lg shadow-lg hover:bg-blue transition-colors duration-300 transform hover:-translate-y-1"
					onClick={() => handleLockDiamondView(diamond)}
					disabled={Status === 2}
				>
					{diamond?.ProductLock === null ? (
						<>
							<LockOutlined className="mr-1" /> Khoá kim cương cho khách hàng
						</>
					) : (
						<>
							<UnlockOutlined className="mr-1" /> Mở khóa kim cương cho khách hàng
						</>
					)}
				</Button>
				<Button
					className="ml-4 bg-gray-100 text-gray-700 py-3 px-8 rounded-lg shadow-lg hover:bg-gray-200 transition-colors duration-300 transform hover:-translate-y-1"
					onClick={() => handleView(id)}
				>
					Tải lên hình ảnh
				</Button>
			</div>
		</div>
	);
};

export default DiamondDetail;
