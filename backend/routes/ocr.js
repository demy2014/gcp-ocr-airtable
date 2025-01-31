const express = require('express');
const multer = require('multer');
const { processOCR } = require('./ocr');

// Initialize Express
const app = express();
const upload = multer({ dest: 'uploads/' });  // Temporary upload directory

// Image upload and OCR processing endpoint
app.post('/upload', upload.single('image'), async (req, res) => {
    const { file } = req;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        // Upload the image to Google Cloud Storage
        const gcsFileName = file.originalname;
        const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);
        await bucket.upload(file.path, { destination: gcsFileName });

        // Process OCR on the uploaded image
        const id = await processOCR(gcsFileName);

        // Return the ID number extracted from the image
        return res.status(200).json({ id });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

module.exports = app;
