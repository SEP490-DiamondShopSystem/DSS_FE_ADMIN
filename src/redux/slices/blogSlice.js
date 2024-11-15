// blogSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

// Async thunk for creating a new blog
export const createBlog = createAsyncThunk(
  'blog/createBlog',
  async (blogData, { rejectWithValue }) => {
    try {
      const response = await api.post('/Blog/Create', {
        Title: blogData.title,
        BlogTags: blogData.tags,
        Thumbnail: blogData.thumbnail, // Assuming it's a URL or base64 string
        Contents: blogData.contents,  // Use QuillJS content here
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

// Async thunk for updating a blog
export const updateBlog = createAsyncThunk(
  'blog/updateBlog',
  async (blogData, { rejectWithValue }) => {
    try {
      const response = await api.post('/Blog/Update', {
        BlogId: blogData.id,
        Title: blogData.title,
        BlogTags: blogData.tags,
        Thumbnail: blogData.thumbnail,
        Contents: blogData.contents, // Use QuillJS content here
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

// Async thunk for removing a blog
export const removeBlog = createAsyncThunk(
  'blog/removeBlog',
  async (blogId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/Blog/Remove?BlogId=${blogId}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

// Async thunk for fetching all blogs
export const fetchAllBlogs = createAsyncThunk(
  'blog/fetchAllBlogs',
  async (pagination, { rejectWithValue }) => {
    try {
      const response = await api.get('/Blog/All', {
        params: { currentPage: pagination.currentPage, pageSize: pagination.pageSize },
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

// Initial state
const initialState = {
  blogs: [],
  loading: false,
  error: null,
};

// Blog slice
export const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create blog
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
      // Update blog
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.blogs.findIndex((blog) => blog.id === action.payload.id);
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove blog
      .addCase(removeBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = state.blogs.filter((blog) => blog.id !== action.meta.arg);
      })
      .addCase(removeBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch all blogs
      .addCase(fetchAllBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchAllBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
