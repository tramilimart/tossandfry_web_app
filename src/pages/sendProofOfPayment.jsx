import React, { useState, useRef, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { updatePolicyDetailsColumn } from '../utils/firebaseUtils.js';
import StatusBar from '../component/statusBar.jsx'
import { Upload } from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../utils/firebaseConnect.js';
import ToastContext from '../utils/toastContext.jsx'

function Component() {
    const navigate = useNavigate();
    const { policyId } = useParams();
    const { showToast } = useContext(ToastContext);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isSubmitLoading, setSubmitLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        setFile(droppedFile);

        // Generate a preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(droppedFile);
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        // Generate a preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
    };

    const submitProof = () => {
        if (file && file.type.startsWith('image/')) {
            handleFileUpload(file);
        } else {
            setUploadError('Please upload an image file');
        }
    };

    const handleFileUpload = async () => {
        try {
            setIsUploading(true);
            setUploadError(null);
            setUploadProgress(0);

            // Upload to Firebase
            const storageRef = ref(storage, `proof_of_payment/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    setUploadError('Upload failed: ' + error.message);
                    setIsUploading(false);
                },
                async () => {
                    // Handle successful upload
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    const columnToUpdate = {
                        policy_status: 'Verifying Payment',
                        payment_ref_no: downloadURL
                    }
                    await updatePolicyDetailsColumn(policyId, columnToUpdate);

                    setIsUploading(false);
                    setUploadProgress(100);
                    showToast("Successfully saved changes.", 'success');
                    navigate(-1);
                }
            );
        } catch (error) {
            setUploadError('Upload failed: ' + error.message);
            setIsUploading(false);
        }
    };

    const payInstruction = () => {
        navigate('/how-to-pay');
    }

    return(
        <>
            <StatusBar title="Submit Proof of Payment"/>
            <div className='process-payment my-3 mx-3'>
                <div className="upload-container">
                    <div
                        className={`upload-box ${isDragging ? 'dragging' : ''} ${isUploading ? 'uploading' : ''}`}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept="image/*"
                            className="file-input"
                        />

                        {preview ? (
                            <div className="image-preview">
                                <img src={preview} alt="Preview" className="preview-image" />
                            </div>
                        ) : (
                            <Upload className="upload-icon" />
                        )}

                        <div className="upload-text">
                            <p>{isDragging ? 'Drop your image here' : 'Drag & drop your image here'}</p>
                            <p className="subtext">or click to browse</p>
                        </div>

                        {isUploading && (
                            <div className="upload-overlay">
                                <div className="progress-container">
                                    <div className="progress-bar" style={{ width: `${uploadProgress}%` }} />
                                    <p className="uploading-text">Uploading... {Math.round(uploadProgress)}%</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {uploadError && <p className="error-text">{uploadError}</p>}
                </div>

                <button type="button" className="btn btn-primary w-100" onClick={submitProof}>
                    {isSubmitLoading ? (<><i className="spinner-border spinner-border-sm mr-1"></i>Sending...</>) : (<>Submit Proof</>)}
                </button>
                <button type="button" className="btn btn-secondary w-100 my-3" onClick={payInstruction}>Dont know how to pay?  Click here.</button>
            
            </div>
        </>
    )
}

export default Component