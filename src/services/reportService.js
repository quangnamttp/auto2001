// services/reportService.js
const { MongoClient } = require('mongodb');
const { MONGO_URI, USER_ID } = require('../config');
const signalService = require('./signalService');

async function saveReport() {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db();
    const report = await signalService.generateSignals();

    const result = await db.collection('reports').insertOne({
      userId: USER_ID,
      ...report,
      createdAt: new Date()
    });

    return result.insertedId;
  } catch (err) {
    console.error('reportService.saveReport error:', err.message);
    throw err;
  } finally {
    await client.close();
  }
}

module.exports = { saveReport };
