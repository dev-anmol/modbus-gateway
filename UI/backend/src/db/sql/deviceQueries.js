module.exports = {
  getAllDevices: 'SELECT * FROM Devices',
  getDeviceById: `SELECT * FROM Devices WHERE Id = @Id`,
  insertDevice: `
    INSERT INTO Devices 
    (Name, Port, IPAddress, Mode, SamplingInterval, Timeout, DeviceProfileId, UnitId)
    VALUES 
    (@Name, @Port, @IPAddress, @Mode, @SamplingInterval, @Timeout, @DeviceProfileId, @UnitId)
  `,
  updateDevice: `
    UPDATE Devices
    SET Name = @Name,
    Port = @Port,
    IPAddress = @IPAddress,
    Mode = @Mode,
    DeviceProfileId = @DeviceProfileId,
    SamplingInterval = @SamplingInterval,
    Timeout = @Timeout,
    UnitId = @UnitId
    WHERE Id = @Id
  `,
  deleteDevice: `
    DELETE FROM Devices 
    WHERE Id = @Id  
  `
}