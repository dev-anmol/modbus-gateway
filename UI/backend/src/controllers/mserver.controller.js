const sql = require('mssql/msnodesqlv8');
const queries = require('../db/sql/mserveQueries');

exports.createServer = async (req, res) => {
  const {
    serverIpAddress,
    serverPort,
    poolSize,
    unitId,
    interval,
    serverName
  } = req.body;

  try {
    const request = new sql.Request()
      .input('ServerIpAddress', sql.NVarChar, serverIpAddress)
      .input('ServerPort', sql.NVarChar, serverPort)
      .input('PoolSize', sql.NVarChar, poolSize)
      .input('UnitId', sql.NVarChar, unitId)
      .input('Interval', sql.NVarChar, interval)
      .input('Name', sql.NVarChar, serverName)

    await request.query(queries.createServer);

    res.status(201).json({ message: 'Server created successfully' });
  } catch (error) {
    console.error('Error creating server:', error.message);
    res.status(500).json({ error: 'Failed to create server' });
  }
};


exports.getServerDetails = async (req, res) => {
  try {
    const request = new sql.Request();

    const data = await request.query(queries.getServerDetails);

    if (data && data.recordset.length > 0) {
      res.status(200).json(data.recordset);
    } else {
      res.status(404).json({msg: 'No devices found'});
    }

  } catch (error) {
    console.error("Error fetching the server details", error);
    res.status(500).json({
      msg: 'Error while getting Server Data '
    })
  }
}