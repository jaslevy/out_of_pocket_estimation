# app.py
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# Define a model for the request body
class EstimateRequest(BaseModel):
    insurance_plan: str
    insurance_company: str
    cpt_codes: list

@app.post("/estimate")
async def get_estimate(request: EstimateRequest):
    # Logic to calculate the estimate based on the request data
    estimate = 100  # Placeholder for actual calculation
    additional_info = "Sample additional info"
    return {"estimate": estimate, "additional_info": additional_info}