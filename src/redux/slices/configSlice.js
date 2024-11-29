import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../../services/api';

// Async thunks for fetching configuration data
export const fetchDiamondRule = createAsyncThunk(
	'config/fetchDiamondRule',
	async (_, {rejectWithValue}) => {
		try {
			const response = await api.get('/Configuration/DiamondRule');
			return response;
		} catch (error) {
			return rejectWithValue(error.response || error.message);
		}
	}
);

export const fetchFrontendDisplayRule = createAsyncThunk(
	'config/fetchFrontendDisplayRule',
	async (_, {rejectWithValue}) => {
		try {
			const response = await api.get('/Configuration/FrontendDisplayRule');
			return response;
		} catch (error) {
			return rejectWithValue(error.response || error.message);
		}
	}
);

export const fetchPromotionRule = createAsyncThunk(
	'config/fetchPromotionRule',
	async (_, {rejectWithValue}) => {
		try {
			const response = await api.get('/Configuration/PromotionRule');
			return response;
		} catch (error) {
			return rejectWithValue(error.response || error.message);
		}
	}
);

// Async thunks for updating configuration data
export const updateDiamondRule = createAsyncThunk(
	'config/updateDiamondRule',
	async (data, {rejectWithValue}) => {
		try {
			const response = await api.post('/Configuration/DiamondRule', data);
			return response;
		} catch (error) {
			return rejectWithValue(error.response || error.message);
		}
	}
);

export const updateFrontendDisplayRule = createAsyncThunk(
	'config/updateFrontendDisplayRule',
	async (data, {rejectWithValue}) => {
		try {
			const response = await api.post('/Configuration/FrontendDisplayRule', data);
			return response;
		} catch (error) {
			return rejectWithValue(error.response || error.message);
		}
	}
);

export const updatePromotionRule = createAsyncThunk(
	'config/updatePromotionRule',
	async (data, {rejectWithValue}) => {
		try {
			const response = await api.post('/Configuration/PromotionRule', data);
			return response;
		} catch (error) {
			return rejectWithValue(error.response || error.message);
		}
	}
);

// Slice
export const configSlice = createSlice({
	name: 'config',
	initialState: {
		diamondRule: {},
		frontendDisplayRule: {},
		promotionRule: {},
		isLoading: false,
		error: null,
	},
	reducers: {
		resetError(state) {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchDiamondRule.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchDiamondRule.fulfilled, (state, action) => {
				state.diamondRule = action.payload;
				state.isLoading = false;
			})
			.addCase(fetchDiamondRule.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})
			.addCase(fetchFrontendDisplayRule.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchFrontendDisplayRule.fulfilled, (state, action) => {
				state.isLoading = false;
				state.frontendDisplayRule = action.payload;
			})
			.addCase(fetchFrontendDisplayRule.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})
			.addCase(fetchPromotionRule.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchPromotionRule.fulfilled, (state, action) => {
				state.isLoading = false;
				state.promotionRule = action.payload;
			})
			.addCase(fetchPromotionRule.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})
			.addCase(updateDiamondRule.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(updateDiamondRule.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(updateDiamondRule.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})
			.addCase(updateFrontendDisplayRule.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(updateFrontendDisplayRule.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(updateFrontendDisplayRule.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})
			.addCase(updatePromotionRule.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(updatePromotionRule.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(updatePromotionRule.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			});
	},
});
