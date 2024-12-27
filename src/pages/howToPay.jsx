import React, { useContext, useState } from 'react'
import ToastContext from '../utils/toastContext.jsx';
import StatusBar from '../component/statusBar.jsx'

function Component() {
    const { showToast } = useContext(ToastContext);
    const [isDownloadLoading, setDownloadLoading] = useState(false);
    
    const downloadQRCode = async () => {
        try {
            setDownloadLoading(true);
            // Fetch the image
            const response = await fetch('/assets/gcash_qr.png');
            const blob = await response.blob();
            
            // Create a blob URL
            const blobUrl = window.URL.createObjectURL(blob);
            
            // Create temporary anchor element
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'ctpl-agent-gcash-qr-code.jpg';
            
            // Append to body, click, and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up blob URL
            window.URL.revokeObjectURL(blobUrl);
            setDownloadLoading(false);
        } catch (error) {
            showToast("Error downloading QR Code.", 'error');
        }
    };

    const copyGCashPhoneNo = () => {
        navigator.clipboard.writeText('09123305767')
        .then(() => {
            showToast("GCash No. copied to clipboard.", 'info');
        })
        .catch(err => {
            showToast("Error copying text.", 'error');
        });
    }

    const copyBDOAcctName = () => {
        navigator.clipboard.writeText('Limart Salomon')
        .then(() => {
            showToast("Account Name copied to clipboard.", 'info');
        })
        .catch(err => {
            showToast("Error copying text.", 'error');
        });
    }

    const copyBDOAcctNo = () => {
        navigator.clipboard.writeText('004500708459')
        .then(() => {
            showToast("Account No. copied to clipboard.", 'info');
        })
        .catch(err => {
            showToast("Error copying text.", 'error');
        });
    }

    return(
        <>
            <StatusBar title="How To Pay"/>
            <div className="note mx-2 mt-2">
                <span>Important Note: Take a screenshot once the payment transaction is complete. This will serve as your proof of payment.</span>
            </div>
            <div className='how-to-pay'>
                <span className="title mt-3">Pay using GCash</span>
                <span className="desc my-1">(Download and scan this QR Code below.)</span>
                <img src="/assets/gcash_qr.png" alt="" loading="lazy" className='my-3'/>
                <button type="button" className="btn btn-primary w-200" onClick={downloadQRCode}>
                    {isDownloadLoading ? (<><i className="spinner-border spinner-border-sm mr-1"></i>Downloading...</>) : (<>Download QR Code</>)}
                </button>
                <button type="button" className="btn btn-primary mt-3 w-200" onClick={copyGCashPhoneNo}>Copy Phone Number</button>

                <div className='divider my-4 '></div>

                <span className="title">Pay using BDO Transfer</span>
                <span className="desc my-1">(Copy account details below.)</span>
                <img src="/assets/bdo_account.png" alt="" loading="lazy" className='my-3'/>
                <button type="button" className="btn btn-primary w-200" onClick={copyBDOAcctName}>Copy Account Name</button>
                <button type="button" className="btn btn-primary mt-3 mb-5 w-200" onClick={copyBDOAcctNo}>Copy Account Number</button>
            </div>
        </>
    )
}

export default Component