
// Function to validate email format
const validateEmailFormat = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Function to check if the email domain (host) exists
const checkEmailHostExists = async (email) => {
  const domain = email.split('@')[1];
  try {
    const response = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`);
    const data = await response.json();
    return data.Status === 0 && data.Answer && data.Answer.length > 0;
  } catch (error) {
    console.error("Error checking email host:", error);
    return false;
  }
};

// Function to check if an email exists using a third-party API
const checkEmailExists = async (email) => {
  // Replace with your own API endpoint or service that checks email existence
  const response = await fetch(`https://api.example.com/check-email?email=${email}`);
  const data = await response.json();
  return data.exists;
};

// Main function to validate email
export const validateEmail = async (email) => {
  if (!validateEmailFormat(email)) {
    return { isValid: false, message: "Invalid email format" };
  }

  const hostExists = await checkEmailHostExists(email);
  if (!hostExists) {
    return { isValid: false, message: "Email domain does not exist" };
  }

  // Uncomment the following block if you have a service to check email existence
  // const emailExists = await checkEmailExists(email);
  // if (!emailExists) {
  //   return { valid: false, message: "Email does not exist" };
  // }

  return { isValid: true, message: "valid" };
};