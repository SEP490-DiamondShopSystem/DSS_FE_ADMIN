import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../../services/api';

// Fetch all promotions
export const fetchPromotions = createAsyncThunk(
	'promotions/fetchPromotions',
	async (_, {rejectWithValue}) => {
		try {
			const response = await api.get('/Promotion');
			return response;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);
export const fetchPromotionDetail = createAsyncThunk(
	'promotions/fetchPromotionDetail',
	async (promotionId, {rejectWithValue}) => {
		try {
			const response = await api.get(`/Promotion/${promotionId}`);
			return response;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

// Create a new promotion
export const createPromotion = createAsyncThunk(
	'promotions/createPromotion',
	async (newPromotion, {rejectWithValue}) => {
		try {
			const response = await api.post('/Promotion', newPromotion);

			return response;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

// Create a full promotion with details
export const createFullPromotion = createAsyncThunk(
	'promotions/createFullPromotion',
	async (fullPromotion, {rejectWithValue}) => {
		try {
			const response = await api.post('/Promotion/Full', fullPromotion);
			return response;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

// Update promotion requirements
export const updatePromotionRequirements = createAsyncThunk(
	'promotions/updatePromotionRequirements',
	async ({promotionId, requirements}, {rejectWithValue}) => {
		try {
			const response = await api.put(`/Promotion/${promotionId}/Requirement`, requirements);
			return response;
		} catch (error) {
			return rejectWithValue(error || 'Failed to update promotion');
		}
	}
);

// Update promotion gifts
export const updatePromotionGifts = createAsyncThunk(
	'promotions/updatePromotionGifts',
	async ({promotionId, gifts}, {rejectWithValue}) => {
		try {
			const response = await api.put(`/Promotion/${promotionId}/Gift`, gifts);
			return response.data;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

// Update a specific promotion
export const updatePromotion = createAsyncThunk(
	'promotions/updatePromotion',
	async ({promotionId, promotionData}, {rejectWithValue}) => {
		try {
			const response = await api.put(`/Promotion/${promotionId}`, promotionData, {
				headers: {
					'Content-Type': 'application/json', // Ensure JSON content type is set
				},
			});
			return response;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

// Delete a promotion
export const deletePromotion = createAsyncThunk(
	'promotions/deletePromotion',
	async (promotionId, {rejectWithValue}) => {
		try {
			await api.delete(`/Promotion/${promotionId}`);
			return promotionId;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

// Pause a promotion
export const pausePromotion = createAsyncThunk(
	'promotions/pausePromotion',
	async (promotionId, {rejectWithValue}) => {
		try {
			const response = await api.patch(`/Promotion/${promotionId}/Pause`);
			return response;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

// Cancel a promotion
export const cancelPromotion = createAsyncThunk(
	'promotions/cancelPromotion',
	async (promotionId, {rejectWithValue}) => {
		try {
			const response = await api.patch(`/Promotion/${promotionId}/Cancel`);
			return response;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

// Update promotion thumbnail
export const updatePromotionThumbnail = createAsyncThunk(
	'promotions/updatePromotionThumbnail',
	async ({promotionId, thumbnailData}, {rejectWithValue}) => {
		try {
			const response = await api.put(`/Promotion/${promotionId}/Thumbnail`, thumbnailData);
			return response.data;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

// Thunk to upload promotion thumbnail using multipart/form-data
export const uploadPromotionThumbnail = createAsyncThunk(
	'promotion/uploadThumbnail',
	async ({promotionId, imageFile}, {rejectWithValue}) => {
		try {
			const formData = new FormData();
			formData.append('imageFile', imageFile);
			const response = await api.put(`/Promotion/${promotionId}/Thumbnail`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			return response;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const promotionSlice = createSlice({
	name: 'promotionSlice',
	initialState: {
		promotions: [],
		promotionDetail: null,
		status: 'idle',
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			// Fetch promotions
			.addCase(fetchPromotions.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchPromotions.fulfilled, (state, action) => {
				state.loading = false;
				state.promotions = action.payload;
			})
			.addCase(fetchPromotions.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(fetchPromotionDetail.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchPromotionDetail.fulfilled, (state, action) => {
				state.loading = false;
				state.promotionDetail = action.payload;
			})
			.addCase(fetchPromotionDetail.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			// Create a new promotion
			.addCase(createPromotion.pending, (state) => {
				state.loading = true;
			})
			.addCase(createPromotion.fulfilled, (state, action) => {
				state.loading = false;
				state.promotions.push(action.payload);
			})
			.addCase(createPromotion.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Create a full promotion
			.addCase(createFullPromotion.pending, (state) => {
				state.loading = true;
			})
			.addCase(createFullPromotion.fulfilled, (state, action) => {
				state.loading = false;
				state.promotions.push(action.payload);
			})
			.addCase(createFullPromotion.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Update promotion requirements
			.addCase(updatePromotionRequirements.pending, (state) => {
				state.loading = true;
			})
			.addCase(updatePromotionRequirements.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(updatePromotionRequirements.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Update promotion gifts
			.addCase(updatePromotionGifts.pending, (state) => {
				state.loading = true;
			})
			.addCase(updatePromotionGifts.fulfilled, (state, action) => {
				state.loading = false;
				const index = state.promotions.findIndex(
					(promo) => promo.Id === action.payload.PromotionId
				);
				if (index !== -1) {
					state.promotions[index].Gifts = action.payload.Gifts;
				}
			})
			.addCase(updatePromotionGifts.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Update a promotion
			.addCase(updatePromotion.pending, (state) => {
				state.loading = true;
			})
			.addCase(updatePromotion.fulfilled, (state, action) => {
				state.loading = false;
				if (!Array.isArray(state.promotions)) {
					state.promotions = [];
				}
				const index = state.promotions.findIndex((promo) => promo.Id === action.payload.Id);
				if (index !== -1) {
					state.promotions[index] = action.payload;
				}
			})
			.addCase(updatePromotion.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Delete a promotion
			.addCase(deletePromotion.pending, (state) => {
				state.loading = true;
			})
			.addCase(deletePromotion.fulfilled, (state, action) => {
				state.loading = false;
				state.promotions = state.promotions.filter((promo) => promo.Id !== action.payload);
			})
			.addCase(deletePromotion.rejected, (state, action) => {
				console.error('Delete error:', action.payload);
				state.loading = false;
				state.error = action.payload;
			})

			// Pause a promotion
			.addCase(pausePromotion.pending, (state) => {
				state.loading = true;
			})
			.addCase(pausePromotion.fulfilled, (state, action) => {
				state.loading = false;
				const index = state.promotions.findIndex((promo) => promo.Id === action.payload.Id);
				if (index !== -1) {
					state.promotions[index].Status = 'paused';
				}
			})
			.addCase(pausePromotion.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Cancel a promotion
			.addCase(cancelPromotion.pending, (state) => {
				state.loading = true;
			})
			.addCase(cancelPromotion.fulfilled, (state, action) => {
				state.loading = false;
				const index = state.promotions.findIndex((promo) => promo.Id === action.payload.Id);
				if (index !== -1) {
					state.promotions[index].Status = 'cancelled';
				}
			})
			.addCase(cancelPromotion.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Update promotion thumbnail
			.addCase(updatePromotionThumbnail.pending, (state) => {
				state.loading = true;
			})
			.addCase(updatePromotionThumbnail.fulfilled, (state, action) => {
				state.loading = false;
				const index = state.promotions.findIndex((promo) => promo.Id === action.payload.Id);
				if (index !== -1) {
					state.promotions[index].Thumbnail = action.payload.Thumbnail;
				}
			})
			.addCase(updatePromotionThumbnail.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});
