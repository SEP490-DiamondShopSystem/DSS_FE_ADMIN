import {createAsyncThunk, createSlice, configureStore} from '@reduxjs/toolkit';
import {api} from '../../services/api';

export const fetchPriceBoard = createAsyncThunk(
	'diamondPrice/fetchPriceBoard',
	async ({shapeId, isLabDiamond, cut, isSideDiamond}, {rejectWithValue}) => {
		try {
			const response = await api.get('/Diamond/Price/PriceBoard', {
				params: {
					shapeId,
					isLabDiamond,
					cut,
					isSideDiamond,
				},
			});
			return response;
		} catch (error) {
			console.error('Error fetching price board:', error);
			return rejectWithValue(error || error.message);
		}
	}
);

export const fetchDiamondPrices = createAsyncThunk(
	'diamondPrice/fetchDiamondPrices',
	async ({diamondShapeId, pageSize, start}, {rejectWithValue}) => {
		try {
			const response = await api.get('/Diamond/Price', {
				params: {
					diamondShapeId,
					pageSize,
					start,
				},
			});
			return response;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const createDiamondPrice = createAsyncThunk(
	'diamondPrice/createDiamondPrice',
	async ({listPrices, shapeId, isSideDiamond, isLabDiamond}, {rejectWithValue}) => {
		try {
			console.log('Sending listPrices to API:', {
				listPrices,
				shapeId,
				isLabDiamond,
				isSideDiamond,
			});

			const response = await api.post('/Diamond/Price', {
				listPrices,
				shapeId,
				isLabDiamond,
				isSideDiamond,
			});

			console.log('Response from creating diamond prices:', response);
			return response.data || response;
		} catch (error) {
			console.error('Error creating diamond prices:', error);
			return rejectWithValue(error);
		}
	}
);

// PUT /api/Diamond/Price
export const updateDiamondPrices = createAsyncThunk(
	'diamondPrice/updateDiamondPrices',
	async ({updatedDiamondPrices, shapeId, isLabDiamond, isSideDiamond}, {rejectWithValue}) => {
		try {
			console.log('Sending updatedDiamondPrices to API:', {
				updatedDiamondPrices,
				shapeId,
				isLabDiamond,
				isSideDiamond,
			});

			const response = await api.put('/Diamond/Price', {
				updatedDiamondPrices,
				shapeId,
				isLabDiamond,
				isSideDiamond,
			});

			console.log('Response from updating diamond prices:', response);

			return response.data || response;
		} catch (error) {
			console.error('Error updating diamond prices:', error);
			return rejectWithValue(error);
		}
	}
);

export const fetchDiamondPriceByShape = createAsyncThunk(
	'diamondPrice/fetchDiamondPriceByShape',
	async ({shapeId, isLabDiamond}, {rejectWithValue}) => {
		try {
			const response = await api.get('/Diamond/Price/Shape', {
				params: {shapeId, isLabDiamond},
			});
			return response;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);
export const deleteDiamondPrice = createAsyncThunk(
	'diamondPrice/deleteDiamondPrice',
	async ({priceIds, shapeId, isLabDiamond, isSideDiamond}, {rejectWithValue}) => {
		try {
			console.log('Sending delete request with:', {
				priceIds,
				shapeId,
				isLabDiamond,
				isSideDiamond,
			});

			const response = await api.delete('/Diamond/Price', {
				data: {
					priceIds,
					shapeId,
					isLabDiamond,
					isSideDiamond,
				},
			});

			console.log('Response from delete diamond prices:', response);

			return response.data || response;
		} catch (error) {
			console.error('Error deleting diamond prices:', error);

			if (error) {
				return rejectWithValue(error.data);
			}
			return rejectWithValue({
				type: 'Unknown Error',
				title: 'Error occurred during deletion',
				status: 500,
				detail: error.message,
			});
		}
	}
);

// DELETE /api/Diamond/Price/{shapeId}/{criteriaId}
export const deleteDiamondPriceShape = createAsyncThunk(
	'diamondPrice/deleteDiamondPrice',
	async ({shapeId, criteriaId}, {rejectWithValue}) => {
		try {
			const response = await api.delete(`/Diamond/Price/${shapeId}/${criteriaId}`);
			return response;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const fetchDiamondCriteria = createAsyncThunk(
	'diamondPrice/fetchDiamondCriteria',
	async (_, {rejectWithValue}) => {
		try {
			const response = await api.get('/Diamond/Criteria/All');
			return response;
		} catch (error) {
			console.error('Error fetching price board:', error);
			return rejectWithValue(error || error.message);
		}
	}
);

// POST /api/Diamond/Criteria/Range/MainDiamond
export const createMainDiamondCriteria = createAsyncThunk(
	'diamondPrice/createMainDiamondCriteria',
	async ({caratFrom, caratTo, diamondShapeId, isSideDiamond}, {rejectWithValue}) => {
		try {
			const response = await api.post('/Diamond/Criteria/Range/MainDiamond', {
				caratFrom,
				caratTo,
				diamondShapeId,
				isSideDiamond,
			});
			return response.data || response;
		} catch (error) {
			console.error('Error creating Main Diamond criteria:', error);
			return rejectWithValue(error.message || error);
		}
	}
);

// DELETE /api/Diamond/Criteria/Range/MainDiamond
export const deleteMainDiamondCriteria = createAsyncThunk(
	'diamondPrice/deleteMainDiamondCriteria',
	async ({caratFrom, caratTo, diamondShapeId, isSideDiamond}, {rejectWithValue}) => {
		try {
			const response = await api.delete('/Diamond/Criteria/Range/MainDiamond', {
				data: {caratFrom, caratTo, diamondShapeId, isSideDiamond},
			});
			return response.data || response;
		} catch (error) {
			console.error('Error deleting Main Diamond criteria:', error);
			return rejectWithValue(error.message || error);
		}
	}
);

// POST /api/Diamond/Criteria/Range/SideDiamond
export const createSideDiamondCriteria = createAsyncThunk(
	'diamondPrice/createSideDiamondCriteria',
	async ({caratFrom, caratTo, diamondShapeId, isSideDiamond}, {rejectWithValue}) => {
		try {
			const response = await api.post('/Diamond/Criteria/Range/SideDiamond', {
				caratFrom,
				caratTo,
				diamondShapeId,
				isSideDiamond,
			});
			return response.data || response;
		} catch (error) {
			console.error('Error creating Side Diamond criteria:', error);
			return rejectWithValue(error.message || error);
		}
	}
);

// DELETE /api/Diamond/Criteria/Range/SideDiamond
export const deleteSideDiamondCriteria = createAsyncThunk(
	'diamondPrice/deleteSideDiamondCriteria',
	async ({caratFrom, caratTo, diamondShapeId, isSideDiamond}, {rejectWithValue}) => {
		try {
			const response = await api.delete('/Diamond/Criteria/Range/SideDiamond', {
				data: {caratFrom, caratTo, diamondShapeId, isSideDiamond},
			});
			return response.data || response;
		} catch (error) {
			console.error('Error deleting Side Diamond criteria:', error);
			return rejectWithValue(error.message || error);
		}
	}
);

// Initial state
const initialState = {
	priceBoard: [],
	prices: [],
	shapes: [],
	loading: false,
	error: null,
};

// Slice
export const diamondPriceSlice = createSlice({
	name: 'diamondPrice',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchPriceBoard.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchPriceBoard.fulfilled, (state, action) => {
				state.loading = false;
				state.priceBoard = action.payload.data || action.payload;
				console.log('Price board data fetched successfully:', action.payload); // Log the fetched data
			})
			.addCase(fetchPriceBoard.rejected, (state, action) => {
				state.loading = false;
				const errorMsg = action.payload ? action.payload : 'An error occurred'; // Better error handling
				console.error('Failed to fetch price board:', errorMsg); // Log the error message
				state.error = errorMsg;
			})
			.addCase(fetchDiamondCriteria.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchDiamondCriteria.fulfilled, (state, action) => {
				state.loading = false;
				state.criteria = action.payload.data || action.payload;
			})
			.addCase(fetchDiamondCriteria.rejected, (state, action) => {
				state.loading = false;
				const errorMsg = action.payload ? action.payload : 'An error occurred'; // Better error handling
				state.error = errorMsg;
			})

			.addCase(fetchDiamondPrices.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchDiamondPrices.fulfilled, (state, action) => {
				state.loading = false;
				state.prices = action.payload.data || action.payload;
			})
			.addCase(fetchDiamondPrices.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			.addCase(createDiamondPrice.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createDiamondPrice.fulfilled, (state, action) => {
				state.loading = false;
				state.prices.push(action.payload.data || action.payload);
			})
			.addCase(createDiamondPrice.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			.addCase(updateDiamondPrices.pending, (state) => {
				state.loading = true;
				state.error = null;
			})

			.addCase(updateDiamondPrices.fulfilled, (state, action) => {
				state.loading = false;
				const updatedPrices = action.payload.data || action.payload; // Make sure this is correct

				console.log('Response from updating diamond prices:', updatedPrices); // Log the response

				if (Array.isArray(updatedPrices) && updatedPrices.length > 0) {
					updatedPrices.forEach((updatedPrice) => {
						const index = state.prices.findIndex(
							(price) => price.diamondCriteriaId === updatedPrice.diamondCriteriaId
						);
						if (index !== -1) {
							// Update existing price
							state.prices[index] = updatedPrice;
						} else {
							console.warn(
								`Price with diamondCriteriaId ${updatedPrice.diamondCriteriaId} not found.`
							);
						}
					});
				} else {
					console.warn('No updated prices returned from the API.');
				}

				console.log('Updated diamond prices:', state.prices); // Log the updated prices array
			})

			.addCase(updateDiamondPrices.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			.addCase(fetchDiamondPriceByShape.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchDiamondPriceByShape.fulfilled, (state, action) => {
				state.loading = false;
				state.shapes = action.payload.data || action.payload;
			})
			.addCase(fetchDiamondPriceByShape.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			.addCase(deleteDiamondPrice.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteDiamondPrice.fulfilled, (state, action) => {
				state.loading = false;
				// Ensure shapeId and criteriaId are present in action.payload or adjust as needed
				const {criteriaId} = action.payload || action.meta.arg;
				state.prices = state.prices.filter((price) => price.criteriaId !== criteriaId);
			})
			.addCase(deleteDiamondPrice.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(createMainDiamondCriteria.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createMainDiamondCriteria.fulfilled, (state, action) => {
				state.loading = false;
				console.log('Main Diamond criteria created successfully:', action.payload);
				state.prices.push(action.payload);
			})
			.addCase(createMainDiamondCriteria.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(deleteMainDiamondCriteria.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteMainDiamondCriteria.fulfilled, (state, action) => {
				state.loading = false;
				console.log('Main Diamond criteria deleted successfully:', action.payload);
				state.prices = state.prices.filter(
					(criteria) => criteria.id !== action.meta.arg.criteriaId
				);
			})
			.addCase(deleteMainDiamondCriteria.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(createSideDiamondCriteria.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createSideDiamondCriteria.fulfilled, (state, action) => {
				state.loading = false;
				console.log('Side Diamond criteria created successfully:', action.payload);
				state.prices.push(action.payload);
			})
			.addCase(createSideDiamondCriteria.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(deleteSideDiamondCriteria.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteSideDiamondCriteria.fulfilled, (state, action) => {
				state.loading = false;
				console.log('Side Diamond criteria deleted successfully:', action.payload);
				state.prices = state.prices.filter(
					(criteria) => criteria.id !== action.meta.arg.criteriaId
				);
			})
			.addCase(deleteSideDiamondCriteria.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});
