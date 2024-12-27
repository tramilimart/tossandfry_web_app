import { db, auth } from './firebaseConnect.js';
import { getAuth, sendPasswordResetEmail, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { query, collection, addDoc, doc, setDoc, getDoc, getDocs, where, updateDoc, deleteDoc, orderBy, Timestamp} from "firebase/firestore";
import { firebaseDateFormat, sendVerificationCode, generateRandomCode } from './appUtils.js';

// Function to create a new user with email and password
export const registerUser = async (displayName, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;   
    await updateProfile(user, {
      displayName: displayName
    });
    const verification_code = generateRandomCode();

    // Save user credential to 
    const saveResult = await saveUserCredential(user, verification_code);
    if (saveResult.isSuccess) {
      //Email a verification Code
      const sendResult = await sendVerificationCode(user.email, verification_code);
      if (sendResult.isSuccess) {
        return { isSuccess: true, uid: user.uid, code: verification_code, message: "Successfully registered. Please log in to continue." };
      } else {
        return { isSuccess: false, message: "Error sending email verification code." };
      }
    } else {
      return { isSuccess: false, message: "Error saving user credential." };
    }
  } catch (error) {
    let message;
    switch (error.code) {
      case 'auth/email-already-in-use':
        message = "The email address is already in use by another account.";
        break;
      case 'auth/invalid-email':
        message = "The email address is invalid.";
        break;
      case 'auth/operation-not-allowed':
        message = "Email/password accounts are not enabled.";
        break;
      case 'auth/weak-password':
        message = "The password is too weak.";
        break;
      default:
        message = "Registration failed: " + error.message;
        break;
    }
    return { isSuccess: false, message };
  }
};

export const saveUserCredential = async(user, verification_code) => {
  try {
    await setDoc(doc(db, "agents", user.uid), {
      account_role: 'user',
      active_tag: 'Y',
      address1: '',
      address2: '',
      agent_name: user.displayName,
      barangay: '',
      city: '',
      date_of_birth: '',
      email: user.email,
      profile_photo_url: '',
      province: '',
      remarks: '',
      sex: '',
      valid_id: '',
      valid_id_pic: '',
      verification_code: verification_code,
    });
    return {
      isSuccess: true,
      message: 'User credential successfully saved.'
    };
  } catch (error) {
    console.error("Error fetching data: ", error);
    return {
      isSuccess: false,
      message: error
    };
  }
}

export const getUserIdByEmail = async (email) => {
  try {
    // Reference to the agents collection
    const agentsRef = collection(db, 'agents');

    // Create a query to search for the document where email matches the provided email
    const q = query(agentsRef, where('email', '==', email));

    // Execute the query
    const querySnapshot = await getDocs(q);

    // Check if any documents were found
    if (querySnapshot.empty) {
      throw new Error('No user found with this email.');
    }

    // Since uid is the document ID, retrieve it from the first document
    let uid = null;
    querySnapshot.forEach((doc) => {
      uid = doc.id; // Get the document ID which is the uid
    });

    return { isSuccess: true, uid };
  } catch (error) {
    return { isSuccess: false, message: error.message };
  }
};

export const updateVerificationCodeById = async (uid, code) => {
  try {
    // Reference to the specific document in the agents collection
    const agentRef = doc(db, 'agents', uid);

    // Update the document with the new verification code
    await updateDoc(agentRef, {
      verification_code: code
    });

    return { isSuccess: true, message: 'Verification code updated successfully.' };
  } catch (error) {
    console.error('Error updating verification code:', error);
    return { isSuccess: false, message: 'Failed to update verification code: ' + error.message };
  }
};

export const checkVerificationCode = async (doc_id, code) => {
  try {
    // Reference to the specific document in the 'agent' collection
    const docRef = doc(db, 'agents', doc_id);
    
    // Get the document snapshot
    const docSnap = await getDoc(docRef);
    
    // Check if the document exists
    if (!docSnap.exists()) {
      return { isVerified: false, message: "Document does not exist." };
    }
    
    // Get the document data
    const data = docSnap.data();
    
    // Compare the received code with the code in the document
    if (data.verification_code === code) {
      return { isVerified: true, message: "Verification code matches." };
    } else {
      return { isVerified: false, message: "Verification code does not match." };
    }
  } catch (error) {
    console.error('Error checking verification code:', error);
    return { isVerified: false, message: "Error checking verification code: " + error.message };
  }
}

