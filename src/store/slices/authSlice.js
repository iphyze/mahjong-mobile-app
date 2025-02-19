// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

export const checkUserStatus = createAsyncThunk(
  'auth/checkUserStatus',
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/getSingleUser/${String(userId)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.status === 200 ? response.data?.data : rejectWithValue('Invalid user status');
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoading: true,
    isAuthenticated: false,
    hasOnboarded: false,
    user: null,
    error: null
  },
  reducers: {
    setOnboarding: (state, action) => {
      state.hasOnboarded = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkUserStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkUserStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
      });
  }
});

export const { setOnboarding, setUser } = authSlice.actions;
export default authSlice.reducer;