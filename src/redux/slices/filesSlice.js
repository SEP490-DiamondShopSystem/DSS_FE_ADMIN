import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '../../services/api';

// Async Thunks
export const fetchDiamondFiles = createAsyncThunk(
	'files/fetchDiamondFiles',
	async (diamondId, {rejectWithValue}) => {
		try {
			const response = await api.get(`/Diamond/${diamondId}/Files`);
			return response;
		} catch (error) {
			return rejectWithValue(error || error.message);
		}
	}
);
export const fetchJewelryModelFiles = createAsyncThunk(
	'jewelryModelFiles/fetchJewelryModelFiles',
	async (jewelryModelId, {rejectWithValue}) => {
		try {
			const response = await api.get(`/JewelryModelFiles/${jewelryModelId}/Files`);
			return response;
		} catch (error) {
			return rejectWithValue(error || error.message);
		}
	}
);

export const uploadDiamondThumbnail = createAsyncThunk(
	'files/uploadThumbnail',
	async ({diamondId, formFile}, {rejectWithValue}) => {
		try {
			const formData = new FormData();
			formData.append('formFile', formFile);
			const response = await api.post(`/Diamond/${diamondId}/Files/Thumbnail`, formData, {
				headers: {'Content-Type': 'multipart/form-data'},
			});
			return response;
		} catch (error) {
			return rejectWithValue(error || error.message);
		}
	}
);
export const uploadJewelryModelThumbnail = createAsyncThunk(
	'jewelryModelFiles/uploadThumbnail',
	async ({jewelryModelId, formFile}, {rejectWithValue}) => {
		try {
			const formData = new FormData();
			formData.append('formFile', formFile);
			const response = await api.post(
				`/JewelryModelFiles/${jewelryModelId}/Files/Thumbnail`,
				formData,
				{
					headers: {'Content-Type': 'multipart/form-data'},
				}
			);
			return response;
		} catch (error) {
			return rejectWithValue(error || error.message);
		}
	}
);
export const deleteDiamondThumbnail = createAsyncThunk(
	'files/deleteThumbnail',
	async (diamondId, {rejectWithValue}) => {
		try {
			const response = await api.delete(`/Diamond/${diamondId}/Files/Thumbnail`);
			return response;
		} catch (error) {
			return rejectWithValue(error || error.message);
		}
	}
);
export const deleteJewelryModelThumbnail = createAsyncThunk(
	'jewelryModelFiles/deleteThumbnail',
	async (jewelryModelId, {rejectWithValue}) => {
		try {
			const response = await api.delete(
				`/JewelryModelFiles/${jewelryModelId}/Files/Thumbnail`
			);
			return response;
		} catch (error) {
			return rejectWithValue(error || error.message);
		}
	}
);
export const uploadCertificates = createAsyncThunk(
	'files/uploadCertificates',
	async ({diamondId, certificateCode, formFile}, {rejectWithValue}) => {
		try {
			const formData = new FormData();
			formData.append('certificateCode', certificateCode);
			formData.append('formFile', formFile);
			const response = await api.post(`/Diamond/${diamondId}/Files/Certificates`, formData, {
				headers: {'Content-Type': 'multipart/form-data'},
			});
			return response;
		} catch (error) {
			return rejectWithValue(error || error.message);
		}
	}
);

export const deleteCertificate = createAsyncThunk(
	'files/deleteCertificate',
	async ({diamondId, certAbsolutePath}, {rejectWithValue}) => {
		try {
			const response = await api.delete(`/Diamond/${diamondId}/Files/Certificates`, {
				params: {certAbsolutePath},
			});
			return response;
		} catch (error) {
			return rejectWithValue(error || error.message);
		}
	}
);
// Upload Base Images
export const uploadBaseImages = createAsyncThunk(
	'jewelryModelFiles/uploadBaseImages',
	async ({jewelryModelId, formFiles}, {rejectWithValue}) => {
		try {
			const formData = new FormData();
			formFiles.forEach((file) => formData.append('formFiles', file));
			const response = await api.post(
				`/JewelryModelFiles/${jewelryModelId}/Files/Images/Base`,
				formData,
				{
					headers: {'Content-Type': 'multipart/form-data'},
				}
			);
			return response;
		} catch (error) {
			return rejectWithValue(error || error.message);
		}
	}
);

