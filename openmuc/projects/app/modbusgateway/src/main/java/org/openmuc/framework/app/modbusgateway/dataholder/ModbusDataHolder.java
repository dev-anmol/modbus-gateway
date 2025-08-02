package org.openmuc.framework.app.modbusgateway.dataholder;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;


public class ModbusDataHolder {
    private static final ModbusDataHolder INSTANCE = new ModbusDataHolder();

    private final Map<String, Object> channelData = new ConcurrentHashMap<>();

    // Unit ID-aware register storage using composite keys
    private final Map<String, Integer> holdingRegisters = new ConcurrentHashMap<>();
    private final Map<String, Integer> inputRegisters = new ConcurrentHashMap<>();
    private final Map<String, Boolean> coils = new ConcurrentHashMap<>();
    private final Map<String, Boolean> discreteInputs = new ConcurrentHashMap<>();

    private ModbusDataHolder() {}

    public static ModbusDataHolder getInstance() {
        return INSTANCE;
    }

    // Channel data methods (unchanged)
    public void setChannelData(String channelId, Object value) {
        channelData.put(channelId, value);
    }

    public Object getChannelData(String channelId) {
        return channelData.get(channelId);
    }

    // REMOVED: Problematic default unit ID methods - these caused data corruption
    // Old methods that used getDefaultUnitId() have been removed:
    // - setHoldingRegister(int address, int value)
    // - getHoldingRegister(int address)
    // - setInputRegister(int address, int value)
    // - getInputRegister(int address)
    // - setCoil(int address, boolean value)
    // - getCoil(int address)
    // - setDiscreteInput(int address, boolean value)
    // - getDiscreteInput(int address)

    // ========================================================================
    // HOLDING REGISTERS - Unit ID-aware methods ONLY
    // ========================================================================

    public void setHoldingRegisterForUnit(int unitId, int address, int value) {
        String key = unitId + ":" + address;
        holdingRegisters.put(key, value);
    }

    public Integer getHoldingRegisterForUnit(int unitId, int address) {
        String key = unitId + ":" + address;
        return holdingRegisters.get(key);
    }

    public Map<Integer, Integer> getHoldingRegistersForUnit(int unitId) {
        Map<Integer, Integer> result = new ConcurrentHashMap<>();
        String prefix = unitId + ":";

        for (Map.Entry<String, Integer> entry : holdingRegisters.entrySet()) {
            if (entry.getKey().startsWith(prefix)) {
                try {
                    int address = Integer.parseInt(entry.getKey().substring(prefix.length()));
                    result.put(address, entry.getValue());
                } catch (NumberFormatException e) {
                    // Skip invalid entries
                }
            }
        }
        return result;
    }

    // ========================================================================
    // INPUT REGISTERS - Unit ID-aware methods ONLY
    // ========================================================================

    public void setInputRegisterForUnit(int unitId, int address, int value) {
        String key = unitId + ":" + address;
        inputRegisters.put(key, value);
    }

    public Integer getInputRegisterForUnit(int unitId, int address) {
        String key = unitId + ":" + address;
        return inputRegisters.get(key);
    }

    public Map<Integer, Integer> getInputRegistersForUnit(int unitId) {
        Map<Integer, Integer> result = new ConcurrentHashMap<>();
        String prefix = unitId + ":";

        for (Map.Entry<String, Integer> entry : inputRegisters.entrySet()) {
            if (entry.getKey().startsWith(prefix)) {
                try {
                    int address = Integer.parseInt(entry.getKey().substring(prefix.length()));
                    result.put(address, entry.getValue());
                } catch (NumberFormatException e) {
                    // Skip invalid entries
                }
            }
        }
        return result;
    }

    // ========================================================================
    // COILS - Unit ID-aware methods ONLY
    // ========================================================================

    public void setCoilForUnit(int unitId, int address, boolean value) {
        String key = unitId + ":" + address;
        coils.put(key, value);
    }

    public Boolean getCoilForUnit(int unitId, int address) {
        String key = unitId + ":" + address;
        return coils.get(key);
    }

    public Map<Integer, Boolean> getCoilsForUnit(int unitId) {
        Map<Integer, Boolean> result = new ConcurrentHashMap<>();
        String prefix = unitId + ":";

        for (Map.Entry<String, Boolean> entry : coils.entrySet()) {
            if (entry.getKey().startsWith(prefix)) {
                try {
                    int address = Integer.parseInt(entry.getKey().substring(prefix.length()));
                    result.put(address, entry.getValue());
                } catch (NumberFormatException e) {
                    // Skip invalid entries
                }
            }
        }
        return result;
    }

    // ========================================================================
    // DISCRETE INPUTS - Unit ID-aware methods ONLY
    // ========================================================================

    public void setDiscreteInputForUnit(int unitId, int address, boolean value) {
        String key = unitId + ":" + address;
        discreteInputs.put(key, value);
    }

    public Boolean getDiscreteInputForUnit(int unitId, int address) {
        String key = unitId + ":" + address;
        return discreteInputs.get(key);
    }

    public Map<Integer, Boolean> getDiscreteInputsForUnit(int unitId) {
        Map<Integer, Boolean> result = new ConcurrentHashMap<>();
        String prefix = unitId + ":";

        for (Map.Entry<String, Boolean> entry : discreteInputs.entrySet()) {
            if (entry.getKey().startsWith(prefix)) {
                try {
                    int address = Integer.parseInt(entry.getKey().substring(prefix.length()));
                    result.put(address, entry.getValue());
                } catch (NumberFormatException e) {
                    // Skip invalid entries
                }
            }
        }
        return result;
    }

    // ========================================================================
    // UTILITY METHODS
    // ========================================================================

    /**
     * Get all unit IDs that have data stored
     */
    public Set<Integer> getAllUnitIds() {
        Set<Integer> unitIds = new HashSet<>();

        // Extract unit IDs from all register types
        extractUnitIdsFromKeys(holdingRegisters.keySet(), unitIds);
        extractUnitIdsFromKeys(inputRegisters.keySet(), unitIds);
        extractUnitIdsFromKeys(coils.keySet(), unitIds);
        extractUnitIdsFromKeys(discreteInputs.keySet(), unitIds);

        return unitIds;
    }

    private void extractUnitIdsFromKeys(Set<String> keys, Set<Integer> unitIds) {
        for (String key : keys) {
            String[] parts = key.split(":");
            if (parts.length == 2) {
                try {
                    unitIds.add(Integer.parseInt(parts[0]));
                } catch (NumberFormatException e) {
                    // Skip invalid entries
                }
            }
        }
    }

    /**
     * Get all holding registers grouped by unit ID
     */
    public Map<Integer, Map<Integer, Integer>> getAllHoldingRegistersByUnit() {
        Map<Integer, Map<Integer, Integer>> result = new ConcurrentHashMap<>();

        for (Map.Entry<String, Integer> entry : holdingRegisters.entrySet()) {
            String[] parts = entry.getKey().split(":");
            if (parts.length == 2) {
                try {
                    int unitId = Integer.parseInt(parts[0]);
                    int address = Integer.parseInt(parts[1]);

                    result.computeIfAbsent(unitId, k -> new ConcurrentHashMap<>())
                            .put(address, entry.getValue());
                } catch (NumberFormatException e) {
                    // Skip invalid entries
                }
            }
        }
        return result;
    }
}