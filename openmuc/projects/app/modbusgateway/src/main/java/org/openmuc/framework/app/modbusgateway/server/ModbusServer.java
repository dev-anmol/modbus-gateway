package org.openmuc.framework.app.modbusgateway.server;

import com.ghgande.j2mod.modbus.procimg.*;
import com.ghgande.j2mod.modbus.slave.ModbusSlave;
import com.ghgande.j2mod.modbus.slave.ModbusSlaveFactory;
import org.openmuc.framework.app.modbusgateway.dataholder.ModbusDataHolder;
import org.openmuc.framework.app.modbusgateway.pojo.Device;
import org.openmuc.framework.app.modbusgateway.pojo.Mapping;
import org.openmuc.framework.app.modbusgateway.pojo.Server;
import org.openmuc.framework.app.modbusgateway.services.ModbusConfigService;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.InetAddress;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Component(immediate = true)
public class ModbusServer {
    private static final Logger logger = LoggerFactory.getLogger(ModbusServer.class);
    private static final String APP_NAME = "Dynamic Modbus Server Service";

    private final ModbusDataHolder dataHolder = ModbusDataHolder.getInstance();
    private final Map<String, ModbusSlave> activeServers = new ConcurrentHashMap<>();
    private final Map<String, DynamicProcessImage> processImages = new ConcurrentHashMap<>();
    private ScheduledExecutorService scheduler;

    // Track register mappings for proper synchronization
    private final Map<Integer, String> registerToChannelMapping = new ConcurrentHashMap<>();
    private final Map<String, Set<Integer>> serverToRegistersMapping = new ConcurrentHashMap<>();

    private List<Server> serverConfigs;
    private List<Device> deviceConfigs;
    private List<Mapping> mappingConfigs;

    @Activate
    private void activate() {
        logger.info("Activating Modbus Server Service, {}", APP_NAME);
        try {
            scheduler = Executors.newScheduledThreadPool(5);

            scheduler.schedule(() -> {
                try {
                    initializeServers();
                    startDataSynchronization();
                } catch (Exception e) {
                    logger.error("Failed to initialize servers: {}", e.getMessage(), e);
                }
            }, 20, TimeUnit.SECONDS);

        } catch (Exception e) {
            logger.error("Failed to activate Modbus Server Service", e);
            throw new RuntimeException("Server activation failed", e);
        }
    }

    private void initializeServers() {
        try {
            serverConfigs = ModbusConfigService.accessServerData();
            deviceConfigs = ModbusConfigService.accessDeviceData();
            mappingConfigs = ModbusConfigService.accessMappingData();

            logger.info("RECEIVED SERVER DATA: {}", serverConfigs);
            logger.info("RECEIVED DEVICE DATA: {}", deviceConfigs);
            logger.info("RECEIVED MAPPING DATA: {}", mappingConfigs);

            if (serverConfigs == null || serverConfigs.isEmpty()) {
                logger.warn("No server configurations available");
                return;
            }

            // Build register mappings first
            buildRegisterMappings();

            for (Server serverConfig : serverConfigs) {
                createModbusServerWithRetry(serverConfig, 3);
            }

            logger.info("Successfully initialized {} Modbus servers", activeServers.size());

        } catch (Exception e) {
            logger.error("Error initializing servers", e);
            throw new RuntimeException("Server initialization failed", e);
        }
    }

    private void buildRegisterMappings() {
        if (deviceConfigs == null || mappingConfigs == null) {
            logger.warn("Cannot build register mappings - missing configuration data");
            return;
        }

        for (Device device : deviceConfigs) {
            for (Mapping mapping : mappingConfigs) {
                if (mapping.getDeviceProfileId() == device.getDeviceProfileId()) {
                    String channelId = device.getName() + "_" + mapping.getParameter() + "_" + mapping.getId();
                    int registerAddress = Integer.parseInt(mapping.getRegisterAddress());

                    registerToChannelMapping.put(registerAddress, channelId);

                    logger.info("Mapped register {} to channel {} for register type {}",
                            registerAddress, channelId, mapping.getRegisterType());
                }
            }
        }

        // Initialize server to registers mapping
        for (Server serverConfig : serverConfigs) {
            serverToRegistersMapping.put(serverConfig.getName(), new HashSet<>());
        }
    }

