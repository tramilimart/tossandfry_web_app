import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { auth } from './utils/firebaseConnect';
import AgentContext, { AgentProvider } from './utils/agentContext';
import ToastContext, { ToastProvider } from './utils/toastContext';
import { fetchServices } from './utils/firebaseUtils';
import store from './store/store';

import HomePage from './pages/home';
import ErrorPage from './component/errorPage';
import SignInPage from './pages/signIn';
import Registration from './pages/registration';
import VerifyCode from './pages/verifyCode';
import ForgotPassword from './pages/forgotPassword';
import UpdatePassword from './pages/updatePassword';
import Ctpl from './pages/ctpl';
import ScanImage from './pages//scanImage';
import Drafts from './pages/draft';
import Sent from './pages/sent';
import Issued from './pages/issued';
import Renewals from './pages/renewals';
import DraftDetails from './pages/draftDetails';
import SentDetails from './pages/sentDetails';
import IssuedDetails from './pages/issuedDetails';
import ProofOfPayment from './pages/sendProofOfPayment';
import HowToPay from './pages/howToPay';
import MyLocation from './pages/myLocation';

const queryClient = new QueryClient();

function App() {
  const { agentContext, setAgentContext } = useContext(AgentContext);
  const { toastContext, setToastContext } = useContext(ToastContext);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch services data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesData = await fetchServices();
        setServices(servicesData);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchData();
  }, [fetchServices]);

  // Handle authentication state change
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user && user.emailVerified) {
        /*if(!user.emailVerified) {
          const uid = user.uid;
          const email = user.email; 
          navigate('/verify', { state: { uid, email } });
        } else {*/
          setAgentContext(prevState => ({
            ...prevState,
            agent: {
              uid: user.uid,
              name: user.displayName,
              email: user.email,
              photo_url: user.photoURL,
            },
            services: services //this contain no value when reloaded on other page
          }));
          console.log('===========>>setAgentContext data');
        //}
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, setAgentContext, services]);

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
                <Route path="/" element={agentContext.agent.uid ? <HomePage /> : <SignInPage />} />
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
                <Route path="*" element={<ErrorPage />} />
              </Routes>
            </BrowserRouter>
          </QueryClientProvider>
        </Provider>
  );
}

const AppWithContextProvider = () => (
  <ToastProvider>
    <AgentProvider>
      <App />
    </AgentProvider>
  </ToastProvider>
);

export default AppWithContextProvider;

//export default App;

//export const useAgentInfo = () => useContext(AgentInfoContext);
