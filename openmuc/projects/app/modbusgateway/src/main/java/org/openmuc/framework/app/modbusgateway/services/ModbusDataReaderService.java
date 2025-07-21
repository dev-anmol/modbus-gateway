package org.openmuc.framework.app.modbusgateway.services;

import org.openmuc.framework.app.modbusgateway.pojo.Device;
import org.openmuc.framework.app.modbusgateway.pojo.Mapping;
import org.openmuc.framework.app.modbusgateway.pojo.Server;
import org.openmuc.framework.data.Record;
import org.openmuc.framework.dataaccess.Channel;
import org.openmuc.framework.dataaccess.DataAccessService;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;


@Component(immediate = true)
public class ModbusDataReaderService {
    private static final Logger logger = LoggerFactory.getLogger(ModbusDataReaderService.class);

    private DataAccessService dataAccessService;

    private final Map<String, Record> channelDataCache = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(5);

    private List<Device> deviceList;
    private List<Mapping> mappingList;
    private List<Server> serverList;

    @Reference
    public void setDataAccessService(DataAccessService dataAccessService) {
        this.dataAccessService = dataAccessService;
    }

    @Activate
    public void activate() {
        logger.info("Starting Modbus Data Reader Service");
        initializeConfigurationData();
        startDataReading();
//        startModbusServer();
    }

    private void initializeConfigurationData() {
        deviceList = ModbusConfigService.accessDeviceData();
        mappingList = ModbusConfigService.accessMappingData();
        serverList = ModbusConfigService.accessServerData();
    }

    private void startDataReading() {
        if (deviceList == null || mappingList == null) {
            logger.error("Cannot start data reading - configuration data is not available");
            return;
        }

        //Create reading tasks for each device
        for (Device device : deviceList) {
            scheduler.scheduleAtFixedRate(
                    () -> readDeviceData(device), 0, Integer.parseInt(device.getSamplingInterval()), TimeUnit.MILLISECONDS
            );
        }
    }

    private void readDeviceData(Device device) {
        try {
            for (Mapping mapping : mappingList) {
                if (mapping.getDeviceProfileId() == device.getDeviceProfileId()) {
                    String channelId = device.getName() + "_" + mapping.getParameter() + "_" + mapping.getId();

                    Channel channel = dataAccessService.getChannel(channelId);
                    logger.info("Found channel Id, {} : {}", channelId, channel);
                    if (channel != null) {
                        Record record = channel.getLatestRecord();
                        if (record != null && record.getValue() != null) {
                            channelDataCache.put(channelId, record);
                            logger.info("Updated data for channel {} : {}", channelId, record.getValue());
                        }
                    }
                }
            }

        }
        catch (NullPointerException e) {
            logger.error("NullPointerException caught : {}", e.getMessage());
        }
        catch (Exception e) {
            logger.error("Error reading the data, {}", e.getMessage());
        }
    }

    public Record getChannelData(String channelId) {
        return channelDataCache.get(channelId);
    }

    public Map<String, Record> getAllChannelData() {
        return new ConcurrentHashMap<>(channelDataCache);
    }
}
