import { createSlice } from '@reduxjs/toolkit';
import { getFormattedDate } from '../utils/appUtils.js';

const storedVehicleDtls = JSON.parse(localStorage.getItem('vehicleDtls')) || {};

// Initial state
const initialVehicleState = {
  policy_type: storedVehicleDtls.policy_type || '',
  mv_file_no: storedVehicleDtls.mv_file_no || '',
  plate_no: storedVehicleDtls.plate_no || '',
  engine_no: storedVehicleDtls.engine_no || '',
  chassis_no: storedVehicleDtls.chassis_no || '',
  make: storedVehicleDtls.make || '',
  sub_model: storedVehicleDtls.sub_model || '',
  model_year: storedVehicleDtls.model_year || '',
  color: storedVehicleDtls.color || '',
  type_of_use: storedVehicleDtls.type_of_use || '',
  net_premium: storedVehicleDtls.net_premium || '',
  tax_and_fees: storedVehicleDtls.tax_and_fees || '',
  gross_premium: storedVehicleDtls.gross_premium || ''
};

// Create vehicle slice
const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState: initialVehicleState,
  reducers: {
    addVehicle: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearVehicle: (state) => {
      return initialVehicleState;
    },
    updateVehicle: (state, action) => {
      const { field, value } = action.payload;
      if (field in state) {
        state[field] = value;
      }
    },
  },
});

// Export actions
export const { addVehicle: addVehicle, clearVehicle: clearVehicle, updateVehicle: updateVehicle } = vehicleSlice.actions;
export default vehicleSlice.reducer;
