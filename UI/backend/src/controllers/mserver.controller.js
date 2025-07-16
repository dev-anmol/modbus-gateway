const sql = require('mssql/msnodesqlv8');
const queries = require('../db/sql/mserveQueries');

exports.createServer = async (req, res) => {
  const {
    serverIpAddress,
    serverPort,
    poolSize,
    unitId,
    interval,
  } = req.body;

  try {
    const request = new sql.Request()
      .input('ServerIpAddress', sql.NVarChar, serverIpAddress)
      .input('ServerPort', sql.NVarChar, serverPort)
      .input('PoolSize', sql.NVarChar, poolSize)
      .input('UnitId', sql.NVarChar, unitId)
      .input('Interval', sql.NVarChar, interval);

    await request.query(queries.createServer);

    res.status(201).json({ message: 'Server created successfully' });
  } catch (error) {
    console.error('Error creating server:', error.message);
    res.status(500).json({ error: 'Failed to create server' });
  }
};
