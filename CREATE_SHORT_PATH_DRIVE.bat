@echo off
echo ========================================
echo CREATE VIRTUAL DRIVE FOR SHORT PATH
echo ========================================
echo.
echo This will create drive P: pointing to this project
echo No files will be moved - it's a virtual mapping!
echo.
pause

REM Remove existing P: drive if exists
subst P: /D >NUL 2>&1

REM Create P: drive
echo Creating virtual drive P:...
subst P: "%CD%"
if errorlevel 1 (
    echo ERROR: Failed to create virtual drive
    pause
    exit /b 1
)
echo.

REM Verify
if exist P:\package.json (
    echo SUCCESS: Drive P: created!
    echo.
    echo Project is now accessible at: P:\
    echo Original location unchanged: %CD%
    echo.
    echo NEXT STEPS:
    echo 1. Open new terminal
    echo 2. cd P:\
    echo 3. Run: npx react-native run-android
    echo.
    echo To remove drive P: later, run: subst P: /D
) else (
    echo ERROR: Drive creation verification failed
    pause
    exit /b 1
)
echo.
pause

REM Open new terminal at P: drive
echo Opening new terminal at P: drive...
start cmd /k "cd /d P:\ && echo Ready to build! Run: npx react-native run-android"
