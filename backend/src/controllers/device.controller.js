const sql = require('mssql/msnodesqlv8');
const queries = require('../db/sql/deviceQueries');

exports.getAllDevices = async (req, res) => {
    try {

    } catch (error) {

    }
}



exports.addDevice = async (req, res) => {
    const {
        deviceName,
        devicePort,
        deviceProfileId,
        unitId,
        ipAddress,
        mode,
        samplingInterval,
        timeout,
    } = req.body;

    try {
        const request = new sql.Request()
            .input('Name', sql.NVarChar, deviceName)
            .input('Port', sql.NVarChar, devicePort)
            .input('IPAddress', sql.NVarChar, ipAddress)
            .input('Mode', sql.NVarChar, mode)
            .input('SamplingInterval', sql.NVarChar, samplingInterval)
            .input('Timeout', sql.NVarChar, timeout)
            .input('DeviceProfileId', sql.NVarChar, deviceProfileId)
            .input('UnitId', sql.NVarChar, unitId);

        await request.query(queries.insertDevice);

        res.status(201).json({ message: 'Device added successfully' });
    } catch (err) {
        console.error('Error inserting device:', err.message);
        res.status(500).json({ error: 'Failed to add device' });
    }
};