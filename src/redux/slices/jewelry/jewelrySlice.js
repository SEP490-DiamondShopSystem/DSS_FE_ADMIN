import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../../../services/api';

// Thunk to fetch all jewelry items with pagination and optional filters
export const fetchAllJewelry = createAsyncThunk(
	'jewelry/fetchAll',
	async (params, {rejectWithValue}) => {
		try {
			console.log('fetchAllJewelry request params:', params); // Log request params
			const response = await api.get('/Jewelry/Staff/All', {params});
			console.log('fetchAllJewelry response:', response); // Log response data
			return response;
		} catch (error) {
			console.error('fetchAllJewelry error:', error.response); // Log error response
			return rejectWithValue(error.response);
		}
	}
);

// Thunk to fetch a single jewelry detail by ID
export const fetchJewelryDetail = createAsyncThunk(
	'jewelry/fetchDetail',
	async (jewelryId, thunkAPI) => {
		try {
			console.log('fetchJewelryDetail request jewelryId:', jewelryId); // Log jewelryId
			const response = await api.get(`/Jewelry/Staff/Detail`, {params: {jewelryId}});
			console.log('fetchJewelryDetail response:', response); // Log response data
			return response;
		} catch (error) {
			console.error('fetchJewelryDetail error:', error.response); // Log error response
			return thunkAPI.rejectWithValue(error.response);
		}
	}
);

// Thunk to create a new jewelry item
export const createJewelry = createAsyncThunk(
	'jewelry/create',
	async ({modelId, sizeId, metalId, status, sideDiamondOptId, attachedDiamondIds}, thunkAPI) => {
		try {
			const jewelryRequest = {modelId, sizeId, metalId, status};
			console.log('createJewelry request:', jewelryRequest); // Log request data
			console.log('createJewelry sideDiamondOptId:', sideDiamondOptId); // Log side diamond options
			console.log('createJewelry attachedDiamondIds:', attachedDiamondIds); // Log attached diamonds

			const response = await api.post('/Jewelry/Create', {
				jewelryRequest,
				sideDiamondOptId,
				attachedDiamondIds,
			});
			console.log('createJewelry response:', response); // Log response data
			return response;
		} catch (error) {
			console.error('createJewelry error:', error.response); // Log error response
			return thunkAPI.rejectWithValue(error.response);
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
			});
	},
});

export const {clearJewelryDetail} = jewelrySlice.actions;
