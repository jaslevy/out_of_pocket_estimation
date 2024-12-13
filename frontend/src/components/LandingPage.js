import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">Out-of-Pocket Payment Estimator</h1>
      <p className="text-gray-700 text-center mb-6 max-w-3xl">
        Use this tool to estimate out-of-pocket medical expenses based on historical data and advanced machine learning techniques.
      </p>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl">
        <h2 className="text-xl font-bold mb-4 text-gray-800">How It Works</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>
            <strong>Data Preparation:</strong> Patient demographics and CPT codes are standardized into structured formats for consistent comparisons.
          </li>
          <li>
            <strong>Vectorization:</strong> Demographic information is transformed into numerical embeddings using machine learning models.
          </li>
          <li>
            <strong>Similarity Scoring:</strong> Top 3 relevant documents are identified using nearest neighbor search.
          </li>
          <li>
            <strong>Weighted Averages:</strong> 
            <ul className="list-disc list-inside pl-6 space-y-1">
              <li>Extract distances: Smaller distances indicate higher similarity.</li>
              <li>Calculate weights: <code>weight = 1 / (distance + 𝜖)</code></li>
              <li>Normalize weights: <code>normalized weight = weight / ∑ weights</code></li>
              <li>Compute weighted average: <code>weighted average = ∑ (normalized weight × out_of_pocket_payment)</code></li>
            </ul>
          </li>
          <li>
            <strong>Breakdown and Total:</strong> Provides a detailed breakdown of costs for each CPT code and a total expected payment.
          </li>
        </ul>
        <button
          onClick={() => navigate("/form")}
          className="mt-6 w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
