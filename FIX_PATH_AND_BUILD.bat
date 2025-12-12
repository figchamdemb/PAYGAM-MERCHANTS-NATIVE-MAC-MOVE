@echo off
color 0A
title React Native Path Length Fix - All-In-One Solution
cls

echo.
echo  ========================================
echo    REACT NATIVE PATH LENGTH FIX
echo  ========================================
echo.
echo  Problem: Build path too long (CMake 250 char limit)
echo  Current: %CD%
echo.
echo  Choose your fix:
echo.
echo  [1] Create Virtual Drive P:\ (INSTANT - Recommended!)
echo  [2] Move to C:\Patrol (Permanent)
echo  [3] Just Clean Caches (Try first)
echo  [4] Show detailed guide
echo  [5] Exit
echo.
set /p choice="Enter choice (1-5): "

if "%choice%"=="1" goto VIRTUAL_DRIVE
if "%choice%"=="2" goto MOVE_PROJECT
if "%choice%"=="3" goto CLEAN_ONLY
if "%choice%"=="4" goto SHOW_GUIDE
if "%choice%"=="5" goto END
goto INVALID

:VIRTUAL_DRIVE
cls
echo.
echo  ========================================
echo    CREATING VIRTUAL DRIVE P:\
echo  ========================================
echo.
echo  This creates a shortcut drive - no files moved!
echo.
pause

REM Remove existing P: if present
subst P: /D >NUL 2>&1

REM Create P: drive
subst P: "%CD%"
if errorlevel 1 (
    color 0C
    echo.
    echo  ERROR: Failed to create virtual drive P:\
    echo.
    pause
    exit /b 1
)

REM Verify
if not exist P:\package.json (
    color 0C
    echo.
    echo  ERROR: Drive P:\ created but verification failed
    echo.
    pause
    exit /b 1
)

color 0A
echo.
echo  ========================================
echo    SUCCESS! Drive P:\ Created
echo  ========================================
echo.
echo  New path: P:\
echo  Original: %CD%
echo.
echo  NEXT STEPS:
echo  1. Open new terminal (opening now...)
echo  2. You'll be at P:\
echo  3. Run: npx react-native run-android
echo.
echo  To remove P:\ later: subst P: /D
echo.
pause

REM Open new terminal at P:\
start cmd /k "color 0A && cd /d P:\ && echo. && echo Ready to build! Run: npx react-native run-android && echo. && echo Note: This drive exists until PC restart. To recreate: run FIX_PATH_AND_BUILD.bat && echo."
goto END

:MOVE_PROJECT
cls
echo.
echo  ========================================
echo    MOVING PROJECT TO C:\Patrol
echo  ========================================
echo.
echo  This will COPY the entire project to C:\Patrol
echo  Original files remain unchanged
echo.
echo  Press CTRL+C to cancel, or
pause

if exist C:\Patrol (
    color 0E
    echo.
    echo  WARNING: C:\Patrol already exists!
    echo.
    set /p overwrite="Overwrite? (y/n): "
    if not "%overwrite%"=="y" goto END
    rmdir /s /q C:\Patrol
)

echo.
echo  Copying project (this may take 2-5 minutes)...
xcopy "%CD%" "C:\Patrol\" /E /H /C /I /Y /Q

if errorlevel 1 (
    color 0C
    echo.
    echo  ERROR: Failed to copy project
    echo.
    pause
    exit /b 1
)

echo.
echo  Cleaning caches in new location...
cd /d C:\Patrol
if exist android\.gradle rmdir /s /q android\.gradle >NUL 2>&1
if exist android\.cxx rmdir /s /q android\.cxx >NUL 2>&1
if exist android\app\build rmdir /s /q android\app\build >NUL 2>&1
if exist android\build rmdir /s /q android\build >NUL 2>&1

color 0A
echo.
echo  ========================================
echo    SUCCESS! Project Moved
echo  ========================================
echo.
echo  New location: C:\Patrol
echo  Old location: %CD%
echo.
echo  NEXT STEPS:
echo  1. Open new terminal (opening now...)
echo  2. You'll be at C:\Patrol
echo  3. Run: npx react-native run-android
echo.
echo  If build succeeds, you can delete the old folder.
echo.
pause

REM Open new terminal at C:\Patrol
start cmd /k "color 0A && cd /d C:\Patrol && echo. && echo Ready to build! Run: npx react-native run-android && echo."
goto END

:CLEAN_ONLY
cls
echo.
echo  ========================================
echo    CLEANING BUILD CACHES
echo  ========================================
echo.

echo  Killing processes...
taskkill /F /IM java.exe /T >NUL 2>&1
taskkill /F /IM node.exe /T >NUL 2>&1
taskkill /F /IM gradle.exe /T >NUL 2>&1
echo    [OK] Processes killed
echo.

echo  Cleaning Gradle...
if exist android\.gradle (
    rmdir /s /q android\.gradle
    echo    [OK] Cleaned .gradle
)
if exist android\.cxx (
    rmdir /s /q android\.cxx
    echo    [OK] Cleaned .cxx
)
if exist android\app\build (
    rmdir /s /q android\app\build
    echo    [OK] Cleaned app build
)
if exist android\build (
    rmdir /s /q android\build
    echo    [OK] Cleaned android build
)
echo.

echo  Running gradlew clean...
cd android
call gradlew clean >NUL 2>&1
cd ..
echo    [OK] Gradle clean complete
echo.

echo  Cleaning Metro cache...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo    [OK] Cleaned Metro cache
)
echo.

color 0A
echo  ========================================
echo    CLEANING COMPLETE
echo  ========================================
echo.
echo  WARNING: Path is still long!
echo  This may still fail. Recommended:
echo    - Option 1: Virtual Drive (instant)
echo    - Option 2: Move to C:\Patrol (permanent)
echo.
echo  Try building now:
echo    npx react-native run-android
echo.
pause
goto END

:SHOW_GUIDE
cls
echo.
echo  ========================================
echo    DETAILED FIX GUIDE
echo  ========================================
echo.
echo  Opening: PATH_LENGTH_FIX_GUIDE.md
echo.
start PATH_LENGTH_FIX_GUIDE.md
pause
goto END

:INVALID
color 0C
echo.
echo  Invalid choice. Please enter 1-5.
echo.
timeout /t 2 /nobreak >NUL
color 0A
cls
goto :eof

:END
echo.
echo  Script complete.
echo.
