import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '../../services/api'; // Ensure your API service is correctly implemented

// Async thunk for creating a new blog
export const createBlog = createAsyncThunk(
	'blog/createBlog',
	async (blogData, {rejectWithValue}) => {
		try {
			const response = await api.post('/Blog/Create', blogData, {
				headers: {'Content-Type': 'multipart/form-data'},
			});
			return response;
		} catch (error) {
			console.error('Error Response:', error.response);
			return rejectWithValue(error.response || 'Error creating blog');
		}
	}
);

// Async thunk for updating an existing blog
export const updateBlog = createAsyncThunk(
	'blog/updateBlog',
	async (blogData, {rejectWithValue}) => {
		try {
			const response = await api.post('/Blog/Update', blogData, {
				headers: {'Content-Type': 'multipart/form-data'},
			});
			;
			return response;
		} catch (error) {
			return rejectWithValue(error.response || 'Error updating blog');
		}
	}
);

// Async thunk for removing a blog
export const removeBlog = createAsyncThunk('blog/removeBlog', async (blogId, {rejectWithValue}) => {
	try {
		const response = await api.post(`/Blog/Remove?BlogId=${blogId}`);
		return blogId; // Return the blogId to remove from state
	} catch (error) {
		return rejectWithValue(error.response || 'Error removing blog');
	}
});

// Async thunk for fetching all blogs with pagination
export const fetchAllBlogs = createAsyncThunk(
	'blog/fetchAllBlogs',
	async ({CurrentPage, PageSize}, {rejectWithValue}) => {
		try {
			const response = await api.get('/Blog/Staff/All', {
				params: {CurrentPage, PageSize},
			});
			;
			return response; // Adjust based on actual API response structure
		} catch (error) {
			const message = error.response?.message || 'Error fetching blogs';
			return rejectWithValue(message);
		}
	}
);
export const fetchBlogDetail = createAsyncThunk(
	'blog/fetchBlogDetail',
	async ({BlogId}, {rejectWithValue}) => {
		try {
			const response = await api.get('/Blog/Staff/Detail', {
				params: {BlogId},
			});
			return response; // Adjust based on actual API response structure
		} catch (error) {
			const message = error.response?.message || 'Error fetching blog detail';
			return rejectWithValue(message);
		}
	}
);
// Initial state for the blog slice
const initialState = {
	blogs: {}, // Normalize state
	totalPage: 0,
	currentPage: 1,
	pageSize: 5,
	loading: false,
	error: null,
};
// Blog slice with reducers and extra reducers
export const blogSlice = createSlice({
	name: 'blog',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// Handle createBlog
			.addCase(createBlog.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createBlog.fulfilled, (state, action) => {
				state.loading = false;
				state.blogs.push(action.payload);
			})
			.addCase(createBlog.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			// Handle updateBlog
			.addCase(updateBlog.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateBlog.fulfilled, (state, action) => {
				state.loading = false;
				const index = state.blogs.findIndex((blog) => blog.Id === action.payload.Id);
				if (index !== -1) {
					state.blogs[index] = action.payload;
				}
			})
			.addCase(updateBlog.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			// Handle removeBlog
			.addCase(removeBlog.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(removeBlog.fulfilled, (state, action) => {
				state.loading = false;
				state.blogs = state.blogs.filter((blog) => blog.Id !== action.payload);
			})
			.addCase(removeBlog.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			// Handle fetchAllBlogs
			.addCase(fetchAllBlogs.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchAllBlogs.fulfilled, (state, action) => {
				state.loading = false;
				state.blogs = action.payload.Values || []; // Use 'Values' with a capital 'V'
				state.totalPage = action.payload.TotalPage;
				state.currentPage = action.payload.CurrentPage;
			})
			.addCase(fetchAllBlogs.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			// Handle fetchBlogDetail
			.addCase(fetchBlogDetail.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchBlogDetail.fulfilled, (state, action) => {
				state.loading = false;
				state.blogs = action.payload.Values || []; // Use 'Values' with a capital 'V'
				state.BlogId = action.payload.BlogId;
			})
			.addCase(fetchBlogDetail.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});
