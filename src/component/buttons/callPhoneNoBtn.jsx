import React from 'react';

//<CallPhoneNo phoneNumber={'09567823349'}/>

const PhoneCallButton = ({ phoneNumber}) => {
  const formatPhoneNumber = (number) => {
    // Remove any non-numeric characters from the phone number
    return number.replace(/\D/g, '');
  };

  const handleCall = () => {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    window.location.href = `tel:${formattedNumber}`;
  };

  return (
    <button
      onClick={handleCall}
      className="flex items-center gap-2 px-4 py-2 success-bg text-white rounded-lg hover:bg-green-600 transition-colors"
      aria-label={`Call ${phoneNumber}`}
    >
      <span>Call Now</span>
    </button>
  );
};

export default PhoneCallButton;