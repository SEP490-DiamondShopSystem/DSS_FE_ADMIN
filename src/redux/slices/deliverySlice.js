import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../../services/api';

export const getAllDelivery = createAsyncThunk(
	'deliverySlice/getAllDelivery',
	async (_, {rejectWithValue}) => {
		try {
			const data = await api.get(`/Delivery/All`);
			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const handleCreateDelivery = createAsyncThunk(
	'deliverySlice/handleCreateDelivery',
	async (_, {rejectWithValue}) => {
		try {
			const data = await api.post(`/Delivery/Create`);
			return data;
		} catch (error) {
			console.error(error);
			return rejectWithValue(error);
		}
	}
);

export const deliverySlice = createSlice({
	name: 'deliverySlice',
	initialState: {
		deliveryList: null,
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getAllDelivery.pending, (state) => {
				state.loading = true;
			})
			.addCase(getAllDelivery.fulfilled, (state, action) => {
				state.loading = false;
				state.deliveryList = action.payload;
			})
			.addCase(getAllDelivery.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(handleCreateDelivery.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleCreateDelivery.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(handleCreateDelivery.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});
