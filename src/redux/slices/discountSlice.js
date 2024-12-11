import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../../services/api';

// Fetch all discounts
export const fetchDiscounts = createAsyncThunk(
	'discounts/fetchDiscounts',
	async (_, {rejectWithValue}) => {
		console.log('Fetching discounts...');

		const response = await api.get('/Discount');
		return response;
	}
);
export const fetchDiscountDetail = createAsyncThunk(
	'discounts/fetchDiscountDetail',
	async (discountId, {rejectWithValue}) => {
		console.log('Fetching discounts...');

		const response = await api.get(`/Discount/${discountId}`);

		// Log the fetched data here
		console.log('Fetched discount details:', response);

		return response;
	}
);

// Create a new discount
export const createDiscount = createAsyncThunk(
	'discounts/createDiscount',
	async (newDiscount, {rejectWithValue}) => {
		const response = await api.post('/Discount', newDiscount);

		return response;
	}
);

// Create a full discount with details
export const createFullDiscount = createAsyncThunk(
	'discounts/createFullDiscount',
	async (fullDiscount, {rejectWithValue}) => {
		const response = await api.post('/Discount/Full', fullDiscount);
		console.log('Creating discount with data:', fullDiscount);
		return response;
	}
);

// Update discount requirements
export const updateDiscountRequirements = createAsyncThunk(
	'discounts/updateDiscountRequirements',
	async ({discountId, requirements}, {rejectWithValue}) => {
		const response = await api.put(`/Discount/${discountId}/Requirement`, requirements);
		return response;
	}
);

// Update a specific discount
export const updateDiscount = createAsyncThunk(
	'discounts/updateDiscount',
	async ({discountId, discountData}, {rejectWithValue}) => {
		console.log(`Updating discount with ID ${discountId} and data:`, discountData);
		const response = await api.put(`/Discount/${discountId}`, discountData, {
			headers: {
				'Content-Type': 'application/json', // Ensure JSON content type is set
			},
		});
		return response;
	}
);

// Delete a discount
export const deleteDiscount = createAsyncThunk(
	'discounts/deleteDiscount',
	async (discountId, {rejectWithValue}) => {
		await api.delete(`/Discount/${discountId}`);
		console.log(`Deleting discount with ID ${discountId}`);

		return response;
	}
);

// Pause a discount
export const pauseDiscount = createAsyncThunk(
	'discounts/pauseDiscount',
	async (discountId, {rejectWithValue}) => {
		const response = await api.patch(`/Discount/${discountId}/Pause`);
		return response;
	}
);

// Cancel a discount
export const cancelDiscount = createAsyncThunk(
	'discounts/cancelDiscount',
	async (discountId, {rejectWithValue}) => {
		const response = await api.patch(`/Discount/${discountId}/Cancel`);
		return response;
	}
);

