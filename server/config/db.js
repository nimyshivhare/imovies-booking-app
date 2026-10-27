const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  const targetUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/imovies_db';

  try {
    // Attempt standard connection to local or remote MongoDB (2s timeout)
    const conn = await mongoose.connect(targetUri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    console.log(`[Notice] Could not connect to external MongoDB at ${targetUri}.`);
    console.log(`[Info] Starting built-in in-memory MongoDB fallback server...`);

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongod = await MongoMemoryServer.create({
        instance: {
          dbName: 'imovies_db',
        },
      });
      const inMemoryUri = mongod.getUri();
      await mongoose.connect(inMemoryUri);
      console.log(`[In-Memory MongoDB Connected]: ${inMemoryUri}`);

      // Auto-seed if database is freshly initialized
      const Movie = require('../models/Movie');
      const movieCount = await Movie.countDocuments();
      if (movieCount === 0) {
        console.log('[Info] Auto-seeding initial movies, theatres, and shows...');
        const { seedDataInternal } = require('../scripts/seedData');
        if (seedDataInternal) {
          await seedDataInternal();
        }
      }
    } catch (memError) {
      console.error(`[MongoDB Error]: Failed to start in-memory fallback: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
