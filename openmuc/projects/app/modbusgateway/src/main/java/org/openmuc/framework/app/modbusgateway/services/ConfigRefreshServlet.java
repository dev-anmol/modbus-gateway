package org.openmuc.framework.app.modbusgateway.services;
import org.openmuc.framework.app.modbusgateway.services.ModbusConfigService;
import org.openmuc.framework.config.ConfigService;
import org.osgi.framework.Bundle;
import org.osgi.framework.BundleContext;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Deactivate;
import org.osgi.service.http.HttpService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component(immediate = true)
public class ConfigRefreshServlet {

    private static final Logger logger = LoggerFactory.getLogger(ConfigRefreshServlet.class);
    private static final String CHANNELS_CONFIG_PATH = "conf/channels.xml";

    @Reference(cardinality = org.osgi.service.component.annotations.ReferenceCardinality.OPTIONAL)
    private HttpService httpService;

    @Reference(cardinality = org.osgi.service.component.annotations.ReferenceCardinality.OPTIONAL)
    private ConfigService configService;

    private BundleContext bundleContext;

    @Activate
    public void activate() {
        try {
            httpService.registerServlet("/api/config/refresh", new ConfigRefreshHandler(), null, null);
            logger.info("ConfigRefreshServlet registered at /api/config/refresh");
        } catch (Exception e) {
            logger.error("Failed to register ConfigRefreshServlet: {}", e.getMessage(), e);
        }
    }

    @Deactivate
    public void deactivate() {
        try {
            if (httpService != null) {
                httpService.unregister("/api/config/refresh");
                logger.info("ConfigRefreshServlet unregistered");
            }
        } catch (Exception e) {
            logger.error("Failed to unregister ConfigRefreshServlet: {}", e.getMessage());
        }
    }

    private class ConfigRefreshHandler extends HttpServlet {

        @Override
        protected void service(HttpServletRequest req, HttpServletResponse resp)
                throws ServletException, IOException {

            // Always set CORS headers first, before any processing
            setCorsHeaders(resp);

            // Handle preflight OPTIONS request
            if ("OPTIONS".equals(req.getMethod())) {
                resp.setStatus(HttpServletResponse.SC_OK);
                return;
            }

            // Continue with normal processing
            super.service(req, resp);
        }

        @Override
        protected void doGet(HttpServletRequest req, HttpServletResponse resp)
                throws ServletException, IOException {

            try {
                String action = req.getParameter("action");

                logger.info("Configuration refresh requested via GET from: {} with action: {}",
                        req.getRemoteAddr(), action);

                // CORS headers already set in service method

                // Step 1: Always refresh and update the configuration first
                refreshConfiguration();

                // Step 2: Determine the reload strategy based on action parameter
                if ("restart".equals(action)) {
                    // Restart the entire application
                    handleApplicationRestart(resp);
                } else {
                    // Try configuration hot-reload first
                    handleConfigurationReload(resp);
                }

            } catch (Exception e) {
                logger.error("Configuration refresh failed: {}", e.getMessage(), e);

                resp.setStatus(500);
                resp.setContentType("application/json");

                resp.getWriter().write("{\"error\":\"" + e.getMessage() + "\"}");
                resp.getWriter().flush();
            }
        }

        @Override
        protected void doPost(HttpServletRequest req, HttpServletResponse resp)
                throws ServletException, IOException {

            try {
                // Get the action parameter to determine what to do
                String action = req.getParameter("action");

                logger.info("Configuration refresh requested from: {} with action: {}",
                        req.getRemoteAddr(), action);

                // CORS headers already set in service method

                // Step 1: Always refresh and update the configuration first
                refreshConfiguration();

                // Step 2: Determine the reload strategy based on action parameter
                if ("restart".equals(action)) {
                    // Restart the entire application
                    handleApplicationRestart(resp);
                } else {
                    // Try configuration hot-reload first
                    handleConfigurationReload(resp);
                }

            } catch (Exception e) {
                logger.error("Configuration refresh failed: {}", e.getMessage(), e);

                resp.setStatus(500);
                resp.setContentType("application/json");

                resp.getWriter().write("{\"error\":\"" + e.getMessage() + "\"}");
                resp.getWriter().flush();
            }
        }

        private void setCorsHeaders(HttpServletResponse resp) {
            resp.setHeader("Access-Control-Allow-Origin", "*");
            resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            resp.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
            resp.setHeader("Access-Control-Max-Age", "3600");
            resp.setHeader("Access-Control-Allow-Credentials", "false");
        }

        private void refreshConfiguration() throws Exception {
            logger.info("Refreshing Modbus gateway configuration...");

            // Refresh configuration and update channels.xml
            ModbusConfigService.refreshConfiguration();
            logger.info("ModbusConfigService configuration refreshed");

            // Validate the updated configuration file
            if (!validateChannelsConfig()) {
                throw new Exception("Updated channels.xml validation failed");
            }

            logger.info("Configuration refresh completed successfully");
        }

