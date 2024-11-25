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
		Expired: 3,
		Paused: 4,
		Cancelled: 5,
	},
	TargetType: {
		Jewelry_Model: 1,
		Diamond: 2,
		Order: 3,
	},
	UnitType: {
		Percent: 1,
		Fix_Price: 2,
		Free_Gift: 3,
	},
	DeliveryPackageStatus: {
		Preparing: 1,
		Delivering: 2,
		Complete: 3,
		Cancelled: 4,
	},
	OrderItemStatus: {
		Preparing: 0,
		Done: 1,
		Removed: 2,
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
		None: 1,
		Very_Small: 2,
		Small: 3,
		Medium: 4,
		Slightly_Large: 5,
		Large: 6,
		Very_Large: 7,
		Extremely_Large: 8,
	},
	Cut: {
		Good: 1,
		Very_Good: 2,
		Excellent: 3,
	},
	Fluorescence: {
		None: 1,
		Faint: 2,
		Medium: 3,
		Strong: 4,
	},
	Girdle: {
		Extremely_Thin: 1,
		Very_Thin: 2,
		Thin: 3,
		Medium: 4,
		Slightly_Thick: 5,
		Thick: 6,
		Very_Thick: 7,
		Extremely_Thick: 8,
	},
	Polish: {
		Poor: 1,
		Fair: 2,
		Good: 3,
		Very_Good: 4,
		Excellent: 5,
	},
	Symmetry: {
		Poor: 1,
		Fair: 2,
		Good: 3,
		Very_Good: 4,
		Excellent: 5,
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
};

export const enumMappings = {
	Origin: {
		1: 'Tự Nhiên',
		2: 'Nhân Tạo',
		3: 'Cả hai',
	},
	Operator: {
		1: 'Equal or Larger',
		2: 'Larger',
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
		1: 'None',
		2: 'Very Small',
		3: 'Small',
		4: 'Medium',
		5: 'Slightly Large',
		6: 'Large',
		7: 'Very Large',
		8: 'Extremely Large',
	},
	Cut: {
		1: 'Good',
		2: 'Very Good',
		3: 'Excellent',
	},
	Fluorescence: {
		1: 'None',
		2: 'Faint',
		3: 'Medium',
		4: 'Strong',
	},
	Girdle: {
		1: 'Extremely Thin',
		2: 'Very Thin',
		3: 'Thin',
		4: 'Medium',
		5: 'Slightly Thick',
		6: 'Thick',
		7: 'Very Thick',
		8: 'Extremely Thick',
	},
	Polish: {
		1: 'Poor',
		2: 'Fair',
		3: 'Good',
		4: 'Very Good',
		5: 'Excellent',
	},
	Symmetry: {
		1: 'Poor',
		2: 'Fair',
		3: 'Good',
		4: 'Very Good',
		5: 'Excellent',
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
	1: 'Good',
	2: 'Very Good',
	3: 'Excelent',
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
	Very_Good: 2,
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
