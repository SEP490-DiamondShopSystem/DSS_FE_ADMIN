// import {CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET_NAME} from '@env';
import axios from 'axios';

const CLOUDINARY_CLOUD_NAME = 'dj7kubwcx';
const CLOUDINARY_UPLOAD_PRESET_NAME = '_DiamondShop';

console.log('CLOUDINARY_CLOUD_NAME', CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_UPLOAD_PRESET_NAME', CLOUDINARY_UPLOAD_PRESET_NAME);

const formatKey = (key) => {
	const newString = key.replace(/;/g, '');
	return newString;
};

// Hàm upload ảnh đơn lẻ lên Cloudinary
export const uploadImageToCloudinary = async (file) => {
	console.log('file:', file); // Kiểm tra xem file có đúng không
	if (!file) {
		console.error('No file provided for upload.');
		return;
	}

	const data = new FormData();
	data.append('file', file);
	data.append('upload_preset', formatKey(CLOUDINARY_UPLOAD_PRESET_NAME));
	data.append('cloud_name', CLOUDINARY_CLOUD_NAME);

	try {
		const response = await axios.post(
			`https://api.cloudinary.com/v1_1/${formatKey(CLOUDINARY_CLOUD_NAME)}/image/upload`,
			data,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}
		);
		console.log('Image uploaded successfully: ', response.data);
		return response.data;
	} catch (error) {
		console.log('Error uploading image: ', error);
		return null;
	}
};

// Hàm upload nhiều ảnh lên Cloudinary
export const uploadMultipleImages = async (files) => {
	const uploadPromises = Array.from(files).map((file) => {
		return uploadImageToCloudinary(file);
	});

	try {
		const results = await Promise.all(uploadPromises);
		return results.filter((result) => result !== null);
	} catch (error) {
		console.error('Error uploading multiple images: ', error);
		return [];
	}
};
