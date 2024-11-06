import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../../../services/api';

// Async thunk for fetching jewelry data
export const fetchJewelry = createAsyncThunk(
	'jewelry/fetchJewelry',
	async (
		{page, take, ModelName, SerialCode, MetalId, SizeId, HasSideDiamond, Status},
		{rejectWithValue}
	) => {
		try {
			const response = await api.get('/api/Jewelry/Staff/All', {
				params: {
					page,
					take,
					ModelName,
					SerialCode,
					MetalId,
					SizeId,
					HasSideDiamond,
					Status,
				},
			});
			return response;
		} catch (error) {
			return rejectWithValue(error.response || error.message);
		}
	}
);
export const fetchJewelryDetail = createAsyncThunk(
	'jewelry/fetchJewelryDetail',
	async (jewelryId, {rejectWithValue}) => {
		try {
			const response = await api.get(`/api/Jewelry/Staff/Detail`, {
				params: {jewelryId},
			});
			return response; 
		} catch (error) {
			return rejectWithValue(error.response || error.message);
		}
	}
);
export const createJewelry = createAsyncThunk(
	'jewelry/createJewelry',
	async ({jewelryRequest, sideDiamondOptId, attachedDiamondIds}, {rejectWithValue}) => {
		try {
			const response = await api.post('/api/Jewelry/Create', {
				jewelryRequest,
				sideDiamondOptId,
				attachedDiamondIds,
			});
			return response;
		} catch (error) {
			if (error.response) {
				return rejectWithValue(error.response);
			}
			return rejectWithValue(error.message);
		}
	}
);

const initialState = {
	jewelryItems: [],
	totalPage: 0,
	currentPage: 0,
	status: 'idle',
	error: null,
};

export const jewelrySlice = createSlice({
	name: 'jewelry',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchJewelry.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(fetchJewelry.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.jewelryItems = action.payload.values;
				state.totalPage = action.payload.totalPage;
				state.currentPage = action.payload.currentPage;
			})
			.addCase(fetchJewelry.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			})
			.addCase(fetchJewelryDetail.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchJewelryDetail.fulfilled, (state, action) => {
				state.loading = false;
				state.jewelryDetail = action.payload; 
			})
			.addCase(fetchJewelryDetail.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(createJewelry.pending, (state) => {
				state.createStatus = 'loading';
				state.createError = null;
			})
			.addCase(createJewelry.fulfilled, (state, action) => {
				state.createStatus = 'succeeded';
				state.jewelryData = action.payload;
			})
			.addCase(createJewelry.rejected, (state, action) => {
				state.createStatus = 'failed';
				state.createError = action.payload || 'Failed to create jewelry';
			});
	},
});
