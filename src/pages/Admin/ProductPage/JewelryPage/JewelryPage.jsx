import React, {useEffect, useState, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';

import {
	Form,
	Input,
	Button,
	Checkbox,
	Select,
	Row,
	Col,
	Spin,
	notification,
	Card,
	Modal,
	Tag,
	Tooltip,
	Empty,
	message,
} from 'antd';
import {
	SearchOutlined,
	PlusOutlined,
	FilterOutlined,
	InfoCircleOutlined,
	DollarOutlined,
	GoldOutlined,
	CheckCircleOutlined,
	FilterFilled,
} from '@ant-design/icons';
import {fetchAllJewelry, fetchJewelryDetail} from '../../../../redux/slices/jewelry/jewelrySlice';
import JewelryModelList from '../../PromotionPage/JewelryModelList';
import {
	selectJewelryList,
	selectJewelryLoading,
	selectJewelryError,
	selectJewelryTotalPage,
	getAllMetalsSelector,
	getAllSizesSelector,
} from '../../../../redux/selectors';
import JewelryDetail from './JewelryDetail';
import JewelryCreateForm from './JewelryCreateForm';
import {fetchAllMetals} from '../../../../redux/slices/jewelry/metalSlice';
import {fetchAllSizes} from '../../../../redux/slices/jewelry/sizeSlice';
import {formatPrice} from '../../../../utils';
import Loading from '../../../../components/Loading';
import {Helmet} from 'react-helmet';

const JewelryPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const loading = useSelector(selectJewelryLoading);
	const error = useSelector(selectJewelryError);
	const totalPage = useSelector(selectJewelryTotalPage);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [jewelry, setJewelry] = useState(null);

	// const jewelryList = useSelector(selectJewelryList);
	const [isPopupVisible, setIsPopupVisible] = useState(false);
	const [selectedModel, setSelectedModel] = useState(null);
	const [selectedJewelry, setSelectedJewelry] = useState(null);
	const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
	const [isFilterVisible, setIsFilterVisible] = useState(false);
	const [jewelryList, setJewelryList] = useState(null);

	const [filters, setFilters] = useState({
		ModelName: '',
		SerialCode: '',
		MetalId: '',
		SizeId: '',
		HasSideDiamond: false,
		Status: 1,
	});

	const metals = useSelector(getAllMetalsSelector);
	const sizes = useSelector(getAllSizesSelector);

	const sizesByUnit = useMemo(() => {
		return sizes?.reduce((acc, sizeGroup) => {
			if (!sizeGroup.Unit) return acc;

			if (!acc[sizeGroup.Unit]) {
				acc[sizeGroup.Unit] = [];
			}
			acc[sizeGroup.Unit].push(...sizeGroup.Sizes);
			return acc;
		}, {});
	}, [sizes]);

	useEffect(() => {
		dispatch(fetchAllMetals());
		dispatch(fetchAllSizes());
	}, [dispatch]);

	useEffect(() => {
		if (selectedModel?.Id) {
			dispatch(
				fetchAllJewelry({
					CurrentPage: currentPage,
					PageSize: pageSize,
					filters,
					JewelryModelId: selectedModel?.Id,
				})
			)
				.unwrap()
				.then((res) => {
					setJewelryList(res?.Values);
				})
				.catch((error) => {
					notification.error({
						message: 'Lỗi',
						description:
							error?.data?.detail ||
							error?.detail ||
							'Không thể tải danh sách trang sức',
					});
				});
		}
	}, [dispatch, selectedModel?.Id, currentPage, pageSize]);

	const handleSelectModel = (model) => {
		setSelectedModel(model);
		setIsPopupVisible(false);
	};

	const handleJewelryClick = (jewelry) => {
		setSelectedJewelry(jewelry);
	};

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

	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
			<Helmet>
				<title>Quản Lý Trang Sức</title>
			</Helmet>
			<div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
				{/* Header */}
				<div className="bg-primary/10 px-6 py-6 border-b border-primary/20 flex justify-between items-center">
					<h1 className="text-3xl font-semibold flex items-center">
						<GoldOutlined className="mr-3 text-primary-600" />
						Quản Lý Trang Sức
					</h1>
					<Button
						type="primary"
						icon={<PlusOutlined />}
						onClick={() => setIsCreateFormOpen(true)}
						className="bg-primary hover:bg-primary-600 transition-colors rounded-lg shadow-md"
					>
						Thêm Trang Sức
					</Button>
				</div>

				<div className="p-6 space-y-6">
					<Card
						className="border-primary/50 hover:border-primary transition-all"
						title={
							<div className="flex items-center text-primary">
								<CheckCircleOutlined className="mr-2" />
								Chọn Mẫu Trang Sức
							</div>
						}
					>
						<Row gutter={16} align="middle">
							<Col xs={24} md={16}>
								<Input
									readOnly
									value={selectedModel?.Name || 'Chưa chọn mẫu'}
									placeholder="Chọn mẫu trang sức"
									prefix={<InfoCircleOutlined className="text-primary" />}
									className="rounded-lg"
								/>
							</Col>
							<Col xs={24} md={8}>
								<Button
									type="default"
									onClick={() => setIsPopupVisible(true)}
									className="w-full rounded-lg"
								>
									Chọn Mẫu
								</Button>
							</Col>
						</Row>
					</Card>

					{/* Filters */}
					<Card
						className="mb-6 border-primary"
						title={
							<div
								className="flex items-center cursor-pointer"
								onClick={() => setIsFilterVisible(!isFilterVisible)}
							>
								<FilterOutlined className="mr-2 text-primary" />
								Bộ Lọc {isFilterVisible ? '▼' : '►'}
							</div>
						}
					>
						{isFilterVisible && (
							<Row gutter={[16, 16]}>
								<Col xs={24} md={12} lg={6}>
									<div>Chất Liệu</div>
									<Select
										value={filters.MetalId}
										onChange={(value) => {
											const updatedFilters = {...filters, MetalId: value};
											setFilters(updatedFilters);
										}}
										placeholder="Chọn chất liệu"
										allowClear
										className="w-full"
									>
										{metals.map((metal) => (
											<Select.Option key={metal.Id} value={metal.Id}>
												{metal.Name}
											</Select.Option>
										))}
									</Select>
								</Col>
								<Col xs={24} md={12} lg={6} className="w-full">
									<div>Kích Thước</div>
									<Select
										value={filters.SizeId}
										onChange={(value) => {
											setFilters((prevFilters) => ({
												...prevFilters,
												SizeId: value,
											}));
										}}
										placeholder="Chọn kích thước"
										allowClear
										className="w-full"
									>
										{Object.entries(sizesByUnit).map(([unit, unitSizes]) => (
											<Select.OptGroup key={unit} label={unit.toUpperCase()}>
												{unitSizes.map((size) => (
													<Select.Option key={size.Id} value={size.Id}>
														{`${size.Value} ${unit}`}
													</Select.Option>
												))}
											</Select.OptGroup>
										))}
									</Select>
								</Col>

								<Col xs={24} md={12} lg={6}>
									<div>Trạng Thái</div>
									<Select
										allowClear
										value={filters.Status}
										onChange={(value) => {
											const updatedFilters = {...filters, Status: value};
											setFilters(updatedFilters); // Update the state
										}}
										className="w-full"
									>
										<Select.Option value={1}>Hoạt động</Select.Option>
										<Select.Option value={4}>Không hoạt động</Select.Option>
										<Select.Option value={3}>Đã lưu trữ</Select.Option>
										<Select.Option value={2}>Đã bán</Select.Option>
										<Select.Option value={5}>Bị khóa</Select.Option>
										<Select.Option value={6}>Đặt trước</Select.Option>
									</Select>
								</Col>
								<Col xs={24} md={12} lg={6}>
									<div>Mã sê-ri</div>
									<Input
										onChange={(e) => {
											const updatedFilters = {
												...filters,
												SerialCode: e.target.value,
											};
											setFilters(updatedFilters); // Update the state
										}}
									/>
								</Col>
								<Col span={24}>
									<Button
										type="primary"
										icon={<SearchOutlined />}
										onClick={() => {
											if (!selectedModel) {
												message.warning(
													'Vui lòng chọn mẫu trang sức trước khi lọc'
												);
												return;
											}
											dispatch(
												fetchAllJewelry({
													JewelryModelId: selectedModel?.Id,
													CurrentPage: currentPage,
													PageSize: pageSize,
													MetalId: filters.MetalId,
													SerialCode: filters.SerialCode,
													SizeId: filters.SizeId,
													Status: filters.Status,
												})
											)
												.unwrap()
												.then((res) => {
													console.log('Fetch Result:', res);
													console.log('Values:', res?.Values);
													setJewelryList(res?.Values);
												})
												.catch((error) => {
													console.error('Fetch Error:', error);
													notification.error({
														message: 'Lỗi',
														description:
															error?.data?.detail ||
															error?.detail ||
															'Không thể tải danh sách trang sức',
													});
												});
										}}
										className="w-full"
									>
										Áp Dụng Bộ Lọc
									</Button>
								</Col>
							</Row>
						)}
					</Card>

					{/* Jewelry List */}
					{loading ? (
						<div className="flex justify-center items-center h-64">
							<Loading />
						</div>
					) : !jewelryList ? (
						<Empty
							description="Chưa có trang sức nào, Vui lòng chọn mẫu trang sức và tiếp tục!"
							className="my-10"
						/>
					) : (
						<>
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-10">
								{Array.isArray(jewelryList) &&
									jewelryList?.map((jewelry) => (
										<Card
											key={jewelry.Id}
											hoverable
											onClick={() =>
												navigate(`/products/jewelry-list/${jewelry?.Id}`)
											}
											className="transform transition-all hover:scale-105 hover:shadow-2xl hover:border rounded-2xl overflow-hidden"
										>
											<div className="flex">
												{/* Image Section - 40% width */}
												<div className="w-40 mr-5">
													<img
														alt={jewelry.SerialCode}
														src={
															jewelry?.Model?.Thumbnail?.MediaPath ||
															'/default-thumbnail.jpg'
														}
														className="w-full h-48 object-cover rounded-lg"
													/>
												</div>

												{/* Information Section - 60% width */}
												<div className="w-3/5 flex flex-col justify-between">
													<div>
														<div className="flex justify-between items-center mb-2">
															<span className="text-lg font-bold text-primary">
																{jewelry.Title} -{' '}
																{jewelry.ModelCode}
															</span>
															{renderStatusTag(jewelry.Status)}
														</div>

														<div className="space-y-2 text-gray-700">
															<div className="flex items-center">
																<DollarOutlined className="mr-2 text-primary" />
																<span className="font-semibold">
																	{!jewelry.SoldPrice ? (
																		jewelry.TotalPrice >
																		jewelry.SalePrice ? (
																			<div className="flex items-center">
																				<span className="line-through mr-2 text-gray-400">
																					{formatPrice(
																						jewelry.TotalPrice
																					)}
																				</span>
																				<span className="text-darkGreen text-xl">
																					{formatPrice(
																						jewelry.SalePrice
																					)}
																				</span>
																			</div>
																		) : (
																			<span className="">
																				{formatPrice(
																					jewelry.TotalPrice
																				)}
																			</span>
																		)
																	) : (
																		<Tooltip title="Giá đã bán">
																			{formatPrice(
																				jewelry.SoldPrice
																			)}
																		</Tooltip>
																	)}
																</span>
															</div>
															<div className="flex justify-between text-sm">
																<Tooltip title="Chất Liệu">
																	<span>
																		{jewelry?.Metal?.Name ||
																			'N/A'}
																	</span>
																</Tooltip>
																<Tooltip title="Kích Thước">
																	<span>
																		{jewelry?.Size?.Value}{' '}
																		{jewelry?.Size?.Unit}
																	</span>
																</Tooltip>
															</div>
														</div>
													</div>
												</div>
											</div>
										</Card>
									))}
							</div>
							<div className="flex flex-col sm:flex-row justify-center items-center mt-12 space-y-4 sm:space-y-0 sm:space-x-6">
								<div className="flex items-center space-x-4">
									<Button
										onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
										disabled={currentPage === 1}
										className="px-4 py-2 rounded-lg"
									>
										Trước
									</Button>
									<span className="text-lg font-semibold">
										Trang {currentPage} / {totalPage}
									</span>
									<Button
										onClick={() =>
											setCurrentPage((p) => Math.min(totalPage, p + 1))
										}
										disabled={currentPage === totalPage}
										className="px-4 py-2 rounded-lg"
									>
										Sau
									</Button>
								</div>
								{/* <Select value={pageSize} onChange={setPageSize} className="w-32">
							<Select.Option value={5}>5 per page</Select.Option>
							<Select.Option value={10}>10 per page</Select.Option>
							<Select.Option value={20}>20 per page</Select.Option>
						</Select> */}
							</div>
						</>
					)}
				</div>
			</div>

			{/* Modals (unchanged) */}
			<Modal
				open={isPopupVisible}
				onCancel={() => setIsPopupVisible(false)}
				footer={null}
				width="80%"
			>
				<JewelryModelList onSelectModel={handleSelectModel} />
			</Modal>

			{selectedJewelry && (
				<JewelryDetail jewelry={selectedJewelry} onClose={() => setSelectedJewelry(null)} />
			)}

			{isCreateFormOpen && (
				<JewelryCreateForm
					onClose={() => setIsCreateFormOpen(false)}
					isCreateFormOpen={isCreateFormOpen}
					setIsCreateFormOpen={setIsCreateFormOpen}
				/>
			)}
		</div>
	);
};

export default JewelryPage;
