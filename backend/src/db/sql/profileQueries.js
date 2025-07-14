module.exports = {
  getAllProfiles: `
     SELECT * FROM DeviceProfile
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
    `
};
