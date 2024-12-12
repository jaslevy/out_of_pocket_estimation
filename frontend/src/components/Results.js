// src/components/Results.js
import React from 'react';
import { useLocation } from 'react-router-dom';

const Results = () => {
  const location = useLocation();
  const { estimate, additionalInfo } = location.state || { estimate: 0, additionalInfo: '' };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Out-of-Pocket Payment Estimate</h1>
      <p className="text-lg">Estimated Amount: <span className="font-semibold">${estimate}</span></p>
      <p className="text-lg">Additional Information: {additionalInfo}</p>
    </div>
  );
};

export default Results;