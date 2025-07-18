module.exports = {
  getAllProfiles: `
     SELECT * FROM DeviceProfile WHERE isActive = 1
    `,
  getDeviceProfileById: `
    SELECT * FROM DeviceProfile WHERE Id = @Id
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
  updateProfile: `
      UPDATE DeviceProfile 
      SET ProfileName = @ProfileName,
      DeviceMake = @DeviceMake,
      ProfileModel = @ProfileModel,
      ProfileDescription = @ProfileDescription
      WHERE Id = @Id    
    `,
  disableProfile: `
      UPDATE DeviceProfile SET isActive = 0 WHERE Id = @Id
    `
};
