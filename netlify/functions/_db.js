// netlify/functions/_db.js
// Shared MongoDB connection - reused across warm function invocations

const { MongoClient } = require('mongodb')

const uri = process.env.MONGODB_URI
const dbName = process.env.DB_NAME || 'vibekit'

let cachedClient = null

async function connectDB() {
  if (cachedClient) return cachedClient.db(dbName)
  const client = new MongoClient(uri)
  await client.connect()
  cachedClient = client
  return client.db(dbName)
}

module.exports = { connectDB }
