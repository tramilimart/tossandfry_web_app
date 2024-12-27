import React, { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useServiceUtils, numAndTextInput, textInputOnly, numInputOnly, allInput } from '../utils/appUtils.js';
import { addVehicle } from '../store/vehicleSlice.jsx';
import ToastContext from '../utils/toastContext.jsx';
import StatusBar from '../component/statusBar.jsx';
import { sendImageToAPI } from '../utils/appUtils.js';
import YearModal from '../component/modals/modalYear.jsx';
import TypeOfUseModal from '../component/modals/typeOfUse.jsx';
import CameraIcon from '../assets/icon_camera.svg'
import ValidatingModal from '../component/modals/validatingModal.jsx';

function Component() {
  const { vehicleType } = useParams();
  const policyType = `ctpl-${vehicleType}`;

  const navigate = useNavigate();
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const { showToast } = useContext(ToastContext);
  const serviceUtils = useServiceUtils();
  const [ errorMessage, setErrorMessage ] = useState('');
  const vehicleSlice = useSelector((state) => state.vehicle);
  const assuredSlice = useSelector((state) => state.assured);
  const coverSlice = useSelector((state) => state.cover);

  const [vehicleDetails, setVehicleDetails] = useState({
    mv_file_no: vehicleSlice.mv_file_no,
    plate_no: vehicleSlice.plate_no,
    engine_no: vehicleSlice.engine_no,
    chassis_no: vehicleSlice.chassis_no,
    make: vehicleSlice.make,
    model_year: vehicleSlice.model_year,
    color: vehicleSlice.color,
    type_of_use: vehicleSlice.type_of_use,
  });
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [isOpeningGallery, setOpeningGallery] = useState(false);
  const [isStartingCamera, setStartingCamera] = useState(false);
  const [isScanningPhoto, setScanningPhoto] = useState(false);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const [returnedText, setReturnedText] = useState('');


  const startCamera = async () => {
    setStartingCamera(true);
    setCapturedImage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use "environment" for the back camera
        },
      });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setIsCameraActive(true);
    } catch (error) {
      // Handle specific errors
      if (error.name === "NotAllowedError") {
        showToast("Please allow camera access to use this feature.", 'error');
      } else if (error.name === "NotFoundError") {
        showToast("No camera detected. Please connect a camera and try again.", 'error');
      } else if (error.name === "OverconstrainedError") {
        showToast("Back camera not available, falling back to front camera.", 'warning');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      } else {
        console.error("Error accessing the camera:", error);
        showToast("An error occurred while accessing the camera. Please try again.", 'error');
      }
    } finally {
      setStartingCamera(false);
    }
  };
  
  useEffect(() => {
    startCamera();
  }, []);

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");

    // Set canvas dimensions to match the video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame on the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the canvas to a Blob (image file)
    canvas.toBlob(async (blob) => {
      if (blob) {
        openValidatingModal();
        // Send the image to the API
        const response = await sendImageToAPI(blob);
        setReturnedText(response);
        if (response.mv_file_no || response.motor_no || response.serial_no) {
          localStorage.setItem("vehicleDtls", JSON.stringify({
            mv_file_no: response.mv_file || '',
            engine_no: response.motor_no || '',
            chassis_no: response.serial_no || '',
            plate_no: response.plate_no[0] || '',
            model_year: response.model_year[0] || '',
            make: response.make[0] || '',
            sub_model: response.series_no
          }))
          dispatch(addVehicle({
            mv_file_no: response.mv_file || '',
            engine_no: response.motor_no || '',
            chassis_no: response.serial_no || '',
            plate_no: response.plate_no[0] || '',
            model_year: response.model_year[0] || '',
            make: response.make[0] || '',
            sub_model: response.series_no || ''
          }));
          showToast("Please double check data before proceeding.", 'info');
          navigate(`/ctpl/${policyType.split('-')[1]}/1`);
        } else {
          startCamera();
          setCapturedImage(null);
          navigate(-1);
          showToast("No data retrieve from photo.", 'error');
        }
      }
    }, "image/png");

    // Get the image data from the canvas
    const imageData = canvas.toDataURL("image/png");
    setCapturedImage(imageData);

    // Stop the camera
    stopCamera();
  };

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    videoRef.current.srcObject = null;
    setIsCameraActive(false);
  };

  const openGallery = async () => {
    setScanningPhoto(true);    
    setScanningPhoto(false);
  }

  const openValidatingModal = () => {
    navigate('?validating=true');
  };
  
  return (
    <>
      <ValidatingModal/>
      <StatusBar title='Scan Certificate of Registration' />
      <div className='fill-form-body text-center'>
        <div className='d-flex flex-column align-items-center'>

          <div className='photo-border align-items-center'>
            {capturedImage && (
                <img src={capturedImage} alt="Captured" style={{ width: "100%" }} />
            )}

            {!isCameraActive && !capturedImage && (
              <i className="spinner-border spinner-border-sm mr-1"></i>
            )}

            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            <video ref={videoRef} style={{ width: "100%", height: "50vh" , display: isCameraActive ? "block" : "none" }}></video>
          </div>
          
          <div onClick={capturePhoto} className="camera-button my-5">
            {isScanningPhoto ? (<><i className="spinner-border spinner-border-sm mr-1"></i>Capturing...</>) : (<img src={CameraIcon} alt="" loading="lazy"/>)}
          </div>
          
          <button onClick={openGallery} type="button" className="btn btn-primary">
            {isOpeningGallery ? (<><i className="spinner-border spinner-border-sm w-100 mr-1"></i>Opening...</>) : (<>Select from Gallery</>)}
          </button>

        </div>
      </div>
    </>
  );
};

export default Component;
