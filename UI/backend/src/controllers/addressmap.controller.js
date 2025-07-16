const sql = require('mssql/msnodesqlv8');
const queries = require('../db/sql/addressMapQueries');



exports.getAddressMappings = async (req, res) => {

    const DeviceProfileId = req.params.id;

    try {
        const request = new sql.Request()
            .input('DeviceProfileId', sql.NVarChar, DeviceProfileId);

        const data = await request.query(queries.getAddressMappings);

        if (data.recordset && data.recordset.length > 0) {
            const mappings = data.recordset;
            res.status(200).send(mappings);
        }
    } catch (err) {
        console.error('Error while fetching mappings', err);
        res.status(500).json({
            msg: "Failed to get address mappings"
        })
    }
}


// exports.addAddressMappings = async (req, res) => {
//     const deviceProfileId = Number(req.params.id);
//     const mappings = req.body;

//     if (!Array.isArray(mappings)) {
//         return res.status(400).json({ error: 'Invalid payload format. Expected array of mappings.' });
//     }

//     try {
//         for (let mapping of mappings) {
//             const {
//                 parameter,
//                 registerAddress,
//                 registerType,
//                 dataType,
//                 interval
//             } = mapping;

//             const request = new sql.Request();
//             await request
//                 .input('DeviceProfileId', sql.Int, deviceProfileId)
//                 .input('Parameter', sql.NVarChar, parameter)
//                 .input('RegisterAddress', sql.NVarChar, registerAddress)
//                 .input('RegisterType', sql.NVarChar, registerType)
//                 .input('DataType', sql.NVarChar, dataType)
//                 .input('Interval', sql.NVarChar, interval)
//                 .query(queries.insertAddressMapping);
//         }

//         res.status(200).json({ message: 'Mappings saved successfully.' });

//     } catch (err) {
//         console.error('Error inserting address mappings:', err.message);
//         res.status(500).json({ error: 'Failed to save mappings.' });
//     }
// };


exports.saveOrUpdateMappings = async (req, res) => {
    const deviceProfileId = Number(req.params.id);
    const mappings = req.body;

    if (!Array.isArray(mappings)) {
        return res.status(400).json({ error: 'Invalid payload format. Expected array of mappings.' });
    }

    try {
        for (let mapping of mappings) {
            const {
                Id,
                parameter,
                registerAddress,
                registerType,
                dataType,
                interval
            } = mapping;

            const request = new sql.Request();
            if (Id) {
                await request
                    .input('Id', sql.Int, Id)
                    .input('Parameter', sql.NVarChar, parameter)
                    .input('RegisterAddress', sql.NVarChar, registerAddress)
                    .input('RegisterType', sql.NVarChar, registerType)
                    .input('DataType', sql.NVarChar, dataType)
                    .input('Interval', sql.NVarChar, interval)
                    .query(queries.updateAddressMapping);
            } else {
                await request
                    .input('DeviceProfileId', sql.Int, deviceProfileId)
                    .input('Parameter', sql.NVarChar, parameter)
                    .input('RegisterAddress', sql.NVarChar, registerAddress)
                    .input('RegisterType', sql.NVarChar, registerType)
                    .input('DataType', sql.NVarChar, dataType)
                    .input('Interval', sql.NVarChar, interval)
                    .query(queries.insertAddressMapping);
            }
        }

        res.status(200).json({ message: 'Mappings updated successfully.' });

    } catch (err) {
        console.error('Error updating address mappings:', err.message);
        res.status(500).json({ error: 'Failed to update mappings.' });
    }
}