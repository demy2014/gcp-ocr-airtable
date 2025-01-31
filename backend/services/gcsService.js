const { Storage } = require('@google-cloud/storage');
const config = require('../config');

const storage = new Storage();
const bucket = storage.bucket(config.gcsBucket);

async function uploadFileToGCS(filePath, fileName) {
  await bucket.upload(filePath, { destination: fileName });
  return `https://storage.googleapis.com/${config.gcsBucket}/${fileName}`;
}
