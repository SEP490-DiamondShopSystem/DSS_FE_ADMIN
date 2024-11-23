import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Modal, Form, Button, Upload, List, Image, message, Select, Card} from 'antd';
import {
	UploadOutlined,
	FileImageOutlined,
	FileProtectOutlined,
	EditOutlined,
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

	const [jewelryModelFiles, setJewelryModelFiles] = useState(null);
	const [selectedSideDiamond, setSelectedSideDiamond] = useState(null);
	const [selectedMetal, setSelectedMetal] = useState(null);

	const [categorizedFile, setCategorizedFile] = useState(null);
	const [thumbnailFile, setThumbnailFile] = useState(null);
	const [imageFiles, setImageFiles] = useState([]);
	const [sideDiamondFile, setSideDiamondFile] = useState(null);
	const [metalFile, setMetalFile] = useState(null);

	const [isEditMode, setIsEditMode] = useState(false);

	const [initialFiles, setInitialFiles] = useState({
		thumbnail: null,
		images: [],
	});

	const [removedImagePaths, setRemovedImagePaths] = useState([]);

	useEffect(() => {
		if (jewelryModelId) {
			dispatch(fetchJewelryModelFiles(jewelryModelId)).then((response) => {
				if (response.payload) {
					setJewelryModelFiles((prevState) => ({
						...prevState,
						...response.payload,
					}));
				}
			});

			dispatch(fetchJewelryModelDetail(jewelryModelId)).then((response) => {
				if (response.payload) {
					setJewelryModelFiles((prevState) => ({
						...prevState,
						SizeMetals: response.payload.SizeMetals,
						SideDiamonds: response.payload.SideDiamonds,
					}));
				}
			});
		}
	}, [jewelryModelId, dispatch]);

	useEffect(() => {
		if (jewelryModelFiles) {
			const initialThumbnail = jewelryModelFiles.Thumbnail?.MediaPath || null;
			const initialImages = jewelryModelFiles.BaseImages || [];

			setInitialFiles({
				thumbnail: initialThumbnail,
				images: initialImages,
			});

			setThumbnailFile(initialThumbnail);
			setImageFiles(initialImages);
		}
	}, [jewelryModelFiles]);

	const handleCancel = () => {
		setIsEditMode(false);
		setThumbnailFile(initialFiles.thumbnail);
		setImageFiles(initialFiles.images);
		setRemovedImagePaths([]);
		onClose();
	};

	const handleSwitchToEdit = async () => {
		// Reset selections before switching to edit mode
		setSelectedMetal(null);
		setSelectedSideDiamond(null);
		// Enable edit mode after data refresh
		setIsEditMode(true);
	};

	// Function to fetch the image URL based on Metal ID and Side Diamond ID
	const getImageForSelection = (selectedMetal, selectedSideDiamond) => {
		if (!selectedMetal || !selectedSideDiamond) {
			return null;
		}

		const imageCategoryKey = `Categories/${selectedMetal}/${selectedSideDiamond}`;
		const galleryImages = jewelryModelFiles?.Gallery?.[imageCategoryKey] || [];

		if (galleryImages.length > 0) {
			return galleryImages[0].MediaPath; // Return the first image path found
		}

		return null; // Return null if no image is found
	};

	const handleSaveChanges = async () => {
		if (categorizedFile && selectedSideDiamond && selectedMetal) {
			await handleUploadCategorizedImage();
		} else if (sideDiamondFile && selectedSideDiamond) {
			await handleUploadSideDiamondImage();
		} else if (metalFile && selectedMetal) {
			await handleUploadMetalImage();
		} else {
			message.warning('Please upload a file for the selected options.');
			return;
		}

		// Other save operations (e.g., thumbnail or base images)
		handleThumbnailUpload();
		handleImageUpload();
		handleDeleteImages();

		// Refresh the files
		await dispatch(fetchJewelryModelFiles(jewelryModelId)).then((response) => {
			if (response.payload) {
				setJewelryModelFiles(response.payload);
			}
		});

		// Reset states after saving
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

	const hasFileListChanged = (currentFileList, initialFileList) => {
		if (Array.isArray(currentFileList)) {
			return (
				currentFileList.length !== initialFileList.length ||
				!currentFileList.every(
					(file, index) => file.MediaPath !== initialFileList[index].MediaPath
				)
			);
		}
		return currentFileList !== initialFileList;
	};

	// Handle removing images
	const handleImageRemove = (file) => {
		// Add the removed file's path to the removedImagePaths array
		const imagePath = file.url || file.MediaPath; // Make sure to get the correct path
		setRemovedImagePaths((prev) => [...prev, imagePath]);
	};

	// Handle the deletion of images by calling the API
	const handleDeleteImages = () => {
		if (removedImagePaths.length > 0) {
			console.log('Deleting images:', removedImagePaths);

			dispatch(deleteJewelryModelImages({jewelryModelId, imagePaths: removedImagePaths}))
				.then(() => {
					message.success('Images deleted successfully');
				})
				.catch((err) => {
					message.error(error?.data?.title || error?.detail);
				});
		}
	};

	const handleThumbnailUpload = async () => {
		if (!thumbnailFile || thumbnailFile === initialFiles.thumbnail) {
			return;
		}

		console.log('Uploading Thumbnail for Diamond ID:', jewelryModelId);

		try {
			await dispatch(uploadJewelryModelThumbnail({jewelryModelId, formFile: thumbnailFile}));
			message.success('Thumbnail uploaded successfully');
		} catch (err){
			message.error(error?.data?.title || error?.detail);
		}
	};
	const handleUploadCategorizedImage = async () => {
		if (!categorizedFile || !selectedSideDiamond || !selectedMetal) {
			message.warning(
				'Please select a Side Diamond, Metal, and upload an image before submitting.'
			);
			return;
		}

		try {
			await dispatch(
				uploadCategorizedImage({
					jewelryModelId,
					imageFile: categorizedFile,
					sideDiamondOptId: selectedSideDiamond,
					metalId: selectedMetal,
				})
			);
			message.success('Categorized image uploaded successfully');
			dispatch(fetchJewelryModelFiles(jewelryModelId)); // Refresh the data
			setCategorizedFile(null); // Reset the categorized file after upload
		} catch (error) {
			message.error(error?.data?.title || error?.detail);
		}
	};
	const handleUploadSideDiamondImage = async () => {
		console.log('sideDiamondFile:', sideDiamondFile);
		console.log('selectedSideDiamond:', selectedSideDiamond);

		try {
			await dispatch(
				uploadSideDiamondImage({
					jewelryModelId,
					image: sideDiamondFile, // Wrap the file in an array
					sideDiamondOptionId: selectedSideDiamond,
				})
			);
			message.success('Side Diamond image uploaded successfully');
			setSideDiamondFile(null); // Reset the state after upload
		} catch (err) {
			message.error(error?.data?.title || error?.detail);
		}
	};

	const handleUploadMetalImage = async () => {
		console.log('MetalFile:', metalFile);
		console.log('selectedMetal:', selectedMetal);

		try {
			await dispatch(
				uploadMetalImages({jewelryModelId, formFiles: metalFile, metalId: selectedMetal})
			);
			message.success('Metal image uploaded successfully');
			setMetalFile(null);
		} catch (err) {
			message.error(error?.data?.title || error?.detail);
		}
	};
	const handleImageUpload = async () => {
		if (imageFiles.length === 0 || imageFiles === initialFiles.images) {
			return;
		}

		console.log('Uploading Diamond Images for Diamond ID:', jewelryModelId);

		try {
			await dispatch(uploadBaseImages({jewelryModelId, formFiles: imageFiles}));
			message.success('Diamond images uploaded successfully');
		} catch (err) {
			message.error(error?.data?.title || error?.detail);
		}
	};

	const handleFileChange = (fileList, setState) => {
		setState(fileList);
	};

	return (
		<Modal
			title="Jewelry Model's Files"
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
								Save Changes
							</Button>,
					  ]
					: [
							<Button
								key="edit"
								type="primary"
								icon={<EditOutlined />}
								onClick={handleSwitchToEdit}
							>
								Switch to Edit Mode
							</Button>,
					  ]
			}
		>
			{isEditMode ? (
				<Form layout="vertical">
					<Form.Item label="Select Side Diamond">
						<Select
							placeholder="Select a side diamond option"
							onChange={(value) => setSelectedSideDiamond(value)}
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
								<Option disabled>No side diamonds available</Option>
							)}
						</Select>
					</Form.Item>

					<Form.Item label="Select Metal">
						<Select
							placeholder="Select a metal option"
							onChange={(value) => setSelectedMetal(value)}
						>
							{uniqueMetals?.map((metal) => (
								<Option key={metal.MetalId} value={metal.MetalId}>
									{metal.Metal?.Name || 'Unknown Metal'}
								</Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item label="Upload Image">
						<Upload
							accept="image/*"
							beforeUpload={(file) => {
								if (selectedMetal && selectedSideDiamond) {
									// Both Metal and Side Diamond selected
									setCategorizedFile(file);
								} else if (selectedSideDiamond) {
									// Only Side Diamond selected
									setSideDiamondFile(file);
								} else if (selectedMetal) {
									// Only Metal selected
									setMetalFile(file);
								} else {
									message.warning(
										'Please select a Side Diamond, Metal, or both before uploading an image.'
									);
									return Upload.LIST_IGNORE; // Prevent file from being added to the upload list
								}
								return false; // Prevent default upload behavior
							}}
							showUploadList={false}
						>
							<Button icon={<UploadOutlined />}>Select Image</Button>
						</Upload>
						{/* Preview the file */}
						{categorizedFile && selectedMetal && selectedSideDiamond && (
							<div style={{marginTop: 10}}>
								<Image
									src={URL.createObjectURL(categorizedFile)}
									alt="Categorized Image Preview"
									width={100}
									height={100}
									style={{objectFit: 'cover'}}
								/>
							</div>
						)}
						{sideDiamondFile && selectedSideDiamond && !selectedMetal && (
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
						{metalFile && selectedMetal && !selectedSideDiamond && (
							<div style={{marginTop: 10}}>
								<Image
									src={URL.createObjectURL(metalFile)}
									alt="Metal Image Preview"
									width={100}
									height={100}
									style={{objectFit: 'cover'}}
								/>
							</div>
						)}
					</Form.Item>

					{/* Thumbnail Upload */}
					<Form.Item label="Thumbnail">
						<Upload
							accept="image/*"
							beforeUpload={(file) => {
								setThumbnailFile(file);
								return false;
							}}
							showUploadList={false}
						>
							<Button icon={<UploadOutlined />}>Select Thumbnail</Button>
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

					{/* Jewelry Model Images Upload */}
					<Form.Item label="Jewelry Model Images">
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
								Select Jewelry Model Images
							</Button>
						</Upload>
					</Form.Item>
				</Form>
			) : (
				<div className="space-y-8">
					{/* View Mode */}
					<div>
						{/* Thumbnail Section */}
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
											No Thumbnail Available
										</div>
									)
								}
							/>
						</div>

						{/* Images Section */}
						<div className="space-y-2">
							<h3 className="text-lg font-semibold">Images</h3>
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
													<span className="text-white text-lg">
														Preview
													</span>
												</div>
											</div>
										</List.Item>
									)}
								/>
							</Card>
						</div>
					</div>

					{/* Selection Form */}
					<Form layout="vertical" className="space-y-4">
						{/* Side Diamond Select */}
						<Form.Item label="Select Side Diamond" className="mb-4">
							<Select
								placeholder="Select a side diamond"
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
							</Select>
						</Form.Item>

						{/* Metal Select */}
						<Form.Item label="Select Metal" className="mb-4">
							<Select
								placeholder="Select a metal option"
								onChange={(value) => setSelectedMetal(value)}
								className="w-full"
							>
								{uniqueMetals.length > 0 ? (
									uniqueMetals.map((metal) => (
										<Option key={metal.MetalId} value={metal.MetalId}>
											{metal.Metal?.Name || 'Unknown Metal'}
										</Option>
									))
								) : (
									<Option disabled>No metals available</Option>
								)}
							</Select>
						</Form.Item>
					</Form>

					{/* Display the image based on Metal and Side Diamond selection */}
					{selectedMetal && selectedSideDiamond && (
						<div className="space-y-2 mt-6">
							<h3 className="text-lg font-semibold">Selected Jewelry Image</h3>
							<div className="flex justify-center items-center">
								{getImageForSelection(selectedMetal, selectedSideDiamond) ? (
									<Image
										src={getImageForSelection(
											selectedMetal,
											selectedSideDiamond
										)}
										alt="Selected Jewelry"
										width={200}
										style={{objectFit: 'cover'}}
										className="rounded-lg shadow-lg"
									/>
								) : (
									<div className="flex justify-center items-center w-48 h-48 bg-gray-200 text-gray-500 rounded-lg shadow-lg">
										Not Available
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			)}
		</Modal>
	);
};
