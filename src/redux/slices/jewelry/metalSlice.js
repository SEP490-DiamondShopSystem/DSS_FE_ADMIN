import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../../services/api';

// Async thunk to fetch all metals
export const fetchAllMetals = createAsyncThunk('metals/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/JewelryModel/Metal/All');
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

// Async thunk to update the price of a metal
export const updateMetalPrice = createAsyncThunk('metals/updatePrice', async (metal) => {
  const response = await api.put('/JewelryModel/Metal/UpdatePrice', {
    id: metal.id,
    price: metal.price,
  });
  return response;
});

// Create the metal slice
export const metalSlice = createSlice({
  name: 'metalSlice',
  initialState: {
    metals: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllMetals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllMetals.fulfilled, (state, action) => {
        state.loading = false;
        state.metals = action.payload;
      })
      .addCase(fetchAllMetals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateMetalPrice.fulfilled, (state, action) => {
        const updatedMetal = action.payload;
        const existingMetal = state.metals?.find((metal) => metal.id === updatedMetal.id);
        if (existingMetal) {
          existingMetal.price = updatedMetal.price;
        }
      })
      .addCase(updateMetalPrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
