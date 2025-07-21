package org.openmuc.framework.app.modbusgateway.services;

public class RoutesService {

    private static final String device = "http://localhost:5000/api/device";
    private static final String profile = "http://localhost:5000/api/device-profile";
    private static final String mapping = "http://localhost:5000/api/address-maps";
    private static final String server = "http://localhost:5000/api/mserver";

    public static String getDeviceUrl() {
        return device;
    }

    public static String getProfileUrl() {
        return profile;
    }

    public static String getMappingUrl() {
        return mapping;
    }

    public static String getServerUrl() { return server; }


}