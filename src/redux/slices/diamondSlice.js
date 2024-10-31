import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../../services/api';

export const getAllDiamond = createAsyncThunk(
	'diamondSlice/getAllDiamond',
	async (_, {rejectWithValue}) => {
		try {
			const response = await api.get(`/Diamond/All/Admin`);
			return response;
		} catch (error) {
			console.log('Error: ', JSON.stringify(error.response.data));
			return rejectWithValue(error.response.data);
		}
	}
);

export const getDiamondDetail = createAsyncThunk(
	'diamondSlice/getDiamondDetail',
	async (id, {rejectWithValue}) => {
		console.log(id);

		try {
			const response = await api.get(`/Diamond/${id}`);
			console.log(response);

			return response;
		} catch (error) {
			console.log('Error: ', JSON.stringify(error.response.data));
			return rejectWithValue(error.response.data);
		}
	}
);

export const getDiamondShape = createAsyncThunk(
	'diamondSlice/getDiamondShape',
	async (id, {rejectWithValue}) => {
		console.log(id);

		try {
			const response = await api.get(`/Diamond/Shape/All`);
			console.log(response);

			return response;
		} catch (error) {
			console.log('Error: ', JSON.stringify(error.response.data));
			return rejectWithValue(error.response.data);
		}
	}
);

export const handleAddDiamond = createAsyncThunk(
	'diamondSlice/handleAddDiamond',
	async (params, {rejectWithValue}) => {
		console.log('params', params);

		try {
			const response = await api.post(`/Diamond`, params);
			console.log(response);

			return response;
		} catch (error) {
			console.log('Error: ', JSON.stringify(error.response.data));
			return rejectWithValue(error.response.data);
		}
	}
);
export const handleDeleteDiamond = createAsyncThunk(
	'diamondSlice/handleDeleteDiamond',
	async (id, {rejectWithValue}) => {
		try {
			const response = await api.delete(`/Diamond/${id}`);
			console.log(response);

			return response;
		} catch (error) {
			console.log('Error: ', JSON.stringify(error.response.data));
			return rejectWithValue(error.response.data);
		}
	}
);

export const diamondSlice = createSlice({
	name: 'diamondSlice',
	initialState: {
		diamonds: null,
		diamondDetail: null,
		diamondShape: null,
		loading: false,
		error: null,
	},
	reducers: {
		setUser: (state, action) => {
			state.userInfo = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getAllDiamond.pending, (state) => {
				state.loading = true;
			})
			.addCase(getAllDiamond.fulfilled, (state, action) => {
				state.loading = false;
				state.diamonds = action.payload;
			})
			.addCase(getAllDiamond.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(getDiamondDetail.pending, (state) => {
				state.loading = true;
			})
			.addCase(getDiamondDetail.fulfilled, (state, action) => {
				state.loading = false;
				state.diamondDetail = action.payload;
			})
			.addCase(getDiamondDetail.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(getDiamondShape.pending, (state) => {
				state.loading = true;
			})
			.addCase(getDiamondShape.fulfilled, (state, action) => {
				state.loading = false;
				state.diamondShape = action.payload;
			})
			.addCase(getDiamondShape.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(handleAddDiamond.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleAddDiamond.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(handleAddDiamond.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(handleDeleteDiamond.pending, (state) => {
				state.loading = true;
			})
			.addCase(handleDeleteDiamond.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(handleDeleteDiamond.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});
