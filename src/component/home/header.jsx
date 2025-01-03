import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../utils/firebaseConnect';
import OkCancelModal from '../modals/okCancelModal';
import StoreStatus from "../../component/home/storeStatus";

function Component({ displayName, photo_url }) {
    const navigate = useNavigate();
    const [okCancelModal, setOkCancelModal] = useState(false);

    useEffect(() => {
        setOkCancelModal(false);
    }, [okCancelModal]);

    const handleLogout = async () => {
        openOkCancelModal();
    };

    const generateProfile = (name) => {
        const encodedName = encodeURIComponent(name);
        return `https://ui-avatars.com/api/?name=${encodedName}&background=363636&color=fff&size=128`;
    };

    const openOkCancelModal = () => {
        navigate('?confirm=true');
        setOkCancelModal(true);
    };
    const closeOkCancelModal = () => {
        setOkCancelModal(false);
    };
    const setSelectedConfirmation = async (value) => {
        if (value === 'Y') {
            try {
                await signOut(auth);
                setTimeout(() => {
                  window.location.href = '/';
                }, 0);
            } catch (error) {
                console.error('Error during sign-out:', error);
            }
        }
    };

    return (
        <>
            <OkCancelModal onClose={closeOkCancelModal} onSave={setSelectedConfirmation} title='Confirm Sign Out' message='Do you want to sign out your account?' />

            <div className="user-info-container">
                <i className="bi bi-list fs-2 cur-p" onClick={handleLogout}></i>
                <div className="user-info">
                    {displayName ?
                        (<span>Hi, {displayName.split(' ')[0]}</span>) :
                        (<span>Hi, Welcome!</span>)}
                    {photo_url ?
                        (<img src={photo_url} alt="User Profile" onClick={handleLogout}/>) :
                        (<img src={generateProfile(displayName ? displayName : 'Welcome')} alt="Default Profile" />)}
                </div>
            </div>
        </>
    )
}

export default Component