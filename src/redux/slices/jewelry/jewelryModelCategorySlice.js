import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../../services/api';

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
    loading: false, // false -> loading state is off, true -> loading state is on
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllJewelryModelCategories.pending, (state) => {
        state.loading = true; // Set loading to true when loading
        console.log('Fetching all jewelry model categories...'); // Debug log
      })
      .addCase(fetchAllJewelryModelCategories.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false when done loading
        console.log('Successfully fetched jewelry model categories:', action.payload); // Debug log
        state.categories = action.payload;
      })
      .addCase(fetchAllJewelryModelCategories.rejected, (state, action) => {
        state.loading = false; // Set loading to false when done loading
        console.log('Failed to fetch jewelry model categories:', action.error.message); // Debug log
        state.error = action.error.message;
      })
      .addCase(createJewelryModelCategory.fulfilled, (state, action) => {
        console.log('Created new jewelry model category:', action.payload); // Debug log
        state.categories.push(action.payload);
      })
      .addCase(createJewelryModelCategory.rejected, (state, action) => {
        console.log('Failed to create jewelry model category:', action.error.message); // Debug log
        state.error = action.error.message;
      });
  },
});
