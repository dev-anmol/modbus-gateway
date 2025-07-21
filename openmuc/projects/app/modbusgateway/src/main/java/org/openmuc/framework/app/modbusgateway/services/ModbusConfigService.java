package org.openmuc.framework.app.modbusgateway.services;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;
import org.openmuc.framework.app.modbusgateway.pojo.Device;
import org.openmuc.framework.app.modbusgateway.pojo.Mapping;
import org.openmuc.framework.app.modbusgateway.pojo.Profile;
import org.openmuc.framework.app.modbusgateway.pojo.Server;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component(immediate = true)
public class ModbusConfigService {
    private static final Logger logger = LoggerFactory.getLogger(ModbusConfigService.class);
    private static final String APP_NAME = "Open MUC | Modbus gateway";
    private static final String CHANNELS_XML_PATH = System.getProperty("user.dir") + "/conf/channels.xml";

    private static List<Device> deviceList;
    private static List<Profile> profileList;
    private static List<Mapping> mappingList;
    private static List<Server> serverList;
    private static Gson gson = new Gson();

    @Activate
    public void activate() {
        logger.info("Starting activation of {}", APP_NAME);

        // Fetch all required data
        deviceList = getDeviceData();
        profileList = getProfileData();
        mappingList = getMappingData();
        serverList = getServerData();

        // Generate channels.xml
        if (deviceList != null && profileList != null && mappingList != null) {
            generateChannelsXml();
        } else {
            logger.error("Failed to fetch required data for channels.xml generation");
        }
    }

    public static List<Device> getDeviceData() {
        logger.info("Get Device Data Method Activated");
        try {
            String apiUrl = RoutesService.getDeviceUrl();
            URL url = new URL(apiUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");

            int responseCode = conn.getResponseCode();
            logger.info("Node API responded with status code: {}", responseCode);

            if (responseCode == 200 || responseCode == 201) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                StringBuilder response = new StringBuilder();
                String line;

                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                reader.close();

                logger.info("Device API Response: {}", response.toString());

                Type deviceListType = new TypeToken<List<Device>>() {
                }.getType();
                return gson.fromJson(response.toString(), deviceListType);
            } else {
                logger.warn("Device API call failed with response code {}", responseCode);
                return null;
            }
        } catch (JsonSyntaxException e) {
            logger.error("JSON Parse error in getDeviceData: {}", e.getMessage());
            return null;
        } catch (Exception e) {
            logger.error("Error making GET request to Device API: {}", e.getMessage(), e);
            return null;
        }
    }

    public static List<Profile> getProfileData() {
        logger.info("Get Profile Data Method Activated");
        try {
            String apiUrl = RoutesService.getProfileUrl();
            URL url = new URL(apiUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");

            int responseCode = conn.getResponseCode();

            if (responseCode == 200 || responseCode == 201) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                reader.close();
                logger.info("Profile API Response: {}", response.toString());

                Type profileListType = new TypeToken<List<Profile>>() {
                }.getType();
                return gson.fromJson(response.toString(), profileListType);
            } else {
                logger.warn("Profile API call failed with response code {}", responseCode);
                return null;
            }
        } catch (IOException e) {
            logger.error("Error in getProfileData: {}", e.getMessage(), e);
            return null;
        } catch (JsonSyntaxException e) {
            logger.error("JSON Parse error in getProfileData: {}", e.getMessage());
            return null;
        }
    }

    public static List<Mapping> getMappingData() {
        logger.info("Get Mapping Data Method Activated");
        try {
            String apiUrl = RoutesService.getMappingUrl();
            URL url = new URL(apiUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");

            int responseCode = conn.getResponseCode();

            if (responseCode == 200 || responseCode == 201) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                StringBuilder response = new StringBuilder();
                String line;

                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                reader.close();
                logger.info("Mapping API Response: {}", response.toString());

                Type mappingListType = new TypeToken<List<Mapping>>() {
                }.getType();
                return gson.fromJson(response.toString(), mappingListType);
            } else {
                logger.warn("Mapping API call failed with response code {}", responseCode);
                return null;
            }
        } catch (JsonSyntaxException e) {
            logger.error("JSON parse error in getMappingData: {}", e.getMessage());
            return null;
        } catch (Exception e) {
            logger.error("Error in getMappingData: {}", e.getMessage(), e);
            return null;
        }
    }

    public static List<Server> getServerData() {
        logger.info("Get Server Data Method Activated");
        try {
            String apiUrl = RoutesService.getServerUrl();
            URL url = new URL(apiUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");

            int responseCode = conn.getResponseCode();

            if (responseCode == 200 || responseCode == 201) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                StringBuilder response = new StringBuilder();
                String line;

                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                reader.close();
                logger.info("Server API Response: {}", response.toString());

                Type serverListType = new TypeToken<List<Server>>() {

                }.getType();
                return gson.fromJson(response.toString(), serverListType);
            } else {
                logger.warn("Server Api call failed with response code {}", responseCode);
                return null;
            }

        } catch (JsonSyntaxException e) {
            logger.error("JSON parse error in getServerData: {}", e.getMessage());
            return null;
        } catch (Exception e) {
            logger.error("Error in getServerData(): {}", e.getMessage());
            return null;
        }
    }

