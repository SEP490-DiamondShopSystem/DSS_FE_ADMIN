import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

// Get all delivery fees
export const fetchDeliveryFees = createAsyncThunk(
  'deliveryFee/fetchAll',
  async ({ isLocation }) => {
    const response = await api.get('/DeliveryFee/All', {
      params: { isLocation: isLocation },
    });
    return response;
  }
);

// Calculate delivery fee
export const calculateDeliveryFee = createAsyncThunk(
  'deliveryFee/calculate',
  async (params) => {
    const response = await api.post('/DeliveryFee/Calculate', params);
    return response;
  }
);

// Calculate delivery fee based on location
export const calculateDeliveryFeeByLocation = createAsyncThunk(
  'deliveryFee/calculateLocation',
  async (location) => {
    const response = await api.post('/DeliveryFee/Calculate/Location', location);
    return response;
  }
);

// Add new delivery fee
export const addDeliveryFee = createAsyncThunk(
  'deliveryFee/add',
  async (deliveryFee) => {
    const response = await api.post('/DeliveryFee', deliveryFee);
    return response;
  }
);

// Update delivery fee
export const updateDeliveryFee = createAsyncThunk(
  'deliveryFee/update',
  async (deliveryFee) => {
    const response = await api.put('/DeliveryFee', deliveryFee);
    return response;
  }
);

export const deleteDeliveryFee = createAsyncThunk(
  'deliveryFee/delete',
  async (id) => {
    const payload = {
      deliveryFeeIds: [id], // Wrap the ID in an array
    };
    const response = await api.delete('/DeliveryFee', {
      data: payload, // Send the payload in the request body
    });
    return id; // Return the id so the reducer can handle the deletion
  }
);

// Set delivery fee active/inactive
export const setActiveDeliveryFee = createAsyncThunk(
  'deliveryFee/setActive',
  async (id) => {
    const response = await api.put(`/DeliveryFee/SetActive`, { id });
    return response;
  }
);

// Slice
export const deliveryFeeSlice = createSlice({
  name: 'deliveryFee',
  initialState: {
    fees: [],
    loading: false,
    error: null,
    activeFee: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Handling fetch all delivery fees
    builder.addCase(fetchDeliveryFees.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchDeliveryFees.fulfilled, (state, action) => {
      state.loading = false;
      state.fees = action.payload;
    });
    builder.addCase(fetchDeliveryFees.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Handling calculate delivery fee
    builder.addCase(calculateDeliveryFee.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(calculateDeliveryFee.fulfilled, (state, action) => {
      state.loading = false;
      // Handle the calculated fee data if necessary
    });
    builder.addCase(calculateDeliveryFee.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Handling calculate delivery fee by location
    builder.addCase(calculateDeliveryFeeByLocation.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(calculateDeliveryFeeByLocation.fulfilled, (state, action) => {
      state.loading = false;
      // Handle the location-based fee data if necessary
    });
    builder.addCase(calculateDeliveryFeeByLocation.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Handling add delivery fee
    builder.addCase(addDeliveryFee.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addDeliveryFee.fulfilled, (state, action) => {
      state.loading = false;
      state.fees.push(action.payload); // Add new fee to the list
    });
    builder.addCase(addDeliveryFee.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Handling update delivery fee
    builder.addCase(updateDeliveryFee.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateDeliveryFee.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.fees.findIndex((fee) => fee.id === action.payload.id);
      if (index !== -1) {
        state.fees[index] = action.payload; // Update the fee
      }
    });
    builder.addCase(updateDeliveryFee.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Handling delete delivery fee
    builder.addCase(deleteDeliveryFee.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteDeliveryFee.fulfilled, (state, action) => {
      state.loading = false;
      state.fees = state.fees.filter((fee) => fee.id !== action.payload); // Remove deleted fee
    });
    builder.addCase(deleteDeliveryFee.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Handling set active delivery fee
    builder.addCase(setActiveDeliveryFee.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(setActiveDeliveryFee.fulfilled, (state, action) => {
      state.loading = false;
      state.activeFee = action.payload; // Set active fee
    });
    builder.addCase(setActiveDeliveryFee.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});
