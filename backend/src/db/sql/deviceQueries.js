module.exports = {
  getAllDevices: 'SELECT * FROM Devices',

  getDeviceById: `SELECT * FROM Devices WHERE Id = @Id`,


  insertDevice: `
  INSERT INTO Devices 
  (Name, Port, IPAddress, Mode, SamplingInterval, Timeout, DeviceProfileId, UnitId)
  VALUES 
  (@Name, @Port, @IPAddress, @Mode, @SamplingInterval, @Timeout, @DeviceProfileId, @UnitId)
`
}