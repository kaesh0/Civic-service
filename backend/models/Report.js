import mongoose from 'mongoose';
import { DataTypes } from 'sequelize';
import { getSequelize } from '../config/database.js';

/**
 * MongoDB Report Schema using Mongoose
 */
const mongoReportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters long'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function(coords) {
          return coords.length === 2 && 
                 coords[0] >= -180 && coords[0] <= 180 && // longitude
                 coords[1] >= -90 && coords[1] <= 90;     // latitude
        },
        message: 'Invalid coordinates format'
      }
    }
  },
  photoUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(url) {
        if (!url) return true; // Optional field
        return /^https?:\/\/.+/.test(url);
      },
      message: 'Invalid photo URL format'
    }
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open'
  },
  upvoteCount: {
    type: Number,
    default: 0,
    min: 0
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create 2dsphere index for geospatial queries
mongoReportSchema.index({ location: '2dsphere' });

// Index for efficient queries
mongoReportSchema.index({ author: 1 });
mongoReportSchema.index({ status: 1 });
mongoReportSchema.index({ createdAt: -1 });
mongoReportSchema.index({ upvoteCount: -1 });

const MongoReport = mongoose.model('Report', mongoReportSchema);

/**
 * PostgreSQL Report Model using Sequelize
 */
function createPostgresReport() {
  const sequelize = getSequelize();
  if (!sequelize) return null;

  const PostgresReport = sequelize.define('Report', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        len: [5, 200],
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [10, 2000],
        notEmpty: true
      }
    },
    location: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    photoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          args: true,
          msg: 'Invalid photo URL format'
        }
      }
    },
    status: {
      type: DataTypes.ENUM('Open', 'In Progress', 'Resolved', 'Closed'),
      defaultValue: 'Open',
      allowNull: false
    },
    upvoteCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    authorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'reports',
    timestamps: true,
    indexes: [
      {
        fields: ['authorId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['createdAt']
      },
      {
        fields: ['upvoteCount']
      },
      {
        type: 'GIST',
        fields: ['location']
      }
    ]
  });

  return PostgresReport;
}

/**
 * Get the appropriate Report model based on database type
 * @returns {Model} Report model
 */
export function getReportModel() {
  const databaseType = process.env.DATABASE_TYPE || 'mongodb';
  
  if (databaseType === 'mongodb') {
    return MongoReport;
  } else if (databaseType === 'postgresql') {
    return createPostgresReport();
  } else {
    throw new Error(`Unsupported database type: ${databaseType}`);
  }
}

export { MongoReport };
export const PostgresReport = createPostgresReport();