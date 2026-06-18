@echo off
REM ============================================================
REM   Totem Liceo Fenner - Lanzador en modo kiosko (Chrome)
REM   Abre el sitio a pantalla completa, sin barras ni pestanas.
REM   Para salir del modo kiosko: Alt + F4
REM ============================================================

set "CHROME=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
set "URL=https://totem-liceo.vercel.app"

start "" "%CHROME%" ^
 --kiosk "%URL%" ^
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
