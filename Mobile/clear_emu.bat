emulator -avd emu -wipe-data
timeout 70
adb shell rm /storage/sdcard/Android/data/com.ionicframework.cerebralhike151910/files/*.*
adb shell ls /storage/sdcard/Android/data/com.ionicframework.cerebralhike151910/files

