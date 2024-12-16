import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../../../services/api';

// Thunks for API calls
export const fetchAllJewelryModels = createAsyncThunk(
	'jewelryModel/fetchAllJewelryModels',
	async (params, {rejectWithValue}) => {
		try {
			const response = await api.get('/JewelryModel/Staff/All', {params});
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
			return response;
		} catch (error) {
			console.error('createSideDiamondOptionForJewelryModel error:', error.response || error); // Log error
			return thunkAPI.rejectWithValue(error.response);
		}
	}
);

export const updateCraftmanFee = createAsyncThunk(
	'jewelryModel/updateCraftmanFee',
	async ({modelId, newFee}, thunkAPI) => {
		try {
			// Construct the payload as JSON
			const payload = {
				modelId,
				newFee,
			};

			// Send a JSON request
			const response = await api.put('/JewelryModel/Update/CraftmanFee', payload, {
				headers: {
					'Content-Type': 'application/json-patch+json', // Match the expected content type
				},
			});
			return response.data; // Assuming the response contains JSON
		} catch (error) {
			console.error('updateCraftmanFee error:', error.response || error); // Log error
			return thunkAPI.rejectWithValue(
				error.response?.data || 'Failed to update craftsman fee'
			);
		}
	}
);
export const addSizeMetalForJewelryModel = createAsyncThunk(
	'jewelryModel/addSizeMetalForJewelryModel',
	async ({modelId, metalSizeSpec}, thunkAPI) => {
		try {
			const response = await api.post('/JewelryModel/Create/SizeMetal', {
				modelId: modelId,
				metalSizeSpec: metalSizeSpec,
			});
			return response;
		} catch (error) {
			console.error('addSizeMetalForJewelryModel error:', error.response || error);
			return thunkAPI.rejectWithValue(error.response);
		}
	}
);

export const updateSizeMetalForJewelryModel = createAsyncThunk(
	'jewelryModel/updateSizeMetal',
	async ({modelId, sizeMetals}, thunkAPI) => {
		try {
			const response = await api.put('/JewelryModel/Update/SizeMetal', {
				modelId: modelId,
				sizeMetals: sizeMetals,
			});
			return response;
		} catch (error) {
			console.error('updateSizeMetalForJewelryModel error:', error.response || error);
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
			return response;
		} catch (error) {
			console.error('deleteSizeMetalFromJewelryModel error:', error.response || error); // Log error
			return thunkAPI.rejectWithValue(error.response);
		}
	}
);

export const deleteJewelryModel = createAsyncThunk(
	'jewelryModel/deleteJewelryModel',
	async (modelId, {rejectWithValue}) => {
		try {
			const response = await api.delete('/JewelryModel/Delete/JewelryModel', {
				params: {ModelId: modelId},
			});
			return response;
		} catch (error) {
			console.error('deleteJewelryModel error:', error.response || error); // Log error
			return rejectWithValue(error.response || 'Failed to delete jewelry model');
		}
	}
);
export const changeVisibilityJewelryModel = createAsyncThunk(
	'jewelryModel/changeVisibilityJewelryModel',
	async (modelId, {rejectWithValue}) => {
		try {
			const response = await api.put('/JewelryReview/ChangeVisibility', {
				params: {ModelId: modelId},
			});
			return response;
		} catch (error) {
			console.error('changeVisibilityJewelryModel error:', error.response || error); // Log error
			return rejectWithValue(
				error.response || 'Failed to toggle review jewelry model víibility'
			);
		}
	}
);
// Updated deleteSideDiamondOption thunk to match the new API specification
export const deleteSideDiamondOption = createAsyncThunk(
	'jewelryModel/deleteSideDiamondOption',
	async (sideDiamondOptId, {rejectWithValue}) => {
		try {
			const response = await api.delete(`/JewelryModel/Delete/SideDiamondOption`, {
				params: {SideDiamondOptId: sideDiamondOptId},
			});
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
			})
			.addCase(fetchAllJewelryModels.fulfilled, (state, action) => {
				state.loading = false;
				state.models = action.payload.Values || []; // Set 'Values' to models
			})
			.addCase(fetchAllJewelryModels.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || 'An unknown error occurred'; // Ensure fallback to a string if error is undefined
				console.error('fetchAllJewelryModels error:', state.error); // Log the error
			})

			.addCase(fetchJewelryModelDetail.fulfilled, (state, action) => {
				state.modelDetail = action.payload;
			})
			.addCase(createJewelryModel.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createJewelryModel.fulfilled, (state, action) => {
				state.loading = false;
				state.models.push(action.payload); // Add created model to the state
			})
			.addCase(createJewelryModel.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
				console.error('createJewelryModel failed:', action.payload); // Log error response
			})
			.addCase(createSizeMetalForJewelryModel.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createSizeMetalForJewelryModel.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(createSizeMetalForJewelryModel.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
				console.error('createSizeMetalForJewelryModel failed:', action.payload); // Log error response
			})
			.addCase(createSideDiamondOptionForJewelryModel.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createSideDiamondOptionForJewelryModel.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(createSideDiamondOptionForJewelryModel.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
				console.error('createSideDiamondOptionForJewelryModel failed:', action.payload); // Log error response
			})
			.addCase(updateCraftmanFee.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateCraftmanFee.fulfilled, (state, action) => {
				state.loading = false;
				// Optionally update the specific model's craftsman fee in the state
				const updatedModelIndex = state.models.findIndex(
					(model) => model.id === action.meta.arg.modelId
				);
				if (updatedModelIndex !== -1) {
					state.models[updatedModelIndex].craftmanFee = action.meta.arg.craftmanFee;
				}
			})
			.addCase(updateCraftmanFee.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
				console.error('updateCraftmanFee failed:', action.payload); // Log error response
			})
			.addCase(updateSizeMetalForJewelryModel.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateSizeMetalForJewelryModel.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(updateSizeMetalForJewelryModel.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
				console.error('updateSizeMetalForJewelryModel failed:', action.payload); // Log error response
			})
			.addCase(deleteSizeMetalFromJewelryModel.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteSizeMetalFromJewelryModel.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(deleteSizeMetalFromJewelryModel.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
				console.error('deleteSizeMetalFromJewelryModel failed:', action.payload); // Log error response
			})
			.addCase(deleteJewelryModel.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteJewelryModel.fulfilled, (state, action) => {
				state.loading = false;
				// Optionally remove the deleted model from the state
				state.models = state.models.filter((model) => model.id !== action.meta.arg);
			})
			.addCase(deleteJewelryModel.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
				console.error('deleteJewelryModel failed:', action.payload); // Log error response
			})

			// Update existing deleteSideDiamondOption case to match the new thunk signature
			.addCase(deleteSideDiamondOption.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteSideDiamondOption.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(deleteSideDiamondOption.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
				console.error('deleteSideDiamondOption failed:', action.payload); // Log error response
			});
	},
});

export default jewelryModelSlice.reducer;
