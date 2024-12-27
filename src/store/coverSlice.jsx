import { createSlice } from '@reduxjs/toolkit';

const storedCoverDtls = JSON.parse(localStorage.getItem('coverDtls')) || {};

// Initial state
const initialCoverState = {
  start_date: storedCoverDtls.start_date || '',
  expiry_date: storedCoverDtls.expiry_date || ''
};

// Create cover slice
const coverSlice = createSlice({
  name: 'cover',
  initialState: initialCoverState,
  reducers: {
    addCover: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearCover: (state) => {
      return initialCoverState;
    }
  },
});

// Export actions
export const { addCover: addCover, clearCover: clearCover } = coverSlice.actions;
export default coverSlice.reducer;
