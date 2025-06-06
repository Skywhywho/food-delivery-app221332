@echo off
echo Creating food-delivery-app directory in XAMPP htdocs...
mkdir "C:\xampp\htdocs\food-delivery-app" 2>nul

echo Copying API files...
xcopy /Y /I "api\*.php" "C:\xampp\htdocs\food-delivery-app\api\"

echo Done!
pause 