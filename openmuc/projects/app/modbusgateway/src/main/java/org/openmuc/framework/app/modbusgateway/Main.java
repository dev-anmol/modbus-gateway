package org.openmuc.framework.app.modbusgateway;

import org.openmuc.framework.app.modbusgateway.services.ModbusConfigService;
import org.openmuc.framework.app.modbusgateway.services.ModbusDataReaderService;

public class Main {
    public static void main(String[] args) {
        try {
            ModbusConfigService configService = new ModbusConfigService();
            ModbusDataReaderService pollingService = new ModbusDataReaderService();

            configService.activate();
            pollingService.activate();

        } catch (Exception e) {
            System.out.println("Error while activating" + e + e.getMessage());
        }
    }
}
