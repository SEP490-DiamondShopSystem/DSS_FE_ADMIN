import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../../../services/api';

// Thunks for API calls
export const fetchAllJewelryModels = createAsyncThunk(
	'jewelryModel/fetchAllJewelryModels',
	async (params, {rejectWithValue}) => {
		try {
			const response = await api.get('/JewelryModel/Staff/All', {params});
			console.log(response);
			return response;
		} catch (error) {
			console.error('fetchAllJewelryModels error:', error); // Log the full error for better debugging
			return rejectWithValue(error.response || error.message || 'An unknown error occurred');
		}
	}
);

export const fetchJewelryModelDetail = createAsyncThunk(
	'jewelryModel/fetchJewelryModelDetail',
	async (modelId, thunkAPI) => {
		try {
			const response = await api.get(`/JewelryModel/Staff/Detail`, {params: {modelId}});
			console.log('fetchJewelryModelDetail response:', response); // Log API response
			return response;
		} catch (error) {
			console.error('fetchJewelryModelDetail error:', error.response || error); // Log error
			return thunkAPI.rejectWithValue(error.response);
		}
	}
);

export const createJewelryModel = createAsyncThunk(
	'jewelryModel/createJewelryModel',
	async (modelData, thunkAPI) => {
		try {
			const response = await api.post('/JewelryModel/Create', modelData, {
				headers: {'Content-Type': 'application/json-patch+json'},
			});
			console.log('createJewelryModel response:', response); // Log API response
			return response;
		} catch (error) {
			console.error('createJewelryModel error:', error.response || error); // Log error
			return thunkAPI.rejectWithValue(error.response);
		}
	}
);

export const createSizeMetalForJewelryModel = createAsyncThunk(
	'jewelryModel/createSizeMetal',
	async ({modelId, metalSizeSpec}, thunkAPI) => {
		try {
			const response = await api.post(
				`/JewelryModel/Create/SizeMetal`,
				{modelId, metalSizeSpec},
				{
					headers: {'Content-Type': 'application/json-patch+json'},
				}
			);
			console.log('createSizeMetalForJewelryModel response:', response); // Log API response
			return response;
		} catch (error) {
			console.error('createSizeMetalForJewelryModel error:', error.response || error); // Log error
			return thunkAPI.rejectWithValue(error.response);
		}
	}
);

export const createSideDiamondOptionForJewelryModel = createAsyncThunk(
	'jewelryModel/createSideDiamondOption',
	async ({modelId, sideDiamondSpec}, thunkAPI) => {
		try {
			const response = await api.post(
				`/JewelryModel/Create/SideDiamondOption`,
				{modelId, sideDiamondSpec},
				{
					headers: {'Content-Type': 'application/json-patch+json'},
				}
			);
			console.log('createSideDiamondOptionForJewelryModel response:', response); // Log API response
			return response;
		} catch (error) {
			console.error('createSideDiamondOptionForJewelryModel error:', error.response || error); // Log error
			return thunkAPI.rejectWithValue(error.response);
		}
	}
);

export const updateSizeMetalForJewelryModel = createAsyncThunk(
	'jewelryModel/updateSizeMetal',
	async ({modelId, sizeMetals}, thunkAPI) => {
		const formData = new FormData();
		formData.append('ModelId', modelId);
		sizeMetals.forEach((item, index) => {
			formData.append(`SizeMetals[${index}].sizeId`, item.sizeId);
			formData.append(`SizeMetals[${index}].metalId`, item.metalId);
			formData.append(`SizeMetals[${index}].weight`, item.weight);
		});

		try {
			const response = await api.put('/JewelryModel/Update/SizeMetal', formData, {
				headers: {'Content-Type': 'multipart/form-data'},
			});
			console.log('updateSizeMetalForJewelryModel response:', response); // Log API response
			return response;
		} catch (error) {
			console.error('updateSizeMetalForJewelryModel error:', error.response || error); // Log error
			return thunkAPI.rejectWithValue(error.response);
		}
	}
);

export const deleteSizeMetalFromJewelryModel = createAsyncThunk(
	'jewelryModel/deleteSizeMetal',
	async ({modelId, metalId, sizeId}, thunkAPI) => {
		try {
			const response = await api.delete('/JewelryModel/Delete/SizeMetal', {
				params: {ModelId: modelId, MetalId: metalId, SizeId: sizeId},
			});
			console.log('deleteSizeMetalFromJewelryModel response:', response); // Log API response
			return response;
		} catch (error) {
			console.error('deleteSizeMetalFromJewelryModel error:', error.response || error); // Log error
			return thunkAPI.rejectWithValue(error.response);
		}
	}
);

