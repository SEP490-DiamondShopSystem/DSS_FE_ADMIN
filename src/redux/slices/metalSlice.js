import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api';

// Async thunk to fetch all metals
export const fetchAllMetals = createAsyncThunk('metals/fetchAll', async () => {
  const response = await api.get('/JewelryModel/Metal/All');
  return response.data;
});

// Async thunk to update the price of a metal
export const updateMetalPrice = createAsyncThunk('metals/updatePrice', async (metal) => {
  const response = await api.put('/UpdatePrice', {
    id: metal.id,
    price: metal.price,
  });
  return response.data;
});

// Create the metal slice
export const metalSlice = createSlice({
  name: 'metalSlice',
  initialState: {
    metals: [],
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllMetals.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllMetals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Add any fetched metals to the array
        state.metals = action.payload;
      })
      .addCase(fetchAllMetals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateMetalPrice.fulfilled, (state, action) => {
        const updatedMetal = action.payload;
        const existingMetal = state.metals.find(metal => metal.id === updatedMetal.id);
        if (existingMetal) {
          existingMetal.price = updatedMetal.price;
        }
      })
      .addCase(updateMetalPrice.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

