const sql = require('mssql/msnodesqlv8');
const queries = require('../db/sql/deviceQueries');


exports.getAllProfiles = async (req, res) => {
    try {

    } catch (error) {

    }
}


exports.addProfile = async (req, res) => {
    const {
      ProfileName,
      ProfileDescription,
      DeviceMake,
      ProfileModel
    } = req.body;
  
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
