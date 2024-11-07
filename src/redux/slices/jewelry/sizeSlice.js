import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../../../services/api';

// Async thunk to fetch all metals
export const fetchAllSizes = createAsyncThunk('sizes/fetchAll', async (_, {rejectWithValue}) => {
	try {
		const response = await api.get('/Size/All');
		console.log('FetchAllSizes Response:', response);
		return response;
	} catch (error) {
		console.log('Error: ', JSON.stringify(error));
		return rejectWithValue(error);
	}
});

export const sizeSlice = createSlice({
	name: 'sizeSlices',
	initialState: {
		sizes: null,
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAllSizes.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchAllSizes.fulfilled, (state, action) => {
				state.loading = false;
				state.sizes = action.payload;
			})
			.addCase(fetchAllSizes.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});
