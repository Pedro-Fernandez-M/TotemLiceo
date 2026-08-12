@echo off
REM ============================================================
REM   Totem Liceo Fenner - Lanzador en modo kiosko (Chrome)
REM   Abre el sitio a pantalla completa en la pantalla tactil
REM   (pantalla extendida DISPLAY2, posicion 1366,0).
REM   Para salir del modo kiosko: Alt + F4
REM   Si cambia la disposicion de pantallas, ajusta WINPOS.
REM ============================================================

set "CHROME=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
set "URL=https://totem-liceo.vercel.app"
set "WINPOS=1366,0"

start "" "%CHROME%" ^
 --kiosk "%URL%" ^
 --window-position=%WINPOS% ^
 --user-data-dir="%LOCALAPPDATA%\TotemLiceo" ^
 --no-first-run ^
 --fast --fast-start ^
 --disable-translate ^
 --disable-features=TranslateUI ^
 --disable-session-crashed-bubble ^
 --disable-infobars ^
 --noerrdialogs ^
 --overscroll-history-navigation=0 ^
 --use-fake-ui-for-media-stream ^
 --autoplay-policy=no-user-gesture-required
