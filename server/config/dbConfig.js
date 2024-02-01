require("dotenv").config();
const odbc = require("odbc");
const sql = require("mssql");
// const sqlv8 = require("mssql/msnodesqlv8");

async function connectDB() {
  if (process.env.DB_Environment === "AWS") {
    const config = {
      user: process.env.AWS_EC2_USER,
      password: process.env.AWS_EC2_PASSWORD,
      server: process.env.AWS_EC2_SERVER,
      port: +process.env.AWS_EC2_PORT,
      database: process.env.AWS_EC2_NAME,
      authentication: {
        type: "default",
      },
      options: {
        encrypt: true,
        trustServerCertificate: true,
      },
    };

    const connect = new sql.connect(config);
    return connect;
  } else if (process.env.DB_Environment === "Local") {
    const config = {
      server: process.env.Local_DB_Server,
      database: process.env.Local_DB_Name,
      driver: "msnodesqlv8",
      options: {
        trustedConnection: true,
      },
    };

    const connect = new sql.connect(config);
    return connect;
  }
}

//Old Method
// async function connectDB() {
//     return await odbc.connect(process.env.LocalDBConnectionString);
// }

module.exports = {
  connectDB,
};
