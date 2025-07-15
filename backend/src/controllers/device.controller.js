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



exports.getDeviceById = async (req, res) => {

    const deviceId = req.params.Id;

    try {
        const request = new sql.Request()
            .input('Id', sql.Int, deviceId);

        const data = await request.query(queries.getDeviceById);

        if (data.recordset && data.recordset.length > 0) {
            const device = data.recordset[0];
            res.status(200).send(device);
        } else {
            res.status(404).json({ msg: 'Device not found' })
        }

    } catch (err) {
        console.error('Error Fetching Device', err.message)
        res.status(500).json({ error: "Internal server error" });
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


exports.updateDevice = async (req, res) => {
    const id = req.params.id;
    const { Name, Port, IPAddress, Mode, DeviceProfileId, SamplingInterval, Timeout, UnitId, Id } = req.body;

    try {

        const request = new sql.Request()
            .input('Id', sql.Int, id)
            .input('Name', sql.NVarChar, Name)
            .input('Port', sql.NVarChar, Port)
            .input('IPAddress', sql.NVarChar, IPAddress)
            .input('Mode', sql.NVarChar, Mode)
            .input('DeviceProfileId', sql.NVarChar, DeviceProfileId)
            .input('SamplingInterval', sql.NVarChar, SamplingInterval)
            .input('Timout', sql.NVarChar, Timeout)
            .input('UnitId', sql.NVarChar, UnitId);

        await request.query(queries.updateDevice);

        res.status(200).json({ message: 'Device Updated' });

    } catch (err) {
        console.error('Error while updating', err.message);
        res.status(500).json({ msg: "Error while update", error: err.message })
    }
}