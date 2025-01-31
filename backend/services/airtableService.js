const Airtable = require('airtable');
const config = require('../config');

const base = new Airtable({ apiKey: config.airtableApiKey }).base(config.airtableBaseId);

async function uploadToAirtable(table, record) {
  return base(table).create(record);
}

async function findRecordById(table, idNumber) {
  const records = await base(table).select({ filterByFormula: `{id_number} = "${idNumber}"` }).firstPage();
  return records.length > 0 ? records[0] : null;
}

module.exports = { uploadToAirtable, findRecordById };