import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Form = () => {
  const [insurancePlan, setInsurancePlan] = useState("");
  const [insuranceCompany, setInsuranceCompany] = useState("");
  const [cptCodes, setCptCodes] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [relationship, setRelationship] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Prepopulate Test Case 1
  const prepopulateTestCase1 = () => {
    setInsurancePlan("Plan A");
    setInsuranceCompany("Company X");
    setCptCodes("12345, 54321");
    setName("Test User 1");
    setDob("19940101");
    setGender("M");
    setAddress("999 Test St, Testville, NY, 99999");
    setRelationship("self");
  };

  // Prepopulate Test Case 2 (Single CPT Code)
  const prepopulateTestCase2 = () => {
    setInsurancePlan("Plan B");
    setInsuranceCompany("Company Y");
    setCptCodes("67890");
    setName("Test User 2");
    setDob("19881231");
    setGender("F");
    setAddress("456 Elm St, Othertown, CA, 67890");
    setRelationship("child");
  };

  // Prepopulate Test Case 3 (Diverse Data)
  const prepopulateTestCase3 = () => {
    setInsurancePlan("Plan C");
    setInsuranceCompany("Company Z");
    setCptCodes("54321");
    setName("Demo User");
    setDob("19901123");
    setGender("F");
    setAddress("321 Oak St, Elsewhere, FL, 67812");
    setRelationship("self");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Create the payload for the API
    const payload = {
      cpt_codes: cptCodes.split(",").map((code) => code.trim()),
      insurance_provider: insuranceCompany,
      insurance_plan: insurancePlan,
      patient_demographics: {
        name,
        dob,
        gender,
        address: {
          street: address.split(",")[0]?.trim(),
          city: address.split(",")[1]?.trim(),
          state: address.split(",")[2]?.trim(),
          zip_code: address.split(",")[3]?.trim(),
        },
        relationship_to_policyholder: relationship,
      },
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      // Navigate to the results page with data
      navigate("/results", { state: data });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
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
            placeholder="Enter comma-separated CPT codes"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Patient Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Date of Birth (YYYYMMDD):</label>
          <input
            type="text"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Gender:</label>
          <input
            type="text"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Address (Street, City, State, Zip):</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="123 Main St, Anytown, NY, 12345"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Relationship to Policyholder:</label>
          <input
            type="text"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
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
        <button 
          type="button" 
          onClick={prepopulateTestCase1}
          className="w-full bg-gray-300 text-black font-bold py-2 rounded hover:bg-gray-400 transition duration-200 mt-4"
        >
          Prepopulate Test Case 1
        </button>
        <button 
          type="button" 
          onClick={prepopulateTestCase2}
          className="w-full bg-gray-300 text-black font-bold py-2 rounded hover:bg-gray-400 transition duration-200 mt-2"
        >
          Prepopulate Test Case 2
        </button>
        <button 
          type="button" 
          onClick={prepopulateTestCase3}
          className="w-full bg-gray-300 text-black font-bold py-2 rounded hover:bg-gray-400 transition duration-200 mt-2"
        >
          Prepopulate Test Case 3
        </button>
      </form>
      {loading && <p className="mt-4 text-gray-500">Loading...</p>}
    </div>
  );
};

export default Form;
