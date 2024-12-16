import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '../../services/api';

// Get all delivery fees
export const fetchAllLocations = createAsyncThunk(
	'locationSlice/fetchAll',
	async (_, {rejectWithValue}) => {
		try {
			const response = await api.get('/Location/Province');
			return response;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);
export const locationSlice = createSlice({
	name: 'locationSlice',
	initialState: {
		locations: [],
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		// Handling fetch all delivery fees
		builder.addCase(fetchAllLocations.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(fetchAllLocations.fulfilled, (state, action) => {
			state.loading = false;
			state.locations = action.payload;
		});
		builder.addCase(fetchAllLocations.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message;
		});
	},
});
