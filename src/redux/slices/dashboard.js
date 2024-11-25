import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../../services/api';

export const getAllTopSellingShape = createAsyncThunk(
	'dashboardSlice/getAllTopSellingShape',
	async (_, {rejectWithValue}) => {
		try {
			const data = await api.get(`/Dashboard/Diamond/TopSelling/AllShape`);
			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const getDashboard = createAsyncThunk(
	'dashboardSlice/getDashboard',
	async (_, {rejectWithValue}) => {
		try {
			const data = await api.get(`/Dashboard`);
			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);
export const getTopSellingJewelry = createAsyncThunk(
	'dashboardSlice/getTopSellingJewelry',
	async (_, {rejectWithValue}) => {
		try {
			const data = await api.get(`/Dashboard/Jewelry/TopSelling`);
			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const getOrderCompleted = createAsyncThunk(
	'dashboardSlice/getOrderCompleted',
	async ({startDate, endDate, isCustomOrder}, {rejectWithValue}) => {
		try {
			const data = await api.get(
				`/Dashboard/OrderCompleted/Count?startDate=${startDate}&endDate=${endDate}&isCustomOrder=${isCustomOrder}`
			);
			console.log('data', data);

			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const getAccountCount = createAsyncThunk(
	'dashboardSlice/getAccountCount',
	async (roles, {rejectWithValue}) => {
		try {
			const data = await api.get(`/Dashboard/Account/Count?roles=${1}`);
			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const dashboardSlice = createSlice({
	name: 'dashboardSlice',
	initialState: {
		shapeSelling: null,
		dashboard: null,
		orderCompletedCount: null,
		accountCustomerCount: null,
		topSellingJewelry: null,
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getAllTopSellingShape.pending, (state) => {
				state.loading = true;
			})
			.addCase(getAllTopSellingShape.fulfilled, (state, action) => {
				state.loading = false;
				state.shapeSelling = action.payload;
			})
			.addCase(getAllTopSellingShape.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(getDashboard.pending, (state) => {
				state.loading = true;
			})
			.addCase(getDashboard.fulfilled, (state, action) => {
				state.loading = false;
				state.dashboard = action.payload;
			})
			.addCase(getDashboard.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(getOrderCompleted.pending, (state) => {
				state.loading = true;
			})
			.addCase(getOrderCompleted.fulfilled, (state, action) => {
				state.loading = false;
				state.orderCompletedCount = action.payload;
			})
			.addCase(getOrderCompleted.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(getAccountCount.pending, (state) => {
				state.loading = true;
			})
			.addCase(getAccountCount.fulfilled, (state, action) => {
				state.loading = false;
				state.accountCustomerCount = action.payload;
			})
			.addCase(getAccountCount.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(getTopSellingJewelry.pending, (state) => {
				state.loading = true;
			})
			.addCase(getTopSellingJewelry.fulfilled, (state, action) => {
				state.loading = false;
				state.topSellingJewelry = action.payload;
			})
			.addCase(getTopSellingJewelry.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});
