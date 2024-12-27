import React, { useState, useEffect } from 'react';

const useWakeLock = () => {
  const [wakeLock, setWakeLock] = useState(null);
  const [error, setError] = useState(null);

  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        const lock = await navigator.wakeLock.request('screen');
        setWakeLock(lock);
        setError(null);
        
        // Add event listener for visibility change
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        return true;
      } else {
        throw new Error('Wake Lock API is not supported in this browser');
      }
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const handleVisibilityChange = async () => {
    if (document.visibilityState === 'visible' && wakeLock === null) {
      await requestWakeLock();
    }
  };

  const releaseWakeLock = () => {
    if (wakeLock) {
      wakeLock.release();
      setWakeLock(null);
    }
  };

  useEffect(() => {
    requestWakeLock();

    // Cleanup function
    return () => {
      releaseWakeLock();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []); // Empty dependency array means this runs once on mount

  return {
    isActive: wakeLock !== null,
    error
  };
};

// Example usage component
const WakeLockComponent = () => {
  const { isActive, error } = useWakeLock();

  return (
    <div className="p-4">
      <div className="mb-2">
        Wake Lock Status: {isActive ? 'Active' : 'Inactive'}
      </div>
      {error && (
        <div className="text-red-500">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default WakeLockComponent;