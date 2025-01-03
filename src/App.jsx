import React, { useEffect, useState, useContext } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { auth } from './utils/firebaseConnect'
import AgentContext, { AppProvider } from './utils/appContext'
import ToastContext, { ToastProvider } from './utils/toastContext'
import { fetchProducts } from './utils/firebaseUtils'
import store from './store/store'

import Home from './pages/home'
import ErrorPage from './component/errorPage'
import SignIn from './pages/signIn';
import Registration from './pages/registration'
import VerifyCode from './pages/verifyCode'
import ForgotPassword from './pages/forgotPassword'
import UpdatePassword from './pages/updatePassword'
import Ctpl from './pages/ctpl'
import ScanImage from './pages//scanImage'
import Drafts from './pages/draft'
import Sent from './pages/sent'
import Issued from './pages/issued'
import Renewals from './pages/renewals'
import DraftDetails from './pages/draftDetails'
import SentDetails from './pages/sentDetails'
import IssuedDetails from './pages/issuedDetails'
import ProofOfPayment from './pages/sendProofOfPayment'
import HowToPay from './pages/howToPay'
import MyLocation from './pages/myLocation'
import Category from './pages/category'
import AddItem from './pages/addItem'
import StoreLocation from './pages/storeLocation'
import PrivacyPolicy from './pages/privacyPolicy'
import DataDeletionPage from './pages/dataDeletion'

const queryClient = new QueryClient();

function App() {
  const { userContext, setUserContext} = useContext(AgentContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const getOrCreateDeviceId = () => {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = Array.from({ length: 15 }, () =>
        Math.random().toString(36).charAt(2)
      ).join('');
      localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  };
  getOrCreateDeviceId();

  // Handle authentication state change
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user && user.emailVerified) {
        setUserContext(prevState => ({
            ...prevState,
            user: {
              uid: user.uid,
              name: user.displayName,
              email: user.email,
              photo_url: user.photoURL,
            }
          }));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, setUserContext, products]);

  if (loading) {
    return (
      <div className='center-loading'>
        <i className='spinner-border'></i><p>Loading...</p>
      </div>
    );
  }

  return (
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home userContext={userContext}/>} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/verify" element={<VerifyCode />} />
                <Route path="/forgotPassword" element={<ForgotPassword />} />
                <Route path="/updatePassword" element={<UpdatePassword />} />
                <Route path="/ctpl/:vehicleType/:form/:policyId?" element={<Ctpl />} />
                <Route path="/scan-image/:vehicleType" element={<ScanImage />} />
                <Route path="/drafts" element={<Drafts />} />
                <Route path="/sent" element={<Sent />} />
                <Route path="/issued" element={<Issued />} />
                <Route path="/renewals" element={<Renewals />} />
                <Route path="/draft-dtls/:policyId" element={<DraftDetails />} />
                <Route path="/sent-dtls/:policyId" element={<SentDetails />} />
                <Route path="/issued-dtls/:policyId" element={<IssuedDetails />} />
                <Route path="/proof-of-payment/:policyId" element={<ProofOfPayment />} />
                <Route path="/how-to-pay" element={<HowToPay />} />
                <Route path="/myLocation" element={<MyLocation />} />
                <Route path="/store-location" element={<StoreLocation />} />
                <Route path="/category/:category" element={<Category />} />
                <Route path="/add-item" element={<AddItem />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/data-deletion" element={<DataDeletionPage />} />
                <Route path="*" element={<ErrorPage />} />
              </Routes>
            </BrowserRouter>
          </QueryClientProvider>
        </Provider>
  );
}

const AppWithContextProvider = () => (
  <ToastProvider>
    <AppProvider>
      <App />
    </AppProvider>
  </ToastProvider>
);

export default AppWithContextProvider;

//export default App;

//export const useAgentInfo = () => useContext(AgentInfoContext);
