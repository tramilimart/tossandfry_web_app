import { createSlice } from '@reduxjs/toolkit';

const storedAssuredDtls = JSON.parse(localStorage.getItem('assuredDtls')) || {};

// Initial state
const initialAssuredState = {
    fname: storedAssuredDtls.fname || '',
    mname: storedAssuredDtls.mname || '',
    lname: storedAssuredDtls.lname || '',
    email: storedAssuredDtls.email || '',
    mobile_no: storedAssuredDtls.mobile_no || '',
    province_name: storedAssuredDtls.province_name || '',
    province_code: storedAssuredDtls.province_code || '',
    city_name: storedAssuredDtls.city_name || '',
    city_code: storedAssuredDtls.city_code || '',
    barangay_name: storedAssuredDtls.barangay_name || '',
    barangay_code: storedAssuredDtls.barangay_code || '',
    address1: storedAssuredDtls.address1 || '',
};

// Create vehicle slice
const assuredSlice = createSlice({
  name: 'assured',
  initialState: initialAssuredState,
  reducers: {
    addAssured: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearAssured: (state) => {
      return initialAssuredState;
    },
    updateAssured: (state, action) => {
      const { field, value } = action.payload;
      if (field in state) {
        state[field] = value;
      }
    },
  },
});

// Export actions
export const { addAssured: addAssured, clearAssured: clearAssured, updateAssured: updateAssured } = assuredSlice.actions;
export default assuredSlice.reducer;
