@echo off
echo =======================================================
echo   PAYGAM MERCHANT CLI - RELEASE BUILD SCRIPT
echo =======================================================
echo.

echo [1/6] Setting up virtual drive P: to fix path length issues...
subst P: /D >NUL 2>&1
subst P: "%~dp0."
if not exist P:\package.json (
    echo ERROR: Could not map P: drive.
    pause
    exit /b 1
)

echo [2/6] Switching to P: drive workspace...
P:

echo [3/6] Installing Node dependencies...
call npm install --legacy-peer-deps
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm install failed.
    pause
    exit /b 1
)

echo [4/6] Cleaning Gradle cache...
cd android
call gradlew.bat clean
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Gradle clean failed.
    pause
    exit /b 1
)

echo [5/6] Building Release APK (this may take 5-10 mins)...
call gradlew.bat assembleRelease
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Build failed. Check the output above.
    pause
    exit /b 1
)

echo [6/6] Copying APK to Desktop...
copy "app\build\outputs\apk\release\app-release.apk" "%USERPROFILE%\Desktop\PAYGAM-MERCHANT-v1.0.6.apk"
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Could not copy APK to desktop. Check app\build\outputs\apk\release\
)

echo.
echo =======================================================
echo   BUILD SUCCESSFUL!
echo   APK: %USERPROFILE%\Desktop\PAYGAM-MERCHANT-v1.0.6.apk
echo =======================================================
echo.
pause