export const fetchServices = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "services"), orderBy('gross_premium', 'desc'));
    const services = [];
    querySnapshot.forEach((doc) => {
      services.push({ id: doc.id, ...doc.data() });
    });
    //console.log("===========>>fetchServices data:", services);
    return services;
  } catch (error) {
    console.error("[firebaseUtils] [fetchServices] Error fetching data: ", error);
    return null;
  }
};
export const deleteRowData = async (table, id) => {
  try {
    // Create a reference to the document to be deleted
    const docRef = doc(db, table, id);

    // Delete the document
    await deleteDoc(docRef);

    console.log(`Document with ID ${id} deleted from ${table}`);
    return true; // Return true to indicate success
  } catch (error) {
      console.error("Error deleting document: ", error);
      return false; // Return false to indicate failure
  }
}

export const fetchPolicyDetails = async (policyId) => {
  try {
      // Reference the document in both collections
      const docRef = doc(db, 'policy_details', policyId);

      // Fetch the documents
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.log(`No policy found with ID: ${policyId}`);
        return null;
      }
      
      // Get the data
      const policyData = docSnap.data();
      
      // Optional: Add the document ID to the returned data
      return {
          id: docSnap.id,
          ...policyData
      };
  } catch (error) {
      console.error("Error fetching data: ", error);
      return null;
  }
}

