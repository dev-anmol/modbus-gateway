const sql = require('mssql');
const queries = require('../db/sql/addressMapQueries');

exports.addAddressMappings = async (req, res) => {
    const deviceProfileId = Number(req.params.id);
    const mappings = req.body;

    if (!Array.isArray(mappings)) {
        return res.status(400).json({ error: 'Invalid payload format. Expected array of mappings.' });
    }

    try {
        for (let mapping of mappings) {
            const {
                parameter,
                registerAddress,
                registerType,
                dataType,
                interval
            } = mapping;

            const request = new sql.Request();
            await request
                .input('DeviceProfileId', sql.Int, deviceProfileId)
                .input('Parameter', sql.NVarChar, parameter)
                .input('RegisterAddress', sql.NVarChar, registerAddress)
                .input('RegisterType', sql.NVarChar, registerType)
                .input('DataType', sql.NVarChar, dataType)
                .input('Interval', sql.NVarChar, interval)
                .query(queries.insertAddressMapping);
        }

        res.status(200).json({ message: 'Mappings saved successfully.' });

    } catch (err) {
        console.error('Error inserting address mappings:', err.message);
        res.status(500).json({ error: 'Failed to save mappings.' });
    }
};
