import round from '../assets/images/diamondShapes/round.png';
import princess from '../assets/images/diamondShapes/princess.png';
import pear from '../assets/images/diamondShapes/pear.png';
import cushion from '../assets/images/diamondShapes/cushionSquare.png';
import emerald from '../assets/images/diamondShapes/emerald.png';
import oval from '../assets/images/diamondShapes/oval.png';
import radiant from '../assets/images/diamondShapes/radiant.png';
import asscher from '../assets/images/diamondShapes/asscher.png';
import marquise from '../assets/images/diamondShapes/marquise.png';
import heart from '../assets/images/diamondShapes/heart.png';

export const enums = {
	BlobDirectoryType: {
		Public: 0,
		PaidContent: 1,
		Private: 2,
	},
	DeliveryFeeType: {
		Distance: 1,
		LocationToCity: 2,
	},
	WarrantyStatus: {
		Active: 0,
		Expired: 1,
		Cancelled: 2,
	},
	WarrantyType: {
		Diamond: 1,
		Jewelry: 2,
	},
	TransactionType: {
		Pay: 1,
		Refund: 3,
		Partial_Refund: 4,
	},
	DiamondOrigin: {
		Natural: 1,
		Lab: 2,
		Both: 3,
	},
	Operator: {
		Equal_Or_Larger: 1,
		Larger: 2,
	},
	RedemptionMode: {
		Single: 1,
		Multiple: 2,
	},
	Status: {
		Scheduled: 1,
		Active: 2,
		Paused: 3,
		Expired: 4,
		Cancelled: 5,
	},
	TargetType: {
		Mẫu_Trang_Sức: 1,
		Kim_Cương: 2,
		Order: 3,
	},
	UnitType: {
		Phần_Trăm: 1,
		Giảm_Giá_Cứng: 2,
		Free_Gift: 3,
	},
	DeliveryPackageStatus: {
		Preparing: 1,
		Delivering: 2,
		Complete: 3,
		Cancelled: 4,
	},
	OrderItemStatus: {
		Chờ_Xử_Lí: 0,
		Đang_Chuẩn_Bị: 1,
		Đã_Xong: 2,
		Đã_Xóa: 3,
	},
	OrderStatus: {
		Pending: 1,
		Processing: 2,
		Rejected: 3,
		Cancelled: 4,
		Prepared: 5,
		Delivering: 6,
		Delivery_Failed: 7,
		Success: 8,
		Refused: 9,
	},
	PaymentStatus: {
		PaidAll: 1,
		Deposited: 2,
		Refunding: 3,
		Refunded: 4,
		Pending: 5,
	},
	PaymentType: {
		Payall: 1,
		COD: 2,
	},
	PriorityLevel: {
		Low: 0,
		Medium: 1,
		High: 2,
	},
	BackType: {
		Push_Back: 0,
		Screw_Back: 1,
		Secure_Lock_Back: 2,
	},
	ChainType: {
		Cable: 0,
		Rope: 1,
		Bead: 2,
		Byzantine: 3,
		Figaro: 4,
		Curb: 5,
	},
	ClaspType: {
		Spring_Ring: 0,
		Lobster_Claw: 1,
		Bayonet: 2,
		Barrel: 3,
		Open_Box: 4,
		Toggle: 5,
		S_Hook: 6,
		Magnetic: 7,
		Pearl: 8,
		Bracelet_Catch: 9,
	},
	SettingType: {
		Prong: 0,
		Bezel: 1,
		Tension: 2,
		Pave: 3,
		Bar: 4,
		Flush: 5,
	},
	Clarity: {
		S12: 1,
		S11: 2,
		VS2: 3,
		VS1: 4,
		VVS2: 5,
		VVS1: 6,
		IF: 7,
		FL: 8,
	},
	Color: {
		K: 1,
		J: 2,
		I: 3,
		H: 4,
		G: 5,
		F: 6,
		E: 7,
		D: 8,
	},
	Culet: {
		Không_Có: 1,
		Rất_Nhỏ: 2,
		Nhỏ: 3,
		Bình_Thường: 4,
		Hơi_Lớn: 5,
		Lớn: 6,
		Rất_Lớn: 7,
		Cực_Lớn: 8,
	},
	Cut: {
		Tốt: 1,
		Rất_Tốt: 2,
		Xuất_Sắc: 3,
	},
	Fluorescence: {
		Không_Có: 1,
		Mờ: 2,
		Bình_Thường: 3,
		Mạnh: 4,
	},
	Girdle: {
		Cực_Mỏng: 1,
		Rất_Mỏng: 2,
		Mỏng: 3,
		Bình_Thường: 4,
		Hơi_Dày: 5,
		Dày: 6,
		Rất_Dày: 7,
		Cực_Dày: 8,
	},
	Polish: {
		Kém: 1,
		Trung_Bình: 2,
		Tốt: 3,
		Rất_Tốt: 4,
		Xuất_Sắc: 5,
	},
	Symmetry: {
		Kém: 1,
		Trung_Bình: 2,
		Tốt: 3,
		Rất_Tốt: 4,
		Xuất_Sắc: 5,
	},
	DeliveryMethod: {
		Train: 0,
		Car: 1,
		Plane: 2,
	},
	CustomizeRequestStatus: {
		Pending: 1,
		Priced: 2,
		Requesting: 3,
		Accepted: 4,
		Shop_Rejected: 5,
		Customer_Rejected: 6,
		Customer_Cancelled: 7,
	},
	AccountRoleType: {
		Customer: 0,
		Staff: 1,
		None: -1,
	},
	Shapes: {
		Round: 1,
		Cushion: 3,
		Emerald: 4,
		Oval: 5,
		Radiant: 6,
		Asscher: 7,
		Marquise: 8,
		Heart: 9,
		Princess: 2,
		Pear: 10,
	},
	OrderItemStatus: {
		Pending: 0,
		Prepared: 1,
		Done: 2,
		Removed: 3,
	},
};

