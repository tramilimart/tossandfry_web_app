import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSENGER_ID,
    appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const google_provider = new GoogleAuthProvider();
const facebook_provider = new FacebookAuthProvider();
const storage = getStorage(app);

window.dataLayer = window.dataLayer || [];
window.gtag = function(){window.dataLayer.push(arguments);}

window.gtag("config", firebaseConfig.measurementId, {
	cookie_domain: location.hostname,
	cookie_flags: "SameSite=None;Secure",
});
export const analytics = getAnalytics(app);
export { auth, db, google_provider, facebook_provider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, storage };
