package org.openmuc.framework.app.modbusgateway;

import org.openmuc.framework.app.modbusgateway.services.ModbusConfigService;
import org.openmuc.framework.app.modbusgateway.services.ModbusDataReaderService;

public class Main {
    public static void main(String[] args) {
        try {
//            ModbusConfigService servlet = new ModbusConfigService();
            ModbusDataReaderService reader = new ModbusDataReaderService();
//            servlet.activate();
            reader.activate();

        } catch (Exception e) {
            System.out.println("Error while activating" + e + e.getMessage());
        }
    }
}
