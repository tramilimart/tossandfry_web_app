import { createSlice, configureStore } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  uid: null,
  name: null,
  email: null,
  profile_url: null,
};

// Create user slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.uid = action.payload.uid;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.profile_url = action.payload.profile_url;
    },
    clearUser: (state) => {
      state.uid = null;
      state.name = null;
      state.email = null;
      state.profile_url = null;
    },
  },
});

// Export actions
export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
