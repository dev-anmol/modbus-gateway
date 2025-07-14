module.exports = {
    getAllProfiles: `
     SELECT * FROM DeviceProfile
    `,
    insertProfile: `
      INSERT INTO DeviceProfile (
        ProfileName,
        ProfileDescription,
        DeviceMake,
        ProfileModel
      ) VALUES (
        @ProfileName,
        @ProfileDescription,
        @DeviceMake,
        @ProfileModel
      )
    `,
    getDeviceProfileById: `
      SELECT * FROM DeviceProfile WHERE Id = @Id
    `
  };
  