    public static void generateChannelsXml() {
        try {
            logger.info("Starting channels.xml generation");

            DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder docBuilder = docFactory.newDocumentBuilder();
            Document doc = docBuilder.newDocument();

            // Root element
            Element rootElement = doc.createElement("configuration");
            doc.appendChild(rootElement);

            // Driver element
            Element driverElement = doc.createElement("driver");
            driverElement.setAttribute("id", "modbus");
            rootElement.appendChild(driverElement);

            // Create a map of profile ID to profile info for quick lookup
            Map<Integer, Profile> profileMap = new HashMap<>();
            for (Profile profile : profileList) {
                profileMap.put(profile.getId(), profile);
            }

            // Process each device
            for (Device device : deviceList) {

                // Create device element
                Element deviceXmlElement = doc.createElement("device");
                deviceXmlElement.setAttribute("id", device.getName());
                driverElement.appendChild(deviceXmlElement);

                // Device address
                Element deviceAddressElement = doc.createElement("deviceAddress");
                deviceAddressElement.appendChild(doc.createTextNode(device.getIPAddress() + ":" + device.getPort()));
                deviceXmlElement.appendChild(deviceAddressElement);

                // Device settings (TCP/RTU)
                Element deviceSettingsElement = doc.createElement("settings");
                deviceSettingsElement.appendChild(doc.createTextNode(device.getMode().toUpperCase()));
                deviceXmlElement.appendChild(deviceSettingsElement);

                // Find and add channels for this device profile
                for (Mapping mapping : mappingList) {
                    if (mapping.getDeviceProfileId() == device.getDeviceProfileId()) {
                        // Create channel element
                        Element channelElement = doc.createElement("channel");

                        String channelId = device.getName() + "_" + mapping.getParameter() + "_" + mapping.getId();
                        channelElement.setAttribute("id", channelId);
                        deviceXmlElement.appendChild(channelElement);

                        // Channel address format: unitId:registerType:registerAddress:dataType
                        String channelAddress = device.getUnitId() + ":" + mapping.getRegisterType() + ":" +
                                mapping.getRegisterAddress() + ":" + mapping.getDataType();
                        Element channelAddressElement = doc.createElement("channelAddress");
                        channelAddressElement.appendChild(doc.createTextNode(channelAddress));
                        channelElement.appendChild(channelAddressElement);

                        // Value type mapping
                        Element valueTypeElement = doc.createElement("valueType");
                        valueTypeElement.appendChild(doc.createTextNode(mapDataTypeToValueType(mapping.getDataType())));
                        channelElement.appendChild(valueTypeElement);

                        // Sampling interval
                        Element samplingIntervalElement = doc.createElement("samplingInterval");
                        samplingIntervalElement.appendChild(doc.createTextNode(mapping.getInterval()));
                        channelElement.appendChild(samplingIntervalElement);

                        // Logging interval (using device sampling interval as default)
                        Element loggingIntervalElement = doc.createElement("loggingInterval");
                        loggingIntervalElement.appendChild(doc.createTextNode(device.getSamplingInterval()));
                        channelElement.appendChild(loggingIntervalElement);

                        // Settings for timeout
                        Element channelSettingsElement = doc.createElement("settings");
                        channelElement.appendChild(channelSettingsElement);

                        Element timeoutSettingElement = doc.createElement("setting");
                        timeoutSettingElement.setAttribute("id", "TIMEOUT");
                        timeoutSettingElement.appendChild(doc.createTextNode(device.getTimeout()));
                        channelSettingsElement.appendChild(timeoutSettingElement);
                    }
                }
            }

            // Write the XML to file
            TransformerFactory transformerFactory = TransformerFactory.newInstance();
            Transformer transformer = transformerFactory.newTransformer();
            transformer.setOutputProperty(OutputKeys.INDENT, "yes");
            transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "4");

            DOMSource source = new DOMSource(doc);
            StreamResult result = new StreamResult(new File(CHANNELS_XML_PATH));
            transformer.transform(source, result);

            logger.info("channels.xml generated successfully at: {}", CHANNELS_XML_PATH);

            // Log summary
            logger.info("Generated channels.xml with {} devices and {} total channels",
                    deviceList.size(), getTotalChannelCount());

        } catch (Exception e) {
            logger.error("Error generating channels.xml: {}", e.getMessage(), e);
        }
    }

    public static int getTotalChannelCount() {
        int totalChannels = 0;
        for (Device device : deviceList) {
            for (Mapping mapping : mappingList) {
                if (mapping.getDeviceProfileId() == device.getDeviceProfileId()) {
                    totalChannels++;
                }
            }
        }
        return totalChannels;
    }

    public static String mapDataTypeToValueType(String dataType) {
        switch (dataType.toUpperCase()) {
            case "INT16":
            case "INT32":
            case "UINT16":
                return "INTEGER";
            case "FLOAT":
            case "DOUBLE":
                return "DOUBLE";
            case "BOOLEAN":
                return "BOOLEAN";
            default:
                return "STRING";
        }
    }

    public static List<Device> accessDeviceData() {
        return deviceList;
    }

    public static List<Mapping> accessMappingData() {
        return mappingList;
    }

    public static List<Server> accessServerData() {
        return serverList;
    }
}