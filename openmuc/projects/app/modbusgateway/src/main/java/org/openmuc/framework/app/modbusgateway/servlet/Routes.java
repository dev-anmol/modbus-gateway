package org.openmuc.framework.app.modbusgateway.servlet;

public class Routes {

    private static final String device = "http://localhost:5000/api/device";
    private static final String profile = "http://localhost:5000/api/device-profile";
    private static final String mapping = "http://localhost:5000/api/address-maps";
    private static final String server = "http://localhost:5000/api/server"

    public static String getDeviceUrl() {
        return device;
    }

    public static String getProfileUrl() {
        return profile;
    }

    public static String getMappingUrl() {
        return mapping;
    }




}