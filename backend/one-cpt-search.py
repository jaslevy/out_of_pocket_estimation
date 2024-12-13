import json
import numpy as np
from sklearn.neighbors import NearestNeighbors
from sentence_transformers import SentenceTransformer

# Load the Hugging Face model for embeddings
model = SentenceTransformer("all-MiniLM-L6-v2")


def load_mock_data(file_path="data/mock_data2.json"):
    """Load mock data from a JSON file."""
    with open(file_path, "r") as f:
        return json.load(f)


def vectorize(text):
    """Generate an embedding for the input text using Hugging Face model."""
    return model.encode(text).astype("float32")


def prefilter_data(data, cpt_code, insurance_provider, insurance_plan):
    """Filter the mock data based on matching CPT code, insurance provider, and plan."""
    filtered = []
    for entry in data:
        if (
            entry["insurance_company"] == insurance_provider
            and entry["insurance_plan"] == insurance_plan
            and any(cpt["code"] == cpt_code for cpt in entry["cpt_codes"])
        ):
            filtered.append(entry)
    return filtered


def build_vector_store(data):
    """Build a nearest neighbors model for demographic embeddings."""
    embeddings = []
    metadata = []

    for entry in data:
        # Create a combined string from demographic info
        demographic_info = (
            f"{entry['patient_demographics']['name']} "
            f"{entry['patient_demographics']['dob']} "
            f"{entry['patient_demographics']['gender']} "
            f"{entry['patient_demographics']['address']['city']} "
            f"{entry['patient_demographics']['address']['state']}"
        )
        embedding = vectorize(demographic_info)
        embeddings.append(embedding)
        metadata.append(entry)  # Store metadata for later retrieval

    # Convert embeddings to a numpy array
    embeddings = np.array(embeddings)

    # Initialize Nearest Neighbors
    knn = NearestNeighbors(n_neighbors=5, metric="euclidean").fit(embeddings)
    return knn, metadata


def search(
    input_cpt_code,
    insurance_provider,
    insurance_plan,
    patient_demographics,
    mock_data,
    knn,
    metadata,
    top_k=2,
):
    """Search for the top matches based on demographics and calculate weighted average out-of-pocket payment."""
    # Prefilter data to include only documents with a matching CPT code, insurance provider, and plan
    filtered_data = prefilter_data(mock_data, input_cpt_code, insurance_provider, insurance_plan)

    if not filtered_data:
        return {"message": "No matches found after prefiltering."}

    # Build a new vector store only for the filtered data
    embeddings = []
    filtered_metadata = []

    for entry in filtered_data:
        demographic_info = (
            f"{entry['patient_demographics']['name']} "
            f"{entry['patient_demographics']['dob']} "
            f"{entry['patient_demographics']['gender']} "
            f"{entry['patient_demographics']['address']['city']} "
            f"{entry['patient_demographics']['address']['state']}"
        )
        embedding = vectorize(demographic_info)
        embeddings.append(embedding)
        filtered_metadata.append(entry)

    # Convert embeddings to a numpy array
    embeddings = np.array(embeddings)

    # Initialize a new Nearest Neighbors model for the filtered data
    filtered_knn = NearestNeighbors(n_neighbors=top_k, metric="euclidean").fit(embeddings)

    # Create embedding for the input demographics
    demographic_info = (
        f"{patient_demographics['name']} "
        f"{patient_demographics['dob']} "
        f"{patient_demographics['gender']} "
        f"{patient_demographics['address']['city']} "
        f"{patient_demographics['address']['state']}"
    )
    input_embedding = vectorize(demographic_info)

    # Perform nearest neighbor search on the filtered data
    n_neighbors = min(top_k, len(filtered_metadata))
    distances, indices = filtered_knn.kneighbors([input_embedding], n_neighbors=n_neighbors)

    # Gather results
    results = []
    weights = []
    for i, idx in enumerate(indices[0]):
        match = filtered_metadata[idx]
        match_cpt_codes = match["cpt_codes"]

        # Check for CPT overlap (this is guaranteed since we filtered earlier)
        overlap = [
            cpt for cpt in match_cpt_codes if cpt["code"] == input_cpt_code
        ]

        # Calculate out-of-pocket payment for the matching CPT code only
        out_of_pocket = sum(cpt["amount_due"] for cpt in overlap)

        # Inverse of distance as weight (add small epsilon to avoid division by zero)
        weight = 1 / (distances[0][i] + 1e-6)
        weights.append(weight)

        # Append result
        results.append(
            {
                "matched_patient_id": match["patient_demographics"]["patient_id"],
                "cpt_overlap": bool(overlap),
                "out_of_pocket_payment": out_of_pocket,
                "similarity_score": weight
            }
        )

    # Normalize weights
    total_weight = sum(weights)
    normalized_weights = [w / total_weight for w in weights]

    # Compute weighted average of out-of-pocket payments
    weighted_average = sum(
        result["out_of_pocket_payment"] * normalized_weights[i]
        for i, result in enumerate(results)
    )

    # Print the filtered results
    print("Filtered Results:")
    print(json.dumps(results, indent=4))

    # Print the weighted average
    print(f"Weighted Average Out-of-Pocket Payment: {weighted_average:.2f}")

    return {
        "matches": results,
        "weighted_average": weighted_average
    }



# Main function to test the workflow
if __name__ == "__main__":
    # Load mock data
    mock_data = load_mock_data()

    # Build the vector store
    knn, metadata = build_vector_store(mock_data)

    # Define input query
    input_cpt_code = "12345"
    insurance_provider = "Company X"
    insurance_plan = "Plan A"
    patient_demographics = {
        "name": "Test User",
        "dob": "19940101",
        "gender": "M",
        "address": {"street": "999 Test St", "city": "Testville", "state": "NY", "zip_code": "99999"},
        "relationship_to_policyholder": "self",
    }

    # Perform search
    results = search(
        input_cpt_code,
        insurance_provider,
        insurance_plan,
        patient_demographics,
        mock_data,
        knn,
        metadata,
    )

    # Print results
    print(json.dumps(results, indent=4))


# # Main function to test the workflow
# if __name__ == "__main__":
#     # Load mock data
#     mock_data = load_mock_data()

#     # Build the vector store
#     knn, metadata = build_vector_store(mock_data)

#     # Define input query
#     # input_cpt_codes = ["12345", "54321"]
#     # insurance_provider = "Company X"
#     # insurance_plan = "Plan A"
#     # patient_demographics = {
#     #     "name": "John Doe",
#     #     "dob": "19930101",
#     #     "gender": "M",
#     #     "address": {"street": "123 Main St", "city": "Anytown", "state": "NY", "zip_code": "12345"},
#     #     "relationship_to_policyholder": "self",
#     # }

#     input_cpt_codes = ["12345", "67890"]
#     insurance_provider = "Company X"
#     insurance_plan = "Plan A"
#     patient_demographics = {
#         "name": "Test User",
#         "dob": "19940101",
#         "gender": "M",
#         "address": {"street": "999 Test St", "city": "Testville", "state": "NY", "zip_code": "99999"},
#         "relationship_to_policyholder": "self",
#     }


#     # Perform search
#     results = search(
#         input_cpt_codes,
#         insurance_provider,
#         insurance_plan,
#         patient_demographics,
#         mock_data,
#         knn,
#         metadata,
#     )

#     # Print results
#     print(json.dumps(results, indent=4))