// Upload Metal Images
export const uploadMetalImages = createAsyncThunk(
	'jewelryModelFiles/uploadMetalImages',
	async ({jewelryModelId, metalId, formFiles}, {rejectWithValue}) => {
		try {
			const formData = new FormData();
			formData.append('formFiles', formFiles);
			const response = await api.post(
				`/JewelryModelFiles/${jewelryModelId}/Files/Images/Metals/${metalId}`,
				formData,
				{
					headers: {'Content-Type': 'multipart/form-data'},
				}
			);
			return response;
		} catch (error) {
			return rejectWithValue(error || error.message);
		}
	}
);
// Upload Side Diamond Image
export const uploadSideDiamondImage = createAsyncThunk(
	'jewelryModelFiles/uploadSideDiamondImage',
	async ({jewelryModelId, image, sideDiamondOptionId}, {rejectWithValue}) => {
		try {
			const formData = new FormData();
			formData.append('image', image);
			formData.append('sideDiamondOptionId', sideDiamondOptionId);
			const response = await api.post(
				`/JewelryModelFiles/${jewelryModelId}/Files/Images/SideDiamonds/Single`,
				formData,
				{
					headers: {'Content-Type': 'multipart/form-data'},
				}
			);
			return response;
		} catch (error) {
			return rejectWithValue(error || error.message);
		}
	}
);
// Upload Main Diamond Images
export const uploadMainDiamondImages = createAsyncThunk(
	'jewelryModelFiles/uploadMainDiamondImages',
	async ({jewelryModelId, mainDiamondImages}, {rejectWithValue}) => {
		try {
			const formData = new FormData();
			mainDiamondImages.forEach((file) => formData.append('MainDiamondImages', file));

			const response = await api.post(
				`/JewelryModelFiles/${jewelryModelId}/Files/Images/MainDiamonds`,
				formData,
				{
					headers: {'Content-Type': 'multipart/form-data'},
				}
			);
			return response;
		} catch (error) {
			return rejectWithValue(error || error.message);
		}
	}
);



export const uploadCategorizedImage = createAsyncThunk(
	'jewelryModelFiles/uploadCategorizedImage',
	async ({jewelryModelId, imageFile, sideDiamondOptId, metalId}, {rejectWithValue}) => {
		try {
			if (!imageFile) {
				return rejectWithValue('No image file provided.');
			}

			const formData = new FormData();
			formData.append('imageFile', imageFile);
			formData.append('sideDiamondOptId', sideDiamondOptId);
			formData.append('metalId', metalId);

			const response = await api.post(
				`/JewelryModelFiles/${jewelryModelId}/Files/Images/Categorize/Single`,
				formData,
				{
					headers: {'Content-Type': 'multipart/form-data'},
				}
			);
			return response;
		} catch (error) {
			return rejectWithValue(error || error.message);
		}
	}
);

// Delete Images
export const deleteJewelryModelImages = createAsyncThunk(
	'jewelryModelFiles/deleteImages',
	async ({jewelryModelId, imagePaths}, {rejectWithValue}) => {
		try {
			const response = await api.delete(`/JewelryModelFiles/${jewelryModelId}/Files/Images`, {
				data: imagePaths,
			});
			return response;
		} catch (error) {
			return rejectWithValue(error || error.message);
		}
	}
);
export const uploadDiamondImages = createAsyncThunk(
	'files/uploadImages',
	async ({diamondId, formFiles}, {rejectWithValue}) => {
		try {
			const formData = new FormData();
			formFiles.forEach((file) => formData.append('formFiles', file));
			const response = await api.post(`/Diamond/${diamondId}/Files/Images`, formData, {
				headers: {'Content-Type': 'multipart/form-data'},
			});
			return response;
		} catch (error) {
			return rejectWithValue(error || error.message);
		}
	}
);

export const deleteDiamondImages = createAsyncThunk(
	'files/deleteImages',
	async ({diamondId, imagePaths}, {rejectWithValue}) => {
		try {
			const response = await api.delete(`/Diamond/${diamondId}/Files/Images`, {
				data: imagePaths,
			});
			return response;
		} catch (error) {
			return rejectWithValue(error || error.message);
		}
	}
);