export const enumMappings = {
	TargetType: {
		1: 'Mẫu Trang Sức',
		2: 'Kim Cương',
		3: 'Order',
	},
	UnitType: {
		1: 'Phần Trăm',
		2: 'Giảm Giá Cứng',
		3: 'Free Gift',
	},
	Status: {
		1: 'Đã Lên Lịch',
		2: 'Đang Hoạt Động',
		3: 'Đã Tạm Dừng',
		4: 'Hết Hạn',
		5: 'Đã Hủy',
	},
	Origin: {
		1: 'Tự Nhiên',
		2: 'Nhân Tạo',
		3: 'Cả Hai',
	},
	Operator: {
		1: 'Lớn hơn hoặc bằng',
		2: 'Lớn hơn',
	},
	PriorityLevel: {
		0: 'Low',
		1: 'Medium',
		2: 'High',
	},
	BackType: {
		0: 'Push Back',
		1: 'Screw Back',
		2: 'Secure Lock Back',
	},
	ChainType: {
		0: 'Cable',
		1: 'Rope',
		2: 'Bead',
		3: 'Byzantine',
		4: 'Figaro',
		5: 'Curb',
	},
	ClaspType: {
		0: 'Spring Ring',
		1: 'Lobster Claw',
		2: 'Bayonet',
		3: 'Barrel',
		4: 'Open Box',
		5: 'Toggle',
		6: 'S Hook',
		7: 'Magnetic',
		8: 'Pearl',
		9: 'Bracelet Catch',
	},

	SettingType: {
		0: 'Prong',
		1: 'Bezel',
		2: 'Tension',
		3: 'Pave',
		4: 'Bar',
		5: 'Flush',
	},
	Clarity: {
		1: 'S12',
		2: 'S11',
		3: 'VS2',
		4: 'VS1',
		5: 'VVS2',
		6: 'VVS1',
		7: 'IF',
		8: 'FL',
	},
	Color: {
		1: 'K',
		2: 'J',
		3: 'I',
		4: 'H',
		5: 'G',
		6: 'F',
		7: 'E',
		8: 'D',
	},
	Culet: {
		1: 'Không có',
		2: 'Rất Nhỏ',
		3: 'Nhỏ',
		4: 'Trung Bình',
		5: 'Hơi Lớn',
		6: 'Lớn',
		7: 'Rất Lớn',
		8: 'Cực Lớn',
	},
	Cut: {
		1: 'Tốt',
		2: 'Rất Tốt',
		3: 'Xuất Sắc',
	},
	Fluorescence: {
		1: 'Không',
		2: 'Nhẹ',
		3: 'Trung Bình',
		4: 'Mạnh',
	},
	Girdle: {
		1: 'Cực Mỏng',
		2: 'Rất Mỏng',
		3: 'Mỏng',
		4: 'Trung Bình',
		5: 'Hơi Dày',
		6: 'Dày',
		7: 'Rất Dày',
		8: 'Cực Dày',
	},
	Polish: {
		1: 'Kém',
		2: 'Trung Bình',
		3: 'Tốt',
		4: 'Rất Tốt',
		5: 'Xuất Sắc',
	},
	Symmetry: {
		1: 'Kém',
		2: 'Trung Bình',
		3: 'Tốt',
		4: 'Rất Tốt',
		5: 'Xuất Sắc',
	},
	Shape: {
		1: 'Round',
		2: 'Princess',
		4: 'Emerald',
		7: 'Asscher',
		8: 'Marquise',
		5: 'Oval',
		6: 'Radiant',
		10: 'Pear',
		9: 'Heart',
		3: 'Cushion',
	},
};

