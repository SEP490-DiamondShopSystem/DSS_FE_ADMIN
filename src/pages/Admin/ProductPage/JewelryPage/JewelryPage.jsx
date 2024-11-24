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
} from 'antd';
import {SearchOutlined, PlusOutlined} from '@ant-design/icons';
import {fetchAllJewelry} from '../../../../redux/slices/jewelry/jewelrySlice';
import JewelryModelList from '../../PromotionPage/JewelryModelList';
import {
	selectJewelryList,
	selectJewelryLoading,
	selectJewelryError,
	selectJewelryTotalPage,
} from '../../../../redux/selectors';
import JewelryDetail from './JewelryDetail';
import JewelryCreateForm from './JewelryCreateForm';

const JewelryPage = () => {
	const dispatch = useDispatch();
	const loading = useSelector(selectJewelryLoading);
	const error = useSelector(selectJewelryError);
	const totalPage = useSelector(selectJewelryTotalPage);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(5);

	const jewelryList = useSelector(selectJewelryList);
	const [isPopupVisible, setIsPopupVisible] = useState(false);
	const [selectedModel, setSelectedModel] = useState(null);
	const [selectedModelId, setSelectedModelId] = useState(null);
	const [selectedJewelry, setSelectedJewelry] = useState(null);
	const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

	const [filters, setFilters] = useState({
		ModelName: '',
		SerialCode: '',
		MetalId: '',
		SizeId: '',
		HasSideDiamond: false,
		Status: 1,
	});
	const {Meta} = Card;

	const handleSelectModel = (model) => {
		console.log('Model Selected in Parent:', model);
		setSelectedModel(model);
		setIsPopupVisible(false);
	};

	const handleFilterChange = (e) => {
		const {name, value} = e.target;
		setFilters({...filters, [name]: value});
	};

	const handleHasSideDiamondChange = (e) => {
		setFilters({...filters, HasSideDiamond: e.target.checked});
	};
	useEffect(() => {
		if (selectedModel?.Id) {
			// Fetch jewelry items based on the selected model
			dispatch(
				fetchAllJewelry({
					CurrentPage: currentPage,
					PageSize: pageSize,
					filters,
					JewelryModelId: selectedModel?.Id,
				})
			).catch((error) => {
				notification.error({
					message: 'Error',
					description:
						error?.data?.title || error?.detail || 'Failed to load jewelry items',
					duration: 3,
				});
			});
		}
	}, [dispatch, selectedModel?.Id, currentPage, pageSize, filters]);

	useEffect(() => {
		if (error) {
			notification.error({
				message: 'Error',
				description: error,
				duration: 3,
			});
		}
	}, [error]);

	const handleJewelryClick = (jewelry) => {
		setSelectedJewelry(jewelry);
	};

	const handleAddJewelry = () => {
		setIsCreateFormOpen(true);
	};

	const handleCreateFormClose = () => {
		setIsCreateFormOpen(false);
	};

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const handleNextPage = () => {
		if (currentPage < totalPage) {
			setCurrentPage(currentPage + 1);
		}
	};

	return (
		<div className="container mx-auto px-4">
			<h1 className="text-4xl font-semibold text-primary mb-6">Jewelry Collection</h1>
			<Form.Item
				label="Mẫu Trang Sức"
				name="jewelryModelId"
				rules={[
					{
						required: true,
						message: 'Vui Lòng Chọn Mẫu Trang Sức',
					},
				]}
			>
				<div className="flex items-center gap-2">
					<Input readOnly value={selectedModel?.Id} placeholder={selectedModel?.Name} />
					<Button onClick={() => setIsPopupVisible(true)}>Chọn Mẫu Trang Sức</Button>
				</div>
			</Form.Item>
			<Modal
				open={isPopupVisible}
				onCancel={() => setIsPopupVisible(false)}
				footer={null}
				width="80%"
			>
				<JewelryModelList onSelectModel={handleSelectModel} />
			</Modal>
			{/* Filter Section */}
			<div className="filter-section mb-6">
				<h2 className="text-2xl font-semibold text-primary mb-4">Filters</h2>
				<Form layout="inline" className="space-y-4">
					<Row gutter={[16, 16]}>
						{['ModelName', 'SerialCode', 'MetalId', 'SizeId'].map((field) => (
							<Col span={8} key={field}>
								<Form.Item label={field.replace(/([A-Z])/g, ' $1').toUpperCase()}>
									<Input
										name={field}
										value={filters[field]}
										onChange={handleFilterChange}
										placeholder={`Enter ${field}`}
										className="w-full"
									/>
								</Form.Item>
							</Col>
						))}
						<Col span={8}>
							<Form.Item label="Has Side Diamond">
								<Checkbox
									checked={filters.HasSideDiamond}
									onChange={handleHasSideDiamondChange}
									className="w-full"
								/>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item label="Status">
								<Select
									name="Status"
									value={filters.Status}
									onChange={(value) => setFilters({...filters, Status: value})}
									className="w-full"
								>
									<Select.Option value={1}>Active</Select.Option>
									<Select.Option value={2}>Inactive</Select.Option>
									<Select.Option value={3}>Archived</Select.Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Form.Item>
						<Button
							type="primary"
							icon={<SearchOutlined />}
							onClick={() =>
								dispatch(
									fetchAllJewelry({
										CurrentPage: currentPage,
										PageSize: pageSize,
										filters,
									})
								)
							}
							className="bg-primary text-black hover:bg-primaryDark"
						>
							Apply Filters
						</Button>
					</Form.Item>
				</Form>
			</div>

			{/* Add Jewelry Button */}
			<div className="flex justify-end mb-5">
				<Button
					type="primary"
					icon={<PlusOutlined />}
					onClick={handleAddJewelry}
					className="bg-primary text-black hover:bg-primaryDark"
				>
					Add Jewelry
				</Button>
			</div>

			{/* Loading, Error and Jewelry List */}
			{loading && <Spin tip="Loading..." className="flex justify-center mt-5" />}
			{error && <p className="text-red-500 text-center">{error}</p>}
			{!loading && !error && (
				<div className="jewelry-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{Array.isArray(jewelryList) &&
						jewelryList.map((jewelry) => (
							<div
								key={jewelry.Id}
								onClick={() => handleJewelryClick(jewelry)}
								className="jewelry-item bg-white p-6 rounded-lg shadow-lg transition-all transform hover:scale-105 hover:shadow-2xl"
							>
								<Card
									hoverable
									className="flex flex-col lg:flex-row bg-tintWhite rounded-lg border border-gray-200"
								>
									{/* Image Section */}
									<div className="lg:w-1/3 w-full mb-4 lg:mb-0">
										<img
											alt={jewelry.SerialCode}
											src={
												jewelry.thumbnail?.mediaPath ||
												'/default-thumbnail.jpg'
											}
											className="w-full h-48 lg:h-full object-cover rounded-lg"
											style={{
												boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
											}}
											loading="lazy"
										/>
									</div>

									{/* Description Section */}
									<div className="lg:w-2/3 w-full lg:pl-4">
										<Meta
											title={
												<h2 className="text-lg font-semibold text-primary mb-2">
													{jewelry.SerialCode}
												</h2>
											}
											description={
												<div className="space-y-2">
													<p className="text-sm text-gray-500 flex items-center">
														<span className="icon-category mr-2">
															📦
														</span>
														Category:{' '}
														{jewelry.Model?.CategoryId || 'N/A'}
													</p>
													<p className="text-sm text-gray-500 flex items-center">
														<span className="icon-metal mr-2">🛠️</span>
														Metal: {jewelry.Metal?.Name || 'N/A'}
													</p>
													<p className="text-sm text-gray-500 flex items-center">
														<span className="icon-price mr-2">💰</span>
														Price:{' '}
														{jewelry.TotalPrice > 0
															? jewelry.TotalPrice.toLocaleString()
															: 'Contact for price'}{' '}
														VND
													</p>
													<p className="text-sm text-gray-500">
														Size: {jewelry.Size?.Value}{' '}
														{jewelry.Size?.Unit}
													</p>
													<p className="text-sm text-gray-500">
														Weight: {jewelry.Weight}{' '}
														{jewelry.Size?.Unit}
													</p>
													{jewelry.Diamonds &&
														jewelry.Diamonds.length > 0 && (
															<p className="text-sm text-gray-500">
																Diamonds: {jewelry.Diamonds.length}{' '}
																Diamond
																{jewelry.Diamonds.length > 1
																	? 's'
																	: ''}
															</p>
														)}
													{jewelry.EngravedText && (
														<p className="text-sm text-gray-500">
															Engraving: {jewelry.EngravedText}
														</p>
													)}
													<p className="text-lg font-semibold text-darkGreen mt-4">
														Total Price:{' '}
														{jewelry.TotalPrice > 0
															? jewelry.TotalPrice.toLocaleString()
															: 'Contact for price'}{' '}
														VND
													</p>
													<button className="mt-4 py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark">
														View Details
													</button>
												</div>
											}
										/>
									</div>
								</Card>
							</div>
						))}
				</div>
			)}

			{/* Pagination Controls */}
			<div className="pagination-controls flex justify-center space-x-4 mt-4">
				<Button
					onClick={handlePreviousPage}
					disabled={currentPage === 1}
					className="bg-primary text-black hover:bg-primaryDark disabled:opacity-50"
				>
					Previous
				</Button>
				<span className="text-lg">{`Page ${currentPage} of ${totalPage}`}</span>
				<Button
					onClick={handleNextPage}
					disabled={currentPage === totalPage}
					className="bg-primary text-black hover:bg-primaryDark disabled:opacity-50"
				>
					Next
				</Button>
				<Select
					value={pageSize}
					onChange={(value) => setPageSize(value)}
					className="form-select p-2 border border-gray rounded-md"
				>
					<Select.Option value={5}>5 per page</Select.Option>
					<Select.Option value={10}>10 per page</Select.Option>
					<Select.Option value={20}>20 per page</Select.Option>
				</Select>
			</div>

			{/* Jewelry Detail Modal */}
			{selectedJewelry && (
				<JewelryDetail jewelry={selectedJewelry} onClose={() => setSelectedJewelry(null)} />
			)}

			{/* Jewelry Create Form Modal */}
			{isCreateFormOpen && (
				<div className="">
					<JewelryCreateForm
						onClose={handleCreateFormClose}
						isCreateFormOpen={isCreateFormOpen}
						setIsCreateFormOpen={setIsCreateFormOpen}
					/>
				</div>
			)}
		</div>
	);
};

export default JewelryPage;
