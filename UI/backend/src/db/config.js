require('dotenv').config();
const sql = require('mssql/msnodesqlv8');

const config = {
    connectionString: `Driver={ODBC Driver 17 for SQL Server};Server=${process.env.DB_HOST};Database=${process.env.DB_NAME};Trusted_Connection=Yes;`,
    options: {
        trustServerCertificate: true
    }
};

const establishConnection = async () => {
    try {
        await sql.connect(config);
        console.log("Connected to SQL Server using Windows Auth");
    } catch (err) {
        console.error("Connection error:", err);
    }
};

establishConnection();

module.exports = sql;
