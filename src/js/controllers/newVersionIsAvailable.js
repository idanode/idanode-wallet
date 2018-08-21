// 'use strict';
//
// angular.module('copayApp.controllers').controller('newVersionIsAvailable', function ($scope, $modalInstance, go, newVersion, backButton) {
//
// 	$scope.version = newVersion.version;
// 	if(newVersion.msg)
// 		$scope.msg = newVersion.msg;
//
// 	document.removeEventListener('backbutton', backButton.back, false);
//
// 	$scope.openDownloadLink = function () {
// 		var link = '';
//
//
// 		//  if (navigator && navigator.app) {
// 		//    link = 'https://play.google.com/store/apps/details?id=org.idanode.wallet';
// 		// if (newVersion.version.match('t$'))
// 		//  link += '.testnet';
// 		//  }
// 		//  else {
// 		//    link = 'https://github.com/idanode/idanode/releases/tag/v' + newVersion.version;
// 		//  }
//
// 		var appPlatform = '/application.html';
// 		// if (typeof (process.platform) !== "undefined") {
// 		// 	switch (process.platform) {
// 		// 		case 'win32':
// 		// 			appPlatform = "/idanode/idanode-win64.exe";
// 		// 			break;
// 		// 		case 'linux':
// 		// 			appPlatform = "/idanode/idanode-linux64.zip";
// 		// 			break;
// 		// 		case 'darwin':
// 		// 			appPlatform = '/idanode/idanode-osx64.dmg';
// 		// 			break;
// 		// 	}
// 		// } else {
// 		// 	if (window.cordova.platformId === "android")
// 		// 		appPlatform = "/idanode/idanode.apk"
// 		// 	if (window.cordova.platformId === "ios")
// 		// 		appPlatform = "#download"
// 		// }
// 		link = 'https://idanode.org' + appPlatform;
//
// 		//go.openExternalLink(link);
// 		if (typeof nw !== 'undefined')
// 			nw.Shell.openExternal(link);
// 		else
// 			cordova.InAppBrowser.open(link, '_system');
// 		$modalInstance.close('closed result');
// 		if (navigator && navigator.app)
// 			navigator.app.exitApp();
// 		else if (process.exit)
// 			process.exit();
// 	};
//
// 	$scope.later = function () {
// 		$modalInstance.close('closed result');
// 	};
// });