    private void createModbusServerWithRetry(Server serverConfig, int maxRetries) {
        String serverKey = serverConfig.getName();
        Exception lastException = null;

        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                createModbusServer(serverConfig);
                return;
            } catch (Exception e) {
                lastException = e;
                logger.warn("Attempt {} failed for server {}: {}", attempt, serverKey, e.getMessage());

                if (attempt < maxRetries) {
                    try {
                        Thread.sleep(1000 * attempt);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        throw new RuntimeException("Server creation interrupted", ie);
                    }
                }
            }
        }

        logger.error("Failed to create server {} after {} attempts", serverKey, maxRetries);
        throw new RuntimeException("Server creation failed: " + serverKey, lastException);
    }

    private void createModbusServer(Server serverConfig) throws Exception {
        String serverKey = serverConfig.getName();
        logger.info("Creating Modbus server: {} on port {}", serverKey, serverConfig.getPort());

        ModbusSlave modbusSlave = ModbusSlaveFactory.createTCPSlave(
                InetAddress.getByName(serverConfig.getIPAddress()),
                serverConfig.getPort(),
                serverConfig.getPoolSize(),
                false
        );

        Set<Integer> unitIds = getUnitIdsForServer(serverConfig);

        // FIXED: Create separate process image for each unit ID
        for (Integer unitId : unitIds) {
            String imageKey = serverKey + "_unit" + unitId;
            DynamicProcessImage processImage = new DynamicProcessImage(imageKey);
            processImages.put(imageKey, processImage);

            // Initialize process image for this specific unit ID
            initializeProcessImageForUnit(processImage, serverConfig, unitId);

            modbusSlave.addProcessImage(unitId, processImage);
            logger.info("Added separate process image for server {} with unit ID {}", serverKey, unitId);
        }

        modbusSlave.open();
        activeServers.put(serverKey, modbusSlave);
        logger.info("Successfully started Modbus server: {} on {}:{}",
                serverKey, serverConfig.getIPAddress(), serverConfig.getPort());
    }

    private void initializeProcessImageForUnit(DynamicProcessImage processImage, Server serverConfig, int unitId) {
        if (deviceConfigs == null || deviceConfigs.isEmpty() ||
                mappingConfigs == null || mappingConfigs.isEmpty()) {
            logger.warn("Empty device/mapping list – skipping process-image setup for unit {}", unitId);
            return;
        }

        // Find the device for this unit ID
        Device targetDevice = null;
        for (Device device : deviceConfigs) {
            if (device.getUnitId() == unitId) {
                targetDevice = device;
                break;
            }
        }

        if (targetDevice == null) {
            logger.warn("No device found for unit ID {}", unitId);
            return;
        }

        List<Mapping> deviceMappings = getMappingsForDevice(targetDevice);
        for (Mapping mapping : deviceMappings) {
            int address = Integer.parseInt(mapping.getRegisterAddress());

            // Get unit-specific data
            String channelId = targetDevice.getName() + "_" + mapping.getParameter() + "_" + mapping.getId();
            Object currentValue = dataHolder.getChannelData(channelId);

            switch (mapping.getRegisterType().toLowerCase()) {
                case "holding_registers":
                    int holdingValue = extractIntValueFromObject(currentValue, 0);
                    processImage.initializeHoldingRegister(address, holdingValue);
                    dataHolder.setHoldingRegisterForUnit(unitId, address, holdingValue);
                    break;

                case "input_registers":
                    int inputValue = extractIntValueFromObject(currentValue, 0);
                    processImage.initializeInputRegister(address, inputValue);
                    dataHolder.setInputRegisterForUnit(unitId, address, inputValue);
                    break;

                case "coils":
                    boolean coilValue = extractBoolValueFromObject(currentValue, false);
                    processImage.initializeCoil(address, coilValue);
                    dataHolder.setCoilForUnit(unitId, address, coilValue);
                    break;

                case "discrete_inputs":
                    boolean discreteValue = extractBoolValueFromObject(currentValue, false);
                    processImage.initializeDiscreteInput(address, discreteValue);
                    dataHolder.setDiscreteInputForUnit(unitId, address, discreteValue);
                    break;
            }

            logger.info("Initialized {} register at address {} with value {} for unit ID {}",
                    mapping.getRegisterType(), address, currentValue, unitId);
        }
    }

    // FIXED: Helper methods to extract values with defaults (no hardcoded values)
    private int extractIntValueFromObject(Object value, int defaultValue) {
        if (value instanceof Number) {
            return ((Number) value).intValue();
        }
        if (value instanceof org.openmuc.framework.data.Value) {
            try {
                return ((org.openmuc.framework.data.Value) value).asInt();
            } catch (Exception e) {
                logger.debug("Cannot convert OpenMUC value to int: {}", e.getMessage());
            }
        }
        return defaultValue;
    }

    private boolean extractBoolValueFromObject(Object value, boolean defaultValue) {
        if (value instanceof Boolean) {
            return (Boolean) value;
        }
        if (value instanceof org.openmuc.framework.data.Value) {
            try {
                return ((org.openmuc.framework.data.Value) value).asBoolean();
            } catch (Exception e) {
                logger.debug("Cannot convert OpenMUC value to boolean: {}", e.getMessage());
            }
        }
        return defaultValue;
    }

    private Set<Integer> getUnitIdsForServer(Server serverConfig) {
        Set<Integer> unitIds = new HashSet<>();

        if (deviceConfigs != null) {
            List<Device> relevantDevices = getDevicesForServer(serverConfig);
            for (Device device : relevantDevices) {
                unitIds.add(device.getUnitId());
            }
        }

        if (unitIds.isEmpty()) {
            unitIds.add(1);
        }

        return unitIds;
    }

    private List<Device> getDevicesForServer(Server serverConfig) {
        List<Device> relevantDevices = new ArrayList<>();

        if (deviceConfigs != null) {
            for (Device device : deviceConfigs) {
                relevantDevices.add(device);
            }
        }

        return relevantDevices;
    }

    private List<Mapping> getMappingsForDevice(Device device) {
        List<Mapping> deviceMappings = new ArrayList<>();

        if (mappingConfigs != null) {
            for (Mapping mapping : mappingConfigs) {
                if (mapping.getDeviceProfileId() == device.getDeviceProfileId()) {
                    deviceMappings.add(mapping);
                }
            }
        }

        return deviceMappings;
    }

    private void startDataSynchronization() {
        // More frequent synchronization for better responsiveness
        scheduler.scheduleAtFixedRate(() -> {
            try {
                synchronizeChannelDataToRegisters();
                synchronizeRegistersToProcessImages();
            } catch (Exception e) {
                logger.error("Error during data synchronization: {}", e.getMessage(), e);
            }
        }, 1, 1, TimeUnit.SECONDS); // Increased frequency to 1 second
    }

    /**
     * NEW METHOD: Synchronize channel data to register mappings in data holder
     */
    private void synchronizeChannelDataToRegisters() {
        for (Map.Entry<Integer, String> entry : registerToChannelMapping.entrySet()) {
            int registerAddress = entry.getKey();
            String channelId = entry.getValue();

            Object channelValue = dataHolder.getChannelData(channelId);
            if (channelValue != null) {
                // Find the mapping to determine register type
                try {
                    Mapping relevantMapping = findMappingForChannelId(channelId);
                    if (relevantMapping != null) {
                        updateDataHolderRegister(relevantMapping, registerAddress, channelValue);
                    }
                } catch (Exception e) {
                    logger.warn("Type mismatch for register {}: {}", registerAddress, e.getMessage());
                }
            }
        }
    }

    private Mapping findMappingForChannelId(String channelId) {
        if (deviceConfigs == null || mappingConfigs == null) return null;

        for (Device device : deviceConfigs) {
            for (Mapping mapping : mappingConfigs) {
                if (mapping.getDeviceProfileId() == device.getDeviceProfileId()) {
                    String expectedChannelId = device.getName() + "_" + mapping.getParameter() + "_" + mapping.getId();
                    if (expectedChannelId.equals(channelId)) {
                        return mapping;
                    }
                }
            }
        }
        return null;
    }

    private void updateDataHolderRegister(Mapping mapping, int address, Object value) {
        try {
            switch (mapping.getRegisterType().toLowerCase()) {
                case "holding_registers":
                    if (value instanceof Number) {
                        int intValue = ((Number) value).intValue();
                        Integer currentValue = dataHolder.getHoldingRegister(address);
                        if (currentValue == null || !currentValue.equals(intValue)) {
                            dataHolder.setHoldingRegister(address, intValue);
                            logger.debug("Updated holding register {} to {} from channel data", address, intValue);
                        }
                    }
                    break;

                case "input_registers":
                    if (value instanceof Number) {
                        int intValue = ((Number) value).intValue();
                        Integer currentValue = dataHolder.getInputRegister(address);
                        if (currentValue == null || !currentValue.equals(intValue)) {
                            dataHolder.setInputRegister(address, intValue);
                            logger.debug("Updated input register {} to {} from channel data", address, intValue);
                        }
                    }
                    break;

                case "coils":
                    if (value instanceof Boolean) {
                        boolean boolValue = (Boolean) value;
                        Boolean currentValue = dataHolder.getCoil(address);
                        if (currentValue == null || !currentValue.equals(boolValue)) {
                            dataHolder.setCoil(address, boolValue);
                            logger.debug("Updated coil {} to {} from channel data", address, boolValue);
                        }
                    }
                    break;

                case "discrete_inputs":
                    if (value instanceof Boolean) {
                        boolean boolValue = (Boolean) value;
                        Boolean currentValue = dataHolder.getDiscreteInput(address);
                        if (currentValue == null || !currentValue.equals(boolValue)) {
                            dataHolder.setDiscreteInput(address, boolValue);
                            logger.debug("Updated discrete input {} to {} from channel data", address, boolValue);
                        }
                    }
                    break;
            }
        } catch (Exception e) {
            logger.error("Error updating data holder register {}: {}", address, e.getMessage());
        }
    }

    private void synchronizeRegistersToProcessImages() {
        for (Map.Entry<String, DynamicProcessImage> entry : processImages.entrySet()) {
            String imageKey = entry.getKey();
            DynamicProcessImage processImage = entry.getValue();

            try {
                // Extract unit ID from image key (e.g., "server1_unit1" -> 1)
                int unitId = extractUnitIdFromImageKey(imageKey);

                // Synchronize unit-specific data
                synchronizeUnitDataToProcessImage(processImage, unitId);

            } catch (Exception e) {
                logger.error("Error synchronizing data for image {}: {}", imageKey, e.getMessage());
            }
        }
    }

    // FIXED: Helper method to extract unit ID from image key (no hardcoded values)
    private int extractUnitIdFromImageKey(String imageKey) {
        try {
            String[] parts = imageKey.split("_unit");
            if (parts.length == 2) {
                return Integer.parseInt(parts[1]);
            }
        } catch (NumberFormatException e) {
            logger.warn("Cannot extract unit ID from image key: {}", imageKey);
        }
        // Return the first available unit ID instead of hardcoded 1
        if (deviceConfigs != null && !deviceConfigs.isEmpty()) {
            return deviceConfigs.get(0).getUnitId();
        }
        return 1; // Last resort default
    }

    // FIXED: Synchronize unit-specific data to process image
    private void synchronizeUnitDataToProcessImage(DynamicProcessImage processImage, int unitId) {
        // Synchronize holding registers for this unit
        Map<Integer, Integer> holdingRegs = dataHolder.getHoldingRegistersForUnit(unitId);
        for (Map.Entry<Integer, Integer> regEntry : holdingRegs.entrySet()) {
            processImage.updateHoldingRegister(regEntry.getKey(), regEntry.getValue());
        }

        // Synchronize coils for this unit
        Map<Integer, Boolean> coils = dataHolder.getCoilsForUnit(unitId);
        for (Map.Entry<Integer, Boolean> coilEntry : coils.entrySet()) {
            processImage.updateCoil(coilEntry.getKey(), coilEntry.getValue());
        }

        // Synchronize input registers for this unit
        Map<Integer, Integer> inputRegs = dataHolder.getInputRegistersForUnit(unitId);
        for (Map.Entry<Integer, Integer> regEntry : inputRegs.entrySet()) {
            // input register is read-only
            logger.debug("Input register {} for unit {} has value {}",
                    regEntry.getKey(), unitId, regEntry.getValue());
        }

        // Synchronize discrete inputs for this unit
        Map<Integer, Boolean> discreteInputs = dataHolder.getDiscreteInputsForUnit(unitId);
        for (Map.Entry<Integer, Boolean> diEntry : discreteInputs.entrySet()) {
            // discrete inputs are read-only
            logger.debug("Discrete input {} for unit {} has value {}",
                    diEntry.getKey(), unitId, diEntry.getValue());
        }
    }


    @Deactivate
    private void deactivate() {
        logger.info("Deactivating Modbus Server Service");

        if (scheduler != null && !scheduler.isShutdown()) {
            scheduler.shutdown();
            try {
                if (!scheduler.awaitTermination(5, TimeUnit.SECONDS)) {
                    scheduler.shutdownNow();
                }
            } catch (InterruptedException e) {
                scheduler.shutdownNow();
                Thread.currentThread().interrupt();
            }
        }

        for (Map.Entry<String, ModbusSlave> entry : activeServers.entrySet()) {
            try {
                entry.getValue().close();
                logger.info("Stopped Modbus server: {}", entry.getKey());
            } catch (Exception e) {
                logger.warn("Error stopping server {}: {}", entry.getKey(), e.getMessage());
            }
        }

        activeServers.clear();
        processImages.clear();
        logger.info("Modbus Server Service deactivated");
    }

    /**
     * Enhanced Dynamic Process Image implementation
     */
    private class DynamicProcessImage implements ProcessImage {
        private final String serverId;
        private final SimpleProcessImage delegate = new SimpleProcessImage();
        private final Map<Integer, Register> holdingRegisters = new ConcurrentHashMap<>();
        private final Map<Integer, InputRegister> inputRegisters = new ConcurrentHashMap<>();
        private final Map<Integer, DigitalOut> coils = new ConcurrentHashMap<>();
        private final Map<Integer, DigitalIn> discreteInputs = new ConcurrentHashMap<>();

        public DynamicProcessImage(String serverId) {
            this.serverId = serverId;
        }

        // Initialization methods
        public void initializeHoldingRegister(int address, int value) {
            try {
                SimpleRegister register = new SimpleRegister(value);
                holdingRegisters.put(address, register);
                delegate.addRegister(address, register);
                logger.info("Initialized holding register {} with value {} for server {}",
                        address, value, serverId);
            } catch (Exception e) {
                logger.error("Error initializing holding register {}: {}", address, e.getMessage());
            }
        }

        public void initializeInputRegister(int address, int value) {
            try {
                SimpleInputRegister register = new SimpleInputRegister(value);
                inputRegisters.put(address, register);
                delegate.addInputRegister(address, register);
                logger.info("Initialized input register {} with value {} for server {}",
                        address, value, serverId);
            } catch (Exception e) {
                logger.error("Error initializing input register {}: {}", address, e.getMessage());
            }
        }

        public void initializeCoil(int address, boolean value) {
            try {
                SimpleDigitalOut coil = new SimpleDigitalOut(value);
                coils.put(address, coil);
                delegate.addDigitalOut(address, coil);
                logger.info("Initialized coil {} with value {} for server {}", address, value, serverId);
            } catch (Exception e) {
                logger.error("Error initializing coil {}: {}", address, e.getMessage());
            }
        }

        public void initializeDiscreteInput(int address, boolean value) {
            try {
                SimpleDigitalIn discreteInput = new SimpleDigitalIn(value);
                discreteInputs.put(address, discreteInput);
                delegate.addDigitalIn(address, discreteInput);
                logger.info("Initialized discrete input {} with value {} for server {}",
                        address, value, serverId);
            } catch (Exception e) {
                logger.error("Error initializing discrete input {}: {}", address, e.getMessage());
            }
        }

        // Enhanced update methods with better change detection
        public void updateHoldingRegister(int address, int value) {
            Register register = holdingRegisters.get(address);
            if (register == null) {
                // Register doesn't exist, create it
                SimpleRegister newRegister = new SimpleRegister(value);
                holdingRegisters.put(address, newRegister);
                delegate.addRegister(address, newRegister);
                logger.info("Created and updated holding register {} to {} for server {}",
                        address, value, serverId);
            } else if (register.getValue() != value) {
                // Update existing register
                try {
                    register.setValue(value);
                    logger.info("Updated holding register {} from {} to {} for server {}",
                            address, register.getValue(), value, serverId);
                } catch (Exception e) {
                    logger.error("Error updating holding register {}: {}", address, e.getMessage());
                }
            }
        }

//        public void updateInputRegister(int address, int value) {
//            InputRegister register = inputRegisters.get(address);
//            if (register == null) {
//                SimpleInputRegister newRegister = new SimpleInputRegister(value);
//                inputRegisters.put(address, newRegister);
//                delegate.addInputRegister(address, newRegister);
//                logger.info("Created and updated input register {} to {} for server {}",
//                        address, value, serverId);
//            } else if (register.getValue() != value) {
//                try {
//                    register.setValue(value);
//                    logger.info("Updated input register {} to {} for server {}",
//                            address, value, serverId);
//                } catch (Exception e) {
//                    logger.error("Error updating input register {}: {}", address, e.getMessage());
//                }
//            }
//        }

        public void updateCoil(int address, boolean value) {
            DigitalOut coil = coils.get(address);
            if (coil == null) {
                SimpleDigitalOut newCoil = new SimpleDigitalOut(value);
                coils.put(address, newCoil);
                delegate.addDigitalOut(address, newCoil);
                logger.info("Created and updated coil {} to {} for server {}", address, value, serverId);
            } else if (coil.isSet() != value) {
                try {
                    coil.set(value);
                    logger.info("Updated coil {} to {} for server {}", address, value, serverId);
                } catch (Exception e) {
                    logger.error("Error updating coil {}: {}", address, e.getMessage());
                }
            }
        }

//        public void updateDiscreteInput(int address, boolean value) {
//            DigitalIn discreteInput = discreteInputs.get(address);
//            if (discreteInput == null) {
//                SimpleDigitalIn newInput = new SimpleDigitalIn(value);
//                discreteInputs.put(address, newInput);
//                delegate.addDigitalIn(address, newInput);
//                logger.info("Created and updated discrete input {} to {} for server {}",
//                        address, value, serverId);
//            } else if (discreteInput.isSet() != value) {
//                try {
//                    discreteInput.set(value);
//                    logger.info("Updated discrete input {} to {} for server {}",
//                            address, value, serverId);
//                } catch (Exception e) {
//                    logger.error("Error updating discrete input {}: {}", address, e.getMessage());
//                }
//            }
//        }

        // ProcessImage interface implementation
        @Override
        public Register getRegister(int ref) throws IllegalAddressException {
            logger.info("Client reading holding register {} from server {}", ref, serverId);
            Register register = holdingRegisters.get(ref);
            if (register != null) {
                logger.info("Returning holding register {} value: {}", ref, register.getValue());
                return register;
            }
            throw new IllegalAddressException("Register " + ref + " not found");
        }

        @Override
        public Register[] getRegisterRange(int ref, int count) throws IllegalAddressException {
            logger.info("Client reading {} holding registers starting at {} from server {}",
                    count, ref, serverId);
            Register[] registers = new Register[count];
            for (int i = 0; i < count; i++) {
                Register register = holdingRegisters.get(ref + i);
                if (register == null) {
                    throw new IllegalAddressException("Register " + (ref + i) + " not found");
                }
                registers[i] = register;
            }
            return registers;
        }

        @Override
        public InputRegister getInputRegister(int ref) throws IllegalAddressException {
            logger.info("Client reading input register {} from server {}", ref, serverId);
            InputRegister register = inputRegisters.get(ref);
            if (register != null) {
                return register;
            }
            throw new IllegalAddressException("Input register " + ref + " not found");
        }

        @Override
        public InputRegister[] getInputRegisterRange(int ref, int count) throws IllegalAddressException {
            logger.info("Client reading {} input registers starting at {} from server {}",
                    count, ref, serverId);
            InputRegister[] registers = new InputRegister[count];
            for (int i = 0; i < count; i++) {
                InputRegister register = inputRegisters.get(ref + i);
                if (register == null) {
                    throw new IllegalAddressException("Input register " + (ref + i) + " not found");
                }
                registers[i] = register;
            }
            return registers;
        }

        @Override
        public DigitalOut getDigitalOut(int ref) throws IllegalAddressException {
            logger.info("Client reading coil {} from server {}", ref, serverId);
            DigitalOut coil = coils.get(ref);
            if (coil != null) {
                return coil;
            }
            throw new IllegalAddressException("Coil " + ref + " not found");
        }

        @Override
        public DigitalOut[] getDigitalOutRange(int ref, int count) throws IllegalAddressException {
            logger.info("Client reading {} coils starting at {} from server {}", count, ref, serverId);
            DigitalOut[] coilArray = new DigitalOut[count];
            for (int i = 0; i < count; i++) {
                DigitalOut coil = coils.get(ref + i);
                if (coil == null) {
                    throw new IllegalAddressException("Coil " + (ref + i) + " not found");
                }
                coilArray[i] = coil;
            }
            return coilArray;
        }

        @Override
        public DigitalIn getDigitalIn(int ref) throws IllegalAddressException {
            logger.info("Client reading discrete input {} from server {}", ref, serverId);
            DigitalIn discreteInput = discreteInputs.get(ref);
            if (discreteInput != null) {
                return discreteInput;
            }
            throw new IllegalAddressException("Discrete input " + ref + " not found");
        }

        @Override
        public DigitalIn[] getDigitalInRange(int ref, int count) throws IllegalAddressException {
            logger.info("Client reading {} discrete inputs starting at {} from server {}",
                    count, ref, serverId);
            DigitalIn[] inputArray = new DigitalIn[count];
            for (int i = 0; i < count; i++) {
                DigitalIn input = discreteInputs.get(ref + i);
                if (input == null) {
                    throw new IllegalAddressException("Discrete input " + (ref + i) + " not found");
                }
                inputArray[i] = input;
            }
            return inputArray;
        }

        // Remaining ProcessImage methods (delegated)
        @Override
        public int getDigitalOutCount() {
            return delegate.getDigitalOutCount();
        }

        @Override
        public int getDigitalInCount() {
            return delegate.getDigitalInCount();
        }

        @Override
        public int getInputRegisterCount() {
            return delegate.getInputRegisterCount();
        }

        @Override
        public int getRegisterCount() {
            return delegate.getRegisterCount();
        }

        @Override
        public File getFile(int ref) throws IllegalAddressException {
            return delegate.getFile(ref);
        }

        @Override
        public File getFileByNumber(int ref) throws IllegalAddressException {
            return delegate.getFileByNumber(ref);
        }

        @Override
        public int getFileCount() {
            return delegate.getFileCount();
        }

        @Override
        public FIFO getFIFO(int ref) throws IllegalAddressException {
            return delegate.getFIFO(ref);
        }

        @Override
        public FIFO getFIFOByAddress(int ref) throws IllegalAddressException {
            return delegate.getFIFOByAddress(ref);
        }

        @Override
        public int getFIFOCount() {
            return delegate.getFIFOCount();
        }
    }
}