package org.openmuc.framework.app.modbusgateway.pojo;

public class Mapping {
    private int Id;
    private int DeviceProfileId;
    private String Parameter;
    private String RegisterAddress;
    private String RegisterType;
    private String DataType;
    private String Interval;

    // Getters and Setters
    public int getId() {
        return Id;
    }

    public void setId(int id) {
        this.Id = id;
    }

    public int getDeviceProfileId() {
        return DeviceProfileId;
    }

    public void setDeviceProfileId(int deviceProfileId) {
        this.DeviceProfileId = deviceProfileId;
    }

    public String getParameter() {
        return Parameter;
    }

    public void setParameter(String parameter) {
        this.Parameter = parameter;
    }

    public String getRegisterAddress() {
        return RegisterAddress;
    }

    public void setRegisterAddress(String registerAddress) {
        this.RegisterAddress = registerAddress;
    }

    public String getRegisterType() {
        return RegisterType;
    }

    public void setRegisterType(String registerType) {
        this.RegisterType = registerType;
    }

    public String getDataType() {
        return DataType;
    }

    public void setDataType(String dataType) {
        this.DataType = dataType;
    }

    public String getInterval() {
        return Interval;
    }

    public void setInterval(String interval) {
        this.Interval = interval;
    }
}
