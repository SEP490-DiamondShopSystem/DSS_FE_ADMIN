import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

// Async Thunks

// Fetch all diamond criteria
export const fetchAllCriteria = createAsyncThunk(
  'criteriaRange/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/Diamond/Criteria/All');
      return response;
    } catch (error) {
      return rejectWithValue(error.response || error.message);
    }
  }
);

// Create a main diamond criteria range
export const createMainDiamondRange = createAsyncThunk(
  'criteriaRange/createMain',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post('/Diamond/Criteria/Range/MainDiamond', payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response || error.message);
    }
  }
);

// Delete a main diamond criteria range
export const deleteMainDiamondRange = createAsyncThunk(
  'criteriaRange/deleteMain',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.delete('/Diamond/Criteria/Range/MainDiamond', { data: payload });
      return response;
    } catch (error) {
      return rejectWithValue(error.response || error.message);
    }
  }
);

// Create a side diamond criteria range
export const createSideDiamondRange = createAsyncThunk(
  'criteriaRange/createSide',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post('/Diamond/Criteria/Range/SideDiamond', payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response || error.message);
    }
  }
);

// Delete a side diamond criteria range
export const deleteSideDiamondRange = createAsyncThunk(
  'criteriaRange/deleteSide',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.delete('/Diamond/Criteria/Range/SideDiamond', { data: payload });
      return response;
    } catch (error) {
      return rejectWithValue(error.response || error.message);
    }
  }
);

// Update a criteria range
export const updateCriteriaRange = createAsyncThunk(
  'criteriaRange/update',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.put('/Diamond/Criteria/Range', payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response || error.message);
    }
  }
);

// Slice
export const criteriaRangeSlice = createSlice({
  name: 'criteriaRange',
  initialState: {
    criteria: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Criteria
      .addCase(fetchAllCriteria.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCriteria.fulfilled, (state, action) => {
        state.loading = false;
        state.criteria = action.payload;
      })
      .addCase(fetchAllCriteria.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Main Diamond Range
      .addCase(createMainDiamondRange.fulfilled, (state, action) => {
        state.criteria.push(action.payload);
      })
      .addCase(createMainDiamondRange.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete Main Diamond Range
      .addCase(deleteMainDiamondRange.fulfilled, (state, action) => {
        state.criteria = state.criteria.filter((item) => item.id !== action.payload.id);
      })
      .addCase(deleteMainDiamondRange.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Create Side Diamond Range
      .addCase(createSideDiamondRange.fulfilled, (state, action) => {
        state.criteria.push(action.payload);
      })
      .addCase(createSideDiamondRange.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete Side Diamond Range
      .addCase(deleteSideDiamondRange.fulfilled, (state, action) => {
        state.criteria = state.criteria.filter((item) => item.id !== action.payload.id);
      })
      .addCase(deleteSideDiamondRange.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update Criteria Range
      .addCase(updateCriteriaRange.fulfilled, (state, action) => {
        const index = state.criteria.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) state.criteria[index] = action.payload;
      })
      .addCase(updateCriteriaRange.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

