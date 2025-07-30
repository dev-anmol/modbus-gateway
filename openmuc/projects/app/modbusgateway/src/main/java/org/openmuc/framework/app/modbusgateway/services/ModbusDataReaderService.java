package org.openmuc.framework.app.modbusgateway.services;

import org.openmuc.framework.app.modbusgateway.dataholder.ModbusDataHolder;
import org.openmuc.framework.app.modbusgateway.pojo.Device;
import org.openmuc.framework.app.modbusgateway.pojo.Mapping;
import org.openmuc.framework.data.Record;
import org.openmuc.framework.dataaccess.Channel;
import org.openmuc.framework.dataaccess.DataAccessService;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;
import java.util.concurrent.*;

/**
 * FIXED: Proper dependency management and activation order
 */
@Component(immediate = true)
public class ModbusDataReaderService {

    private static final Logger logger = LoggerFactory.getLogger(ModbusDataReaderService.class);

    private DataAccessService dataAccessService;

    private final ModbusDataHolder dataStore = ModbusDataHolder.getInstance();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(10);
    private final Map<String, ScheduledFuture<?>> scheduledTasks = new ConcurrentHashMap<>();


    @Reference
    public void setDataAccessService(DataAccessService dataAccessService) {
        this.dataAccessService = dataAccessService;
    }

    @Activate
    public void activate() {
        logger.info("Activating Modbus Data Reader Service");

        // FIXED: Add delay to ensure all channels are created
        scheduler.schedule(this::initializeDataReading, 15, TimeUnit.SECONDS);

        // FIXED: Add periodic check for new channels
        scheduler.scheduleAtFixedRate(this::checkForNewChannels, 30, 30, TimeUnit.SECONDS);
    }

    private void initializeDataReading() {
        try {
            List<Device> deviceList = ModbusConfigService.accessDeviceData();
            List<Mapping> mappingList = ModbusConfigService.accessMappingData();

            if (deviceList == null || mappingList == null) {
                logger.error("Configuration data not available, retrying in 10 seconds");
                scheduler.schedule(this::initializeDataReading, 10, TimeUnit.SECONDS);
                return;
            }

            logger.info("Initializing data reading for {} devices", deviceList.size());

            for (Device device : deviceList) {
                String taskKey = "device_" + device.getName();

                // FIXED: Cancel existing task if present
                ScheduledFuture<?> existingTask = scheduledTasks.get(taskKey);
                if (existingTask != null && !existingTask.isCancelled()) {
                    existingTask.cancel(false);
                }

                // FIXED: Add validation for device configuration
                if (isValidDevice(device)) {
                    ScheduledFuture<?> task = scheduler.scheduleAtFixedRate(
                            () -> readDeviceDataSafely(device, mappingList),
                            5, // Initial delay to let channels initialize
                            Math.max(1000, Integer.parseInt(device.getSamplingInterval())), // Minimum 1 second
                            TimeUnit.MILLISECONDS
                    );
                    scheduledTasks.put(taskKey, task);
                    logger.info("Started data reading for device: {}", device.getName());
                } else {
                    logger.warn("Invalid device configuration: {}", device.getName());
                }
            }

        } catch (Exception e) {
            logger.error("Failed to initialize data reading", e);
            // FIXED: Retry initialization
            scheduler.schedule(this::initializeDataReading, 30, TimeUnit.SECONDS);
        }
    }

    // FIXED: Add validation method
    private boolean isValidDevice(Device device) {
        return device != null
                && device.getName() != null
                && !device.getName().isEmpty()
                && device.getSamplingInterval() != null
                && !device.getSamplingInterval().isEmpty();
    }

    private void readDeviceDataSafely(Device device, List<Mapping> mappingList) {
        try {
            readDeviceData(device, mappingList);
        } catch (Exception e) {
            logger.error("Error reading device data for {} (will retry): {}", device.getName(), e.getMessage());
        }
    }

    private void readDeviceData(Device device, List<Mapping> mappingList) {
        int successCount = 0;
        int totalCount = 0;

        for (Mapping mapping : mappingList) {
            if (mapping.getDeviceProfileId() == device.getDeviceProfileId()) {
                totalCount++;
                String channelId = device.getName() + "_" + mapping.getParameter() + "_" + mapping.getId();

                try {
                    Channel channel = dataAccessService.getChannel(channelId);
                    if (channel != null) {
                        Record record = channel.getLatestRecord();
                        if (record != null && record.getValue() != null) {
                            dataStore.setChannelData(channelId, record.getValue());
                            logger.info("record info {} {}", record.getValue().getValueType(), record.getValue());
                            mapToModbusRegistersWithValidation(mapping, record.getValue(), device.getUnitId());
                            successCount++;

                            if (logger.isDebugEnabled()) {
                                logger.info("Updated data for channel {}: {}", channelId, record.getValue());
                            }
                        } else {
                            logger.info("No record/value available for channel: {}", channelId);
                        }
                    } else {
                        logger.info("Channel not found: {}", channelId);
                    }
                } catch (Exception e) {
                    logger.warn("Error reading channel {}: {}", channelId, e.getMessage());
                }
            }
        }

        if (successCount > 0) {
            logger.info("Device {}: read {}/{} channels successfully",
                    device.getName(), successCount, totalCount);
        } else if (totalCount > 0) {
            logger.warn("Device {}: failed to read any of {} channels",
                    device.getName(), totalCount);
        }
    }

