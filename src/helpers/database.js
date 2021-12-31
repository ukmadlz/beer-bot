const Knex = require('knex');

const config = {
    client: "cockroachdb",
    connection: {
      user: process.env.COCKROACHDB_USER || "root",
      password: process.env.COCKROACHDB_PASSWORD || (process.env.NODE_ENV != "production" ? "" : null),
      database: process.env.COCKROACHDB_DATABASE || "defaultdb",
      host: process.env.COCKROACHDB_HOST || "localhost",
      port: process.env.COCKROACHDB_PORT || 26257,
      ssl: false,
    },
    migrations: {
      directory: "knex/migrations",
    },
    seeds: {
      directory: "knex/seeds",
    },
  };
  
// Connect to database
module.exports = Knex(config);