package org.openmuc.framework.app.modbusgateway.pojo;

public class Server {
    private int UnitId;
    private String ServerIpAddress;
    private int ServerPort;
    private int PoolSize;
    private int Interval;
    private String Name;

    // FIXED: Add missing getBindAddress() method
    public String getBindAddress() {
        return ServerIpAddress != null ? ServerIpAddress : "localhost";
    }

    // FIXED: Keep getIPAddress for backward compatibility
    public String getIPAddress() {
        return ServerIpAddress;
    }

    public void setIPAddress(String ip) {
        this.ServerIpAddress = ip;
    }

    // FIXED: Add null-safe getters with defaults
    public int getPort() {
        return ServerPort > 0 ? ServerPort : 502; // Default Modbus port
    }

    public void setPort(int port) {
        this.ServerPort = port;
    }

    public int getUnitId() {
        return UnitId > 0 ? UnitId : 1; // Default unit ID
    }

    public void setUnitId(int id) {
        this.UnitId = id;
    }

    public int getPoolSize() {
        return PoolSize > 0 ? PoolSize : 4; // Default pool size
    }

    public void setPoolSize(int poolSize) {
        this.PoolSize = poolSize;
    }

    public String getName() {
        return Name != null ? Name : "DefaultServer";
    }

    public void setName(String name) {
        this.Name = name;
    }

    public int getInterval() {
        return Interval;
    }

    public void setInterval(int interval) {
        this.Interval = interval;
    }

    // FIXED: Add meaningful toString() for debugging
    @Override
    public String toString() {
        return String.format("Server{name='%s', bindAddress='%s', port=%d, unitId=%d, poolSize=%d}",
                getName(), getBindAddress(), getPort(), getUnitId(), getPoolSize());
    }
}
