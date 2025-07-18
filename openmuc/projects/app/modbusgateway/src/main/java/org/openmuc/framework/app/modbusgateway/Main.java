package org.openmuc.framework.app.modbusgateway;

import org.openmuc.framework.app.modbusgateway.ModbusConfigServlet;

public class Main {
    public static void main(String[] args) {
        try {
            ModbusConfigServlet servlet = new ModbusConfigServlet();
            servlet.activate();

        } catch (Exception e) {
            System.out.println("Error while activating" + e + e.getMessage());
        }
    }
}
