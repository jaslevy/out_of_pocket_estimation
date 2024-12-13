import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  const handleBackToForm = () => {
    navigate("/form");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Estimated Out-of-Pocket Payment</h1>
      <p className="text-sm text-gray-600 mb-6 text-center">
        This is the estimated bill amount due if the deductible has not been met or the expense is not covered by insurance.
      </p>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
        <p className="mb-4">
          <strong>Total Payment:</strong> ${data.total_expected_payment.toFixed(2)}
        </p>
        <h2 className="text-lg font-bold mb-2">Breakdown:</h2>
        {data.breakdown.map((entry) => (
          <div key={entry.cpt_code} className="mb-6 border-b pb-4">
            <p>
              <strong>CPT Code:</strong> {entry.cpt_code}
            </p>
            <p>
              <strong>Weighted Average:</strong> ${entry.weighted_average.toFixed(2)}
            </p>
            <h3 className="text-md font-bold mt-2">Matches:</h3>
            {entry.breakdown.map((match, idx) => (
              <p key={idx} className="text-sm">
                <strong>Patient ID:</strong> {match.matched_patient_id},{" "}
                <strong>Out-of-Pocket Payment:</strong> ${match.out_of_pocket_payment.toFixed(2)},{" "}
                <strong>Similarity Score:</strong> {match.similarity_score.toFixed(2)}
              </p>
            ))}
          </div>
        ))}
        <button
          onClick={handleBackToForm}
          className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Back to Form
        </button>
      </div>
    </div>
  );
};

export default Results;
