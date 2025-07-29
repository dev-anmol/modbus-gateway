package org.openmuc.framework.app.modbusgateway.dataholder;

import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

/**
 * Singleton class for holding Modbus data in memory.
 * Stores Holding Registers, Input Registers, Coils, and Discrete Inputs.
 */
public class ModbusDataHolder {
    private static final ModbusDataHolder INSTANCE = new ModbusDataHolder();

    private final Map<String, Object> channelData = new ConcurrentHashMap<>();
    private final Map<Integer, Integer> holdingRegisters = new ConcurrentHashMap<>();
    private final Map<Integer, Integer> inputRegisters = new ConcurrentHashMap<>();
    private final Map<Integer, Boolean> coils = new ConcurrentHashMap<>();
    private final Map<Integer, Boolean> discreteInputs = new ConcurrentHashMap<>();

//    private final Map<String, Integer> holdingRegistersWithUnit = new ConcurrentHashMap<>();
//    private final Map<String, Integer> inputRegistersWithUnit = new ConcurrentHashMap<>();
//    private final Map<String, Boolean> coilsWithUnit = new ConcurrentHashMap<>();
//    private final Map<String, Boolean> discreteInputsWithUnit = new ConcurrentHashMap<>();

    private ModbusDataHolder() {}

    /**
     * Get the singleton instance of ModbusDataHolder.
     */
    public static ModbusDataHolder getInstance() {
        return INSTANCE;
    }

    // Channel data methods
    public void setChannelData(String channelId, Object value) {
        channelData.put(channelId, value);
    }

    public Object getChannelData(String channelId) {
        return channelData.get(channelId);
    }

//     Holding Registers
    public void setHoldingRegister(int address, int value) {
        holdingRegisters.put(address, value);
    }

//    public void setHoldingRegisterWithUnit(int unitId, int address, int value) {
//        String key = unitId + ":" + address;
//        holdingRegistersWithUnit.put(key, value);
//    }


    public Integer getHoldingRegister(int address) {
        return holdingRegisters.get(address);
    }

    public Map<Integer, Integer> getAllHoldingRegisters() {
        return new ConcurrentHashMap<>(holdingRegisters);
    }

    // Input Registers
    public void setInputRegister(int address, int value) {
        inputRegisters.put(address, value);
    }

    public Integer getInputRegister(int address) {
        return inputRegisters.get(address);
    }

    public Map<Integer, Integer> getAllInputRegisters() {
        return new ConcurrentHashMap<>(inputRegisters);
    }

    // Coils
    public void setCoil(int address, boolean value) {
        coils.put(address, value);
    }

    public Boolean getCoil(int address) {
        return coils.get(address);
    }

    public Map<Integer, Boolean> getAllCoils() {
        return new ConcurrentHashMap<>(coils);
    }

    // Discrete Inputs
    public void setDiscreteInput(int address, boolean value) {
        discreteInputs.put(address, value);
    }

    public Boolean getDiscreteInput(int address) {
        return discreteInputs.get(address);
    }

    public Map<Integer, Boolean> getAllDiscreteInputs() {
        return new ConcurrentHashMap<>(discreteInputs);
    }
}