        private void handleApplicationRestart(HttpServletResponse resp) throws Exception {
            logger.info("Application restart requested - initiating framework restart...");

            // Send response before restarting (so client gets confirmation)
            resp.setStatus(200);
            resp.setContentType("application/json");
            resp.getWriter().write("{\"message\":\"Application restart initiated. Please wait 30-60 seconds for the system to restart.\"}");
            resp.getWriter().flush();

            // Start restart in a separate thread to allow response to be sent
            new Thread(() -> {
                try {
                    Thread.sleep(1000); // Give time for response to be sent
                    restartApplication();
                } catch (Exception e) {
                    logger.error("Failed to restart application: {}", e.getMessage(), e);
                }
            }).start();
        }

        private void handleConfigurationReload(HttpServletResponse resp) throws Exception {
            logger.info("Attempting configuration hot-reload...");

            try {
                // Attempt hot-reload
                performBasicReload();

                // Give it some time to take effect
                Thread.sleep(3000);

                // For now, we'll assume success since verification is difficult
                resp.setStatus(200);
                resp.setContentType("application/json");
                resp.getWriter().write("{\"message\":\"Configuration refreshed. If changes don't take effect, try restarting via /api/config/refresh?action=restart\"}");
                resp.getWriter().flush();

                logger.info("Configuration hot-reload completed");

            } catch (Exception e) {
                logger.warn("Hot-reload failed: {}", e.getMessage());

                // Suggest restart as fallback
                resp.setStatus(200);
                resp.setContentType("application/json");
                resp.getWriter().write("{\"message\":\"Configuration updated but hot-reload failed. Restart recommended: /api/config/refresh?action=restart\"}");
                resp.getWriter().flush();
            }
        }
    }

    private boolean validateChannelsConfig() {
        try {
            File channelsFile = new File(CHANNELS_CONFIG_PATH);
            if (!channelsFile.exists()) {
                logger.error("channels.xml file not found at: {}", CHANNELS_CONFIG_PATH);
                return false;
            }

            long fileSize = channelsFile.length();
            if (fileSize == 0) {
                logger.error("channels.xml file is empty");
                return false;
            }

            // Basic XML validation
            Path path = Paths.get(CHANNELS_CONFIG_PATH);
            String content = new String(Files.readAllBytes(path));
            if (!content.trim().startsWith("<?xml") && !content.trim().startsWith("<")) {
                logger.error("channels.xml does not appear to be valid XML");
                return false;
            }

            logger.info("channels.xml validation passed. File size: {} bytes", fileSize);
            return true;

        } catch (Exception e) {
            logger.error("Error validating channels.xml: {}", e.getMessage());
            return false;
        }
    }

    private void performBasicReload() throws Exception {
        logger.info("Performing basic configuration reload...");

        try {
            // Update file timestamp
            File channelsFile = new File(CHANNELS_CONFIG_PATH);
            if (channelsFile.exists()) {
                channelsFile.setLastModified(System.currentTimeMillis());
            }

            // Try ConfigService reload if available
            if (configService != null) {
                configService.reloadConfigFromFile();
            } else {
                logger.warn("ConfigService not available - skipping config reload");
            }

            logger.info("Basic configuration reload completed");

        } catch (Exception e) {
            logger.error("Basic reload failed: {}", e.getMessage());
            throw e;
        }
    }

    private void restartApplication() throws Exception {
        try {
            logger.info("Initiating OpenMUC framework restart...");

            if (bundleContext == null) {
                logger.warn("BundleContext is not available - trying alternative restart method");
                restartApplicationAlternative();
                return;
            }

            // Get the system bundle (framework bundle - ID 0)
            Bundle systemBundle = bundleContext.getBundle(0);

            if (systemBundle == null) {
                logger.warn("Could not get system bundle - trying alternative restart method");
                restartApplicationAlternative();
                return;
            }

            logger.info("System bundle found: {} (State: {})",
                    systemBundle.getSymbolicName(), systemBundle.getState());

            // Stop the framework - this will trigger a restart if configured properly
            logger.info("Stopping OpenMUC framework...");
            systemBundle.stop();

            // Note: The framework should automatically restart due to its configuration
            // The application will be unavailable for 30-60 seconds during restart

        } catch (Exception e) {
            logger.error("Failed to restart application: {}", e.getMessage(), e);
            logger.warn("Trying alternative restart method");
            restartApplicationAlternative();
        }
    }

    private void restartApplicationAlternative() throws Exception {
        try {
            logger.info("Attempting alternative restart using system exit...");

            // This will trigger the process to exit, and if OpenMUC is configured
            // to restart automatically (e.g., via systemd, docker, or wrapper script),
            // it will restart
            new Thread(() -> {
                try {
                    Thread.sleep(2000); // Give time for response to be sent
                    logger.info("Executing system exit for restart...");
                    System.exit(0);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }).start();

        } catch (Exception e) {
            logger.error("Alternative restart method failed: {}", e.getMessage());
            throw new Exception("All restart methods failed: " + e.getMessage());
        }
    }
}