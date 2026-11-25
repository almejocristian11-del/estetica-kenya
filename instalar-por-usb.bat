@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul
title Instalador USB - Estetica Unisex Kenya (bellaapp)
cd /d "%~dp0"

set "APP_ID=io.ionic.starter"
set "APK_LISTO=%~dp0apk-listo\bellaapp-EsteticaKenya.apk"
set "APK_GRADLE=%~dp0android\app\build\outputs\apk\debug\app-debug.apk"
set "ADB_EXE="

echo ========================================================================
echo   INSTALADOR POR CABLE USB - ESTETICA UNISEX KENYA (bellaapp)
echo ========================================================================
echo.
echo   [1] Instalacion RAPIDA por USB (RECOMENDADA)
echo       - Instala el APK ya compilado en tu telefono Android.
echo       - Funciona en CUALQUIER PC con Windows (NO necesita Node,
echo         Java ni Android Studio instalados).
echo.
echo   [2] Compilar cambios del codigo + Instalar por USB
echo       - Usa esta opcion solo si modificaste codigo en esta PC
echo         (requiere Node.js y Android SDK/Android Studio).
echo.
set /p "MODO=Elige una opcion [1 o 2, Enter = 1]: "
set "MODO=%MODO: =%"
if "%MODO%"=="" set "MODO=1"

if "%MODO%"=="2" goto COMPILAR
if "%MODO%"=="1" goto PREPARAR_APK

echo.
echo Opcion no valida. Usando opcion 1 (Instalacion RAPIDA)...
goto PREPARAR_APK

REM ========================================================================
REM  OPCION 2: COMPILAR CODIGO DESDE CERO EN OTRA PC
REM ========================================================================
:COMPILAR
echo.
echo [PASO 1/4] Verificando Node.js y dependencias...
where npm.cmd >nul 2>&1
if errorlevel 1 (
    echo [ERROR] No se encontro Node.js en esta computadora.
    echo         Usa la opcion [1] para instalar el APK sin compilar.
    pause
    exit /b 1
)

if not exist "%~dp0node_modules" (
    echo Instalando paquetes npm por primera vez en esta PC...
    call npm.cmd install
    if errorlevel 1 goto ERROR_COMPILAR
)

echo.
echo [PASO 2/4] Compilando aplicacion web Angular/Ionic...
call npm.cmd run build
if errorlevel 1 goto ERROR_COMPILAR

echo.
echo [PASO 3/4] Sincronizando con Capacitor Android...
call npx.cmd cap sync android
if errorlevel 1 goto ERROR_COMPILAR

echo.
echo [PASO 4/4] Configurando Android SDK/Java y generando APK...
set "SDK_DIR="
if defined ANDROID_HOME if exist "%ANDROID_HOME%\platform-tools\adb.exe" set "SDK_DIR=%ANDROID_HOME%"
if not defined SDK_DIR if defined ANDROID_SDK_ROOT if exist "%ANDROID_SDK_ROOT%\platform-tools\adb.exe" set "SDK_DIR=%ANDROID_SDK_ROOT%"
if not defined SDK_DIR if exist "%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe" set "SDK_DIR=%LOCALAPPDATA%\Android\Sdk"

if not defined SDK_DIR (
    echo [ERROR] No se encontro Android SDK en esta PC.
    echo         Instala Android Studio o usa la opcion [1] con APK listo.
    pause
    exit /b 1
)

set "ANDROID_HOME=%SDK_DIR%"
set "SDK_ESCAPED=%SDK_DIR:\=\\%"
set "SDK_ESCAPED=%SDK_ESCAPED::=\:%"
> "%~dp0android\local.properties" echo sdk.dir=%SDK_ESCAPED%

if exist "C:\Program Files\Android\Android Studio\jbr\bin\java.exe" (
    set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
) else if exist "%LOCALAPPDATA%\Programs\Android Studio\jbr\bin\java.exe" (
    set "JAVA_HOME=%LOCALAPPDATA%\Programs\Android Studio\jbr"
)

pushd "%~dp0android"
call gradlew.bat assembleDebug
set "GRADLE_ERR=%ERRORLEVEL%"
popd
if not "%GRADLE_ERR%"=="0" goto ERROR_COMPILAR

if not exist "%~dp0apk-listo" mkdir "%~dp0apk-listo"
copy /y "%APK_GRADLE%" "%APK_LISTO%" >nul
echo APK compilado y actualizado correctamente en apk-listo\bellaapp-EsteticaKenya.apk
goto PREPARAR_APK

:ERROR_COMPILAR
echo.
echo [ERROR] Fallo la compilacion. Revisa los mensajes de arriba.
echo         Recuerda que siempre puedes usar la opcion [1] si ya existe el APK.
pause
exit /b 1

REM ========================================================================
REM  LOCALIZAR APK Y ADB (PORTABLE O DEL SISTEMA)
REM ========================================================================
:PREPARAR_APK
set "APK_FINAL="
if exist "%APK_LISTO%" set "APK_FINAL=%APK_LISTO%"
if not defined APK_FINAL if exist "%APK_GRADLE%" set "APK_FINAL=%APK_GRADLE%"

