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
export const deleteJewelryModelCategory = createAsyncThunk(
	'jewelryModelCategories/delete',
	async (categoryId) => {
		const response = await api.delete('/JewelryModelCategory/Delete', {
			params: {CategoryId: categoryId},
		});
		return categoryId;
	}
);
export const jewelryModelCategorySlice = createSlice({
	name: 'jewelryModelCategories',
	initialState: {
		categories: [],
		loading: false, // false -> loading state is off, true -> loading state is on
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAllJewelryModelCategories.pending, (state) => {
				state.loading = true; // Set loading to true when loading
			})
			.addCase(fetchAllJewelryModelCategories.fulfilled, (state, action) => {
				state.loading = false; // Set loading to false when done loading
				state.categories = action.payload;
			})
			.addCase(fetchAllJewelryModelCategories.rejected, (state, action) => {
				state.loading = false; // Set loading to false when done loading
				state.error = action.error.message;
			})
			.addCase(createJewelryModelCategory.fulfilled, (state, action) => {
				state.categories.push(action.payload);
			})
			.addCase(createJewelryModelCategory.rejected, (state, action) => {
				state.error = action.error.message;
			}) // Handling delete category
			.addCase(deleteJewelryModelCategory.fulfilled, (state, action) => {
				state.categories = state.categories.filter(
					(category) => category.id !== action.payload
				);
			})
			.addCase(deleteJewelryModelCategory.rejected, (state, action) => {
				state.error = action.error.message;
			});
	},
});
