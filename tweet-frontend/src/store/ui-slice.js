import { createSlice } from '@reduxjs/toolkit';
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    toastMessage: '',
  },
  reducers: {
    setToastMessage: (state, action) => {
      state.toastMessage = action.payload;
    },
    clearToastMessage: state => {
      state.toastMessage = '';
    },
  },
});

export default uiSlice;

export const uiActions = uiSlice.actions;
