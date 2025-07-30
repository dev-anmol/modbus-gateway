package org.openmuc.framework.app.modbusgateway.dataholder;

import org.openmuc.framework.app.modbusgateway.pojo.Device;
import org.openmuc.framework.app.modbusgateway.services.ModbusConfigService;

import java.util.concurrent.ConcurrentHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.HashSet;

/**
 * FIXED: Unit ID-aware Modbus data holder with dynamic unit ID retrieval
 */
public class ModbusDataHolder {
    private static final ModbusDataHolder INSTANCE = new ModbusDataHolder();

    private final Map<String, Object> channelData = new ConcurrentHashMap<>();

    // FIXED: Unit ID-aware register storage using composite keys
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

    // FIXED: Dynamic default unit ID retrieval
    private int getDefaultUnitId() {
        List<Device> deviceList = ModbusConfigService.accessDeviceData();
        if (deviceList != null && !deviceList.isEmpty()) {
            return deviceList.get(0).getUnitId(); // Use first device's unit ID
        }
        return 1; // Last resort fallback
    }

    // FIXED: Unit ID-aware holding register methods with dynamic defaults
    public void setHoldingRegister(int address, int value) {
        setHoldingRegisterForUnit(getDefaultUnitId(), address, value);
    }

    public void setHoldingRegisterForUnit(int unitId, int address, int value) {
        String key = unitId + ":" + address;
        holdingRegisters.put(key, value);
    }

    public Integer getHoldingRegister(int address) {
        return getHoldingRegisterForUnit(getDefaultUnitId(), address);
    }

    public Integer getHoldingRegisterForUnit(int unitId, int address) {
        String key = unitId + ":" + address;
        return holdingRegisters.get(key);
    }

    public Map<Integer, Integer> getAllHoldingRegisters() {
        // Return all registers across all unit IDs for backward compatibility
        Map<Integer, Integer> result = new ConcurrentHashMap<>();
        for (Map.Entry<String, Integer> entry : holdingRegisters.entrySet()) {
            String[] parts = entry.getKey().split(":");
            if (parts.length == 2) {
                try {
                    int address = Integer.parseInt(parts[1]);
                    result.put(address, entry.getValue());
                } catch (NumberFormatException e) {
                    // Skip invalid entries
                }
            }
        }
        return result;
    }

    // FIXED: Get holding registers for specific unit ID
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

    // FIXED: Get all holding registers grouped by unit ID
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

    // FIXED: Unit ID-aware input register methods with dynamic defaults
    public void setInputRegister(int address, int value) {
        setInputRegisterForUnit(getDefaultUnitId(), address, value);
    }

    public void setInputRegisterForUnit(int unitId, int address, int value) {
        String key = unitId + ":" + address;
        inputRegisters.put(key, value);
    }

    public Integer getInputRegister(int address) {
        return getInputRegisterForUnit(getDefaultUnitId(), address);
    }

    public Integer getInputRegisterForUnit(int unitId, int address) {
        String key = unitId + ":" + address;
        return inputRegisters.get(key);
    }

    public Map<Integer, Integer> getAllInputRegisters() {
        Map<Integer, Integer> result = new ConcurrentHashMap<>();
        for (Map.Entry<String, Integer> entry : inputRegisters.entrySet()) {
            String[] parts = entry.getKey().split(":");
            if (parts.length == 2) {
                try {
                    int address = Integer.parseInt(parts[1]);
                    result.put(address, entry.getValue());
                } catch (NumberFormatException e) {
                    // Skip invalid entries
                }
            }
        }
        return result;
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

    // FIXED: Unit ID-aware coil methods with dynamic defaults
    public void setCoil(int address, boolean value) {
        setCoilForUnit(getDefaultUnitId(), address, value);
    }

    public void setCoilForUnit(int unitId, int address, boolean value) {
        String key = unitId + ":" + address;
        coils.put(key, value);
    }

    public Boolean getCoil(int address) {
        return getCoilForUnit(getDefaultUnitId(), address);
    }

    public Boolean getCoilForUnit(int unitId, int address) {
        String key = unitId + ":" + address;
        return coils.get(key);
    }

    public Map<Integer, Boolean> getAllCoils() {
        Map<Integer, Boolean> result = new ConcurrentHashMap<>();
        for (Map.Entry<String, Boolean> entry : coils.entrySet()) {
            String[] parts = entry.getKey().split(":");
            if (parts.length == 2) {
                try {
                    int address = Integer.parseInt(parts[1]);
                    result.put(address, entry.getValue());
                } catch (NumberFormatException e) {
                    // Skip invalid entries
                }
            }
        }
        return result;
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

    // FIXED: Unit ID-aware discrete input methods with dynamic defaults
    public void setDiscreteInput(int address, boolean value) {
        setDiscreteInputForUnit(getDefaultUnitId(), address, value);
    }

    public void setDiscreteInputForUnit(int unitId, int address, boolean value) {
        String key = unitId + ":" + address;
        discreteInputs.put(key, value);
    }

    public Boolean getDiscreteInput(int address) {
        return getDiscreteInputForUnit(getDefaultUnitId(), address);
    }

    public Boolean getDiscreteInputForUnit(int unitId, int address) {
        String key = unitId + ":" + address;
        return discreteInputs.get(key);
    }

    public Map<Integer, Boolean> getAllDiscreteInputs() {
        Map<Integer, Boolean> result = new ConcurrentHashMap<>();
        for (Map.Entry<String, Boolean> entry : discreteInputs.entrySet()) {
            String[] parts = entry.getKey().split(":");
            if (parts.length == 2) {
                try {
                    int address = Integer.parseInt(parts[1]);
                    result.put(address, entry.getValue());
                } catch (NumberFormatException e) {
                    // Skip invalid entries
                }
            }
        }
        return result;
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

    // FIXED: Utility methods for getting all available unit IDs
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
}
