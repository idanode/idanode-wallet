'use strict';

// Configure service script

angular.module('copayApp.services').factory('configService', function (storageService, lodash, $log, isCordova) {
	var root = {};
	root.colorOpts = [
		"#0095ff",
		"#0745bc",
		// "#20498b",
		'#DD4B39',
		'#F38F12',
		'#FAA77F',
		'#FADA58',
		'#9EDD72',
		'#77DADA',
		'#4A90E2',
		'#484ED3',
		'#9B59B6',
		'#E856EF',
		'#FF599E',
		'#7A8C9E'
	];

	var constants = require('idanode-common/constants.js');
	var isTestnet = constants.version.match(/t$/);

	// Configuring timestamp address
	//root.TIMESTAMPER_ADDRESS = isTestnet ? 'OPNUXBRSSQQGHKQNEPD2GLWQYEUY5XLD' : 'I2ADHGP4HL6J37NQAD73J7E5SKFIXJOT';
	root.TIMESTAMPER_ADDRESS = "2SATGZDFDXNNJRVZ52O4J6VYTTMO2EZR";

	root.oracles = {
		"FOPUBEUPBC6YLIQDLKL6EW775BMV7YOH": {
			name: "Bitcoin Oracle",
			feednames_filter: ["^bitcoin_merkle$", "^random[\\d]+$"],
			feedvalues_filter: ["^[13][a-km-zA-HJ-NP-Z1-9]{25,34}\\:[0-9\\.]+$", "^\\d{1,6}$"]
		},
		"JPQKPRI5FMTQRJF4ZZMYZYDQVRD55OTC": {
			name: "Crypto exchange rates",
			feednames_filter: ["^[\\dA-Z]+_[\\dA-Z]+$"],
			feedvalues_filter: ["^[\\d\\.]+$"]
		},
		"GFK3RDAPQLLNCMQEVGGD2KCPZTLSG3HN": {
			name: "Flight delay tracker",
			feednames_filter: ["^[\\w\\d]+-\\d{4}-\\d{2}-\\d{2}$"],
			feedvalues_filter: ["^[\\d]+$"]
		},
		"TKT4UESIKTTRALRRLWS4SENSTJX6ODCW": {
			name: "Sports betting on soccer",
			feednames_filter: ["^[\\w\\d]+_[\\w\\d]+_\\d{4}-\\d{2}-\\d{2}$"],
			feedvalues_filter: ["^[\\w\\d]+$"]
		},
		"2SATGZDFDXNNJRVZ52O4J6VYTTMO2EZR": {
			name: "Timestamp",
			feednames_filter: ["^timestamp$"],
			feedvalues_filter: ["^\\d{13,}$"]
		}
	};

    /*TODO: to be open after testnet
	root.hub = [
		'victor.idanode.org/tn',
		'eason.idanode.org/tn',
		'lymn.idanode.org/tn',
		'bob.idanode.org/tn',
		'curry.idanode.org/tn',
		'kake.idanode.org/tn'
	]
	root.stableHub = 'stable.idanode.org/tn';
    */
    /*for test only*/
	root.hub = [
		//'192.168.1.127:6616'
        '52.15.163.180:6616'
	]
	//root.stableHub = '192.168.1.127:6616';
    root.stableHub = '52.15.163.180:6616';
    
	// Wallet default configuration
	var defaultConfig = {
		// wallet limits
		limits: {
			totalCosigners: 6
		},
		//Wallet hub configuration
		// hub: (constants.alt === '2' && isTestnet) ? 'idanode.org/bb-test' : 'galilei.idanode.org/tn',
		hub: root.hub[(Math.floor(Math.random()*(root.hub.length)))],

		// requires bluetooth permission on android
		//deviceName: /*isCordova ? cordova.plugins.deviceName.name : */require('os').hostname(),

		getDeviceName: function () {
			return isCordova ? cordova.plugins.deviceName.name : require('os').hostname();
		},

		//  Change the default unit of the wallet to MN
		//  wallet default config
		wallet: {
			requiredCosigners: 2,
			totalCosigners: 3,
			spendUnconfirmed: false,
			reconnectDelay: 5000,
			idleDurationMin: 4,
			settings: {
				unitName: 'DND',
				unitValue: 1000000,
				unitDecimals: 6,
				unitCode: 'mega',
				bbUnitName: 'blacknotes',
				bbUnitValue: 1,
				bbUnitDecimals: 0,
				bbUnitCode: 'one',
				alternativeName: 'US Dollar',
				alternativeIsoCode: 'USD',
			}
		},
		rates: {
			url: 'https://insight.bitpay.com:443/api/rates',
		},

		pushNotifications: {
			enabled: true,
			config: {
				android: {
					icon: 'push',
					iconColor: '#2F4053'
				},
				ios: {
					alert: 'true',
					badge: 'true',
					sound: 'true',
				},
				windows: {},
			}
		},
		autoUpdateWitnessesList: true
	};

	var configCache = null;

	root.getSync = function () {
		if (!configCache)
			throw new Error('configService#getSync called when cache is not initialized');
		return configCache;
	};

	root.get = function (cb) {

		storageService.getConfig(function (err, localConfig) {
			configCache = migrateLocalConfig(localConfig);
			$log.debug('Preferences read:', configCache);
			return cb(err, configCache);
		});
	};

	root.set = function (newOpts, cb) {
		var config = defaultConfig;
		storageService.getConfig(function (err, oldOpts) {
			if (lodash.isString(oldOpts)) {
				oldOpts = JSON.parse(oldOpts);
			}
			if (lodash.isString(config)) {
				config = JSON.parse(config);
			}
			if (lodash.isString(newOpts)) {
				try {
					newOpts = JSON.parse(newOpts);
				}catch (e){
					newOpts = oldOpts;
				}
			}
			lodash.merge(config, oldOpts, newOpts);
			checkAndReplaceOldUnitCode(config.wallet.settings);
			configCache = config;

			storageService.storeConfig(JSON.stringify(config), cb);
		});
	};

	root.reset = function (cb) {
		configCache = lodash.clone(defaultConfig);
		storageService.removeConfig(cb);
	};

	root.getDefaults = function () {
		return lodash.clone(defaultConfig);
	};

	if (window.config) {
		configCache = migrateLocalConfig(window.config);
	} else {
		root.get(function () {
		});
	}

	// Wallet settings have been set or default
	function migrateLocalConfig(localConfig) {
		if (localConfig) {

			// JSON.parse() 将 JSON 字符串转换为 对象
			try{
				var _config = JSON.parse(localConfig);
			}
			catch(err){
				var _config = {};
			}

			//these ifs are to avoid migration problems
			if (!_config.wallet) {
				_config.wallet = defaultConfig.wallet;
			}
			if (!_config.wallet.settings.unitCode) {
				_config.wallet.settings.unitCode = defaultConfig.wallet.settings.unitCode;
			}
			if (!_config.wallet.settings.unitValue) {
				if (_config.wallet.settings.unitToBytes) {
					_config.wallet.settings.unitValue = _config.wallet.settings.unitToBytes;
				} else {
					_config.wallet.settings.unitValue = defaultConfig.wallet.settings.unitValue;
				}
			}
			if (!_config.wallet.settings.bbUnitName) {
				_config.wallet.settings.bbUnitName = defaultConfig.wallet.settings.bbUnitName;
			}
			if (!_config.wallet.settings.bbUnitValue) {
				_config.wallet.settings.bbUnitValue = defaultConfig.wallet.settings.bbUnitValue;
			}
			if (!_config.wallet.settings.bbUnitDecimals) {
				_config.wallet.settings.bbUnitDecimals = defaultConfig.wallet.settings.bbUnitDecimals;
			}
			if (!_config.wallet.settings.bbUnitCode) {
				_config.wallet.settings.bbUnitCode = defaultConfig.wallet.settings.bbUnitCode;
			}
			if (!_config.pushNotifications) {
				_config.pushNotifications = defaultConfig.pushNotifications;
			}
			if (!_config.hub)
				_config.hub = defaultConfig.hub;
			if (!_config.deviceName)
				_config.deviceName = defaultConfig.getDeviceName();

			checkAndReplaceOldUnitCode(_config.wallet.settings);
		} else {
			_config = lodash.clone(defaultConfig);
			_config.deviceName = defaultConfig.getDeviceName();
		}
		//Hoang: Added this to default config
		_config = defaultConfig;
		return _config;
	}

	function checkAndReplaceOldUnitCode(setting) {
		switch (setting.unitCode) {
			case 'byte':
				setting.unitCode = 'one';
				setting.unitValue = 1;
				break;
			case 'kB':
				setting.unitCode = 'kilo';
				setting.unitValue = 1000;
				break;
			case 'MB':
				setting.unitCode = 'mega';
				setting.unitValue = 1000000;
				break;
			case 'GB':
				setting.unitCode = 'giga';
				setting.unitValue = 1000000000;
				break;
		}
	}


	return root;
});
