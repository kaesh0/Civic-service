import mongoose from 'mongoose';
import { DataTypes } from 'sequelize';
import { getSequelize } from '../config/database.js';

/**
 * MongoDB Upvote Schema using Mongoose
 */
const mongoUpvoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  report: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report',
    required: true
  }
}, {
  timestamps: true
});

// Compound unique index to prevent duplicate upvotes
mongoUpvoteSchema.index({ user: 1, report: 1 }, { unique: true });

// Additional indexes for efficient queries
mongoUpvoteSchema.index({ user: 1 });
mongoUpvoteSchema.index({ report: 1 });
mongoUpvoteSchema.index({ createdAt: -1 });

const MongoUpvote = mongoose.model('Upvote', mongoUpvoteSchema);

/**
 * PostgreSQL Upvote Model using Sequelize
 */
function createPostgresUpvote() {
  const sequelize = getSequelize();
  if (!sequelize) return null;

  const PostgresUpvote = sequelize.define('Upvote', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    reportId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'reports',
        key: 'id'
      }
    }
  }, {
    tableName: 'upvotes',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'reportId']
      },
      {
        fields: ['userId']
      },
      {
        fields: ['reportId']
      },
      {
        fields: ['createdAt']
      }
    ]
  });

  return PostgresUpvote;
}

/**
 * Get the appropriate Upvote model based on database type
 * @returns {Model} Upvote model
 */
export function getUpvoteModel() {
  const databaseType = process.env.DATABASE_TYPE || 'mongodb';
  
  if (databaseType === 'mongodb') {
    return MongoUpvote;
  } else if (databaseType === 'postgresql') {
    return createPostgresUpvote();
  } else {
    throw new Error(`Unsupported database type: ${databaseType}`);
  }
}

export { MongoUpvote };
export const PostgresUpvote = createPostgresUpvote();