import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userDetails: null,
  },
  reducers: {
    dispatchLogin: (state, action) => {
      state.userDetails = { ...action.payload };
    },
    dispatchLogout: state => {
      state.userDetails = null;
    },
  },
});

export default authSlice;

export const authActions = authSlice.actions;