if not defined APK_FINAL (
    echo.
    echo [ERROR] No se encontro ningun archivo APK compilado.
    echo         Ejecuta de nuevo y elige la opcion [2] en una PC con Android Studio.
    pause
    exit /b 1
)

if exist "%~dp0herramientas-usb\adb.exe" (
    set "ADB_EXE=%~dp0herramientas-usb\adb.exe"
) else (
    for /f "delims=" %%A in ('where adb.exe 2^>nul') do if not defined ADB_EXE set "ADB_EXE=%%A"
)
if not defined ADB_EXE if exist "%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe" (
    set "ADB_EXE=%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe"
)
if not defined ADB_EXE if defined ANDROID_HOME if exist "%ANDROID_HOME%\platform-tools\adb.exe" (
    set "ADB_EXE=%ANDROID_HOME%\platform-tools\adb.exe"
)

if not defined ADB_EXE (
    echo.
    echo [ERROR] No se encontro adb.exe ni en herramientas-usb\ ni en Android SDK.
    echo         Asegurate de copiar completa la carpeta herramientas-usb\ junto al proyecto.
    pause
    exit /b 1
)

echo.
echo Usando APK : %APK_FINAL%
echo Usando ADB : %ADB_EXE%

REM ========================================================================
REM  VERIFICAR TELEFONO CONECTADO POR CABLE USB
REM ========================================================================
:BUSCAR_TELEFONO
echo.
echo Buscando telefono Android conectado por cable USB...
"%ADB_EXE%" start-server >nul 2>&1

set "DEV_OK="
set "DEV_UNAUTH="
for /f "skip=1 tokens=1,2" %%D in ('"%ADB_EXE%" devices') do (
    if "%%E"=="device" set "DEV_OK=%%D"
    if "%%E"=="unauthorized" set "DEV_UNAUTH=%%D"
)

if defined DEV_OK goto INSTALAR_APK

if defined DEV_UNAUTH (
    echo.
    echo [ATENCION] Se detecto el telefono [!DEV_UNAUTH!], pero falta autorizarlo:
    echo   1. Desbloquea la pantalla de tu celular.
    echo   2. Toca "Permitir" en el aviso "Permitir depuracion USB".
    echo   3. Marca "Permitir siempre desde esta computadora".
    echo.
    pause
    goto BUSCAR_TELEFONO
)

echo.
echo [AVISO] No se detecto ningun telefono Android por USB.
echo Verifica lo siguiente en tu celular:
echo   1. Conecta un cable USB que transfiera DATOS (no solo carga).
echo   2. Ajustes ^> Acerca del telefono ^> Toca 7 veces "Numero de compilacion".
echo   3. Ajustes ^> Opciones de desarrollador ^> Activa "Depuracion por USB".
echo   4. En el modo USB elige "Transferencia de archivos (MTP)".
echo   5. (Xiaomi/Redmi) Activa tambien "Instalar via USB".
echo.
set /p "RETRY=Presiona ENTER para volver a buscar (o escribe S para salir): "
if /i "%RETRY%"=="S" exit /b 1
goto BUSCAR_TELEFONO

REM ========================================================================
REM  INSTALAR APK Y ABRIR LA APLICACION AUTOMATICAMENTE
REM ========================================================================
:INSTALAR_APK
echo.
echo Telefono detectado: %DEV_OK%
echo Instalando bellaapp en el dispositivo (espera unos segundos)...
echo.
"%ADB_EXE%" -s "%DEV_OK%" install -r -d "%APK_FINAL%"
if not errorlevel 1 goto ABRIR_APP

echo.
echo [AVISO] No se pudo sobrescribir la instalacion anterior (posible cambio de firma).
set /p "REINST=Deseas desinstalar la version anterior e instalar limpia? [S/N]: "
if /i not "%REINST%"=="S" (
    echo Instalacion cancelada.
    pause
    exit /b 1
)
"%ADB_EXE%" -s "%DEV_OK%" uninstall %APP_ID% >nul 2>&1
"%ADB_EXE%" -s "%DEV_OK%" install "%APK_FINAL%"
if errorlevel 1 (
    echo.
    echo [ERROR] No se pudo instalar la aplicacion.
    echo         En celulares Xiaomi/MIUI verifica activar "Instalar via USB".
    pause
    exit /b 1
)

:ABRIR_APP
echo.
echo ========================================================================
echo   INSTALACION COMPLETADA CON EXITO!
echo   Abriendo Estetica Unisex Kenya (bellaapp) en tu telefono...
echo ========================================================================
"%ADB_EXE%" -s "%DEV_OK%" shell monkey -p %APP_ID% -c android.intent.category.LAUNCHER 1 >nul 2>&1
echo.
echo Ya puedes desconectar el cable USB cuando gustes.
pause
exit /b 0
