@echo off
echo ========================================
echo CLEANING REACT NATIVE BUILD CACHES
echo ========================================
echo.

REM Kill any running Metro/Gradle processes
echo Step 1: Killing Java/Gradle/Metro processes...
taskkill /F /IM java.exe /T >NUL 2>&1
taskkill /F /IM node.exe /T >NUL 2>&1
taskkill /F /IM gradle.exe /T >NUL 2>&1
echo   - Processes killed
echo.

REM Clean Gradle caches
echo Step 2: Cleaning Gradle caches...
if exist android\.gradle (
    rmdir /s /q android\.gradle
    echo   - Cleaned .gradle
)
if exist android\.cxx (
    rmdir /s /q android\.cxx
    echo   - Cleaned .cxx build cache
)
if exist android\app\build (
    rmdir /s /q android\app\build
    echo   - Cleaned app build
)
if exist android\build (
    rmdir /s /q android\build
    echo   - Cleaned android build
)
echo.

REM Clean Metro cache
echo Step 3: Cleaning Metro cache...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo   - Cleaned Metro cache
)
echo.

REM Clean React Native cache
echo Step 4: Cleaning React Native caches...
cd android
call gradlew clean >NUL 2>&1
cd ..
echo   - Gradle clean complete
echo.

REM Clean watchman (if exists)
where watchman >NUL 2>&1
if %errorlevel% equ 0 (
    echo Step 5: Cleaning Watchman...
    watchman watch-del-all >NUL 2>&1
    echo   - Watchman cache cleared
) else (
    echo Step 5: Watchman not installed (skipping)
)
echo.

echo ========================================
echo CLEANING COMPLETE!
echo ========================================
echo.
echo WARNING: Path is still too long!
echo Current: %CD%
echo This may still fail. Recommended: Run MOVE_PATROL_TO_SHORT_PATH.bat
echo.
echo To try building now:
echo   npx react-native run-android
echo.
pause
