# app.py
from fastapi import FastAPI
from pydantic import BaseModel
from search import find_estimates  # Import the search function

app = FastAPI()

class EstimateRequest(BaseModel):
    insurance_plan: str
    insurance_company: str
    cpt_codes: list

@app.post("/estimate")
async def get_estimate(request: EstimateRequest):
    results = find_estimates(request.insurance_plan, request.insurance_company, request.cpt_codes)
    
    if not results:
        return {"estimate": 0, "additional_info": "No matching data found."}

    total_estimate = sum(item["amount_due"] for item in results)
    return {"estimate": total_estimate, "details": results}