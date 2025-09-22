import mongoose from 'mongoose';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

let sequelize = null;

/**
 * Connect to the appropriate database based on DATABASE_TYPE environment variable
 * @returns {Promise<void>}
 */
export async function connectDatabase() {
  const databaseType = process.env.DATABASE_TYPE || 'mongodb';
  
  if (databaseType === 'mongodb') {
    await connectMongoDB();
  } else if (databaseType === 'postgresql') {
    await connectPostgreSQL();
  } else {
    throw new Error(`Unsupported database type: ${databaseType}`);
  }
}

/**
 * Connect to MongoDB using Mongoose
 * @returns {Promise<void>}
 */
async function connectMongoDB() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is required');
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw error;
  }
}

/**
 * Connect to PostgreSQL using Sequelize
 * @returns {Promise<void>}
 */
async function connectPostgreSQL() {
  try {
    const postgresUri = process.env.POSTGRES_URI;
    if (!postgresUri) {
      throw new Error('POSTGRES_URI environment variable is required');
    }

    sequelize = new Sequelize(postgresUri, {
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });

    // Test the connection
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL');

    // Sync database (create tables if they don't exist)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('📊 Database synchronized');
    }

  } catch (error) {
    console.error('PostgreSQL connection failed:', error);
    throw error;
  }
}

/**
 * Get the Sequelize instance
 * @returns {Sequelize|null}
 */
export function getSequelize() {
  return sequelize;
}

/**
 * Close database connections
 * @returns {Promise<void>}
 */
export async function closeDatabase() {
  const databaseType = process.env.DATABASE_TYPE || 'mongodb';
  
  if (databaseType === 'mongodb') {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } else if (databaseType === 'postgresql' && sequelize) {
    await sequelize.close();
    console.log('PostgreSQL connection closed');
  }
}