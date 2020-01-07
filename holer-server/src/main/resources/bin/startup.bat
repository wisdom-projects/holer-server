@echo off
@REM Copyright 2018-present, Yudong (Dom) Wang
@REM
@REM Licensed under the Apache License, Version 2.0 (the "License");
@REM you may not use this file except in compliance with the License.
@REM You may obtain a copy of the License at
@REM
@REM      http://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing, software
@REM distributed under the License is distributed on an "AS IS" BASIS,
@REM WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
@REM See the License for the specific language governing permissions and
@REM limitations under the License.

@REM -----------------------------------------------------------------------------
@REM Holer Startup
@REM -----------------------------------------------------------------------------
title holer-server
setlocal enabledelayedexpansion
set errorlevel=

set JAVA_BIN=java

set HOLER_OK=0
set HOLER_ERR=1
set HOLER_CURDIR=%~dp0
cd /d %HOLER_CURDIR%\..
set HOLER_HOME=%cd%
set HOLER_APP=!HOLER_HOME!\holer-server-1.2.jar
set HOLER_LOG_DIR=!HOLER_HOME!\logs
set HOLER_LOG=!HOLER_LOG_DIR!\holer-server.log
set HOLER_LINE=------------------------------------------

@REM Create logs directory
if not exist "!HOLER_LOG_DIR!" (
    mkdir "!HOLER_LOG_DIR!"
)

@REM Check if Java is correctly installed and set
"!JAVA_BIN!" -version 1>nul 2>nul
if !errorlevel! neq 0 (
    @echo.
    @echo Please install Java 1.8 or higher and make sure the Java is set correctly.
    @echo.
    @echo You can execute command [ !JAVA_BIN! -version ] to check if Java is correctly installed and set.
    @echo.
    pause
    goto:eof
)

@echo !HOLER_LINE!
@echo Starting holer server...

start /b !JAVA_BIN!w -jar "!HOLER_APP!" >> "!HOLER_LOG!"
timeout /T 3 /NOBREAK

@echo !HOLER_LINE!
tasklist | findstr !JAVA_BIN!w

if !errorlevel! equ 0 (
    @echo !HOLER_LINE!
    @echo Started holer server.
    @echo.
    @echo The holer server is running.
    @echo !HOLER_LINE!
) else (
    @echo Holer server is stopped.
    @echo Please check the log file for details [ !HOLER_LOG! ]
    @echo !HOLER_LINE!
)

pause
goto:eof
