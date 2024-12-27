import { useDispatch } from 'react-redux';
import { clearAssured } from '../store/assuredSlice.jsx';
import { clearVehicle } from '../store/vehicleSlice.jsx';

const useClearLocalStorage = () => {
  const dispatch = useDispatch();

  const clearLocalStorage = () => {
    localStorage.clear();
    console.log('Cleared Local Storage');
    setTimeout(() => {
      console.log("This will run after a 1-second delay.");
    }, 1000);
    dispatch(clearAssured());
    dispatch(clearVehicle());
    console.log('Cleared Slices');
  };

  return clearLocalStorage;
};

export default useClearLocalStorage;
