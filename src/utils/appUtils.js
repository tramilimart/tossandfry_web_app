import { useContext } from 'react';
import AgentContext from './appContext.jsx';

export const useServiceUtils = () => {
    const { agentContext } = useContext(AgentContext);
    
    return {
        getServiceIcon: (policy_type) => {
            if (!policy_type) return '';
            const details = agentContext?.services?.find(service => service.id === policy_type);
            return details ? details.icon : '';
        },
        getServiceLabel: (policy_type) => {
            if (!policy_type) return '';
            const details = agentContext?.services?.find(service => service.id === policy_type);
            return details ? details.label : '';
        },
        getServicePage: (policy_type) => {
            if (!policy_type) return '';
            const details = agentContext?.services?.find(service => service.id === policy_type);
            return details ? details.page : '';
        },
        getServicePremium: (policy_type) => {
            console.log('getServicePremium', policy_type);
            if (!policy_type) return '';
            const details = agentContext?.services?.find(service => service.id === policy_type);

             // Return an empty string or handle the case where details are not found
            if (!details) return '';

            return {
                net_premium : details.net_premium,
                tax_and_fees  : details.tax_and_fees ,
                gross_premium  : details.gross_premium ,
             };
        },
        
        getAllServices: () => {
            return agentContext?.services || [];
        }
    };
};

import { Timestamp } from 'firebase/firestore';
export function firebaseDateFormat(dateStr) {
  const [year, day, month] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return Timestamp.fromDate(date);
}
export function currencyFormat(num) {
    if(!num) {
        return '';
    } else {
        const parsedNum = parseFloat(num);
        return parsedNum.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}
export function isValidEmail(email) {
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}
export function isValidMobileNo(mobileNo) {
    var zeroPattern = /^0\d{10}$/; // 11 digits starting with 0
    var plus63Pattern = /^\+63\d{10}$/; // 13 digits starting with +63
    return zeroPattern.test(mobileNo) || plus63Pattern.test(mobileNo);
}
export function lpad(str, length) {
    str = str.toString(); 
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}
export const numInputOnly = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '').toUpperCase();
};
export const textInputOnly = (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
};
export const emailInputOnly = (e) => {
    e.target.value = e.target.value.replace(/[^0-9a-zA-Z@._%+-]/g, '').toLowerCase();
};
export const numAndTextInput = (e) => {
    e.target.value = e.target.value.replace(/[^0-9a-zA-Z()-]/g, '').toUpperCase();
};
export const allInput = (e) => {
    e.target.value = e.target.value.replace(/[^0-9a-zA-Z.\-&#\s]/g, '').toUpperCase();
};
export const endpoint = () => {
    if (process.env.NODE_ENV === 'production') {
        if (window.location.hostname === 'payment.mercantile.ph') {
            return import.meta.env.VITE_LIVE_API_URL;
        } else {
            return import.meta.env.VITE_UAT_API_URL;
        }
    } else {
        return import.meta.env.VITE_LOCAL_API_URL;
    }      
}
export const isLive = () => {
    var isLive = false;
    if (process.env.NODE_ENV === 'production') {
        if (window.location.hostname === 'payment.mercantile.ph') {
            isLive = true;
        }
    }  
    return isLive; 
}
export function goBack() {
    window.history.back();
}
export const getFormattedDate = (format, date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    if(format == 'milis') {
        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    } else if (format == 'input_date') {
        return `${year}/${month}/${day}`;
    } else if (format == 'input_date_value') {
        return `${year}-${month}-${day}`;
    } else {
        return `${month}-${day}-${year}`;
    }
}
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    return date.toLocaleString('en-US', options);
}
export const firebaseTimestampToDisplayDateFormat = (timestamp) => {
    // Convert Firebase Timestamp to JavaScript Date object
    const date = timestamp.toDate();
    
    // Extract month, day, and year
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    
    // Format as MM/DD/YYYY
    return `${month}/${day}/${year}`;
};
export const firebaseTimestampToInputDateFormat = (timestamp) => {
    // Convert Firebase Timestamp to JavaScript Date object
    const date = timestamp.toDate();
    
    // Extract month, day, and year
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    
    // Format as MM/DD/YYYY
    return `${year}-${month}-${day}`;
};
export const hasAgentTransaction = (value) => {
    sessionStorage.setItem("isAgentHasTransaction", value);
}

export const getUserAgent = () => {
    return navigator.userAgent;
};
export const getUserIpAddress = async () => {
    try {
      const response = await fetch('https://api64.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (e) {
      return 'null';
    }
};
export const sendVerificationCode = async (email, code) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/emailVerificationCode`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, verificationCode: code })
        });
    
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        // Read the response as text
        const responseText = await response.text();

        return {
            isSuccess: true,
            message: responseText
        };
    } catch (error) {
        return {
            isSuccess: false,
            message: `Failed to send verification code: ${error.message}`
        };
    }
}
export const verifyUserEmail = async (uid) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/verifyUserEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid })
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const data = await response.json();
      return { isSuccess: true, message: data.message };
    } catch (error) {
      console.error('Error verifying user email:', error);
      return { isSuccess: false, message: "Failed to verify user email: " + error.message };
    }
};

export const updatePassword = async (email, newPassword) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/updatePassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update password');
      }
  
      return { isSuccess: true, message: 'Password updated successfully.' };
    } catch (error) {
      console.error('Error updating password:', error);
      return { isSuccess: false, message: `Failed to update password: ${error.message}` };
    }
};

export const sendImageToAPI = async (imageBlob) => {
    try {
      // Create a FormData object
      const formData = new FormData();
  
      // Append the image to the formData with a field name, e.g., 'file'
      formData.append('image', imageBlob, 'captured-image.png');
  
      // Send the request
      const response = await fetch('https://tipapiuat.mici.com.ph/text-to-image/v3', {
        method: 'POST',
        /*headers: {
          'Content-Type': 'multipart/form-data',
        },*/
        body: formData,
      });
  
      // Parse the response
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('API Response:', data);
      return data;
    } catch (error) {
      console.error('Error sending image to API:', error);
    }
};
export const formatWord = (word) => {
    return word
      .split('_') // Split the word into parts by underscore
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1)) // Capitalize the first letter of each part
      .join(' '); // Join the parts back with spaces
  }
export const generateRandomCode = () => {
    // Generate a random number between 10000 and 99999
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    return randomCode.toString(); // Convert the number to a string
};