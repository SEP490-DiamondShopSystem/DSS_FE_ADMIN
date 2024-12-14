import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../../../services/api';

// Thunk to fetch all jewelry items with pagination and optional filters
export const fetchAllJewelry = createAsyncThunk(
	'jewelry/fetchAll',
	async (params, {rejectWithValue}) => {
		try {
			const {
				CurrentPage,
				PageSize,
				ModelName,
				SerialCode,
				SizeId,
				MetalId,
				Status,
				JewelryModelId,
			} = params;
			let url = '/Jewelry/Staff/All';
			const queryParams = new URLSearchParams();

			if (CurrentPage) queryParams.append('CurrentPage', CurrentPage);
			if (PageSize) queryParams.append('PageSize', PageSize);
			if (JewelryModelId) queryParams.append('JewelryModelId', JewelryModelId);
			if (ModelName) queryParams.append('ModelName', ModelName);
			if (SerialCode) queryParams.append('SerialCode', SerialCode);
			if (SizeId) queryParams.append('SizeId', SizeId);
			if (MetalId) queryParams.append('MetalId', MetalId);
			if (Status) queryParams.append('Status', Status);

			if (queryParams.toString()) {
				url += `?${queryParams.toString()}`;
			}

			const response = await api.get(url);
			return response;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

// Thunk to fetch a single jewelry detail by ID
export const fetchJewelryDetail = createAsyncThunk(
	'jewelry/fetchDetail',
	async (jewelryId, thunkAPI) => {
		try {
			const response = await api.get(`/Jewelry/Staff/Detail`, {params: {jewelryId}});
			console.log('fetchJewelryDetail response:', response);
			return response;
		} catch (error) {
			console.error('fetchJewelryDetail error:', error);
			return thunkAPI.rejectWithValue(error);
		}
	}
);

// Thunk to create a new jewelry item
export const createJewelry = createAsyncThunk(
	'jewelry/create',
	async (
		{modelId, sizeId, metalId, modelCode, status, sideDiamondOptId, attachedDiamondIds},
		thunkAPI
	) => {
		try {
			const response = await api.post('/Jewelry/Create', {
				jewelryRequest: {modelId, sizeId, metalId, modelCode, status},
				sideDiamondOptId,
				attachedDiamondIds,
			});
			console.log('createJewelry response:', response);
			return response;
		} catch (error) {
			console.error('createJewelry error:', error);
			return thunkAPI.rejectWithValue(error);
		}
	}
);
export const deleteJewelry = createAsyncThunk(
	'jewelry/deleteJewelry',
	async (JewelryId, {rejectWithValue}) => {
		try {
			const response = await api.delete(`/Jewelry/Delete?JewelryId=${JewelryId}`);
			console.log('createJewelry response:', response);
			return response;
		} catch (error) {
			console.error('createJewelry error:', error);
			return rejectWithValue(error);
		}
	}
);

export const changeJewelryReviewVisibility = createAsyncThunk(
	'jewelry/changeReviewVisibility',
	async (jewelryId, thunkAPI) => {
		try {
			const response = await api.put('/JewelryReview/ChangeVisibility', null, {
				params: {JewelryId: jewelryId},
			});
			console.log('changeJewelryReviewVisibility response:', response);
			return response;
		} catch (error) {
			console.error('changeJewelryReviewVisibility error:', error);
			return thunkAPI.rejectWithValue(error);
		}
	}
);
// Jewelry slice to manage state
export const jewelrySlice = createSlice({
	name: 'jewelrySlice',
	initialState: {
		jewelryList: [],
		totalPage: 0,
		currentPage: 0,
		jewelryDetail: null,
		loading: false,
		error: null,
	},
	reducers: {
		clearJewelryDetail: (state) => {
			state.jewelryDetail = null;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Handle fetchAllJewelry
			.addCase(fetchAllJewelry.pending, (state) => {
				state.loading = true;
				state.error = null;
				console.log('fetchAllJewelry pending');
			})
			.addCase(fetchAllJewelry.fulfilled, (state, action) => {
				state.loading = false;
				state.jewelryList = action.payload.Values || []; // Use 'Values' with a capital 'V'
				state.totalPage = action.payload.TotalPage;
				state.currentPage = action.payload.CurrentPage;
				console.log('fetchAllJewelry fulfilled:', action.payload);
			})
			.addCase(fetchAllJewelry.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
				console.error('fetchAllJewelry rejected:', action.payload);
			})

			// Handle fetchJewelryDetail
			.addCase(fetchJewelryDetail.pending, (state) => {
				state.loading = true;
				state.error = null;
				console.log('fetchJewelryDetail pending');
			})
			.addCase(fetchJewelryDetail.fulfilled, (state, action) => {
				state.loading = false;
				state.jewelryDetail = action.payload;
				console.log('fetchJewelryDetail fulfilled:', action.payload);
			})
			.addCase(fetchJewelryDetail.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
				console.error('fetchJewelryDetail rejected:', action.payload);
			})

			// Handle createJewelry
			.addCase(createJewelry.pending, (state) => {
				state.loading = true;
				state.error = null;
				console.log('createJewelry pending');
			})
			.addCase(createJewelry.fulfilled, (state, action) => {
				state.loading = false;
				state.jewelryList.push(action.payload);
				console.log('createJewelry fulfilled:', action.payload);
			})
			.addCase(createJewelry.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
				console.error('createJewelry rejected:', action.payload);
			})
			.addCase(changeJewelryReviewVisibility.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(changeJewelryReviewVisibility.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(changeJewelryReviewVisibility.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(deleteJewelry.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteJewelry.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(deleteJewelry.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export const {clearJewelryDetail} = jewelrySlice.actions;
