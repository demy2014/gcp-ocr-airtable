const express = require('express');
const multer = require('multer');
const { uploadFileToGCS } = require('../services/gcsService');
const { extractTextFromImage } = require('../services/visionService');
const { uploadToAirtable, findRecordById } = require('../services/airtableService');
const config = require('../config');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.array('images'), async (req, res) => {
  try {
    const results = [];

    for (const file of req.files) {
      const gcsUri = await uploadFileToGCS(file.path, file.originalname);
      const text = await extractTextFromImage(gcsUri);

      if (!text) {
        results.push({ file: file.originalname, status: 'No ID detected' });
        continue;
      }

      const existingRecord = await findRecordById(config.processedTable, text);
      if (existingRecord) {
        results.push({ file: file.originalname, status: 'ID already exists' });
        continue;
      }

      await uploadToAirtable(config.processedTable, { fields: { id_number: text } });
      results.push({ file: file.originalname, status: 'Uploaded successfully', extractedId: text });
    }

    res.json({ message: 'Processing completed', results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;