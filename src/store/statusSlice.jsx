import { createSlice } from '@reduxjs/toolkit';

const storedStatusDtls = JSON.parse(localStorage.getItem('statusDtls')) || {};

// Initial state
const initialStatusState = {
  policy_status: storedStatusDtls.policy_status || ''
};

// Create cover slice
const statusSlice = createSlice({
  name: 'status',
  initialState: initialStatusState,
  reducers: {
    addStatus: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearStatus: (state) => {
      return initialStatusState;
    }
  },
});

// Export actions
export const { addStatus: addStatus, clearStatus: clearStatus } = statusSlice.actions;
export default statusSlice.reducer;
