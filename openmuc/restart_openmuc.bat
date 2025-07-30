@echo off
setlocal enabledelayedexpansion

REM OpenMUC Auto-Restart Script for Windows
REM Updated with correct paths

REM Configuration - Updated with your actual paths
set OPENMUC_HOME=C:\Users\Rightwatts\openmuc\modbus-to-modbus\modbusgateway\openmuc\framework
set FELIX_JAR=%OPENMUC_HOME%\felix\felix.jar
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-11.0.27.6-hotspot
set JAVA_EXE=%JAVA_HOME%\bin\java.exe
set LOG_DIR=%OPENMUC_HOME%\logs
set LOG_FILE=%LOG_DIR%\restart.log

REM Create logs directory if it doesn't exist
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

REM Change to OpenMUC framework directory (important for relative paths)
cd /d "%OPENMUC_HOME%"

REM Set window title
title OpenMUC Framework - Auto Restart Monitor

echo ======================================== >> "%LOG_FILE%"
echo OpenMUC Auto-Restart Monitor Started >> "%LOG_FILE%"
echo Start Time: %date% %time% >> "%LOG_FILE%"
echo OpenMUC Home: %OPENMUC_HOME% >> "%LOG_FILE%"
echo Felix JAR: %FELIX_JAR% >> "%LOG_FILE%"
echo Java: %JAVA_EXE% >> "%LOG_FILE%"
echo ======================================== >> "%LOG_FILE%"

echo ========================================
echo OpenMUC Framework Auto-Restart Monitor
echo ========================================
echo OpenMUC Home: %OPENMUC_HOME%
echo Felix JAR: %FELIX_JAR%
echo Java: %JAVA_EXE%
echo Log File: %LOG_FILE%
echo ========================================
echo.
echo Press Ctrl+C to stop the monitor
echo.

:restart_loop
set START_TIME=%date% %time%
echo [!START_TIME!] Starting OpenMUC Framework...
echo [!START_TIME!] Starting OpenMUC Framework... >> "%LOG_FILE%"

REM Start OpenMUC with proper JVM parameters
"%JAVA_EXE%" -Xms512m -Xmx1024m -jar "%FELIX_JAR%"

REM Capture exit code and end time
set EXIT_CODE=!ERRORLEVEL!
set END_TIME=%date% %time%
echo [!END_TIME!] OpenMUC exited with code: !EXIT_CODE!
echo [!END_TIME!] OpenMUC exited with code: !EXIT_CODE! >> "%LOG_FILE%"

REM Handle different exit codes
if !EXIT_CODE!==0 (
    echo [!END_TIME!] Normal restart requested via web interface. Restarting in 3 seconds...
    echo [!END_TIME!] Normal restart requested via web interface. Restarting in 3 seconds... >> "%LOG_FILE%"
    timeout /t 3 /nobreak >nul
    goto restart_loop
)

if !EXIT_CODE!==99 (
    echo [!END_TIME!] Intentional shutdown detected. Monitor stopping...
    echo [!END_TIME!] Intentional shutdown detected. Monitor stopping... >> "%LOG_FILE%"
    echo.
    echo OpenMUC has been intentionally stopped.
    pause
    exit /b 0
)

REM For unexpected exit codes
echo [!END_TIME!] WARNING: Unexpected exit code !EXIT_CODE!
echo [!END_TIME!] WARNING: Unexpected exit code !EXIT_CODE! >> "%LOG_FILE%"
echo.
echo OpenMUC stopped unexpectedly.
choice /C YN /T 10 /D Y /M "Restart automatically in 10 seconds? (Y/N)"

if !ERRORLEVEL!==1 (
    echo [!END_TIME!] Auto-restarting after unexpected exit...
    echo [!END_TIME!] Auto-restarting after unexpected exit... >> "%LOG_FILE%"
    timeout /t 2 /nobreak >nul
    goto restart_loop
) else (
    echo [!END_TIME!] User chose not to restart. Monitor stopping...
    echo [!END_TIME!] User chose not to restart. Monitor stopping... >> "%LOG_FILE%"
    pause
    exit /b !EXIT_CODE!
)

endlocal
