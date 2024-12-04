import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../../services/api';

export const fetchAccountRule = createAsyncThunk(
	'config/AccountRule',
	async (_, {rejectWithValue}) => {
		try {
			const response = await api.get('/Configuration/AccountRule');
			return response;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);
// Async thunks for fetching configuration data
export const fetchDiamondRule = createAsyncThunk(
	'config/fetchDiamondRule',
	async (_, {rejectWithValue}) => {
		try {
			const response = await api.get('/Configuration/DiamondRule');
			return response;
		} catch (error) {
			return rejectWithValue(error);
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
			return rejectWithValue(error);
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
			return rejectWithValue(error);
		}
	}
);
export const fetchLocationRule = createAsyncThunk(
	'config/fetchLocationRule',
	async (_, {rejectWithValue}) => {
		try {
			const response = await api.get('/Configuration/LocationRules');
			return response;
		} catch (error) {
			return rejectWithValue(error.response || error.message);
		}
	}
);
export const fetchOrderRule = createAsyncThunk(
	'config/fetchOrderRule',
	async (_, {rejectWithValue}) => {
		try {
			const response = await api.get('/Configuration/OrderRule');
			return response;
		} catch (error) {
			return rejectWithValue(error.response || error.message);
		}
	}
);
export const fetchOrderRulePayment = createAsyncThunk(
	'config/fetchOrderRulePayment',
	async (_, {rejectWithValue}) => {
		try {
			const response = await api.get('/Configuration/OrderRule/Payment');
			return response;
		} catch (error) {
			return rejectWithValue(error.response || error.message);
		}
	}
);
export const fetchShopBankAccountRule = createAsyncThunk(
	'config/fetchShopBankAccountRule',
	async (_, {rejectWithValue}) => {
		try {
			const response = await api.get('/Configuration/ShopBankAccountRule');
			return response;
		} catch (error) {
			return rejectWithValue(error.response || error.message);
		}
	}
);
// Async thunks for updating configuration data
export const updateAccountRule = createAsyncThunk(
	'config/updateAccountRule',
	async (data, {rejectWithValue}) => {
		try {
			const response = await api.post('/Configuration/AccountRule', data);
			return response;
		} catch (error) {
			return rejectWithValue(error);
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
			return rejectWithValue(error);
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
			return rejectWithValue(error);
		}
	}
);
export const updateLocationRules = createAsyncThunk(
	'config/updateLocationRules',
	async (data, {rejectWithValue}) => {
		try {
			const response = await api.post('/Configuration/LocationRules', data);
			return response;
		} catch (error) {
			return rejectWithValue(error.response || error.message);
		}
	}
);
export const updateOrderRule = createAsyncThunk(
	'config/updateOrderRule',
	async (data, {rejectWithValue}) => {
		try {
			const response = await api.post('/Configuration/OrderRule', data);
			return response;
		} catch (error) {
			return rejectWithValue(error.response || error.message);
		}
	}
);
export const updateOrderRulePayment = createAsyncThunk(
	'config/updateOrderRulePayment',
	async (data, {rejectWithValue}) => {
		try {
			const response = await api.post('/Configuration/OrderRule/Payment', data);
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
			return rejectWithValue(error);
		}
	}
);

export const updateShopBankAccountRule = createAsyncThunk(
	'config/updateShopBankAccountRule',
	async (data, {rejectWithValue}) => {
		try {
			const response = await api.post('/Configuration/ShopBankAccountRule', data);
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
		accountRule: {},
		diamondRule: {},
		frontendDisplayRule: {},
		promotionRule: {},
		locationRule: {},
		orderRule: {},
		orderPaymentRule: {},
		orderPaymentRule: {},

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
			.addCase(fetchAccountRule.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchAccountRule.fulfilled, (state, action) => {
				state.isLoading = false;
				state.accountRule = action.payload;
			})
			.addCase(fetchAccountRule.rejected, (state) => {
				state.isLoading = false;
				state.error = action.payload;
			})
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
			.addCase(fetchLocationRule.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchLocationRule.fulfilled, (state, action) => {
				state.isLoading = false;
				state.locationRule = action.payload;
			})
			.addCase(fetchLocationRule.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})
			.addCase(fetchOrderRule.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchOrderRule.fulfilled, (state, action) => {
				state.isLoading = false;
				state.orderRule = action.payload;
			})
			.addCase(fetchOrderRule.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})
			.addCase(fetchOrderRulePayment.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchOrderRulePayment.fulfilled, (state, action) => {
				state.isLoading = false;
				state.orderPaymentRule = action.payload;
			})
			.addCase(fetchOrderRulePayment.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})
			.addCase(fetchShopBankAccountRule.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchShopBankAccountRule.fulfilled, (state, action) => {
				state.isLoading = false;
				state.shopBankAccountRule = action.payload;
			})
			.addCase(fetchShopBankAccountRule.rejected, (state, action) => {
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
			.addCase(updateAccountRule.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(updateAccountRule.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(updateAccountRule.rejected, (state, action) => {
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
			.addCase(updateLocationRules.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(updateLocationRules.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(updateLocationRules.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})
			.addCase(updateOrderRule.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(updateOrderRule.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(updateOrderRule.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})
			.addCase(updateOrderRulePayment.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(updateOrderRulePayment.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(updateOrderRulePayment.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})
			.addCase(updateShopBankAccountRule.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(updateShopBankAccountRule.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(updateShopBankAccountRule.rejected, (state, action) => {
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
