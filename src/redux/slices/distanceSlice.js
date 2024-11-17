import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '../../services/api';

export const fetchDistances = createAsyncThunk(
	'distances/fetchDistances',
	async (_, {rejectWithValue}) => {
		try {
			const response = await api.get('/Location/Province');
			return response;
		} catch (error) {
			console.log('Error: ', JSON.stringify(error.response.data));
			return rejectWithValue(error.response.data);
		}
	}
);

export const fetchWard = createAsyncThunk(
	'distances/fetchWard',
	async (districtId, {rejectWithValue}) => {
		try {
			const response = await api.get(`/Location/Ward/${districtId}`);
			return response;
		} catch (error) {
			console.log('Error: ', JSON.stringify(error.response.data));
			return rejectWithValue(error.response.data);
		}
	}
);

export const fetchDistrict = createAsyncThunk(
	'distances/fetchDistrict',
	async (provinceId, {rejectWithValue}) => {
		console.log('provinceId', provinceId);

		try {
			const response = await api.get(`/Location/District/${provinceId}`);
			return response;
		} catch (error) {
			console.log('Error: ', JSON.stringify(error.response.data));
			return rejectWithValue(error.response.data);
		}
	}
);

export const handleCalculateLocation = createAsyncThunk(
	'distances/handleCalculateLocation',
	async ({Province, District, Ward, Street}, {rejectWithValue}) => {
		try {
			const formData = new FormData();
			formData.append('Province', Province);
			formData.append('District', District);
			formData.append('Ward', Ward);
			formData.append('Street', Street);
			formData.append('isLocationCalculation', '');
			const response = await api.post(`/DeliveryFee/Calculate/Location`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			console.log(response);

			return response;
		} catch (error) {
			console.log('Error: ', JSON.stringify(error.response.data));
			return rejectWithValue(error.response.data);
		}
	}
);

// Create the distance slice
export const distanceSlice = createSlice({
	name: 'distanceSlice',
	initialState: {
		distances: [],
		ward: null,
		district: null,
		location: null,
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchDistances.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchDistances.fulfilled, (state, action) => {
				state.loading = false;
				state.distances = action.payload;
			})
			.addCase(fetchDistances.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			.addCase(fetchWard.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchWard.fulfilled, (state, action) => {
				state.loading = false;
				state.ward = action.payload;
			})
			.addCase(fetchWard.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			.addCase(fetchDistrict.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchDistrict.fulfilled, (state, action) => {
				state.loading = false;
				state.district = action.payload;
			})
			.addCase(fetchDistrict.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			.addCase(handleCalculateLocation.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(handleCalculateLocation.fulfilled, (state, action) => {
				state.loading = false;
				state.location = action.payload;
			})
			.addCase(handleCalculateLocation.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			});
	},
});

export default distanceSlice.reducer;
