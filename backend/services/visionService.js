const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient();

async function extractTextFromImage(gcsUri) {
  const [result] = await client.textDetection(gcsUri);
  const detections = result.textAnnotations;
  return detections.length > 0 ? detections[0].description.trim() : null;
}

module.exports = { extractTextFromImage };