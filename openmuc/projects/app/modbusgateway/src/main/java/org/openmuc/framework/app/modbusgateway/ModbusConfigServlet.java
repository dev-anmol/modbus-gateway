package org.openmuc.framework.app.modbusgateway;

import org.openmuc.framework.app.modbusgateway.servlet.Routes;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;


@Component(immediate = true)
public class ModbusConfigServlet {
    private static final Logger logger = LoggerFactory.getLogger(ModbusConfigServlet.class);
    private static final String APP_NAME = "Open MUC | Modbus gateway";

    @Activate
    public void activate() {
        logger.info("Starting activation of {}", APP_NAME);
        getDeviceData();
        getProfileData();
        getMappingData();
    }

    public static void getDeviceData() {
        logger.info("Get Device Data Method Activated");
        try {
            String apiUrl = Routes.getDeviceUrl();
            URL url = new URL(apiUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");

            int responseCode = conn.getResponseCode();
            logger.info("Node API responded with status code: {}", responseCode);

            if (responseCode != 500) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                StringBuilder response = new StringBuilder();
                String line;

                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                reader.close();

                logger.info("Node API Response: {}", response.toString());
            } else {
                logger.warn("Node API call failed with response code {}", responseCode);
            }

            conn.disconnect();

        } catch (Exception e) {
            logger.error("Error making GET request to Node.js API: {}", e.getMessage(), e);
        }
    }

    public static void getProfileData() {
        logger.info("Get Profile Data Method Activated");
        try {
            String apiUrl = Routes.getProfileUrl();
            URL url = new URL(apiUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");

            int responseCode = conn.getResponseCode();

            if (responseCode != 500) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                reader.close();
                logger.info("Node API Response: {}", response.toString());
            } else {
                logger.warn("Node API call failed with response code {}", responseCode);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }

    public static void getMappingData() {
        logger.info("Get Mapping Data Method Activated");
        try {
            String apiUrl = Routes.getMappingUrl();
            URL url = new URL(apiUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");

            int responseCode = conn.getResponseCode();

            if(responseCode != 500) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                StringBuilder response = new StringBuilder();
                String line;

                while((line = reader.readLine()) != null) {
                    response.append(line);
                }
                reader.close();
                logger.info("Node Api Respose : {}", response);
            } else {
                logger.warn("Node API call failed with response code {}", responseCode);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }
}