import { getUserModel, MongoUser, PostgresUser } from './User.js';
import { getReportModel, MongoReport, PostgresReport } from './Report.js';
import { getUpvoteModel, MongoUpvote, PostgresUpvote } from './Upvote.js';
import { defineAssociations } from './associations.js';

// Define associations for PostgreSQL
if (process.env.DATABASE_TYPE === 'postgresql') {
  defineAssociations();
}

export {
  getUserModel,
  getReportModel,
  getUpvoteModel,
  MongoUser,
  MongoReport,
  MongoUpvote,
  PostgresUser,
  PostgresReport,
  PostgresUpvote
};