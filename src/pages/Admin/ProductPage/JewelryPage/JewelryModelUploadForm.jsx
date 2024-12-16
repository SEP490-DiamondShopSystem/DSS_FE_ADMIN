import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Modal, Form, Button, Upload, List, Image, message, Select, Card} from 'antd';
import {
	UploadOutlined,
	FileImageOutlined,
	EditOutlined,
	CloseCircleOutlined,
} from '@ant-design/icons';
import {
	fetchJewelryModelFiles,
	uploadJewelryModelThumbnail,
	uploadBaseImages,
	deleteJewelryModelImages,
	uploadCategorizedImage,
	uploadSideDiamondImage,
	uploadMetalImages,
} from '../../../../redux/slices/filesSlice';
import {fetchJewelryModelDetail} from '../../../../redux/slices/jewelry/jewelryModelSlice';
import {selectFileLoading, selectFileError} from '../../../../redux/selectors';

export const JewelryModelUploadForm = ({jewelryModelId, visible, onClose}) => {
	const dispatch = useDispatch();
	const loading = useSelector(selectFileLoading);

	const [categorizedFiles, setCategorizedFiles] = useState([]);
	const [selectedSideDiamond, setSelectedSideDiamond] = useState(null);
	const [selectedMetal, setSelectedMetal] = useState(null);

	const [jewelryModelFiles, setJewelryModelFiles] = useState(null);
	const [thumbnailFile, setThumbnailFile] = useState(null);
	const [imageFiles, setImageFiles] = useState([]);
	const [sideDiamondFile, setSideDiamondFile] = useState(null);
	const [metalFile, setMetalFile] = useState(null);
	const [metalImages, setMetalImages] = useState([]);
	const [sideDiamondImages, setSideDiamondImages] = useState([]);
	const [isEditMode, setIsEditMode] = useState(false);

	const [initialFiles, setInitialFiles] = useState({
		thumbnail: null,
		images: [],
	});

	const [removedImagePaths, setRemovedImagePaths] = useState([]);

	useEffect(() => {
		if (jewelryModelId) {
			dispatch(fetchJewelryModelFiles(jewelryModelId))
				.unwrap()
				.then((response) => {
					setJewelryModelFiles((prevState) => ({
						...prevState,
						...response,
					}));
				})
				.catch((error) => {
					message.error(error?.data?.detail || error?.detail);
				});

			dispatch(fetchJewelryModelDetail(jewelryModelId))
				.unwrap()
				.then((response) => {
					setJewelryModelFiles((prevState) => ({
						...prevState,
						SizeMetals: response.SizeMetals,
						SideDiamonds: response.SideDiamonds,
					}));
				})
				.catch((error) => {
					message.error(error?.data?.detail || error?.detail);
				});
		}
	}, [jewelryModelId, dispatch]);

	useEffect(() => {
		if (jewelryModelFiles) {
			const initialThumbnail = jewelryModelFiles.Thumbnail?.MediaPath || null;
			const initialImages = jewelryModelFiles.BaseImages || [];
			const baseMetalImages =
				jewelryModelFiles?.BaseMetals?.filter((metal) =>
					metal.MediaPath.includes(`/Metals/${selectedMetal}/`)
				) || [];
			setMetalImages(baseMetalImages);
			const baseSideDiamondImages =
				jewelryModelFiles?.BaseSideDiamonds?.filter((diamond) =>
					diamond.MediaPath.includes(`/SideDiamonds/${selectedSideDiamond}/`)
				) || [];
			setSideDiamondImages(baseSideDiamondImages);

			setInitialFiles({
				thumbnail: initialThumbnail,
				images: initialImages,
			});

			setThumbnailFile(initialThumbnail);
			setImageFiles(initialImages);
		}
	}, [jewelryModelFiles, selectedMetal, selectedSideDiamond]);
	const reloadJewelryModelFiles = async () => {
		try {
			// Fetch files
			const filesResponse = await dispatch(fetchJewelryModelFiles(jewelryModelId)).unwrap();
			setJewelryModelFiles(filesResponse);

			// Fetch model details to get updated metadata
			const detailsResponse = await dispatch(
				fetchJewelryModelDetail(jewelryModelId)
			).unwrap();
			setJewelryModelFiles((prevState) => ({
				...prevState,
				SizeMetals: detailsResponse.SizeMetals,
				SideDiamonds: detailsResponse.SideDiamonds,
			}));

			message.success('Data refreshed successfully');
		} catch (error) {
			message.error(error?.data?.detail || error?.detail || 'Failed to reload data');
		}
	};
	const handleCancel = () => {
		setIsEditMode(false);
		setThumbnailFile(initialFiles.thumbnail);
		setImageFiles(initialFiles.images);
		setRemovedImagePaths([]);
		onClose();
	};
	const handleDeselectMetal = () => {
		setSelectedMetal(null);
		setMetalImages([]);
		setMetalFile(null);
	};

	const handleDeselectSideDiamond = () => {
		setSelectedSideDiamond(null);
		setSideDiamondImages([]);
		setSideDiamondFile(null);
	};
	const handleSwitchToEdit = async () => {
		setSelectedMetal(null);
		setSelectedSideDiamond(null);
		setMetalImages([]);
		setSideDiamondImages([]);
		setIsEditMode(true);
	};

	const handleUploadAdditionalMetalImages = async () => {
		if (!metalFile || !selectedMetal) {
			message.warning('Vui lòng chọn kim loại để thêm ảnh!');
			return;
		}

		const filesToUpload = Array.isArray(metalFile) ? metalFile : [metalFile];

		for (const file of filesToUpload) {
			await dispatch(
				uploadMetalImages({jewelryModelId, formFiles: file, metalId: selectedMetal})
			)
				.unwrap()
				.then(() => {
					message.success('Hình ảnh kim loại đã được thêm thành công!');
				})
				.catch((error) => {
					message.error(error?.data?.detail || error?.detail);
				});
		}

		setMetalFile(null);
		dispatch(fetchJewelryModelFiles(jewelryModelId));
	};
	const handleUploadAdditionalSideDiamondImages = async () => {
		if (!sideDiamondFile || !selectedSideDiamond) {
			message.warning('Vui lòng chọn kim cương tấm để thêm ảnh!');
			return;
		}

		await dispatch(
			uploadSideDiamondImage({
				jewelryModelId,
				image: sideDiamondFile,
				sideDiamondOptionId: selectedSideDiamond,
			})
		)
			.unwrap()
			.then(() => {
				message.success('Hình ảnh kim cương tấm đã được thêm thành công!');
				dispatch(fetchJewelryModelFiles(jewelryModelId));
			})
			.catch((error) => {
				message.error(error?.data?.detail || error?.detail);
			});

		setSideDiamondFile(null);
	};

	const getImagesForSelection = (selectedMetal, selectedSideDiamond) => {
		const images = [];

		if (selectedMetal && selectedSideDiamond) {
			const imageCategoryKey = `Categories/${selectedMetal}/${selectedSideDiamond}`;
			const galleryImages = jewelryModelFiles?.Gallery?.[imageCategoryKey] || [];

			if (galleryImages.length > 0) {
				return galleryImages.map((img) => img.MediaPath); // Return all gallery images
			}
		}

		if (selectedMetal) {
			const baseMetals = jewelryModelFiles?.BaseMetals || [];
			const matchingMetalImages = baseMetals.filter((metal) =>
				metal.MediaPath.includes(`/Metals/${selectedMetal}/`)
			);
			if (matchingMetalImages.length > 0) {
				images.push(...matchingMetalImages.map((img) => img.MediaPath));
			}
		}

		if (selectedSideDiamond) {
			const baseSideDiamonds = jewelryModelFiles?.BaseSideDiamonds || [];
			const matchingSideDiamondImages = baseSideDiamonds.filter((diamond) =>
				diamond.MediaPath.includes(`/SideDiamonds/${selectedSideDiamond}/`)
			);
			if (matchingSideDiamondImages.length > 0) {
				images.push(...matchingSideDiamondImages.map((img) => img.MediaPath));
			}
		}

		if (images.length === 0) {
			const baseImages = jewelryModelFiles?.BaseImages || [];
			if (baseImages.length > 0) {
				images.push(...baseImages.map((img) => img.MediaPath));
			}
		}

		return images.length > 0 ? images : null;
	};

	const handleSaveChanges = async () => {
		// Existing upload methods
		if (categorizedFiles.length && selectedSideDiamond && selectedMetal) {
			await handleUploadCategorizedImage();
		}

		// New additional image uploads
		if (metalFile && selectedMetal) {
			await handleUploadAdditionalMetalImages();
		}
		if (sideDiamondFile && selectedSideDiamond) {
			await handleUploadAdditionalSideDiamondImages();
		}

		// Other existing save operations
		await handleThumbnailUpload();
		await handleImageUpload();
		await handleDeleteImages();

		// Reload files after all operations
		await reloadJewelryModelFiles();

		// Refresh files
		await dispatch(fetchJewelryModelFiles(jewelryModelId))
			.unwrap()
			.then((response) => {
				setJewelryModelFiles(response);
			})
			.catch((error) => {
				message.error(error?.data?.detail || error?.detail);
			});

		resetFormState();
	};

	// Function to reset all the form state
	const resetFormState = () => {
		setIsEditMode(false);
		setThumbnailFile(null);
		setImageFiles([]);
		setCategorizedFile(null);
		setSideDiamondFile(null);
		setMetalFile(null);
		setSelectedSideDiamond(null);
		setSelectedMetal(null);
		setRemovedImagePaths([]);
		onClose();
	};

	const uniqueMetals = Array.from(
		new Map(jewelryModelFiles?.SizeMetals?.map((item) => [item.MetalId, item])).values()
	);
	// Handle removing images
	const handleImageRemove = (file) => {
		// Add the removed file's path to the removedImagePaths array
		const imagePath = file.url || file.MediaPath; // Make sure to get the correct path
		setRemovedImagePaths((prev) => [...prev, imagePath]);
	};

	// Handle the deletion of images by calling the API
	const handleDeleteImages = () => {
		if (removedImagePaths.length > 0) {

			dispatch(deleteJewelryModelImages({jewelryModelId, imagePaths: removedImagePaths}))
				.unwrap()
				.then(() => {
					message.success('Images deleted successfully');
				})
				.catch((error) => {
					message.error(error?.data?.detail || error?.detail);
				});
		}
	};

	const handleThumbnailUpload = async () => {
		if (!thumbnailFile || thumbnailFile === initialFiles.thumbnail) {
			return;
		}


		await dispatch(uploadJewelryModelThumbnail({jewelryModelId, formFile: thumbnailFile}))
			.unwrap()
			.then(() => {
				message.success('Thumbnail uploaded successfully');
			})
			.catch((error) => {
				message.error(error?.data?.detail || error?.detail);
			});
	};
	const handleUploadCategorizedImage = async () => {
		if (!categorizedFiles.length || !selectedSideDiamond || !selectedMetal) {
			message.warning(
				'Please select a Side Diamond, Metal, and upload at least one image before submitting.'
			);
			return;
		}

		// Upload each categorized file individually
		for (const file of categorizedFiles) {
			await dispatch(
				uploadCategorizedImage({
					jewelryModelId,
					imageFile: file,
					sideDiamondOptId: selectedSideDiamond,
					metalId: selectedMetal,
				})
			)
				.unwrap()
				.then(() => {
					message.success('Categorized image uploaded successfully');
				})
				.catch((error) => {
					message.error(error?.data?.detail || error?.detail);
				});
		}

		dispatch(fetchJewelryModelFiles(jewelryModelId)); // Refresh the data
		setCategorizedFiles([]); // Reset the categorized files after upload
	};
	const handleImageUpload = async () => {
		if (imageFiles.length === 0 || imageFiles === initialFiles.images) {
			return;
		}


		await dispatch(uploadBaseImages({jewelryModelId, formFiles: imageFiles}))
			.unwrap()
			.then((res) => {
				message.success('Diamond images uploaded successfully');
			})
			.catch((error) => {
				message.error(error?.data?.detail || error?.detail);
			});
	};
	return (
		<Modal
			title="Hình Ảnh Mẫu Trang Sức"
			visible={visible}
			onCancel={handleCancel}
			footer={
				isEditMode
					? [
							<Button key="cancel" onClick={handleCancel}>
								Cancel
							</Button>,
							<Button
								key="save"
								type="primary"
								loading={loading}
								onClick={handleSaveChanges}
							>
								Lưu Thay Đổi
							</Button>,
					  ]
					: [
							<Button
								key="edit"
								type="primary"
								icon={<EditOutlined />}
								onClick={handleSwitchToEdit}
							>
								Sửa Thông Tin
							</Button>,
					  ]
			}
		>
			{isEditMode ? (
				<Form layout="vertical">
					<Form.Item label="Chọn Kim Cương Tấm">
						<div className="flex items-center space-x-2">
							<Select
								placeholder="Chọn một cài đặt kim cương tấm"
								onChange={(value) => setSelectedSideDiamond(value)}
								value={selectedSideDiamond}
							>
								{jewelryModelFiles?.SideDiamonds?.length > 0 ? (
									jewelryModelFiles.SideDiamonds.map((diamond) => (
										<Option key={diamond.Id} value={diamond.Id}>
											{diamond?.Shape ? (
												<>
													{diamond.Shape.ShapeName} -{' '}
													{diamond.SettingType || 'Unknown Setting'}
												</>
											) : (
												<>
													{diamond.CaratWeight
														? `${diamond.CaratWeight}ct`
														: 'Unknown Carat Weight'}{' '}
													-{' '}
													{diamond.ClarityMin && diamond.ClarityMax
														? `Clarity: ${diamond.ClarityMin} to ${diamond.ClarityMax}`
														: 'Unknown Clarity'}{' '}
													-{' '}
													{diamond.ColorMin && diamond.ColorMax
														? `Color: ${diamond.ColorMin} to ${diamond.ColorMax}`
														: 'Unknown Color'}{' '}
													- {diamond.SettingType || 'Unknown Setting'}
												</>
											)}
										</Option>
									))
								) : (
									<Option disabled>Không có kim cương tấm</Option>
								)}
							</Select>
							{selectedSideDiamond && (
								<Button
									icon={<CloseCircleOutlined />}
									onClick={handleDeselectSideDiamond}
									type="text"
									danger
								>
									Hủy chọn
								</Button>
							)}
						</div>
					</Form.Item>
					<Form.Item label="Chọn Kim Loại">
						<div className="flex items-center space-x-2">
							<Select
								placeholder="Chọn Kim Loại"
								onChange={(value) => setSelectedMetal(value)}
								value={selectedMetal}
							>
								{uniqueMetals?.map((metal) => (
									<Option key={metal.MetalId} value={metal.MetalId}>
										{metal.Metal?.Name || 'Unknown Metal'}
									</Option>
								))}
							</Select>
							{selectedMetal && (
								<Button
									icon={<CloseCircleOutlined />}
									onClick={handleDeselectMetal}
									type="text"
									danger
								>
									Hủy chọn
								</Button>
							)}
						</div>
					</Form.Item>
					{selectedMetal && selectedSideDiamond ? (
						<div className="mt-4">
							<h4 className="text-lg font-semibold mb-2">Hình Ảnh Theo Danh Mục</h4>
							<div className="grid grid-cols-4 gap-4">
								{(() => {
									const imageCategoryKey = `Categories/${selectedMetal}/${selectedSideDiamond}`;
									const galleryImages =
										jewelryModelFiles?.Gallery?.[imageCategoryKey] || [];

									if (galleryImages.length > 0) {
										return galleryImages
											.filter(
												(image) =>
													!removedImagePaths.includes(image.MediaPath)
											)
											.map((image, index) => (
												<div key={index} className="relative">
													<Image
														src={image.MediaPath}
														alt={`Categorized Image ${index + 1}`}
														width={100}
														height={100}
														style={{objectFit: 'cover'}}
													/>
													<Button
														type="link"
														danger
														className="absolute top-0 right-0"
														onClick={() => {
															setRemovedImagePaths((prev) => [
																...prev,
																image.MediaPath,
															]);
														}}
													>
														Xóa
													</Button>
												</div>
											));
									} else {
										return (
											<div className="col-span-4 text-center text-gray-500">
												Không có hình ảnh theo danh mục
											</div>
										);
									}
								})()}
							</div>

							<Form.Item label="Tải Hình Ảnh Theo Danh Mục" className="mt-4">
								<Upload
									multiple
									accept="image/*"
									beforeUpload={(file) => {
										setCategorizedFiles((prevFiles) => [...prevFiles, file]);
										return false;
									}}
									onRemove={(file) => {
										setCategorizedFiles((prevFiles) =>
											prevFiles.filter((f) => f !== file)
										);
									}}
									fileList={categorizedFiles.map((file, index) => ({
										uid: `-${index}`,
										name: file.name,
										status: 'done',
									}))}
								>
									<Button icon={<UploadOutlined />}>
										Tải Hình Ảnh Theo Danh Mục
									</Button>
								</Upload>

								{categorizedFiles.length > 0 && (
									<div
										style={{
											marginTop: 10,
											display: 'flex',
											flexWrap: 'wrap',
											gap: '10px',
										}}
									>
										{categorizedFiles.map((file, index) => (
											<Image
												key={index}
												src={URL.createObjectURL(file)}
												alt={`Categorized Image Preview ${index + 1}`}
												width={100}
												height={100}
												style={{objectFit: 'cover'}}
											/>
										))}
									</div>
								)}
							</Form.Item>
						</div>
					) : (
						<>
							{selectedMetal && (
								<Form.Item label="Hình Ảnh Kim Loại">
									<Upload
										multiple
										accept="image/*"
										beforeUpload={(file) => {
											if (selectedMetal) {
												setMetalFile((prevFiles) =>
													prevFiles
														? [
																...(Array.isArray(prevFiles)
																	? prevFiles
																	: [prevFiles]),
																file,
														  ]
														: [file]
												);
											} else {
												message.warning('Vui lòng chọn kim loại trước');
												return Upload.LIST_IGNORE;
											}
											return false;
										}}
										showUploadList={false}
									>
										<Button icon={<UploadOutlined />}>
											Tải Hình Ảnh Kim Loại
										</Button>
									</Upload>

									{/* Metal Image Preview */}
									{metalFile && (
										<div
											style={{
												marginTop: 10,
												display: 'flex',
												flexWrap: 'wrap',
												gap: '10px',
											}}
										>
											{(Array.isArray(metalFile)
												? metalFile
												: [metalFile]
											).map((file, index) => (
												<Image
													key={index}
													src={URL.createObjectURL(file)}
													alt={`Metal Image Preview ${index + 1}`}
													width={100}
													height={100}
													style={{objectFit: 'cover'}}
												/>
											))}
										</div>
									)}
									{/* Metal Images List */}
									{metalImages.length > 0 && (
										<div className="mt-4">
											<h4>Danh Sách Hình Ảnh Hiện Tại</h4>
											<div className="grid grid-cols-4 gap-4">
												{metalImages
													.filter(
														(image) =>
															!removedImagePaths.includes(
																image.MediaPath
															)
													)
													.map((image, index) => (
														<div key={index} className="relative">
															<Image
																src={image.MediaPath}
																alt={`Metal Image ${index + 1}`}
																width={100}
																height={100}
																style={{objectFit: 'cover'}}
															/>
															<Button
																type="link"
																danger
																className="absolute top-0 right-0"
																onClick={() => {
																	setRemovedImagePaths((prev) => [
																		...prev,
																		image.MediaPath,
																	]);
																	setMetalImages((prevImages) =>
																		prevImages.filter(
																			(img) =>
																				img.MediaPath !==
																				image.MediaPath
																		)
																	);
																}}
															>
																Xóa
															</Button>
														</div>
													))}
											</div>
										</div>
									)}
								</Form.Item>
							)}

							{selectedSideDiamond && (
								<Form.Item label="Hình Ảnh Kim Cương Tấm">
									<Upload
										multiple
										accept="image/*"
										beforeUpload={(file) => {
											if (selectedSideDiamond) {
												setSideDiamondFile(file);
											} else {
												message.warning(
													'Vui lòng chọn kim cương tấm trước'
												);
												return Upload.LIST_IGNORE;
											}
											return false;
										}}
										showUploadList={false}
									>
										<Button icon={<UploadOutlined />}>
											Tải Hình Ảnh Kim Cương Tấm
										</Button>
									</Upload>

									{/* Side Diamond Image Preview */}
									{sideDiamondFile && (
										<div style={{marginTop: 10}}>
											<Image
												src={URL.createObjectURL(sideDiamondFile)}
												alt="Side Diamond Image Preview"
												width={100}
												height={100}
												style={{objectFit: 'cover'}}
											/>
										</div>
									)}

									{/* Side Diamond Images List */}
									{sideDiamondImages.length > 0 && (
										<div className="mt-4">
											<h4>Danh Sách Hình Ảnh Hiện Tại</h4>
											<div className="grid grid-cols-4 gap-4">
												{sideDiamondImages
													.filter(
														(image) =>
															!removedImagePaths.includes(
																image.MediaPath
															)
													)
													.map((image, index) => (
														<div key={index} className="relative">
															<Image
																src={image.MediaPath}
																alt={`Side Diamond Image ${
																	index + 1
																}`}
																width={100}
																height={100}
																style={{objectFit: 'cover'}}
															/>
															<Button
																type="link"
																danger
																className="absolute top-0 right-0"
																onClick={() => {
																	setRemovedImagePaths((prev) => [
																		...prev,
																		image.MediaPath,
																	]);
																	setSideDiamondImages(
																		(prevImages) =>
																			prevImages.filter(
																				(img) =>
																					img.MediaPath !==
																					image.MediaPath
																			)
																	);
																}}
															>
																Xóa
															</Button>
														</div>
													))}
											</div>
										</div>
									)}
								</Form.Item>
							)}
						</>
					)}
					<Form.Item label="Thumbnail">
						<Upload
							accept="image/*"
							beforeUpload={(file) => {
								setThumbnailFile(file);
								return false;
							}}
							showUploadList={false}
						>
							<Button icon={<UploadOutlined />}>Chọn Thumbnail</Button>
						</Upload>
						{thumbnailFile && (
							<img
								src={typeof thumbnailFile === 'string' ? thumbnailFile : ''}
								alt="Thumbnail Preview"
								style={{
									marginTop: 10,
									width: '100px',
									height: '100px',
									objectFit: 'cover',
								}}
							/>
						)}
					</Form.Item>
					<Form.Item label="Hình Ảnh Mẫu Trang Sức">
						<Upload
							multiple
							accept="image/*"
							beforeUpload={(file) => {
								setImageFiles((fileList) => [...fileList, file]);
								return false;
							}}
							onRemove={(file) => {
								handleImageRemove(file); // Track the removed image
								setImageFiles((fileList) =>
									fileList.filter((item) => item.MediaPath !== file.url)
								);
							}}
							showUploadList
							fileList={imageFiles.map((file, index) => ({
								uid: index,
								name: `Image ${index + 1}`,
								url: file.MediaPath,
								status: 'done',
							}))}
						>
							<Button icon={<FileImageOutlined />}>
								Chọn hình ảnh cho trang sức
							</Button>
						</Upload>
					</Form.Item>
				</Form>
			) : (
				<div className="space-y-8">
					<div>
						<div className="space-y-2">
							<h3 className="text-lg font-semibold">Thumbnail</h3>
							<Card
								bordered={false}
								className="shadow-md p-4"
								cover={
									thumbnailFile ? (
										<Image
											src={thumbnailFile}
											alt="Thumbnail"
											width={100}
											height={100}
											style={{objectFit: 'cover'}}
										/>
									) : (
										<div className="flex justify-center items-center h-32 bg-gray-200 text-gray-500">
											Không có Thumbnail
										</div>
									)
								}
							/>
						</div>
						<div className="space-y-2">
							<h3 className="text-lg font-semibold">Hình Ảnh</h3>
							<Card bordered={false} className="shadow-md p-4">
								<List
									grid={{gutter: 16, column: 4}}
									dataSource={imageFiles}
									renderItem={(item) => (
										<List.Item>
											<div className="relative group">
												<Image
													src={item.MediaPath}
													alt="Diamond Image"
													width={100}
													height={100}
													style={{objectFit: 'cover'}}
													className="transition-transform transform group-hover:scale-110"
												/>
												<div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 flex justify-center items-center">
													<span className="text-white text-lg">Xem</span>
												</div>
											</div>
										</List.Item>
									)}
								/>
							</Card>
						</div>
					</div>
					<Form layout="vertical" className="space-y-4">
						<Form.Item label="Chọn Kim Cương Tấm" className="mb-4">
							<div className="flex items-center space-x-2">
								<Select
									placeholder="Chọn Kim Cương Tấm"
									onChange={setSelectedSideDiamond}
									value={selectedSideDiamond}
									className="w-full"
								>
									{jewelryModelFiles?.SideDiamonds?.map((diamond) => (
										<Option key={diamond.Id} value={diamond.Id}>
											{diamond.CaratWeight
												? `${diamond.CaratWeight}ct`
												: 'Unknown Carat Weight'}
										</Option>
									))}
								</Select>{' '}
								{selectedSideDiamond && (
									<Button
										icon={<CloseCircleOutlined />}
										onClick={handleDeselectSideDiamond}
										type="text"
										danger
									>
										Hủy chọn
									</Button>
								)}
							</div>
						</Form.Item>
						<Form.Item label="Chọn Kim Loại" className="mb-4">
							<div className="flex items-center space-x-2">
								<Select
									placeholder="Chọn Kim Loại"
									onChange={(value) => setSelectedMetal(value)}
									value={selectedMetal}
									className="w-full"
								>
									{uniqueMetals.length > 0 ? (
										uniqueMetals.map((metal) => (
											<Option key={metal.MetalId} value={metal.MetalId}>
												{metal.Metal?.Name || 'Unknown Metal'}
											</Option>
										))
									) : (
										<Option disabled>Không có kim loại</Option>
									)}
								</Select>
								{selectedMetal && (
									<Button
										icon={<CloseCircleOutlined />}
										onClick={handleDeselectMetal}
										type="text"
										danger
									>
										Hủy chọn
									</Button>
								)}
							</div>
						</Form.Item>
					</Form>
					{selectedMetal || selectedSideDiamond ? (
						(() => {
							const selectedImages = getImagesForSelection(
								selectedMetal,
								selectedSideDiamond
							);
							if (selectedImages && selectedImages.length > 0) {
								return (
									<div className="grid grid-cols-3 gap-4">
										{selectedImages.map((image, index) => (
											<Image
												key={index}
												src={image}
												alt={`Selected Jewelry ${index + 1}`}
												width={150}
												height={150}
												style={{objectFit: 'cover'}}
												className="rounded-lg shadow-lg"
											/>
										))}
									</div>
								);
							} else {
								return (
									<div className="flex justify-center items-center w-48 h-48 bg-gray-200 text-gray-500 rounded-lg shadow-lg">
										Không tìm thấy hình ảnh
									</div>
								);
							}
						})()
					) : (
						<div className="flex justify-center items-center w-full h-48 bg-gray-200 text-gray">
							Vui lòng chọn kim loại hoặc kim cương
						</div>
					)}
				</div>
			)}
		</Modal>
	);
};
