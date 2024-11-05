import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../../../services/api';

export const fetchAllJewelryModelCategories = createAsyncThunk(
	'jewelryModelCategories/fetchAll',
	async () => {
		const response = await api.get('/JewelryModelCategory/All');
		return response;
	}
);

export const createJewelryModelCategory = createAsyncThunk(
	'jewelryModelCategories/create',
	async (category) => {
		const response = await api.post('/JewelryModelCategory/Create', {
			name: category.name,
			description: category.description,
			isGeneral: category.isGeneral,
			parentCategoryId: category.parentCategoryId,
		});
		return response;
	}
);

export const jewelryModelCategorySlice = createSlice({
	name: 'jewelryModelCategories',
	initialState: {
		categories: [],
		status: 'idle', // idle | loading | succeeded | failed
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAllJewelryModelCategories.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchAllJewelryModelCategories.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.categories = action.payload;
			})
			.addCase(fetchAllJewelryModelCategories.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			})
			.addCase(createJewelryModelCategory.fulfilled, (state, action) => {
				state.categories.push(action.payload);
			})
			.addCase(createJewelryModelCategory.rejected, (state, action) => {
				state.error = action.error.message;
			});
	},
});
