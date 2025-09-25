import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const VisitorCounter = () => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current visitor count
    const getVisitorCount = async () => {
      try {
        // In a real app, you would call an API to get the count
        // For now, we'll simulate with localStorage
        const storedCount = localStorage.getItem('visitorCount');
        if (storedCount) {
          setCount(parseInt(storedCount));
        } else {
          // Simulate initial count
          const initialCount = Math.floor(Math.random() * 1000) + 500;
          setCount(initialCount);
          localStorage.setItem('visitorCount', initialCount.toString());
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching visitor count:', error);
        setLoading(false);
      }
    };

    getVisitorCount();

    // Increment visitor count
    const incrementCount = async () => {
      try {
        // In a real app, you would call an API to increment the count
        // For now, we'll update localStorage
        const currentCount = parseInt(localStorage.getItem('visitorCount') || '0');
        const newCount = currentCount + 1;
        setCount(newCount);
        localStorage.setItem('visitorCount', newCount.toString());
      } catch (error) {
        console.error('Error incrementing visitor count:', error);
      }
    };

    // Increment count when component mounts
    incrementCount();
  }, []);

  if (loading) {
    return (
      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
        <div className="animate-pulse">👥 Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
      <div className="flex items-center space-x-1">
        <span>👥</span>
        <span>{count.toLocaleString()}</span>
        <span className="text-xs">visitors</span>
      </div>
    </div>
  );
};

export default VisitorCounter;

