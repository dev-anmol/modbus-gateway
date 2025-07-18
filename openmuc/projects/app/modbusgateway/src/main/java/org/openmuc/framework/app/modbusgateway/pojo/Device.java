package org.openmuc.framework.app.modbusgateway.pojo;

public class Device {
    private int Id;
    private String Name;
    private String Port;
    private String IPAddress;
    private String Mode;
    private String SamplingInterval;
    private String Timeout;
    private int DeviceProfileId;
    private String UnitId;

    // Getters and Setters
    public int getId() {
        return Id;
    }

    public void setId(int id) {
        this.Id = id;
    }

    public String getName() {
        return Name;
    }

    public void setName(String name) {
        this.Name = name;
    }

    public String getPort() {
        return Port;
    }

    public void setPort(String port) {
        this.Port = port;
    }

    public String getIPAddress() {
        return IPAddress;
    }

    public void setIPAddress(String ipAddress) {
        this.IPAddress = ipAddress;
    }

    public String getMode() {
        return Mode;
    }

    public void setMode(String mode) {
        this.Mode = mode;
    }

    public String getSamplingInterval() {
        return SamplingInterval;
    }

    public void setSamplingInterval(String samplingInterval) {
        this.SamplingInterval = samplingInterval;
    }

    public String getTimeout() {
        return Timeout;
    }

    public void setTimeout(String timeout) {
        this.Timeout = timeout;
    }

    public int getDeviceProfileId() {
        return DeviceProfileId;
    }

    public void setDeviceProfileId(int deviceProfileId) {
        this.DeviceProfileId = deviceProfileId;
    }

    public String getUnitId() {
        return UnitId;
    }

    public void setUnitId(String unitId) {
        this.UnitId = unitId;
    }

}
