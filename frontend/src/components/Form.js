// src/components/Form.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Form = () => {
  const [insurancePlan, setInsurancePlan] = useState('');
  const [insuranceCompany, setInsuranceCompany] = useState('');
  const [cptCodes, setCptCodes] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      navigate('/results', {
        state: { estimate: 100, additionalInfo: 'Sample additional info' },
      });
      setLoading(false);
    }, 2000); // Simulate a 2-second loading time
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Estimate Out-of-Pocket Payment</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Insurance Plan:</label>
          <input
            type="text"
            value={insurancePlan}
            onChange={(e) => setInsurancePlan(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Insurance Company:</label>
          <input
            type="text"
            value={insuranceCompany}
            onChange={(e) => setInsuranceCompany(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">CPT Code(s):</label>
          <input
            type="text"
            value={cptCodes}
            onChange={(e) => setCptCodes(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Submit
        </button>
      </form>
      {loading && <p className="mt-4 text-gray-500">Loading...</p>}
    </div>
  );
};

export default Form;