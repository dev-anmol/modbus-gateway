module.exports = {
    getAllDevices: 'SELECT * FROM Devices',
    insertDevice: `
  INSERT INTO Devices 
  (Name, Port, IPAddress, Mode, SamplingInterval, Timeout, DeviceProfileId, UnitId)
  VALUES 
  (@Name, @Port, @IPAddress, @Mode, @SamplingInterval, @Timeout, @DeviceProfileId, @UnitId)
`
}