// Update discount thumbnail
export const updateDiscountThumbnail = createAsyncThunk(
	'discounts/updateDiscountThumbnail',
	async ({discountId, thumbnailData}, {rejectWithValue}) => {
		try {
			const response = await api.put(`/Discount/${discountId}/Thumbnail`, thumbnailData);
			return response;
		} catch (error) {
			if (error.response) {
				// Handle 400 and 500 status codes
				if (error.response.status === 400) {
					return rejectWithValue({status: 400, errors: error.errors});
				} else if (error.response.status === 500) {
					return rejectWithValue({status: 500, detail: error.detail});
				}
			}
			return rejectWithValue({status: 'unknown', detail: 'An unexpected error occurred.'});
		}
	}
);
// Thunk to upload discount thumbnail
export const uploadDiscountThumbnail = createAsyncThunk(
	'discount/uploadThumbnail',
	async ({discountId, imageFile}, {rejectWithValue}) => {
		try {
			const formData = new FormData();
			formData.append('imageFile', imageFile);
			console.log('Uploading thumbnail with FormData:', formData);
			const response = await api.put(`/Discount/${discountId}/Thumbnail`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data || {status: 'unknown', detail: 'Failed to upload thumbnail'}
			);
		}
	}
);
export const discountSlice = createSlice({
	name: 'discountSlice',
	initialState: {
		discounts: [],
		discountDetail: null,
		status: 'idle',
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			// Fetch discounts
			.addCase(fetchDiscounts.pending, (state) => {
				state.loading = true;
				console.log('Fetching discounts: pending');
			})
			.addCase(fetchDiscounts.fulfilled, (state, action) => {
				state.loading = false;
				state.discounts = action.payload;
				console.log('Fetching discounts: fulfilled', action.payload);
			})
			.addCase(fetchDiscounts.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(fetchDiscountDetail.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchDiscountDetail.fulfilled, (state, action) => {
				state.loading = false;
				state.discountDetail = action.payload;
			})
			.addCase(fetchDiscountDetail.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			// Create a new discount
			.addCase(createDiscount.pending, (state) => {
				state.loading = true;
			})
			.addCase(createDiscount.fulfilled, (state, action) => {
				state.loading = false;
				state.discounts.push(action.payload);
			})
			.addCase(createDiscount.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Create a full discount
			.addCase(createFullDiscount.pending, (state) => {
				state.loading = true;
			})
			.addCase(createFullDiscount.fulfilled, (state, action) => {
				state.loading = false;
				state.discounts.push(action.payload);
			})
			.addCase(createFullDiscount.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Update discount requirements
			.addCase(updateDiscountRequirements.pending, (state) => {
				state.loading = true;
			})
			.addCase(updateDiscountRequirements.fulfilled, (state, action) => {
				state.loading = false;
				const index = state.discounts.findIndex(
					(promo) => promo.Id === action.payload.DiscountId
				);
				if (index !== -1) {
					state.discounts[index].PromoReqs = action.payload.PromoReqs;
				}
			})
			.addCase(updateDiscountRequirements.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Update a discount
			.addCase(updateDiscount.pending, (state) => {
				state.loading = true;
			})
			.addCase(updateDiscount.fulfilled, (state, action) => {
				state.loading = false;
				const index = state.discounts.findIndex((promo) => promo.Id === action.payload.Id);
				if (index !== -1) {
					state.discounts[index] = action.payload;
				}
			})
			.addCase(updateDiscount.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Delete a discount
			.addCase(deleteDiscount.pending, (state) => {
				state.loading = true;
			})
			.addCase(deleteDiscount.fulfilled, (state, action) => {
				state.loading = false;
				state.discounts = state.discounts.filter((promo) => promo.Id !== action.payload);
			})
			.addCase(deleteDiscount.rejected, (state, action) => {
				console.error('Delete error:', action.payload);
				state.loading = false;
				state.error = action.payload;
			})

			// Pause a discount
			.addCase(pauseDiscount.pending, (state) => {
				state.loading = true;
			})
			.addCase(pauseDiscount.fulfilled, (state, action) => {
				state.loading = false;
				const index = state.discounts.findIndex((promo) => promo.Id === action.payload.Id);
				if (index !== -1) {
					state.discounts[index].Status = 'paused';
				}
			})
			.addCase(pauseDiscount.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Cancel a discount
			.addCase(cancelDiscount.pending, (state) => {
				state.loading = true;
			})
			.addCase(cancelDiscount.fulfilled, (state, action) => {
				state.loading = false;
				const index = state.discounts.findIndex((promo) => promo.Id === action.payload.Id);
				if (index !== -1) {
					state.discounts[index].Status = 'cancelled';
				}
			})
			.addCase(cancelDiscount.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Update discount thumbnail
			.addCase(updateDiscountThumbnail.pending, (state) => {
				state.loading = true;
			})
			.addCase(updateDiscountThumbnail.fulfilled, (state, action) => {
				state.loading = false;
				const index = state.discounts.findIndex((promo) => promo.Id === action.payload.Id);
				if (index !== -1) {
					state.discounts[index].Thumbnail = action.payload.Thumbnail;
				}
			})
			.addCase(updateDiscountThumbnail.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});
