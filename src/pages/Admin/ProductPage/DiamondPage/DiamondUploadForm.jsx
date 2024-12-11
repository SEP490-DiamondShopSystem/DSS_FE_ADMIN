import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Modal, Form, Button, Upload, List, Image, message} from 'antd';
import {
	UploadOutlined,
	FileImageOutlined,
	FileProtectOutlined,
	EditOutlined,
} from '@ant-design/icons';
import {
	fetchDiamondFiles,
	uploadDiamondThumbnail,
	uploadCertificates,
	uploadDiamondImages,
	deleteDiamondImages, // Import the delete action
} from '../../../../redux/slices/filesSlice';
import {selectFileLoading, selectFileError} from '../../../../redux/selectors';

export const DiamondUploadForm = ({diamondId, visible, onClose}) => {
	const dispatch = useDispatch();
	const loading = useSelector(selectFileLoading);
	const error = useSelector(selectFileError);

	const [diamondFiles, setDiamondFiles] = useState(null);
	const [thumbnailFile, setThumbnailFile] = useState(null);
	const [certificateFiles, setCertificateFiles] = useState([]);
	const [imageFiles, setImageFiles] = useState([]);
	const [isEditMode, setIsEditMode] = useState(false);

	const [initialFiles, setInitialFiles] = useState({
		thumbnail: null,
		certificates: [],
		images: [],
	});

	const [removedImagePaths, setRemovedImagePaths] = useState([]);

	useEffect(() => {
		if (diamondId) {
			dispatch(fetchDiamondFiles(diamondId))
				.unwrap()
				.then((response) => {
					setDiamondFiles(response);
				})
				.catch((error) => {
					message.error(error?.data?.detail );
				});
		}
	}, [diamondId, dispatch]);

	useEffect(() => {
		if (diamondFiles) {
			const initialThumbnail = diamondFiles.Thumbnail?.MediaPath || null;
			const initialCertificates = diamondFiles.Certificates || [];
			const initialImages = diamondFiles.BaseImages || [];

			setInitialFiles({
				thumbnail: initialThumbnail,
				certificates: initialCertificates,
				images: initialImages,
			});

			setThumbnailFile(initialThumbnail);
			setCertificateFiles(initialCertificates);
			setImageFiles(initialImages);
		}
	}, [diamondFiles]);

	const handleCancel = () => {
		setIsEditMode(false);
		setThumbnailFile(initialFiles.thumbnail);
		setCertificateFiles(initialFiles.certificates);
		setImageFiles(initialFiles.images);
		setRemovedImagePaths([]);
		onClose();
	};

	const handleSwitchToEdit = () => {
		setIsEditMode(true);
	};

	const handleSaveChanges = async () => {
		if (
			hasFileListChanged(thumbnailFile, initialFiles.thumbnail) ||
			hasFileListChanged(certificateFiles, initialFiles.certificates) ||
			imageFiles.some((file) => !initialFiles.images.includes(file)) ||
			removedImagePaths.length > 0
		) {
			handleThumbnailUpload();
			handleCertificatesUpload();
			// Only upload new images
			if (imageFiles.some((file) => !initialFiles.images.includes(file))) {
				handleImageUpload();
			}
			handleDeleteImages();
		} else {
			message.error(error?.data?.detail );
		}
		await dispatch(fetchDiamondFiles(diamondId))
			.unwrap()
			.then((response) => {
				if (response) {
					setDiamondFiles(response);
				}
			})
			.catch((error) => {
				message.error(error?.data?.detail );
			});
		setIsEditMode(false);
	};

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

			dispatch(deleteDiamondImages({diamondId, imagePaths: removedImagePaths}))
				.unwrap()
				.then(() => {
					message.success('Images deleted successfully');
				})
				.catch((error) => {
					message.error(error?.data?.detail );
				});
		}
	};

	const handleThumbnailUpload = async () => {
		if (!thumbnailFile || thumbnailFile === initialFiles.thumbnail) {
			return;
		}

		console.log('Uploading Thumbnail for Diamond ID:', diamondId);
		await dispatch(uploadDiamondThumbnail({diamondId, formFile: thumbnailFile}))
			.unwrap()
			.then(() => {
				message.success('Thumbnail uploaded successfully');
			})
			.catch((error) => {
				message.error(error?.data?.detail );
			});
	};

	const handleCertificatesUpload = async () => {
		if (certificateFiles.length === 0 || certificateFiles === initialFiles.certificates) {
			return;
		}

		console.log('Uploading Certificates for Diamond ID:', diamondId);

		for (const file of certificateFiles) {
			await dispatch(
				uploadCertificates({diamondId, certificateCode: file.name, formFile: file})
			)
				.unwrap()
				.then(() => {
					message.success('Certificates uploaded successfully');
				})
				.catch((error) => {
					message.error(error?.data?.detail );
				});
		}
	};

	const handleImageUpload = async () => {
		if (imageFiles.length === 0 || imageFiles === initialFiles.images) {
			return;
		}

		console.log('Uploading Diamond Images for Diamond ID:', diamondId);

		await dispatch(uploadDiamondImages({diamondId, formFiles: imageFiles}))
			.unwrap()
			.then(() => {
				message.success('Diamond images uploaded successfully');
			})
			.catch((error) => {
				message.error(error?.data?.detail );
			});
	};

	const handleFileChange = (fileList, setState) => {
		setState(fileList);
	};

	return (
		<Modal
			title="Ảnh Kim Cương"
			visible={visible}
			onCancel={handleCancel}
			footer={
				isEditMode
					? [
							<Button key="cancel" onClick={handleCancel}>
								Hủy
							</Button>,
							<Button
								key="save"
								type="primary"
								loading={loading}
								onClick={handleSaveChanges}
							>
								Lưu
							</Button>,
					  ]
					: [
							<Button
								key="edit"
								type="primary"
								icon={<EditOutlined />}
								onClick={handleSwitchToEdit}
							>
								Chỉnh sửa
							</Button>,
					  ]
			}
		>
			{isEditMode ? (
				<Form layout="vertical">
					{/* Thumbnail Upload */}
					<Form.Item label="Ảnh">
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

					{/* Certificates Upload */}
					<Form.Item label="Chứng nhận">
						<Upload
							multiple
							accept="application/pdf"
							beforeUpload={(file) => {
								setCertificateFiles((fileList) => [...fileList, file]);
								return false;
							}}
							onRemove={(file) => {
								setCertificateFiles((fileList) =>
									fileList.filter((item) => item.MediaPath !== file.url)
								);
							}}
							showUploadList
							fileList={certificateFiles.map((file, index) => ({
								uid: index,
								name: file.name,
								url: file.MediaPath,
								status: 'done',
							}))}
						>
							<Button icon={<FileProtectOutlined />}>Select Certificates</Button>
						</Upload>
					</Form.Item>

					{/* Diamond Images Upload */}
					<Form.Item label="Ảnh chi tiết">
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
							<Button icon={<FileImageOutlined />}>Select Diamond Images</Button>
						</Upload>
					</Form.Item>
				</Form>
			) : (
				<div>
					{/* View Mode */}
					<List
						header={<b>Ảnh</b>}
						dataSource={thumbnailFile ? [thumbnailFile] : []}
						renderItem={(item) => (
							<List.Item>
								<Image src={item} alt="Thumbnail" width={100} height={100} />
							</List.Item>
						)}
					/>

					<List
						header={<b>Chứng nhận</b>}
						dataSource={certificateFiles}
						renderItem={(item, index) => (
							<List.Item>
								<a href={item.MediaPath} target="_blank" rel="noopener noreferrer">
									Certificate {index + 1}
								</a>
							</List.Item>
						)}
					/>

					<List
						header={<b>Ảnh chi tiết</b>}
						grid={{gutter: 16, column: 4}}
						dataSource={imageFiles}
						renderItem={(item) => (
							<List.Item>
								<Image
									src={item.MediaPath}
									alt="Diamond Image"
									width={100}
									height={100}
								/>
							</List.Item>
						)}
					/>
				</div>
			)}
		</Modal>
	);
};
