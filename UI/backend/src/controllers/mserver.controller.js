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
      res.status(404).json({ msg: 'No devices found' });
    }

  } catch (error) {
    console.error("Error fetching the server details", error);
    res.status(500).json({
      msg: 'Error while getting Server Data '
    })
  }
}


exports.getServerById = async (req, res) => {
  const id = req.params.id;

  try {

    const request = new sql.Request()
      .input('Id', sql.Int, id);

    const result = await request.query(queries.getServerById);
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset[0]);
    } else {
      res.status(401).json({ msg: "No Server Profile found" });
    }
  } catch (error) {
    console.error('Error while getting Server Profile', error);
    res.status(500).send({
      msg: "Error while getting server Profile",
      error: error
    })
  }
}

exports.updateServer = async (req, res) => {

  const Id = req.params.id;
  const { Name, ServerPort, ServerIpAddress, UnitId, Interval, PoolSize } = req.body;
  try {

    const request = new sql.Request()
      .input('Id', sql.NVarChar, Id)
      .input('Name', sql.NVarChar, Name)
      .input('ServerIpAddress', sql.NVarChar, ServerIpAddress)
      .input('PoolSize', sql.NVarChar, PoolSize)
      .input('Interval', sql.Int, Interval)
      .input('UnitId', sql.NVarChar, UnitId)
      .input('ServerPort', sql.NVarChar, ServerPort);

    await request.query(queries.updateServerProfile);
    res.status(200).json({ message: "Server Profile Updated" })

  } catch (error) {
    console.error('Error while updating the Server', error, error.message);
    res.status(500).send("Error while updating", error);
  }

}


exports.deleteServerProfile = async (req, res) => {
  const id = req.params.id;


  try {
    const request = new sql.Request()
      .input('Id', sql.NVarChar, id);

    await request.query(queries.deleteServerProfile);
    res.status(200).json({ msg: 'server profile deleted' })

  } catch (err) {
    console.error('Error delete the server profile', err);
    res.status(500).json({ msg: "error deleting the profile", err })
  }
}