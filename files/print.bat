@ECHO OFF

@REM Set environment variables used by the batch file
SET PRINTERNAME=7-PDF Printer

REM Create runonce.ini
SET LAPP=%LOCALAPPDATA%
IF "%LAPP%"=="" SET LAPP=%USERPROFILE%\Lokale Einstellungen\Anwendungsdaten
SET RUNONCE=%LAPP%\PDF WRITER\%PRINTERNAME%\runonce.ini
ECHO %RUNONCE%
IF EXIST "%RUNONCE%" DEL "%RUNONCE%"

ECHO Save settings to "%RUNONCE%"
ECHO [PDF Printer] >>  "%RUNONCE%"
ECHO output=%CD%\out\demo.pdf >> "%RUNONCE%"
ECHO author=Demo Script >> "%RUNONCE%"
ECHO showsettings=never >> "%RUNONCE%"
ECHO showpdf=no >> "%RUNONCE%"
ECHO watermarktext=Batch Demo >>  "%RUNONCE%"
ECHO confirmoverwrite=no >>  "%RUNONCE%"
printto.exe "in\example.rtf" "%PRINTERNAME%"
ECHO ERRORLEVEL=%ERRORLEVEL%