# Out-of-Pocket Payment Estimator

This is a **proof of concept** for estimating out-of-pocket medical expenses using machine learning techniques. The tool leverages **data normalization, vectorization**, and **nearest neighbor search** to find relevant matches in the dataset and compute weighted averages of payment amounts.

## **Overview**
The Out-of-Pocket Payment Estimator estimates medical expenses based on:
1. **Data Preparation**:
   - Inputs such as CPT codes, insurance information, and patient demographics are normalized into a structured format.
2. **Vectorization**:
   - Demographic information is converted into numerical embeddings using a machine learning model (Hugging Face's `all-MiniLM-L6-v2` SentenceTransformer).
3. **Similarity Scoring**:
   - The tool identifies the top 3 most relevant documents in the database using **nearest neighbor search**.
4. **Weighted Averages**:
   - Similarity scores (calculated from distances) are used as weights to compute a weighted average of out-of-pocket payments for matching records.
5. **Breakdown and Total**:
   - Provides a detailed breakdown of costs for each CPT code and a total expected payment.

## **Features**
- Handles **single** or **multiple CPT codes**.
- Computes weighted averages based on **demographic similarity**.
- Prepopulated examples allow for easy testing.
- Designed with a **React frontend** and **FastAPI backend**.

## **How It Works**
1. The user inputs their **CPT code(s)**, **insurance information**, and **demographic details** (name, gender, date of birth, address, etc.) into a web form.
2. The backend:
   - Normalizes and vectorizes the input data.
   - Searches for the top 3 matching documents in the mock database using nearest neighbor search.
   - Computes a weighted average of payments based on the similarity scores.
   - Returns a breakdown of payment contributions for each CPT code and a total expected payment.
3. The results are displayed in the frontend, showing the estimated total payment and detailed breakdown.

## Prerequisites
- Python 3.9 or later
- Node.js (for React frontend)
- `pip` (Python package manager)
- `npm` (Node.js package manager)

