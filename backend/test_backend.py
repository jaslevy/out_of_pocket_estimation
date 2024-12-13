import requests

url = "http://127.0.0.1:8000/estimate"

payload = {
    "cpt_codes": ["12345", "54321"],
    "insurance_provider": "Company X",
    "insurance_plan": "Plan A",
    "patient_demographics": {
        "name": "Test User",
        "dob": "19940101",
        "gender": "M",
        "address": {
            "street": "999 Test St",
            "city": "Testville",
            "state": "NY",
            "zip_code": "99999"
        },
        "relationship_to_policyholder": "self"
    }
}

response = requests.post(url, json=payload)

print("Status Code:", response.status_code)
print("Response JSON:", response.json())