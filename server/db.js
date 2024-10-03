const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "tasklist",
  password: "",
  port: 5432,
});

const getClient = async () => {
  return pool.connect();
};
module.exports = {
  pool,
  getClient,
};
