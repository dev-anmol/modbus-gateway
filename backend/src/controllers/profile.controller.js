const sql = require('mssql/msnodesqlv8');
const queries = require('../db/sql/profileQueries');


exports.getAllProfiles = async (req, res) => {
    try {
        const request = new sql.Request();
        const data = await request.query(queries.getAllProfiles);
        if(data.recordset) {
            const profiles = data.recordset;
            res.status(201).json({profiles});
        } else {
            res.status(404).json({msg: 'No device profile found !!!'})
        }

    } catch (error) {
        console.log("Error fetching all device profiles", error);
        res.status(500).json({ error: err.message })
    }
}


exports.addProfile = async (req, res) => {
    const {
        ProfileDescription,
        DeviceMake,
        ProfileModel,
        ProfileName
    } = req.body;
    console.log("Received body:", req.body);

    try {
        const request = new sql.Request()
            .input('ProfileName', sql.NVarChar, ProfileName)
            .input('ProfileDescription', sql.NVarChar, ProfileDescription)
            .input('DeviceMake', sql.NVarChar, DeviceMake)
            .input('ProfileModel', sql.NVarChar, ProfileModel);

        await request.query(queries.insertProfile);

        res.status(201).json({ message: 'Device Profile created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
