@echo off
REM ============================================================
REM  Conectar bellaapp (Ionic + Capacitor) con Android Studio
REM  Uso: doble clic en este archivo o ejecutar "conectar-android.bat"
REM ============================================================

cd /d "%~dp0"

echo.
echo [1/3] Compilando la aplicacion web (ionic build)...
call ionic.cmd build
if errorlevel 1 goto error

echo.
echo [2/3] Sincronizando con el proyecto Android (cap sync)...
call npx.cmd cap sync android
if errorlevel 1 goto error

echo.
echo [3/3] Abriendo Android Studio...
call npx.cmd cap open android
if errorlevel 1 goto error

echo.
echo Listo. En Android Studio selecciona tu telefono arriba y presiona Run (triangulo verde).
pause
exit /b 0

:error
echo.
echo Ocurrio un error. Revisa los mensajes de arriba.
pause
exit /b 1
