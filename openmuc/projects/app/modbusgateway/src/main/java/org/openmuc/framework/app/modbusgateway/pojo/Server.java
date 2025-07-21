package org.openmuc.framework.app.modbusgateway.pojo;

public class Server {
    private int UnitId;
    private String IPAddress;
    private String Port;
    private int PoolSize;
    private int Interval;

    public int getUnitId() {
        return UnitId;
    }

    public void setUnitId(int id) {
        this.UnitId = id;
    }

    public String getPort() {
        return Port;
    }

    public void setPort(String port) {
        this.Port = port;
    }

    public void setIPAddress(String ip) {
        this.IPAddress = ip;
    }

    public String getIPAddress() {
        return IPAddress;
    }

    public int getInterval() {
        return Interval;
    }

    public void setInterval(int interval) {
        this.Interval = interval;
    }

    public int getPoolSize() {
        return PoolSize;
    }

    public void setPoolSize(int poolSize) {
        this.PoolSize = poolSize;
    }
}