// Slice
export const fileSlice = createSlice({
	name: 'fileSlice',
	initialState: {
		files: {},
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
		  // Fetch Diamond Files
		  .addCase(fetchDiamondFiles.pending, (state) => {
			state.loading = true;
		  })
		  .addCase(fetchDiamondFiles.fulfilled, (state, action) => {
			state.loading = false;
			state.files = action.payload;
		  })
		  .addCase(fetchDiamondFiles.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload;
		  })
		  // Fetch Jewelry Model Files
		  .addCase(fetchJewelryModelFiles.pending, (state) => {
			state.loading = true;
		  })
		  .addCase(fetchJewelryModelFiles.fulfilled, (state, action) => {
			state.loading = false;
			state.files = action.payload;
		  })
		  .addCase(fetchJewelryModelFiles.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload;
		  })
		  // Upload Diamond Thumbnail
		  .addCase(uploadDiamondThumbnail.pending, (state) => {
			state.loading = true;
		  })
		  .addCase(uploadDiamondThumbnail.fulfilled, (state, action) => {
			state.loading = false;
			state.files = { ...state.files, thumbnail: action.payload };
		  })
		  .addCase(uploadDiamondThumbnail.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload;
		  })
		  // Upload Jewelry Model Thumbnail
		  .addCase(uploadJewelryModelThumbnail.pending, (state) => {
			state.loading = true;
		  })
		  .addCase(uploadJewelryModelThumbnail.fulfilled, (state, action) => {
			state.loading = false;
			state.files = { ...state.files, thumbnail: action.payload };
		  })
		  .addCase(uploadJewelryModelThumbnail.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload;
		  })
		  // Delete Diamond Thumbnail
		  .addCase(deleteDiamondThumbnail.pending, (state) => {
			state.loading = true;
		  })
		  .addCase(deleteDiamondThumbnail.fulfilled, (state) => {
			state.loading = false;
			state.files = { ...state.files, thumbnail: null };
		  })
		  .addCase(deleteDiamondThumbnail.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload;
		  })
		  // Delete Jewelry Model Thumbnail
		  .addCase(deleteJewelryModelThumbnail.pending, (state) => {
			state.loading = true;
		  })
		  .addCase(deleteJewelryModelThumbnail.fulfilled, (state) => {
			state.loading = false;
			state.files = { ...state.files, thumbnail: null };
		  })
		  .addCase(deleteJewelryModelThumbnail.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload;
		  })
		  // Upload Certificates
		  .addCase(uploadCertificates.pending, (state) => {
			state.loading = true;
		  })
		  .addCase(uploadCertificates.fulfilled, (state, action) => {
			state.loading = false;
			state.files = { ...state.files, certificates: action.payload };
		  })
		  .addCase(uploadCertificates.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload;
		  })
		  // Upload Side Diamond Image
		  .addCase(uploadSideDiamondImage.pending, (state) => {
			state.loading = true;
		  })
		  .addCase(uploadSideDiamondImage.fulfilled, (state, action) => {
			state.loading = false;
			state.files = { ...state.files, sideDiamondImage: action.payload };
		  })
		  .addCase(uploadSideDiamondImage.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload;
		  })
		  // Upload Base Images
		  .addCase(uploadBaseImages.pending, (state) => {
			state.loading = true;
		  })
		  .addCase(uploadBaseImages.fulfilled, (state, action) => {
			state.loading = false;
			state.files = { ...state.files, baseImages: action.payload };
		  })
		  .addCase(uploadBaseImages.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload;
		  })
		  // Upload Metal Images
		  .addCase(uploadMetalImages.pending, (state) => {
			state.loading = true;
		  })
		  .addCase(uploadMetalImages.fulfilled, (state, action) => {
			state.loading = false;
			state.files = { ...state.files, metalImages: action.payload };
		  })
		  .addCase(uploadMetalImages.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload;
		  })
		  // Upload Main Diamond Images
		  .addCase(uploadMainDiamondImages.pending, (state) => {
			state.loading = true;
		  })
		  .addCase(uploadMainDiamondImages.fulfilled, (state, action) => {
			state.loading = false;
			state.files = { ...state.files, mainDiamondImages: action.payload };
		  })
		  .addCase(uploadMainDiamondImages.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload;
		  })
		  // Upload Categorized Image
		  .addCase(uploadCategorizedImage.pending, (state) => {
			state.loading = true;
		  })
		  .addCase(uploadCategorizedImage.fulfilled, (state, action) => {
			state.loading = false;
			state.files = { ...state.files, categorizedImage: action.payload };
		  })
		  .addCase(uploadCategorizedImage.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload;
		  })
		  // Delete Diamond Images
		  .addCase(deleteDiamondImages.pending, (state) => {
			state.loading = true;
		  })
		  .addCase(deleteDiamondImages.fulfilled, (state) => {
			state.loading = false;
			state.files = { ...state.files, deletedDiamondImages: true };
		  })
		  .addCase(deleteDiamondImages.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload;
		  })
		  // Delete Jewelry Model Images
		  .addCase(deleteJewelryModelImages.pending, (state) => {
			state.loading = true;
		  })
		  .addCase(deleteJewelryModelImages.fulfilled, (state) => {
			state.loading = false;
			state.files = { ...state.files, deletedJewelryModelImages: true };
		  })
		  .addCase(deleteJewelryModelImages.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload;
		  });
	  },
	  
});
