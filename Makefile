VERSION=`cut -d '"' -f2 $BUILDDIR/../version.js`


cordova-base:
	grunt dist-mobile

# ios:  cordova-base
# 	make -C cordova ios
# 	open cordova/project/platforms/ios/Copay
#
# android: cordova-base
# 	make -C cordova run-android
#
# release-android: cordova-base
# 	make -C cordova release-android
#

ios-prod:
	cordova/build.sh IOS --clear
	cd ../idanodebuilds/project-IOS && cordova build ios
#	open ../idanodebuilds/project-IOS/platforms/ios/idanode.xcodeproj

ios-debug:
	cordova/build.sh IOS --dbgjs
	cd ../idanodebuilds/project-IOS && cordova build ios
	open ../idanodebuilds/project-IOS/platforms/ios/IdaNode.xcodeproj

ios:
	cordova/build.sh IOS --dbgjs
	cd ../idanodebuilds/project-IOS && cordova build ios
	open ../idanodebuilds/project-IOS/platforms/ios/IdaNode.xcodeproj
	
android:
	cordova/build.sh ANDROID
	cd ../idanodebuilds/project-ANDROID && cordova build android 2>&1 >/dev/null
	mv ../idanodebuilds/project-ANDROID/platforms/android/app/build/outputs/apk/debug/app-debug.apk ../idanodebuilds/idanode.apk

	#mv ../idanodebuilds/project-ANDROID/platforms/android/build/outputs/apk/android-debug.apk ../idanodebuilds/idanode.apk

android-prod:
	cordova/build.sh ANDROID --clear
#	cp ./etc/beep.ogg ./cordova/project/plugins/phonegap-plugin-barcodescanner/src/android/LibraryProject/res/raw/beep.ogg
	cd ../idanodebuilds/project-ANDROID && cordova run android --device
	
android-prod-fast:
	cordova/build.sh ANDROID
	cd ../idanodebuilds/project-ANDROID && cordova run android --device

android-debug:
	cordova/build.sh ANDROID --dbgjs --clear
#	cp ./etc/beep.ogg ./cordova/project/plugins/phonegap-plugin-barcodescanner/src/android/LibraryProject/res/raw/beep.ogg
	cd ../idanodebuilds/project-ANDROID && cordova run android --device

android-debug-fast:
	cordova/build.sh ANDROID --dbgjs
#	cp ./etc/beep.ogg ./cordova/project/plugins/phonegap-plugin-barcodescanner/src/android/LibraryProject/res/raw/beep.ogg
	cd ../idanodebuilds/project-ANDROID && cordova run android --device
#	cd ../idanodebuilds/project-ANDROID && cordova build android

win32: 
	grunt.cmd desktop
	cp -r node_modules ../idanodebuilds/IdaNode/win32/
	grunt.cmd inno32

win64: 
	grunt.cmd desktop
	cp -r node_modules ../idanodebuilds/IdaNode/win64/
	grunt.cmd inno64

linux64:
	grunt desktop
	cp -r node_modules ../idanodebuilds/IdaNode/linux64/
	grunt linux64
	
osx64:
	grunt desktop
	cp -r node_modules ../idanodebuilds/IdaNode/osx64/IdaNode.app/Contents/Resources/app.nw/
	#mkdir -p ../idanodebuilds/IdaNode/osx64/app
	#cp -R ../idanodebuilds/IdaNode/osx64/IdaNode.app ../idanodebuilds/IdaNode/osx64/app/
	#ln -s /Applications ../idanodebuilds/IdaNode/osx64/app/
	#hdiutil create -srcfolder ../idanodebuilds/IdaNode/osx64/app/  -fs HFS+J -volname 'IdaNode' ../idanode-osx64.dmg
	#mv ../idanode-osx64.dmg ../idanodebuilds/
	#rm -rf ../idanodebuilds/IdaNode/osx64/app
	grunt dmg
