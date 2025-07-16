module.exports = {

  insertAddressMapping: `
  INSERT INTO DeviceProfileAddressMap (
    DeviceProfileId,
    Parameter,
    RegisterAddress,
    RegisterType,
    DataType,
    Interval
  )
  VALUES (
    @DeviceProfileId,
    @Parameter,
    @RegisterAddress,
    @RegisterType,
    @DataType,
    @Interval
  )
`,
  getAddressMappings: `
  SELECT * FROM 
  DeviceProfileAddressMap
  WHERE DeviceProfileId = @DeviceProfileId;
`,
  updateAddressMapping: `
  UPDATE DeviceProfileAddressMap
  SET
    Parameter = @Parameter,
    RegisterAddress = @RegisterAddress,
    RegisterType = @RegisterType,
    DataType = @DataType,
    Interval = @Interval
  WHERE Id = @Id
`
}