export const fetchPolicyDetailsByID = async (docId) => {
    try {
        const docRef = doc(db, "policy_details", docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            return docSnap.data();
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching data: ", error);
        return null;
    }
}

export const fetchAssuredDetailsByID = async (docId) => {
  try {
      const docRef = doc(db, "assured", docId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          return docSnap.data();
      } else {
          console.log("No such document!");
          return null;
      }
  } catch (error) {
      console.error("Error fetching data: ", error);
      return null;
  }
}


export const insertAssuredDetails = async(assuredInfo) => {
  try {
    const assuredDocRef = await addDoc(collection(db, "assured"), {
      fname: assuredInfo.fname,
      mname: assuredInfo.mname,
      lname: assuredInfo.lname,
      email: assuredInfo.email,
      mobile_no: assuredInfo.mobile_no,
      province_name: assuredInfo.province_name,
      province_code: assuredInfo.province_code,
      city_name: assuredInfo.city_name,
      city_code: assuredInfo.city_code,
      barangay_name: assuredInfo.barangay_name,
      barangay_code: assuredInfo.barangay_code,
      address1: assuredInfo.address1,
      active_tag: 'Y',
    });
    return assuredDocRef.id;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return null;
  }
}
export const updateAssuredDetails = async (assuredId, assuredInfo) => {
  try {
    const assuredDocRef = doc(db, "assured", assuredId);
    await updateDoc(assuredDocRef, {
      fname: assuredInfo.fname,
      mname: assuredInfo.mname,
      lname: assuredInfo.lname,
      email: assuredInfo.email,
      mobile_no: assuredInfo.mobile_no,
      province_name: assuredInfo.province_name,
      province_code: assuredInfo.province_code,
      city_name: assuredInfo.city_name,
      city_code: assuredInfo.city_code,
      barangay_name: assuredInfo.barangay_name,
      barangay_code: assuredInfo.barangay_code,
      address1: assuredInfo.address1,
      active_tag: 'Y',
    });
    return assuredId;
  } catch (error) {
    console.error("Error updating document: ", error);
    return null;
  }
}

export const insertPolicyDetails = async(status, agentId, assuredSlice, vehicleSlice, coverSlice) => {
  try {
    const policyDocRef = await addDoc(collection(db, "policy_details"), {
      //Agent ID
      agent_id: agentId,

      //Assured Details
      fname: assuredSlice.fname,
      mname: assuredSlice.mname,
      lname: assuredSlice.lname,
      email: assuredSlice.email,
      mobile_no: assuredSlice.mobile_no,
      province_name: assuredSlice.province_name,
      province_code: assuredSlice.province_code,
      city_name: assuredSlice.city_name,
      city_code: assuredSlice.city_code,
      barangay_name: assuredSlice.barangay_name,
      barangay_code: assuredSlice.barangay_code,
      address1: assuredSlice.address1,

      //Unit Details
      mv_file_no: vehicleSlice.mv_file_no,
      plate_no: vehicleSlice.plate_no,
      engine_no: vehicleSlice.engine_no,
      chassis_no: vehicleSlice.chassis_no,
      make: vehicleSlice.make,
      sub_model: vehicleSlice.sub_model,
      model_year: vehicleSlice.model_year,
      color: vehicleSlice.color,
      type_of_use: vehicleSlice.type_of_use,

      //Cover Details
      start_date: firebaseDateFormat(coverSlice.start_date),
      expiry_date: firebaseDateFormat(coverSlice.expiry_date),

      //Policy Details 
      issue_date: null,
      quotation_date: Timestamp.fromDate(new Date()),
      net_premium: vehicleSlice.net_premium,
      policy_status: status,
      policy_type: vehicleSlice.policy_type,
      tax_and_fees: vehicleSlice.tax_and_fees,
      gross_premium: vehicleSlice.gross_premium,
      authentication_no: '',
      coc_no: '',
      policy_no: '',
      remarks: ''
    });
    return policyDocRef.id;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return null;
  }
}
export const updatePolicyDetails = async (status, policyId, assuredSlice, vehicleSlice, coverSlice) => {
  try {
    const policyDocRef = doc(db, "policy_details", policyId);
    await updateDoc(policyDocRef, {
      //Assured Details
      fname: assuredSlice.fname,
      mname: assuredSlice.mname,
      lname: assuredSlice.lname,
      email: assuredSlice.email,
      mobile_no: assuredSlice.mobile_no,
      province_name: assuredSlice.province_name,
      province_code: assuredSlice.province_code,
      city_name: assuredSlice.city_name,
      city_code: assuredSlice.city_code,
      barangay_name: assuredSlice.barangay_name,
      barangay_code: assuredSlice.barangay_code,
      address1: assuredSlice.address1,

      //Unit Details
      mv_file_no: vehicleSlice.mv_file_no,
      plate_no: vehicleSlice.plate_no,
      engine_no: vehicleSlice.engine_no,
      chassis_no: vehicleSlice.chassis_no,
      make: vehicleSlice.make,
      sub_model: vehicleSlice.sub_model,
      model_year: vehicleSlice.model_year,
      type_of_use: vehicleSlice.type_of_use,

      //Cover Details
      start_date: firebaseDateFormat(coverSlice.start_date),
      expiry_date: firebaseDateFormat(coverSlice.expiry_date),

      //Policy Details 
      policy_status: status,
      issue_date: null,
      quotation_date: Timestamp.fromDate(new Date()),
      policy_type: vehicleSlice.policy_type,
      net_premium: vehicleSlice.net_premium,
      tax_and_fees: vehicleSlice.tax_and_fees,
      gross_premium: vehicleSlice.gross_premium,
      payment_status: 'Unpaid',
      payment_ref_no: '',
      authentication_no: '',
      policy_no: '',
      coc_no: '',
      remarks: ''
    });
    return policyId;
  } catch (error) {
    console.error("Error updating document: ", error);
    return null;
  }
} 

export const updatePolicyStatusById = async (uid, status) => {
  try {
    // Reference to the specific document in the agents collection
    const agentRef = doc(db, 'policy_details', uid);

    // Update the document with the new verification code
    await updateDoc(agentRef, {
      policy_status: status
    });

    return { isSuccess: true, message: 'Verification code updated successfully.' };
  } catch (error) {
    console.error('Error updating verification code:', error);
    return { isSuccess: false, message: 'Failed to update verification code: ' + error.message };
  }
};

export const updatePolicyDetailsColumn = async (uid, columnToUpdate) => {
  try {
    // Reference to the specific document in the agents collection
    const agentRef = doc(db, 'policy_details', uid);

    // Update the document with the new verification code
    await updateDoc(agentRef, {
      ...columnToUpdate
    });

    return { isSuccess: true, message: 'Verification code updated successfully.' };
  } catch (error) {
    console.error('Error updating verification code:', error);
    return { isSuccess: false, message: 'Failed to update verification code: ' + error.message };
  }
};