const sql = require('mssql/msnodesqlv8');
const queries = require('../db/sql/profileQueries');


exports.getAllProfiles = async (req, res) => {
    try {
        const request = new sql.Request();
        const data = await request.query(queries.getAllProfiles);
        if (data.recordset) {
            const profiles = data.recordset;
            res.status(201).json({ profiles });
        } else {
            res.status(404).json({ msg: 'No device profile found !!!' })
        }

    } catch (error) {
        console.log("Error fetching all device profiles", error);
        res.status(500).json({ error: err.message })
    }
}

exports.getDeviceProfile = async (req, res) => {
    const profileId = req.params.id;

    try {
        const request = new sql.Request()
            .input('Id', sql.Int, profileId);

        const data = await request.query(queries.getDeviceProfileById);

        if (data.recordset && data.recordset.length > 0) {
            const profile = data.recordset[0];
            res.status(200).send(profile);
        } else {
            res.status(404).json({ message: "Device Profile not found" });
        }
    } catch (error) {
        console.error("Error fetching the Device Profile", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


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

exports.updateDeviceProfile = async (req, res) => {
    const id = req.params.id;
    const { ProfileName, DeviceMake, ProfileModel, ProfileDescription } = req.body;

    try {
        const request = new sql.Request()
            .input('Id', sql.Int, id)
            .input('ProfileName', sql.NVarChar, ProfileName)
            .input('DeviceMake', sql.NVarChar, DeviceMake)
            .input('ProfileModel', sql.NVarChar, ProfileModel)
            .input('ProfileDescription', sql.NVarChar, ProfileDescription)

        await request.query(queries.updateProfile);
        res.status(200).json({ message: 'Device Profile Updated' })
    } catch (err) {
        console.error('Update error:', err.message);
        res.status(500).json({ error: 'Failed to update the device profile' })
    }
}