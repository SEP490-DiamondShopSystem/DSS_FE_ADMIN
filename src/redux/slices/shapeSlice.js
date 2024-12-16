import {createAsyncThunk, createSlice, configureStore} from '@reduxjs/toolkit';
import {api} from '../../services/api';

// GET /api/Diamond/Price/PriceBoard
export const fetchAllShapes = createAsyncThunk('shapes/fetchAll', async (_, {rejectWithValue}) => {
	try {
		const response = await api.get('/Diamond/Shape/All');
		return response;
	} catch (error) {
		return rejectWithValue(error);
	}
});
export const shapeSlice = createSlice({
	name: 'shapeSlices',
	initialState: {
		shapes: null,
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAllShapes.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchAllShapes.fulfilled, (state, action) => {
				state.loading = false;
				state.shapes = action.payload;
			})
			.addCase(fetchAllShapes.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});