export const marks = {
	1: 'K',
	2: 'J',
	3: 'I',
	4: 'H',
	5: 'G',
	6: 'F',
	7: 'E',
	8: 'D',
};
export const marksCut = {
	1: 'Tốt',
	2: 'Rất Tốt',
	3: 'Xuất Sắc',
};
export const marksClarity = {
	1: 'SI2',
	2: 'SI1',
	3: 'VS2',
	4: 'VS1',
	5: 'VVS2',
	6: 'VVS1',
	7: 'IF',
	8: 'FL',
};
export const Clarity = {
	S12: 1,
	S11: 2,
	VS2: 3,
	VS1: 4,
	VVS2: 5,
	VVS1: 6,
	IF: 7,
	FL: 8,
};

export const Color = {
	K: 1,
	J: 2,
	I: 3,
	H: 4,
	G: 5,
	F: 6,
	E: 7,
	D: 8,
};

export const Cut = {
	Good: 1,
	Rất_Tốt: 2,
	Excellent: 3,
};
export const ShapeName = {
	Round: '1',
	Princess: '2',
	Emerald: '4',
	Asscher: '7',
	Marquise: '8',
	Oval: '5',
	Radiant: '6',
	Pear: '10',
	Heart: '9',
	Cushion: '3',
};

export const shapeItems = [
	{
		id: 1,
		image: round,
		value: 1,
		shape: 'Round',
	},
	{
		id: 2,
		image: cushion,
		shape: 'Cushion',
		value: 3,
	},
	{id: 3, image: emerald, shape: 'Emerald', value: 4},
	{id: 4, image: oval, shape: 'Oval', value: 5},
	{id: 5, image: radiant, shape: 'Radiant', value: 6},
	{id: 6, image: asscher, shape: 'Asscher', value: 7},
	{id: 7, image: marquise, shape: 'Marquise', value: 8},
	{id: 8, image: heart, shape: 'Heart', value: 9},
	{id: 9, image: princess, shape: 'Princess', value: 2},
	{id: 9, image: pear, shape: 'Pear', value: 10},
];
