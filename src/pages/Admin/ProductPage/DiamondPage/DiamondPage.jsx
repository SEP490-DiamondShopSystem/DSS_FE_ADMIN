import {
	DeleteFilled,
	EyeFilled,
	LockOutlined,
	PlusOutlined,
	UnlockFilled,
	UnlockOutlined,
	UploadOutlined,
} from '@ant-design/icons';
import {
	Button,
	Checkbox,
	Form,
	Input,
	message,
	Modal,
	Popover,
	Select,
	Slider,
	Space,
	Table,
	Tag,
	Tooltip,
	Typography,
} from 'antd';
import debounce from 'lodash/debounce';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {
	FetchDataSelector,
	getAllDiamondSelector,
	getAllShapeSelector,
	GetDiamondFilterSelector,
	LoadingDiamondSelector,
} from '../../../../redux/selectors';
import {
	getAllDiamond,
	getDiamondFilter,
	getDiamondShape,
	handleDeleteDiamond,
	handleLockDiamond,
} from '../../../../redux/slices/diamondSlice';
import {formatPrice} from '../../../../utils';
import {marks, marksClarity, marksCut} from '../../../../utils/constant';
import {AddModalDiamond} from './AddModalDiamond/AddModalDiamond';
import {DiamondUploadForm} from './DiamondUploadForm';
import {LockDiamondModal} from './LockDiamondModal/LockDiamondModal';
import {Filter} from '../../../../components/Filter';

const {Search} = Input;
const {Title} = Typography;

const statusList = [
	{name: 'Tất Cả', value: ''},
	{name: 'Đang bán', value: '1'},
	{name: 'Đã bán', value: '2'},
	{name: 'Đã khóa', value: '3'},
	{name: 'Hết hàng', value: '4'},
	{name: 'Khóa cho khách hàng', value: '5'},
	{name: 'Đặt trước', value: '6'},
];

const statusMapping = {
	1: {label: 'Đang bán', color: 'green'},
	2: {label: 'Đã bán', color: 'blue'},
	3: {label: 'Đã khóa', color: 'volcano'},
	4: {label: 'Hết hàng', color: 'red'},
	5: {label: 'Khóa cho khách hàng', color: 'purple'},
	6: {label: 'Đặt trước', color: 'geekblue'},
};

const DiamondPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [form] = Form.useForm();
	const loading = useSelector(LoadingDiamondSelector);
	const shapes = useSelector(getAllShapeSelector);
	const fetch = useSelector(FetchDataSelector);

	const [shape, setShape] = useState();
	const [showModal, setShowModal] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [diamondList, setDiamondList] = useState();
	const [diamonds, setDiamonds] = useState([]);
	const [diamondId, setDiamondId] = useState();
	const [filters, setFilters] = useState({});
	const [pageSize, setPageSize] = useState(5);
	const [start, setStart] = useState(0);
	const [checked, setChecked] = useState(false);
	const [checkedDiamondJewelry, setCheckedDiamondJewelry] = useState(false);
	const [isFormVisible, setIsFormVisible] = useState(false);
	const [selectedDiamondId, setSelectedDiamondId] = useState(null);
	const [isLockDiamondModalVisible, setIsLockDiamondModalVisible] = useState(false);
	const [lockDiamondId, setLockDiamondId] = useState();
	const [activeStatus, setActiveStatus] = useState('');
	const [searchText, setSearchText] = useState('');
	const [filterLimits, setFilterLimits] = useState(null);

	useEffect(() => {
		dispatch(getDiamondFilter())
			.unwrap()
			.then((res) => {
				setFilterLimits(res);
			});
	}, []);

	useEffect(() => {
		if (filterLimits) {
			setFilters({
				shape: shape,
				price: {minPrice: filterLimits?.Price?.Min, maxPrice: filterLimits?.Price?.Max},
				carat: {
					minCarat: filterLimits?.Carat?.Min,
					maxCarat: filterLimits?.Carat?.Max,
				},
				color: {minColor: filterLimits?.Color?.Min, maxColor: filterLimits?.Color?.Max},
				clarity: {
					minClarity: filterLimits?.Clarity?.Min,
					maxClarity: filterLimits?.Clarity?.Max,
				},
				cut: {minCut: filterLimits?.Cut?.Min, maxCut: filterLimits?.Cut?.Max},
			});
		}
	}, [filterLimits]);

	const columns = [
		{
			title: 'Hình Ảnh',
			dataIndex: 'Thumbnail',
			key: 'Thumbnail',
			align: 'center',
			render: (thumbnail) => (
				<img
					src={thumbnail?.MediaPath}
					alt="Thumbnail"
					style={{
						width: 50,
						height: 50,
						objectFit: 'cover',
						borderRadius: '8px',
						boxShadow: '0 0 10px rgba(0,0,0,0.1)',
					}}
				/>
			),
		},

		{
			title: 'Kim Cương',
			dataIndex: 'Title',
			key: 'Title',
			align: 'center',
		},
		{
			title: 'Nguồn Gốc',
			key: 'IsLabDiamond',
			dataIndex: 'IsLabDiamond',
			align: 'center',
			render: (isLabDiamond) => {
				const color = isLabDiamond ? 'volcano' : 'green';
				const label = isLabDiamond ? 'Nhân Tạo' : 'Tự Nhiên';

				return (
					<Tag color={color} key={label}>
						{label.toUpperCase()}
					</Tag>
				);
			},
		},
		{
			title: 'Mã Sê-ri',
			key: 'SerialCode',
			dataIndex: 'SerialCode',
			align: 'center',
		},

		{
			title: 'Giá',
			key: 'TruePrice',
			dataIndex: 'TruePrice',
			align: 'center',
		},
		{
			title: 'Trạng Thái',
			key: 'Status',
			dataIndex: 'Status',
			align: 'center',
			render: (status) => {
				const {label, color} = statusMapping[status] || {
					label: 'Không Biết',
					color: 'gray',
				};
				return <Tag color={color}>{label?.toUpperCase()}</Tag>;
			},
		},
		{
			title: '',
			key: 'action',
			align: 'center',
			render: (_, record) => (
				<Space size="middle">
					{/* <Tooltip title="Thêm Ảnh">
						<Button type="primary" onClick={() => handleView(record.Id)}>
							<UploadOutlined />
						</Button>
					</Tooltip> */}
					{/* <Tooltip title="Khóa Kim Cương">
						<Button type="default" onClick={() => handleLockDiamondView(record)}>
							{record?.ProductLock === null ? <UnlockOutlined /> : <LockOutlined />}
						</Button>
					</Tooltip> */}
					<Tooltip title="Chi Tiết Kim Cương">
						<Button onClick={() => navigate(`/products/diamond-list/${record.Id}`)}>
							<EyeFilled />
						</Button>
					</Tooltip>
					<Tooltip title="Xóa Kim Cương">
						<Button danger onClick={() => showDeleteModal(record.Id)}>
							<DeleteFilled />
						</Button>
					</Tooltip>
				</Space>
			),
		},
	];

	useEffect(() => {
		dispatch(getDiamondShape());
	}, []);

	const fetchDiamondData = debounce(() => {
		dispatch(
			getAllDiamond({
				pageSize,
				start,
				priceStart: filters?.price?.minPrice,
				priceEnd: filters?.price?.maxPrice,
				shapeId: shape,
				cutFrom: filters?.cut?.minCut,
				cutTo: filters?.cut?.maxCut,
				colorFrom: filters?.color?.minColor,
				colorTo: filters?.color?.maxColor,
				clarityFrom: filters?.clarity?.minClarity,
				clarityTo: filters?.clarity?.maxClarity,
				caratFrom: filters?.carat?.minCarat,
				caratTo: filters?.carat?.maxCarat,
				isLab: checked,
				includeJewelryDiamond: checkedDiamondJewelry,
				diamondStatuses: activeStatus,
				sku: searchText,
			})
		)
			.unwrap()
			.then((res) => {
				setDiamondList(res);
			});
	}, 500);

	useEffect(() => {
		fetchDiamondData();

		return () => fetchDiamondData.cancel();
	}, [
		dispatch,
		filters,
		shape,
		checked,
		checkedDiamondJewelry,
		activeStatus,
		fetch,
		searchText,
		start,
		pageSize,
	]);

	useEffect(() => {
		if (diamondList) {
			const diamondSetting =
				diamondList &&
				diamondList?.Values?.map((diamond) => ({
					...diamond,
					Id: diamond?.Id,
					ShapeName: diamond?.DiamondShape?.ShapeName,
					SerialCode: diamond?.SerialCode,
					Carat: diamond?.Carat,
					Clarity: diamond?.Clarity,
					Color: diamond?.Color,
					Culet: diamond?.Culet,
					Depth: diamond?.Depth,
					IsLabDiamond: diamond?.IsLabDiamond,
					Measurement: diamond?.Measurement,
					Polish: diamond?.Polish,
					PriceOffset: diamond?.PriceOffset,
					Symmetry: diamond?.Symmetry,
					Table: diamond?.Table,
					Title: diamond?.Title,
					TruePrice: formatPrice(diamond?.TruePrice),
					WidthLengthRatio: diamond?.WidthLengthRatio,
					Girdle: diamond?.Girdle,
					Fluorescence: diamond?.Fluorescence,
					Thumbnail: diamond?.Thumbnail,
					Status: diamond?.Status,
				}));
			setDiamonds(diamondSetting);
		}
	}, [diamondList]);

	const handleShapeChange = (value) => {
		setShape(value);
	};

	const handleChange = (type, value) => {
		setFilters((prev) => ({
			...prev,
			[type]: value,
		}));
	};

	const handlePriceChange = (value) => {
		handleChange('price', {minPrice: value[0], maxPrice: value[1]});
	};

	const handleCaratChange = (value) => {
		handleChange('carat', {minCarat: value[0], maxCarat: value[1]});
	};

	const handleColorChange = (value) => {
		handleChange('color', {minColor: value[0], maxColor: value[1]});
	};
	const handleClarityChange = (value) => {
		handleChange('clarity', {minClarity: value[0], maxClarity: value[1]});
	};
	const handleCutChange = (value) => {
		handleChange('cut', {minCut: value[0], maxCut: value[1]});
	};

	const handleChangeCheckbox = (e) => {
		setChecked(e.target.checked);
	};
	const handleChangeCheckboxDiamondJewelry = (e) => {
		setCheckedDiamondJewelry(e.target.checked);
	};

	const showModelAdd = () => {
		setShowModal(true);
	};

	const showDeleteModal = (id) => {
		setIsModalVisible(true);
		setDiamondId(id);
	};

	const handleDelete = () => {
		dispatch(handleDeleteDiamond(diamondId))
			.unwrap()
			.then(() => {
				message.success('Xóa Kim Cương Thành Công!');
			})
			.catch((error) => {
				message.error(error?.data?.detail || error?.detail);
			});
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const handleView = (diamondId) => {
		setSelectedDiamondId(diamondId);
		setIsFormVisible(true);
	};

	const handleLockDiamondView = (diamondId) => {
		setIsLockDiamondModalVisible(true);
		setLockDiamondId(diamondId);
	};

	const handleLockDiamondSubmit = (values) => {
		dispatch(handleLockDiamond(values))
			.unwrap()
			.then((res) => {
				setIsLockDiamondModalVisible(false);
				if (values?.lockedPriceForCustomer !== null) {
					message.success(`Khóa Kim Cương Thành Công`);
				} else {
					message.success(`Mở Khóa Kim Cương Thành Công`);
				}

				form.resetFields();
			})
			.catch((error) => {
				message.error(error?.data?.detail || error?.detail);
			});
	};

	const handleLockDiamondCancel = () => {
		setIsLockDiamondModalVisible(false);
	};

	const handleStatusChange = (value) => {
		setActiveStatus(value);
	};

	const onSearch = (value) => {
		setSearchText(value);
	};

	const text = <span>Lọc</span>;

	const content = (
		<div className="my-4" style={{width: 1000, textAlign: 'justify'}}>
			<Space wrap className="">
				<div className="ml-10 min-w-44">
					<p>Hình Dạng</p>
					<Select
						placeholder="Hình Dạng"
						style={{width: 120}}
						allowClear
						onChange={handleShapeChange}
					>
						{shapes &&
							shapes?.map((shape) => (
								<Option key={shape.Id} value={shape.Id}>
									{shape?.ShapeName}
								</Option>
							))}
					</Select>
				</div>
				<div className="ml-10 min-w-[600px]">
					<p className="mb-4">Giá:</p>
					<Slider
						range
						marks={{
							0: '0',
							50000000: '50M',
							200000000: '200M',
							500000000: '500M',
							700000000: '700M',
							1000000000: `10000M`,
						}}
						step={null}
						value={[filters?.price?.minPrice, filters?.price?.maxPrice]}
						min={filterLimits?.Price?.Min}
						max={1000000000}
						onChange={handlePriceChange}
					/>
				</div>
			</Space>
			<Space wrap className="my-5">
				{/* Carat Range Slider */}

				<div className="ml-10 min-w-44">
					<p className="mb-4">Ly (Carat):</p>
					<Slider
						range
						value={[filters?.carat?.minCarat, filters?.carat?.maxCarat]}
						step={0.01}
						marks={{
							[filters?.carat?.minCarat]: `${filters?.carat?.minCarat}`,
							[filters?.carat?.maxCarat]: `${filters?.carat?.maxCarat}`,
						}}
						min={filterLimits?.Carat?.Min}
						max={filterLimits?.Carat?.Max}
						onChange={handleCaratChange}
					/>
				</div>

				<div className="ml-10 min-w-72">
					<p className="my-4">Màu Sắc (Color):</p>
					<Slider
						range
						marks={marks}
						min={filterLimits?.Color?.Min}
						max={filterLimits?.Color?.Max}
						value={[filters?.color?.minColor, filters?.color?.maxColor]}
						onChange={handleColorChange}
					/>
				</div>
				<div className="ml-10 min-w-72">
					<p className="my-4">Độ Tinh Khiết (Clarity):</p>
					<Slider
						range
						marks={marksClarity}
						min={filterLimits?.Clarity?.Min}
						max={filterLimits?.Clarity?.Max}
						value={[filters?.clarity?.minClarity, filters?.clarity?.maxClarity]}
						onChange={handleClarityChange}
					/>
				</div>
				<div className="ml-10 min-w-72">
					<p className="my-4">Giác cắt (Cut):</p>
					<Slider
						range
						marks={marksCut}
						min={filterLimits?.Cut?.Min}
						max={filterLimits?.Cut?.Max}
						value={[filters?.cut?.minCut, filters?.cut?.maxCut]}
						onChange={handleCutChange}
					/>
				</div>
			</Space>
			<Space wrap className="my-5">
				<div className="ml-10">
					<Checkbox checked={checked} onChange={handleChangeCheckbox}>
						Kim Cương Nhân Tạo
					</Checkbox>
				</div>
				<div className="ml-10">
					<Checkbox
						checked={checkedDiamondJewelry}
						onChange={handleChangeCheckboxDiamondJewelry}
					>
						Kim Cương Đã Đính
					</Checkbox>
				</div>
			</Space>
		</div>
	);
	// if (diamondList === null || diamondList === undefined) <Loading />;
	return (
		<div className="mx-20 my-10">
			<Title level={3}>Danh Sách Kim Cương</Title>
			<Filter
				filter={statusList}
				handleStatusBtn={handleStatusChange}
				active={activeStatus}
			/>
			<div>
				<div className="flex items-center justify-between">
					<Space className="flex items-center my-5">
						<div>
							<Popover
								placement="bottomLeft"
								title={text}
								content={content}
								trigger={'hover'}
							>
								<Button>Lọc Theo Tiêu Chí</Button>
							</Popover>
						</div>
						<div className="flex items-center">
							<span className="ml-3 mr-2">Tìm Kiếm Sê-ri:</span>
							<div>
								<Search
									className="w-full sm:w-60"
									placeholder="Tìm theo sê-ri"
									allowClear
									onSearch={onSearch}
								/>
							</div>
						</div>
					</Space>
					<div>
						<Button
							type="text"
							className="bg-primary"
							icon={<PlusOutlined />}
							onClick={showModelAdd}
						>
							Thêm Kim Cương
						</Button>
					</div>
				</div>
				<div>
					<Table
						dataSource={diamonds}
						columns={columns}
						className="custom-table-header"
						loading={loading}
						pagination={{
							current: start + 1,
							total: diamondList?.TotalPage * pageSize,
							pageSize: pageSize,
							onChange: (page) => setStart(page - 1),
							showSizeChanger: false,
							onShowSizeChange: (current, size) => setPageSize(size),
						}}
					/>
				</div>
			</div>
			<AddModalDiamond setShowModal={setShowModal} showModal={showModal} />
			<DiamondUploadForm
				diamondId={selectedDiamondId}
				visible={isFormVisible}
				onClose={() => setIsFormVisible(false)} // Close the form
			/>

			<Modal
				title="Xóa Kim Cương"
				visible={isModalVisible}
				onOk={handleDelete}
				onCancel={handleCancel}
			>
				<p>Bạn có chắc chắn muốn xóa kim cương này không?</p>
			</Modal>
			<LockDiamondModal
				isOpen={isLockDiamondModalVisible}
				onCancel={handleLockDiamondCancel}
				onSubmit={handleLockDiamondSubmit}
				lockDiamondId={lockDiamondId}
				form={form}
			/>
		</div>
	);
};

export default DiamondPage;
