import { PostgresUser, PostgresReport, PostgresUpvote } from './index.js';

/**
 * Define Sequelize associations for PostgreSQL models
 * This function should be called after all models are defined
 */
export function defineAssociations() {
  if (!PostgresUser || !PostgresReport || !PostgresUpvote) {
    return; // Skip if not using PostgreSQL
  }

  // User associations
  PostgresUser.hasMany(PostgresReport, {
    foreignKey: 'authorId',
    as: 'reports',
    onDelete: 'CASCADE'
  });

  PostgresUser.hasMany(PostgresUpvote, {
    foreignKey: 'userId',
    as: 'upvotes',
    onDelete: 'CASCADE'
  });

  // Report associations
  PostgresReport.belongsTo(PostgresUser, {
    foreignKey: 'authorId',
    as: 'author'
  });

  PostgresReport.hasMany(PostgresUpvote, {
    foreignKey: 'reportId',
    as: 'upvotes',
    onDelete: 'CASCADE'
  });

  // Upvote associations
  PostgresUpvote.belongsTo(PostgresUser, {
    foreignKey: 'userId',
    as: 'user'
  });

  PostgresUpvote.belongsTo(PostgresReport, {
    foreignKey: 'reportId',
    as: 'report'
  });

  console.log('✅ PostgreSQL model associations defined');
}