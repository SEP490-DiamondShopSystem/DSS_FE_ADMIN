import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
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
} from 'antd';
import {
	SearchOutlined,
	PlusOutlined,
	FilterOutlined,
	InfoCircleOutlined,
	DollarOutlined,
	GoldOutlined,
	CheckCircleOutlined,
} from '@ant-design/icons';
import {fetchAllJewelry} from '../../../../redux/slices/jewelry/jewelrySlice';
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

const JewelryPage = () => {
	const dispatch = useDispatch();
	const loading = useSelector(selectJewelryLoading);
	const error = useSelector(selectJewelryError);
	const totalPage = useSelector(selectJewelryTotalPage);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const jewelryList = useSelector(selectJewelryList);
	const [isPopupVisible, setIsPopupVisible] = useState(false);
	const [selectedModel, setSelectedModel] = useState(null);
	const [selectedJewelry, setSelectedJewelry] = useState(null);
	const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
	const [isFilterVisible, setIsFilterVisible] = useState(false);

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
				.catch((error) => {
					notification.error({
						message: 'Lỗi',
						description:
							error?.data?.title ||
							error?.detail ||
							'Không thể tải danh sách trang sức',
					});
				});
		}
	}, [dispatch, selectedModel?.Id, currentPage, pageSize, filters]);

	const handleSelectModel = (model) => {
		setSelectedModel(model);
		setIsPopupVisible(false);
	};

	const handleJewelryClick = (jewelry) => {
		setSelectedJewelry(jewelry);
	};

	const renderStatusTag = (status) => {
		switch (status) {
			case 1:
				return <Tag color="blue">Hoạt động</Tag>;
			case 2:
				return <Tag color="gold">Đã bán</Tag>;
			case 3:
				return <Tag color="volcano">Bị khóa</Tag>;
			case 4:
				return <Tag color="gray">Không hoạt động</Tag>;
			case 5:
				return <Tag color="cyan">Khóa người dùng</Tag>;
			case 6:
				return <Tag color="purple">Đặt trước</Tag>;
			default:
				return <Tag>Không xác định</Tag>;
		}
	};

	return (
		<div className="container mx-auto px-6 py-8 bg-gray-50 min-h-screen">
			<div className="bg-white shadow-lg rounded-xl p-8">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-gray-800 flex items-center">
						<GoldOutlined className="mr-3 text-primary" />
						Quản Lý Trang Sức
					</h1>
					<Button
						type="primary"
						icon={<PlusOutlined />}
						onClick={() => setIsCreateFormOpen(true)}
						className="bg-primary hover:bg-primary-600 transition-colors"
					>
						Thêm Trang Sức
					</Button>
				</div>

				{/* Model Selection */}
				<Card
					className="mb-6 border-primary"
					title={
						<div className="flex items-center">
							<CheckCircleOutlined className="mr-2 text-primary" />
							Chọn Mẫu Trang Sức
						</div>
					}
				>
					<Row gutter={16} align="middle">
						<Col xs={24} md={16}>
							<Input
								readOnly
								value={selectedModel?.Id || 'Chưa chọn mẫu'}
								placeholder="Chọn mẫu trang sức"
								prefix={<InfoCircleOutlined className="text-primary" />}
							/>
						</Col>
						<Col xs={24} md={8}>
							<Button
								type="default"
								onClick={() => setIsPopupVisible(true)}
								className="w-full"
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
								<Form.Item label="Chất Liệu">
									<Select
										value={filters.MetalId}
										onChange={(value) =>
											setFilters({...filters, MetalId: value})
										}
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
								</Form.Item>
							</Col>
							<Col xs={24} md={12} lg={6}>
								<Form.Item label="Kích Thước">
									<Select
										value={filters.SizeId}
										onChange={(value) =>
											setFilters({...filters, SizeId: value})
										}
										placeholder="Chọn kích thước"
										allowClear
										className="w-full"
									>
										{sizes.map((size) => (
											<Select.Option key={size.Id} value={size.Id}>
												{size.Value} {size.Unit}
											</Select.Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col xs={24} md={12} lg={6}>
								<Form.Item label="Kim Cương">
									<Checkbox
										checked={filters.HasSideDiamond}
										onChange={(e) =>
											setFilters({
												...filters,
												HasSideDiamond: e.target.checked,
											})
										}
									>
										Có Kim Cương
									</Checkbox>
								</Form.Item>
							</Col>
							<Col xs={24} md={12} lg={6}>
								<Form.Item label="Trạng Thái">
									<Select
										value={filters.Status}
										onChange={(value) =>
											setFilters({...filters, Status: value})
										}
										className="w-full"
									>
										<Select.Option value={1}>Hoạt động</Select.Option>
										<Select.Option value={2}>Không hoạt động</Select.Option>
										<Select.Option value={3}>Đã lưu trữ</Select.Option>
										<Select.Option value={4}>Đã bán</Select.Option>
										<Select.Option value={5}>Bị khóa</Select.Option>
										<Select.Option value={6}>Đặt trước</Select.Option>
									</Select>
								</Form.Item>
							</Col>
							<Col span={24}>
								<Button
									type="primary"
									icon={<SearchOutlined />}
									onClick={() =>
										dispatch(
											fetchAllJewelry({
												JewelryModelId: selectedModel?.Id,
												CurrentPage: currentPage,
												PageSize: pageSize,
												filters,
											})
										)
									}
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
						<Spin size="large" />
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{jewelryList.map((jewelry) => (
							<Card
								key={jewelry.Id}
								hoverable
								onClick={() => handleJewelryClick(jewelry)}
								className="transform transition-all hover:scale-105 hover:shadow-xl"
								cover={
									<div className="h-48 overflow-hidden flex items-center justify-center">
										<img
											alt={jewelry.SerialCode}
											src={
												jewelry?.Model?.Thumbnail?.MediaPath ||
												'/default-thumbnail.jpg'
											}
											className="w-full h-full object-cover"
										/>
									</div>
								}
							>
								<Card.Meta
									title={
										<div className="flex justify-between items-center">
											<span className="text-lg font-semibold">
												{jewelry.SerialCode}
											</span>
											{renderStatusTag(jewelry.Status)}
										</div>
									}
									description={
										<div className="space-y-2">
											<div className="flex items-center">
												<DollarOutlined className="mr-2 text-primary" />
												<span>
													{jewelry.TotalPrice > 0
														? formatPrice(jewelry.TotalPrice)
														: 'Liên Hệ Báo Giá'}
												</span>
											</div>
											<div className="flex justify-between text-sm text-gray-500">
												<Tooltip title="Chất Liệu">
													<span>{jewelry?.Metal?.Name || 'N/A'}</span>
												</Tooltip>
												<Tooltip title="Kích Thước">
													<span>
														{jewelry.Size?.Value} {jewelry.Size?.Unit}
													</span>
												</Tooltip>
											</div>
										</div>
									}
								/>
							</Card>
						))}
					</div>
				)}

				{/* Pagination */}
				<div className="flex justify-center items-center mt-12 space-x-6">
	<Button
		onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
		disabled={currentPage === 1}
		className="px-4 py-2"
	>
		Previous
	</Button>
	<span className="text-lg">
		Page {currentPage} of {totalPage}
	</span>
	<Button
		onClick={() => setCurrentPage((p) => Math.min(totalPage, p + 1))}
		disabled={currentPage === totalPage}
		className="px-4 py-2"
	>
		Next
	</Button>
	<Select
		value={pageSize}
		onChange={setPageSize}
		style={{ width: 120 }}
		className="ml-4"
	>
		<Select.Option value={5}>5 per page</Select.Option>
		<Select.Option value={10}>10 per page</Select.Option>
		<Select.Option value={20}>20 per page</Select.Option>
	</Select>
</div>


				{/* Modals */}
				<Modal
					open={isPopupVisible}
					onCancel={() => setIsPopupVisible(false)}
					footer={null}
					width="80%"
				>
					<JewelryModelList onSelectModel={handleSelectModel} />
				</Modal>

				{selectedJewelry && (
					<JewelryDetail
						jewelry={selectedJewelry}
						onClose={() => setSelectedJewelry(null)}
					/>
				)}

				{isCreateFormOpen && (
					<JewelryCreateForm
						onClose={() => setIsCreateFormOpen(false)}
						isCreateFormOpen={isCreateFormOpen}
						setIsCreateFormOpen={setIsCreateFormOpen}
					/>
				)}
			</div>
		</div>
	);
};

export default JewelryPage;
