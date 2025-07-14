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
`

}