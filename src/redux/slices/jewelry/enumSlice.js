import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../../../services/api';

// Async thunk to fetch all metals
export const fetchAllEnums = createAsyncThunk('enums/fetchAll', async (_, {rejectWithValue}) => {
	try {
		const response = await api.get('/Enums');
		console.log('fetchAllEnums Response:', response);
		return response;
	} catch (error) {
		console.log('Error: ', JSON.stringify(error));
		return rejectWithValue(error);
	}
});

export const enumSlice = createSlice({
	name: 'enumSlices',
	initialState: {
		enums: null,
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAllEnums.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchAllEnums.fulfilled, (state, action) => {
				state.loading = false;
				state.enums = action.payload;
			})
			.addCase(fetchAllEnums.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});
