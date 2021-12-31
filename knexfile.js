// Update with your config settings.
// connection: {
//   user: process.env.COCKROACHDB_USER || "root",
//   password: process.env.COCKROACHDB_PASSWORD || (process.env.NODE_ENV != "production" ? "" : null),
//   database: process.env.COCKROACHDB_DATABASE || "defaultdb",
//   host: process.env.COCKROACHDB_HOST || "localhost",
//   port: process.env.COCKROACHDB_PORT || 26257,
//   ssl: false,
// },
// migrations: {
//   directory: "knex/migrations",
// },
// seeds: {
//   directory: "knex/seeds",
// },

const KNEX_MIGRATIONS_DIRECTORY = './knex/migrations';
const KNEX_SEEDS_DIRECTORY = './knex/seeds';

const migrations = {
  tableName: 'knex_migrations',
  directory: KNEX_MIGRATIONS_DIRECTORY,
}

module.exports = {

  development: {
    client: 'cockroachdb',
    connection: {
      user: "root",
      password: "",
      database: "defaultdb",
      host: "localhost",
      port: 26257,
      ssl: false,
    },
    migrations,
  },

  production: {
    client: 'cockroachdb',
    connection: {
      user: process.env.COCKROACHDB_USER || "root",
      password: process.env.COCKROACHDB_PASSWORD || (process.env.NODE_ENV != "production" ? "" : null),
      database: process.env.COCKROACHDB_DATABASE || "defaultdb",
      host: process.env.COCKROACHDB_HOST || "localhost",
      port: process.env.COCKROACHDB_PORT || 26257,
      ssl: false,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations,
  }
};
