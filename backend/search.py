import json
import os
from dotenv import load_dotenv
import pinecone

# Load environment variables from .env file
load_dotenv()

# Initialize Pinecone with the API key from the environment variable
pinecone_api_key = os.getenv("PINECONE_API_KEY")
if not pinecone_api_key:
    raise ValueError("PINECONE_API_KEY not found in environment variables.")

pc = pinecone.init(api_key=pinecone_api_key, environment='us-west1-gcp')

# Create an index if it doesn't exist
index_name = "out-of-pocket-estimates"
if index_name not in pc.list_indexes():
    pc.create_index(
        name=index_name,
        dimension=128,  # Ensure this matches your embedding dimension
        metric='euclidean',  # Use the desired metric
        spec=pinecone.ServerlessSpec(cloud='aws', region='us-west-2')  # Specify cloud and region
    )

# Load mock data from JSON file
def load_mock_data():
    with open("data/mock_data.json") as f:
        return json.load(f)

# Function to find estimates
def find_estimates(insurance_plan, insurance_company, cpt_codes):
    mock_data = load_mock_data()
    results = []

    for entry in mock_data:
        if (entry["insurance_plan"] == insurance_plan and
                entry["insurance_company"] == insurance_company):
            for code in entry["cpt_codes"]:
                if code["code"] in cpt_codes:
                    results.append({
                        "cpt_code": code["code"],
                        "amount_due": code["amount_due"],
                        "patient_id": entry["patient_demographics"]["patient_id"],
                        "name": entry["patient_demographics"]["name"],
                        "dob": entry["patient_demographics"]["dob"],
                        "gender": entry["patient_demographics"]["gender"],
                        "address": entry["patient_demographics"]["address"],
                        "relationship_to_policyholder": entry["patient_demographics"]["relationship_to_policyholder"],
                        "policyholder_info": entry["policyholder_info"]
                    })

    return results