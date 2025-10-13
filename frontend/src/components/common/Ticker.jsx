import React, { useState, useEffect } from 'react';

const Ticker = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState('Hồ Chí Minh, Việt Nam');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you would reverse geocode the coordinates
          // For now, we'll use a fallback
          setLocation('Hồ Chí Minh, Việt Nam');
        },
        () => {
          // Fallback location if geolocation fails
          setLocation('Hồ Chí Minh, Việt Nam');
        }
      );
    }

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bg-green-600 text-white py-2 overflow-hidden">
      <div className="flex items-center justify-center space-x-8 animate-pulse">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">📅</span>
          <span className="text-sm">{formatDate(currentTime)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">🕐</span>
          <span className="text-sm">{formatTime(currentTime)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">📍</span>
          <span className="text-sm">{location}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">🌱</span>
          <span className="text-sm">Green Groves - Smart Gardening</span>
        </div>
      </div>
    </div>
  );
};

export default Ticker;
