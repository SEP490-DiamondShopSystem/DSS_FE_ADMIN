import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api';

// Async thunk to fetch all jewelry model categories
export const fetchAllJewelryModelCategories = createAsyncThunk('jewelryModelCategories/fetchAll', async () => {
  const response = await api.get('/JewelryModelCategory/All');
  return response.data;
});

// Async thunk to create a new jewelry model category
export const createJewelryModelCategory = createAsyncThunk('jewelryModelCategories/create', async (category) => {
  const response = await api.post('/JewelryModelCategory/Create', {
    name: category.name,
    description: category.description,
    isGeneral: category.isGeneral,
    parentCategoryId: category.parentCategoryId,
  });
  return response.data;
});

// Create the jewelry model category slice
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
        // Add any fetched categories to the array
        state.categories = action.payload;
      })
      .addCase(fetchAllJewelryModelCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createJewelryModelCategory.fulfilled, (state, action) => {
        // Add the new category to the categories array
        state.categories.push(action.payload);
      })
      .addCase(createJewelryModelCategory.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});