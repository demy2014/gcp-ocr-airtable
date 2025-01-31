const Airtable = require('airtable');

// Initialize Airtable base (replace with your Airtable API key and base ID)
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

// Table name where records will be created
const TABLE_NAME = 'YourTableName';  // Replace with your Airtable table name

/**
 * Creates a new record in Airtable with the extracted ID.
 * @param {string} id The ID number extracted from OCR.
 * @returns {Promise<object>} The created record.
 */
async function createRecord(id) {
    try {
        // Creating a new record in Airtable
        const record = await base(TABLE_NAME).create([
            {
                fields: {
                    "ID Number": id,  // Replace with the actual field name in your Airtable
                    "Status": "Processed",  // Example field
                    "Created At": new Date().toISOString()  // Optional: Add a timestamp
                }
            }
        ]);

        console.log('Airtable record created:', record);
        return record;
    } catch (error) {
        console.error('Error creating Airtable record:', error.message);
        throw error;
    }
}

module.exports = { createRecord };
