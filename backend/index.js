const express = require('express');
const { Storage } = require('@google-cloud/storage');
const vision = require('@google-cloud/vision');
const multer = require('multer');
const Airtable = require('airtable');
require('dotenv').config();

const app = express();
const storage = new Storage();
const visionClient = new vision.ImageAnnotatorClient();
const upload = multer({ storage: multer.memoryStorage() });

// Airtable setup
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
const TABLE_NAME = 'your_table_name'; // The name of your Airtable table

// Google Cloud Storage setup
const bucketName = 'my-ocr-bucket-1'; // Replace with your GCS bucket name
const bucket = storage.bucket(bucketName);

// API endpoint for uploading and processing images
app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    // Upload the file to Google Cloud Storage
    const file = bucket.file(req.file.originalname);
    await file.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype },
    });

    // Use Google Vision API to detect text (OCR) from the image
    const [result] = await visionClient.textDetection(`gs://${bucketName}/${file.name}`);
    const detections = result.textAnnotations;
    
    if (detections.length === 0) {
      return res.status(400).send('No text detected in image.');
    }

    // Extract the text (first element in detections is the full text)
    const extractedText = detections[0].description;

    // Here you can create a new record in Airtable using the extracted text
    base(TABLE_NAME).create({
      'Image Name': req.file.originalname,
      'Extracted Text': extractedText,
    }, (err, record) => {
      if (err) {
        return res.status(500).send('Error creating record in Airtable: ' + err);
      }
      res.status(200).send(`Image uploaded and OCR processed. Record created: ${record.getId()}`);
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing the image.');
  }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

