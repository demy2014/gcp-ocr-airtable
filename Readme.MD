# GCP OCR Airtable Integration

This project enables bulk image upload, OCR (Optical Character Recognition) processing using Google Vision API, and Airtable record creation. Users can upload multiple images, which are processed to extract ID numbers using Google Vision OCR. The extracted ID numbers are then matched with a separate Airtable table to create new records.

## Features
- Upload multiple images to Google Cloud Storage (GCS)
- Extract ID numbers from images using Google Vision API
- Create new records in Airtable with the extracted ID numbers
- Deployable using Google Cloud Functions (or Google Cloud Run for scalability)
  
## Tech Stack
- **Frontend**: (Optional) React / Vue / Next.js
- **Backend**: Node.js (Express)
- **Cloud Storage**: Google Cloud Storage (GCS)
- **OCR Service**: Google Vision API
- **Database**: Airtable
- **Deployment**: Google Cloud Functions / Google Cloud Run
- **Authentication**: Google IAM (Service Accounts)

## Setup Instructions

### Prerequisites
1. **Google Cloud Platform (GCP) Account**: You’ll need a GCP account to use Google Cloud Storage, Vision API, and Cloud Functions/Cloud Run.
2. **Airtable Account**: Set up an Airtable account to store the extracted records.
3. **Node.js and npm**: Ensure you have Node.js and npm installed on your machine.

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/gcp-ocr-airtable.git
cd gcp-ocr-airtable

2. Install Dependencies
Navigate to the backend directory and install the dependencies:

cd backend
npm install

3. Configure Environment Variables
- Create a .env file in the backend directory and add the following variables:

GCS_BUCKET_NAME=your-gcs-bucket-name
AIRTABLE_API_KEY=your-airtable-api-key
AIRTABLE_BASE_ID=your-airtable-base-id
Replace your-gcs-bucket-name, your-airtable-api-key, and your-airtable-base-id with your actual GCS and Airtable credentials.

4. Deploy to Google Cloud
You can deploy the backend as a Google Cloud Function or Cloud Run.

Deploy to Google Cloud Functions:

gcloud functions deploy upload \
  --runtime nodejs18 \
  --trigger-http \
  --allow-unauthenticated \
  --env-vars-file .env

Deploy to Google Cloud Run (Optional):

First, build the Docker image:
- docker build -t gcr.io/your-project-id/gcp-ocr-airtable .

Deploy the Docker image to Cloud Run:

gcloud run deploy gcp-ocr-airtable \
  --image gcr.io/your-project-id/gcp-ocr-airtable \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

5. Testing the Functionality
- Once deployed, test the API endpoint by sending a POST request with image files to the endpoint.

curl -X POST \
  -F "image=@/path/to/image1.jpg" \
  -F "image=@/path/to/image2.jpg" \
  https://your-cloud-function-url

This will trigger the OCR processing and create records in Airtable with the extracted ID numbers.

File Structure

/gcp-ocr-airtable
│── /frontend              # (Optional) React/Vue frontend
│── /backend               # Node.js backend for Cloud Functions/Cloud Run
│   │── /routes
│   │   ├── upload.js      # Handles image uploads to GCS
│   │   ├── ocr.js         # Processes OCR with Google Vision
│   │   ├── airtable.js    # Handles Airtable record creation
│   │── /services
│   │   ├── gcsService.js  # Google Cloud Storage integration
│   │   ├── visionService.js # Google Vision API integration
│   │   ├── airtableService.js # Airtable API integration
│   │── config.js          # Configuration settings (API keys, GCP details)
│   │── index.js           # Google Cloud Function entry point
│── .env                   # Environment variables
│── package.json           # Dependencies
│── README.md              # Documentation
│── cloudbuild.yaml        # GCP Cloud Build deployment config

Troubleshooting
Error 403 - Forbidden: Make sure the service account has the correct IAM permissions (e.g., roles/storage.admin for Google Cloud Storage and roles/cloudfunctions.developer for Google Cloud Functions).

Airtable Record Creation Failed: Double-check your Airtable API key and Base ID in the .env file.
OCR Not Working: Ensure that the Google Vision API is enabled in your GCP project and that your service account has the necessary permissions.