export const deleteSideDiamondOption = createAsyncThunk(
	'jewelryModel/deleteSideDiamondOption',
	async ({modelId, metalId, sizeId}, {rejectWithValue}) => {
		try {
			const response = await api.delete(`/JewelryModel/Delete/SideDiamondOption`, {
				params: {modelId, metalId, sizeId},
			});
			console.log('deleteSideDiamondOption response:', response); // Log API response
			return response;
		} catch (error) {
			console.error('deleteSideDiamondOption error:', error.response || error); // Log error
			return rejectWithValue(error.response || 'Failed to delete side diamond option');
		}
	}
);

export const jewelryModelSlice = createSlice({
	name: 'jewelryModel',
	initialState: {
		models: [],
		modelDetail: null,
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAllJewelryModels.pending, (state) => {
				state.loading = true;
				state.error = null;
				console.log('fetchAllJewelryModels loading...'); // Log loading state
			})
			.addCase(fetchAllJewelryModels.fulfilled, (state, action) => {
				state.loading = false;
				state.models = action.payload.Values || []; // Set 'Values' to models
				console.log('fetchAllJewelryModels fulfilled:', action.payload.Values); // Log response data
			})
			.addCase(fetchAllJewelryModels.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || 'An unknown error occurred'; // Ensure fallback to a string if error is undefined
				console.error('fetchAllJewelryModels error:', state.error); // Log the error
			})

			.addCase(fetchJewelryModelDetail.fulfilled, (state, action) => {
				state.modelDetail = action.payload;
				console.log('fetchJewelryModelDetail fulfilled:', action.payload); // Log model detail
			})
			.addCase(createJewelryModel.pending, (state) => {
				state.loading = true;
				state.error = null;
				console.log('createJewelryModel loading...'); // Log loading state
			})
			.addCase(createJewelryModel.fulfilled, (state, action) => {
				state.loading = false;
				state.models.push(action.payload); // Add created model to the state
				console.log('createJewelryModel fulfilled:', action.payload); // Log created model
			})
			.addCase(createJewelryModel.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
				console.error('createJewelryModel failed:', action.payload); // Log error response
			})
			.addCase(createSizeMetalForJewelryModel.pending, (state) => {
				state.loading = true;
				state.error = null;
				console.log('createSizeMetalForJewelryModel loading...'); // Log loading state
			})
			.addCase(createSizeMetalForJewelryModel.fulfilled, (state, action) => {
				state.loading = false;
				console.log('createSizeMetalForJewelryModel fulfilled:', action.payload); // Log response data
			})
			.addCase(createSizeMetalForJewelryModel.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
				console.error('createSizeMetalForJewelryModel failed:', action.payload); // Log error response
			})
			.addCase(createSideDiamondOptionForJewelryModel.pending, (state) => {
				state.loading = true;
				state.error = null;
				console.log('createSideDiamondOptionForJewelryModel loading...'); // Log loading state
			})
			.addCase(createSideDiamondOptionForJewelryModel.fulfilled, (state, action) => {
				state.loading = false;
				console.log('createSideDiamondOptionForJewelryModel fulfilled:', action.payload); // Log response data
			})
			.addCase(createSideDiamondOptionForJewelryModel.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
				console.error('createSideDiamondOptionForJewelryModel failed:', action.payload); // Log error response
			})
			.addCase(updateSizeMetalForJewelryModel.pending, (state) => {
				state.loading = true;
				state.error = null;
				console.log('updateSizeMetalForJewelryModel loading...'); // Log loading state
			})
			.addCase(updateSizeMetalForJewelryModel.fulfilled, (state, action) => {
				state.loading = false;
				console.log('updateSizeMetalForJewelryModel fulfilled:', action.payload); // Log response data
			})
			.addCase(updateSizeMetalForJewelryModel.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
				console.error('updateSizeMetalForJewelryModel failed:', action.payload); // Log error response
			})
			.addCase(deleteSizeMetalFromJewelryModel.pending, (state) => {
				state.loading = true;
				state.error = null;
				console.log('deleteSizeMetalFromJewelryModel loading...'); // Log loading state
			})
			.addCase(deleteSizeMetalFromJewelryModel.fulfilled, (state, action) => {
				state.loading = false;
				console.log('deleteSizeMetalFromJewelryModel fulfilled:', action.payload); // Log response data
			})
			.addCase(deleteSizeMetalFromJewelryModel.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
				console.error('deleteSizeMetalFromJewelryModel failed:', action.payload); // Log error response
			})
			.addCase(deleteSideDiamondOption.pending, (state) => {
				state.loading = true;
				state.error = null;
				console.log('deleteSideDiamondOption loading...'); // Log loading state
			})
			.addCase(deleteSideDiamondOption.fulfilled, (state, action) => {
				state.loading = false;
				console.log('deleteSideDiamondOption fulfilled:', action.payload); // Log response data
			})
			.addCase(deleteSideDiamondOption.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
				console.error('deleteSideDiamondOption failed:', action.payload); // Log error response
			});
	},
});

export default jewelryModelSlice.reducer;