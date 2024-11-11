import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../../services/api';

// Fetch all promotions
export const fetchPromotions = createAsyncThunk(
	'promotions/fetchPromotions',
	async (_, {rejectWithValue}) => {
		console.log('Fetching promotions...');
		try {
			const response = await api.get('/Promotion');
			return response;
		} catch (error) {
			console.error('Failed to fetch promotions:', error.response?.data || error.message);
			return rejectWithValue(error.response?.data || 'Failed to fetch promotions');
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
			return rejectWithValue(error.response.data || 'Failed to create promotion');
		}
	}
);

// Create a full promotion with details
export const createFullPromotion = createAsyncThunk(
	'promotions/createFullPromotion',
	async (fullPromotion, {rejectWithValue}) => {
		try {
			const response = await api.post('/Promotion/Full', fullPromotion);
			console.log('Creating promotion with data:', fullPromotion);
			return response;
		} catch (error) {
			return rejectWithValue(error.response.data || 'Failed to create full promotion');
		}
	}
);

// Update promotion requirements
export const updatePromotionRequirements = createAsyncThunk(
	'promotions/updatePromotionRequirements',
	async ({promotionId, requirements}, {rejectWithValue}) => {
		try {
			const response = await api.put(`/Promotion/${promotionId}/Requirement`, requirements);
			return response.data;
		} catch (error) {
			if (error.response) {
				// Handle 400 and 500 status codes
				if (error.response.status === 400) {
					return rejectWithValue({status: 400, errors: error.response.data.errors});
				} else if (error.response.status === 500) {
					return rejectWithValue({status: 500, detail: error.response.data.detail});
				}
			}
			return rejectWithValue({status: 'unknown', detail: 'An unexpected error occurred.'});
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
			if (error.response) {
				// Handle 400 and 500 status codes
				if (error.response.status === 400) {
					return rejectWithValue({status: 400, errors: error.response.data.errors});
				} else if (error.response.status === 500) {
					return rejectWithValue({status: 500, detail: error.response.data.detail});
				}
			}
			return rejectWithValue({status: 'unknown', detail: 'An unexpected error occurred.'});
		}
	}
);

// Update a specific promotion
export const updatePromotion = createAsyncThunk(
	'promotions/updatePromotion',
	async ({promotionId, promotionData}, {rejectWithValue}) => {
		try {
			console.log(`Updating promotion with ID ${promotionId} and data:`, promotionData);
			const response = await api.put(`/Promotion/${promotionId}`, promotionData, {
				headers: {
					'Content-Type': 'application/json', // Ensure JSON content type is set
				},
			});
			return response.data;
		} catch (error) {
			if (error.response) {
				// Handle 400 and 500 status codes
				if (error.response.status === 400) {
					return rejectWithValue({status: 400, errors: error.response.data.errors});
				} else if (error.response.status === 500) {
					return rejectWithValue({status: 500, detail: error.response.data.detail});
				}
			}
			return rejectWithValue({status: 'unknown', detail: 'An unexpected error occurred.'});
		}
	}
);

// Delete a promotion
export const deletePromotion = createAsyncThunk(
	'promotions/deletePromotion',
	async (promotionId, {rejectWithValue}) => {
		try {
			await api.delete(`/Promotion/${promotionId}`);
			console.log(`Deleting promotion with ID ${promotionId}`);

			return promotionId;
		} catch (error) {
			if (error.response) {
				// Handle 400 and 500 status codes
				if (error.response.status === 400) {
					return rejectWithValue({status: 400, errors: error.response.data.errors});
				} else if (error.response.status === 500) {
					return rejectWithValue({status: 500, detail: error.response.data.detail});
				}
			}
			return rejectWithValue({status: 'unknown', detail: 'An unexpected error occurred.'});
		}
	}
);

// Pause a promotion
export const pausePromotion = createAsyncThunk(
	'promotions/pausePromotion',
	async (promotionId, {rejectWithValue}) => {
		try {
			const response = await api.patch(`/Promotion/${promotionId}/Pause`);
			return response.data;
		} catch (error) {
			if (error.response) {
				// Handle 400 and 500 status codes
				if (error.response.status === 400) {
					return rejectWithValue({status: 400, errors: error.response.data.errors});
				} else if (error.response.status === 500) {
					return rejectWithValue({status: 500, detail: error.response.data.detail});
				}
			}
			return rejectWithValue({status: 'unknown', detail: 'An unexpected error occurred.'});
		}
	}
);

// Cancel a promotion
export const cancelPromotion = createAsyncThunk(
	'promotions/cancelPromotion',
	async (promotionId, {rejectWithValue}) => {
		try {
			const response = await api.patch(`/Promotion/${promotionId}/Cancel`);
			return response.data;
		} catch (error) {
			if (error.response) {
				// Handle 400 and 500 status codes
				if (error.response.status === 400) {
					return rejectWithValue({status: 400, errors: error.response.data.errors});
				} else if (error.response.status === 500) {
					return rejectWithValue({status: 500, detail: error.response.data.detail});
				}
			}
			return rejectWithValue({status: 'unknown', detail: 'An unexpected error occurred.'});
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
			if (error.response) {
				// Handle 400 and 500 status codes
				if (error.response.status === 400) {
					return rejectWithValue({status: 400, errors: error.response.data.errors});
				} else if (error.response.status === 500) {
					return rejectWithValue({status: 500, detail: error.response.data.detail});
				}
			}
			return rejectWithValue({status: 'unknown', detail: 'An unexpected error occurred.'});
		}
	}
);
// Thunk to upload promotion thumbnail
export const uploadPromotionThumbnail = createAsyncThunk(
	'promotion/uploadThumbnail',
	async ({promotionId, imageFile}, {rejectWithValue}) => {
		const formData = new FormData();
		formData.append('imageFile', imageFile);

		try {
			const response = await axios.put(`/api/Promotion/${promotionId}/Thumbnail`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			return response.data;
		} catch (error) {
			if (error.response) {
				// Handle 400 and 500 status codes
				if (error.response.status === 400) {
					return rejectWithValue({status: 400, errors: error.response.data.errors});
				} else if (error.response.status === 500) {
					return rejectWithValue({status: 500, detail: error.response.data.detail});
				}
			}
			return rejectWithValue({status: 'unknown', detail: 'An unexpected error occurred.'});
		}
	}
);
export const promotionSlice = createSlice({
	name: 'promotionSlice',
	initialState: {
		promotions: null,
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
				console.log('Fetching promotions: pending');
			})
			.addCase(fetchPromotions.fulfilled, (state, action) => {
				state.loading = false;
				state.promotions = action.payload;
				console.log('Fetching promotions: fulfilled', action.payload);
			})
			.addCase(fetchPromotions.rejected, (state, action) => {
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
				const index = state.promotions.findIndex(
					(promo) => promo.Id === action.payload.PromotionId
				);
				if (index !== -1) {
					state.promotions[index].PromoReqs = action.payload.PromoReqs;
				}
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
				state.loading = false;
			})
			.addCase(deletePromotion.fulfilled, (state, action) => {
				state.loading = true;
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
				state.loading = true;
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
				state.loading = false;
			})
			.addCase(cancelPromotion.fulfilled, (state, action) => {
				state.loading = true;
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
				state.loading = false;
			})
			.addCase(updatePromotionThumbnail.fulfilled, (state, action) => {
				state.loading = true;
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
