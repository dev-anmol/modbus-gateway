module.exports = {
    insertProfile: `INSERT INTO DeviceProfile (
        ProfileName,
        ProfileDescription,
        DeviceMake,
        ProfileModel
    ) VALUES (
        @ProfileName, 
        @ProfileDescription,
        @DeviceMake,
        @ProfileModel 
    )`
}