const sql = require('mssql/msnodesqlv8');
const queries = require('../db/sql/deviceQueries');

exports.getAllDevices = async (req, res) => {
    try {
        const request = new sql.Request();
        const data = await request.query(queries.getAllDevices);
        if (data.recordset) {
            const profiles = data.recordset;
            res.status(201).send(profiles);
        } else {
            res.status(404).json({ msg: 'No devices found' })
        }

    } catch (error) {
        console.error('Error fetching all the devices');
        res.status(500).json({ error: err.message });
    }
}



exports.getDeviceById =  async () => {

    const deviceId = req.params.Id;
    
    try {

    } catch(err) {
        console.error('Error Fetching Device', err.message)
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