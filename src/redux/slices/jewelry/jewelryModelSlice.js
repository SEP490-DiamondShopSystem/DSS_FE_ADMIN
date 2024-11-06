import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../../../services/api';

export const fetchJewelryModels = createAsyncThunk(
	'jewelryModel/fetchJewelryModels',
	async ({page, take, name, Category, IsRhodiumFinished, IsEngravable}, {rejectWithValue}) => {
		try {
			const response = await api.get('/api/JewelryModel/Staff/All', {
				params: {
					page,
					take,
					name,
					Category,
					IsRhodiumFinished,
					IsEngravable,
				},
			});
			return response;
		} catch (error) {
			return rejectWithValue(error.response || error.message);
		}
	}
);

export const fetchJewelryModelDetail = createAsyncThunk(
	'jewelryModel/fetchJewelryModelDetail',
	async (modelId, {rejectWithValue}) => {
		try {
			const response = await api.get('/api/JewelryModel/Staff/Detail', {
				params: {modelId},
			});
			return response;
		} catch (error) {
			return rejectWithValue(error.response || error.message);
		}
	}
);
export const createJewelryModel = createAsyncThunk(
	'jewelryModel/createJewelryModel',
	async (payload, {rejectWithValue}) => {
		try {
			const response = await api.post('/api/JewelryModel/Create', payload);
			return response;
		} catch (error) {
			return rejectWithValue(error.response);
		}
	}
);

export const createSizeMetalSpec = createAsyncThunk(
	'jewelryModel/createSizeMetalSpec',
	async (payload, {rejectWithValue}) => {
		try {
			const response = await api.post('/api/JewelryModel/Create/SizeMetal', payload);
			return response;
		} catch (error) {
			return rejectWithValue(error.response);
		}
	}
);

export const createSideDiamondOption = createAsyncThunk(
	'jewelryModel/createSideDiamondOption',
	async (payload, {rejectWithValue}) => {
		try {
			const response = await api.post('/api/JewelryModel/Create/SideDiamondOption', payload);
			return response;
		} catch (error) {
			return rejectWithValue(error.response);
		}
	}
);

export const updateSizeMetalSpec = createAsyncThunk(
	'jewelryModel/updateSizeMetalSpec',
	async (payload, {rejectWithValue}) => {
		try {
			const response = await api.put('/api/JewelryModel/Update/SizeMetal', payload);
			return response;
		} catch (error) {
			return rejectWithValue(error.response);
		}
	}
);

export const deleteSizeMetalSpec = createAsyncThunk(
	'jewelryModel/deleteSizeMetalSpec',
	async ({modelId, metalId, sizeId}, {rejectWithValue}) => {
		try {
			const response = await api.delete('/api/JewelryModel/Delete/SizeMetal', {
				params: {modelId, metalId, sizeId},
			});
			return response;
		} catch (error) {
			return rejectWithValue(error.response);
		}
	}
);

export const deleteSideDiamondOption = createAsyncThunk(
	'jewelryModel/deleteSideDiamondOption',
	async ({modelId, metalId, sizeId}, {rejectWithValue}) => {
		try {
			const response = await api.delete('/api/JewelryModel/Delete/SideDiamondOption', {
				params: {modelId, metalId, sizeId},
			});
			return response;
		} catch (error) {
			return rejectWithValue(error.response);
		}
	}
);
const initialState = {
	jewelryModels: [],
	jewelryModelDetail: null,
	totalPage: 0,
	currentPage: 0,
	status: 'idle',
	error: null,
};

export const jewelryModelSlice = createSlice({
	name: 'jewelryModel',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchJewelryModels.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(fetchJewelryModels.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.jewelryModels = action.payload.values;
				state.totalPage = action.payload.totalPage;
				state.currentPage = action.payload.currentPage;
			})
			.addCase(fetchJewelryModels.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			})
			.addCase(fetchJewelryModelDetail.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(fetchJewelryModelDetail.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.jewelryModelDetail = action.payload;
			})
			.addCase(fetchJewelryModelDetail.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			})
			.addCase(createJewelryModel.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(createJewelryModel.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.jewelryModels.push(action.payload);
			})
			.addCase(createJewelryModel.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			})
			.addCase(createSizeMetalSpec.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(createSizeMetalSpec.fulfilled, (state, action) => {
				state.status = 'succeeded';
			})
			.addCase(createSizeMetalSpec.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			})
			.addCase(createSideDiamondOption.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(createSideDiamondOption.fulfilled, (state, action) => {
				state.status = 'succeeded';
			})
			.addCase(createSideDiamondOption.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			})
			.addCase(updateSizeMetalSpec.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(updateSizeMetalSpec.fulfilled, (state) => {
				state.status = 'succeeded';
			})
			.addCase(updateSizeMetalSpec.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			})
			.addCase(deleteSizeMetalSpec.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(deleteSizeMetalSpec.fulfilled, (state) => {
				state.status = 'succeeded';
			})
			.addCase(deleteSizeMetalSpec.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			})
			.addCase(deleteSideDiamondOption.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(deleteSideDiamondOption.fulfilled, (state) => {
				state.status = 'succeeded';
			})
			.addCase(deleteSideDiamondOption.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			});
	},
});
