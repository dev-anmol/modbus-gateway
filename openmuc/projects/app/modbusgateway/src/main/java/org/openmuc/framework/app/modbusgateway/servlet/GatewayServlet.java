//package org.openmuc.framework.app.modbusgateway.servlet;
//
//import org.osgi.service.component.annotations.Component;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
//import javax.servlet.ServletException;
//import javax.servlet.http.HttpServlet;
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;
//import java.io.BufferedReader;
//import java.io.IOException;
//import java.io.InputStreamReader;
//import java.net.HttpURLConnection;
//import java.net.URL;
//
//@Component(immediate = true)
//public class GatewayServlet extends HttpServlet {
//    private static final Logger logger = LoggerFactory.getLogger(GatewayServlet.class);
//    private static final String APP_Name = "OpenMUC Gateway Servlet";
//
//
//    @Override
//    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
//        try {
//            String apiUrl = Routes.getDeviceUrl();
//            URL url = new URL(apiUrl);
//            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
//            conn.setRequestMethod("GET");
//            conn.setRequestProperty("Accept", "application/json");
//
//            if (conn.getResponseCode() != 200) {
//                logger.error("Failed to connect to API: HTTP error code {}", conn.getResponseCode());
//                res.setStatus(conn.getResponseCode());
//                return;
//            }
//
//            // Read the response
//            BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
//            StringBuilder response = new StringBuilder();
//            String line;
//
//            while ((line = reader.readLine()) != null) {
//                response.append(line);
//            }
//            reader.close();
//
//            // Log the response
//            logger.info("API Response: {}", response.toString());
//
//            // Send response to client
//            res.setContentType("application/json");
//            res.setCharacterEncoding("UTF-8");
//            res.getWriter().write(response.toString());
//
//            conn.disconnect();
//
//        } catch (Exception e) {
//            logger.error("Error fetching data from API: {}", e.getMessage());
//            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
//        }
//    }
//}