from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from mult_cpt_search import search  # Import your search function
import json
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update with your frontend's origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all HTTP headers
)

# Request schema for the form inputs
class PatientDemographics(BaseModel):
    name: str
    dob: str
    gender: str
    address: dict
    relationship_to_policyholder: str

class EstimateRequest(BaseModel):
    cpt_codes: List[str]
    insurance_provider: str
    insurance_plan: str
    patient_demographics: PatientDemographics

@app.post("/estimate")
async def estimate_payment(request: EstimateRequest):
    # Load mock data (ensure path is correct)
    with open("data/mock_data2.json", "r") as f:
        mock_data = json.load(f)

    # Build the vector store (mock implementation or pre-built object)
    from mult_cpt_search import build_vector_store
    knn, metadata = build_vector_store(mock_data)

    # Perform the search
    result = search(
        input_cpt_codes=request.cpt_codes,
        insurance_provider=request.insurance_provider,
        insurance_plan=request.insurance_plan,
        patient_demographics=request.patient_demographics.dict(),
        mock_data=mock_data,
        knn=knn,
        metadata=metadata,
    )
    return result

# To run the server: uvicorn main:app --reload