    // FIXED: Add validation to prevent register conflicts
    private void mapToModbusRegistersWithValidation(Mapping mapping, Object value, int unitId) {
        try {
            int address = Integer.parseInt(mapping.getRegisterAddress());

            // FIXED: Add range validation
            if (address < 0 || address > 65535) {
                logger.error("Invalid register address: {} for mapping {}", address, mapping.getId());
                return;
            }

            switch (mapping.getRegisterType().toUpperCase()) {
                case "HOLDING_REGISTERS":
                    Integer holdingRegValue = extractIntValue(value);
                    if (holdingRegValue != null) {
                        // FIXED: Store with unit ID context
                        dataStore.setHoldingRegisterForUnit(unitId, address, holdingRegValue);
                        logger.debug("Set holding register {} for unit {} with value {}",
                                address, unitId, holdingRegValue);
                    } else {
                        logger.warn("Cannot extract integer from value for register {}: {}", address, value.getClass());
                    }
                    break;

                case "INPUT_REGISTERS":
                    Integer inputRegValue = extractIntValue(value);
                    if (inputRegValue != null) {
                        dataStore.setInputRegisterForUnit(unitId, address, inputRegValue);
                        logger.debug("Set input register {} for unit {} with value {}",
                                address, unitId, inputRegValue);
                    } else {
                        logger.warn("Invalid value type for input register {}: {}", address, value.getClass());
                    }
                    break;

                case "COILS":
                    Boolean coilRegValue = extractBoolValue(value);
                    if (coilRegValue != null) {
                        dataStore.setCoilForUnit(unitId, address, coilRegValue);
                        logger.debug("Set coil {} for unit {} with value {}",
                                address, unitId, coilRegValue);
                    } else {
                        logger.warn("Invalid value type for coil {}: {}", address, value.getClass());
                    }
                    break;

                case "DISCRETE_INPUTS":
                    Boolean discreteRegValue = extractBoolValue(value);
                    if (discreteRegValue != null) {
                        dataStore.setDiscreteInputForUnit(unitId, address, discreteRegValue);
                        logger.debug("Set discrete input {} for unit {} with value {}",
                                address, unitId, discreteRegValue);
                    } else {
                        logger.warn("Invalid value type for discrete input {}: {}", address, value.getClass());
                    }
                    break;

                default:
                    logger.warn("Unknown register type: {} for mapping {}",
                            mapping.getRegisterType(), mapping.getId());
            }
        } catch (NumberFormatException e) {
            logger.error("Invalid register address format: {} for mapping {}",
                    mapping.getRegisterAddress(), mapping.getId());
        } catch (Exception e) {
            logger.error("Error mapping register for mapping {}: {}", mapping.getId(), e.getMessage());
        }
    }

    private Integer extractIntValue(Object value) {
        if (value instanceof org.openmuc.framework.data.Value) {
            try {
                return ((org.openmuc.framework.data.Value) value).asInt();
            } catch (Exception e) {
                logger.debug("Cannot convert OpenMUC value to int: {}", e.getMessage());
            }
        }
        return null;
    }

    private Boolean extractBoolValue(Object value) {
        if (value instanceof org.openmuc.framework.data.Value) {
            try {
                return ((org.openmuc.framework.data.Value) value).asBoolean();
            } catch (Exception e) {
                logger.debug("Cannot convert OpenMUC value to boolean: {}", e.getMessage());
            }
        }
        return null;
    }


    // FIXED: Add method to handle dynamic channel updates
    private void checkForNewChannels() {
        try {
            List<Device> currentDevices = ModbusConfigService.accessDeviceData();
            if (currentDevices != null && hasDeviceListChanged(currentDevices)) {
                logger.info("Device configuration changed, reinitializing data reading");
                initializeDataReading();
            }
        } catch (Exception e) {
            logger.error("Error checking for new channels", e);
        }
    }

    private boolean hasDeviceListChanged(List<Device> newDevices) {
        return newDevices.size() != scheduledTasks.size();
    }

    @Deactivate
    public void deactivate() {
        logger.info("Deactivating Modbus Data Reader Service");

        // Cancel all scheduled tasks
        for (Map.Entry<String, ScheduledFuture<?>> entry : scheduledTasks.entrySet()) {
            entry.getValue().cancel(true);
            logger.info("Cancelled task: {}", entry.getKey());
        }
        scheduledTasks.clear();

        // Shutdown scheduler
        scheduler.shutdown();
        try {
            if (!scheduler.awaitTermination(10, TimeUnit.SECONDS)) {
                scheduler.shutdownNow();
            }
        } catch (InterruptedException e) {
            scheduler.shutdownNow();
            Thread.currentThread().interrupt();
        }

        logger.info("Modbus Data Reader Service deactivated");
    }
}