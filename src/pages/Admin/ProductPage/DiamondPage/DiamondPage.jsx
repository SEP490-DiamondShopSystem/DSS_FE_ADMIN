import React, {useEffect, useState} from 'react';
import {DiamondUploadForm} from './DiamondUploadForm';
import {DeleteFilled, PlusOutlined} from '@ant-design/icons';
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
import debounce from 'lodash/debounce';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {
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
} from '../../../../redux/slices/diamondSlice';
import {formatPrice} from '../../../../utils';
import {marks, marksClarity, marksCut} from '../../../../utils/constant';
import {AddModalDiamond} from './AddModalDiamond/AddModalDiamond';

const {Search} = Input;

const DiamondPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const diamondList = useSelector(getAllDiamondSelector);
	const loading = useSelector(LoadingDiamondSelector);
	const shapes = useSelector(getAllShapeSelector);
	const filterLimits = useSelector(GetDiamondFilterSelector);

	const [active, setActive] = useState('all');
	const [type, setType] = useState('');
	const [shape, setShape] = useState('');
	const [searchText, setSearchText] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [diamonds, setDiamonds] = useState([]);
	const [diamondId, setDiamondId] = useState();
	const [filters, setFilters] = useState({});
	const [pageSize, setPageSize] = useState(100);
	const [start, setStart] = useState(0);
	const [checked, setChecked] = useState(false);
	const [checkedDiamondJewelry, setCheckedDiamondJewelry] = useState(false);

	const [isFormVisible, setIsFormVisible] = useState(false); // for controlling the form visibility
	const [selectedDiamondId, setSelectedDiamondId] = useState(null); // to store the selected diamondId

	useEffect(() => {
		dispatch(getDiamondFilter());
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
			title: 'SKU',
			key: 'CriteriaId',
			dataIndex: 'CriteriaId',
			align: 'center',
		},
		// {
		// 	title: 'Status',
		// 	key: 'status',
		// 	dataIndex: 'status',
		// 	align: 'center',
		// 	render: (status) => {
		// 		let color = status.length > 5 ? 'geekblue' : 'green';
		// 		if (status === 'Expired') {
		// 			color = 'volcano';
		// 		}
		// 		return <Tag color={color}>{status.toUpperCase()}</Tag>;
		// 	},
		// },
		{
			title: 'Giá',
			key: 'TruePrice',
			dataIndex: 'TruePrice',
			align: 'center',
		},
		{
			title: '',
			key: 'action',
			align: 'center',
			render: (_, record) => (
				<Space size="middle">
					<Button
						type="primary"
						onClick={() => handleView(record.Id)} // On click, open the form
					>
						View
					</Button>
					<Button danger onClick={() => showDeleteModal(record.Id)}>
						<DeleteFilled />
					</Button>
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
			})
		);
	}, 500);

	useEffect(() => {
		fetchDiamondData();

		return () => fetchDiamondData.cancel();
	}, [dispatch, filters, shape, checked, checkedDiamondJewelry]);

	useEffect(() => {
		if (diamondList) {
			const diamondSetting =
				diamondList &&
				diamondList?.Values?.map((diamond) => ({
					Id: diamond?.Id,
					ShapeName: diamond?.DiamondShape?.ShapeName,
					CriteriaId: diamond?.DiamondPrice?.CriteriaId,
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
		console.log('Deleted successfully');
		dispatch(handleDeleteDiamond(diamondId))
			.unwrap()
			.then((res) => {
				console.log('res', res);
				if (res.payload !== undefined) {
					message.success('Xóa Kim Cương Thành Công!');
				} else {
					message.error(error?.data?.title || error?.detail);
				}
			})
			.catch((error) => {
				message.error(error?.data?.title || error?.detail);
			});
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const handleView = (diamondId) => {
		setSelectedDiamondId(diamondId); // Set the selected diamondId
		setIsFormVisible(true); // Show the form
	};

	const text = <span>Lọc</span>;

	const content = (
		<div className="my-4" style={{width: 1000, textAlign: 'justify'}}>
			<Space wrap className="">
				<div className="ml-10 min-w-44">
					<p>Hình Dạng</p>
					<Select
						defaultValue=""
						placeholder="Shape"
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
				<div className="ml-10 min-w-96">
					<p className="mb-4">Giá:</p>
					<Slider
						range
						value={[filters?.price?.minPrice, filters?.price?.maxPrice]}
						min={filterLimits?.Price?.Min}
						max={filterLimits?.Price?.Max}
						onChange={handlePriceChange}
					/>
				</div>
			</Space>
			<Space wrap className="my-5">
				{/* Carat Range Slider */}

				<div className="ml-10 min-w-44">
					<p className="mb-4">Carat:</p>
					<Slider
						range
						value={[filters?.carat?.minCarat, filters?.carat?.maxCarat]}
						step={0.1}
						min={filterLimits?.Carat?.Min}
						max={filterLimits?.Carat?.Max}
						onChange={handleCaratChange}
					/>
				</div>

				<div className="ml-10 min-w-72">
					<p className="my-4">Color:</p>
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
					<p className="my-4">Clarity:</p>
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
					<p className="my-4">Cut:</p>
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
			{/* <Filter filter={filter} handleStatusBtn={handleStatusBtn} active={active} /> */}

			<div>
				<div className="flex items-center justify-between">
					<div className="flex items-center my-5">
						<Popover
							placement="bottomLeft"
							title={text}
							content={content}
							trigger={'click'}
						>
							<Button>Lọc Theo Tiêu Chí</Button>
						</Popover>
					</div>
					<div>
						<Button
							type="text"
							className="bg-primary"
							icon={<PlusOutlined />}
							onClick={showModelAdd}
						>
							Thêm
						</Button>
					</div>
				</div>
				<div>
					<Table
						dataSource={diamonds}
						columns={columns}
						className="custom-table-header"
						loading={loading}
						pagination={{pageSize: 5}}
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
		</div>
	);
};

export default DiamondPage;
