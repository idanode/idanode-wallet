'use strict';

angular.module('copayApp.controllers').controller('airDropReceive', function ($scope, $rootScope, go, profileService, gettextCatalog, addressService, $timeout) {
	var self = this;
	var wallet_defined_by_keys = require('idanode-common/wallet_defined_by_keys.js');
	var myWitnesses = require('idanode-common/my_witnesses');
	var network = require('idanode-common/network');
	var Bitcore = require('bitcore-lib');
	var Mnemonic = require("bitcore-mnemonic");
	var crypto = require("crypto");
	var objectHash = require('idanode-common/object_hash.js');
	var ecdsaSig = require('idanode-common/signature.js');

	self.successful = 0;
	self.Redeeming = 0;
	self.errTextList = [];
	self.showMask = 0;
	self.placeholderText = gettextCatalog.getString('Please enter T Code');
	self.isAvailable = 0;

	self.isToRecDir = go.isToRecDir;
	self.setisToRecDir = function () {
		go.isToRecDir = 0;
	};

	self.mnemonicStr = go.tempTcode;
	if(self.mnemonicStr){
		self.isAvailable = 1;
	}

	self.checkTword = function () {
		if (self.mnemonicStr.length < 1) {
			return self.isAvailable = 0;
		} else{
			return self.isAvailable = 1;
		}
	};
	self.clickOK = function () {
		self.showMask = 0;
		if(self.isAvailable == 1){
			self.isAvailable = 1;
			return false;
		}
		self.mnemonicStr = '';
		self.isAvailable = 0;
	};

// 轻钱包获取地址
	self.receiveCandy = function (cb) {
		go.tempTcode = '';
		if (self.isAvailable == 0) {
			return false;
		}
		if(self.mnemonicStr.length != 16){
			self.errTextList[0] = gettextCatalog.getString('Incorrect T code, please re-enter');
			self.showMask = 1;
			$timeout(function() {
				$scope.$apply()
			}, 10);
			return false;
		}

		self.Redeeming = 1;
		self.isAvailable = 0;
		self.mnemonic = 'fury car kingdom design boat please trust enrich empower era paper erase';

// timeout 延时一下
		$timeout(function () {
			var mnemonic = new Mnemonic(self.mnemonic);
			var xPrivKey = mnemonic.toHDPrivateKey(self.mnemonicStr);
			var wallet_xPubKey = Bitcore.HDPublicKey(xPrivKey.derive("m/44'/0'/0'")).toString();

			var tempAddress = [];
			tempAddress[0] = objectHash.getChash160(["sig", {"pubkey": wallet_defined_by_keys.derivePubkey(wallet_xPubKey, 'm/0/0')}]); // 红包地址
			myWitnesses.readMyWitnesses(function (arrWitnesses) {
				if (!arrWitnesses || arrWitnesses.length != 12) {
					self.errTextList[0] = gettextCatalog.getString('arrWitnesses error: try it later.');
					self.Redeeming = 0;
					self.showMask = 1;
					$timeout(function() {
						$scope.$apply()
					}, 10);
					return false;
				}
				network.requestFromLightVendor('light/get_history', {
					addresses: tempAddress,
					witnesses: arrWitnesses
				}, function (ws, request, response) {
					//console.log(JSON.stringify(response))
					//alert('****************' + JSON.stringify(response))
					if (!response.joints) {
						self.errTextList[0] = gettextCatalog.getString('You are too late,');
						self.errTextList[1] = gettextCatalog.getString('the T code has been claimed by other people');
						self.Redeeming = 0;
						self.showMask = 1;
						$timeout(function() {
							$scope.$apply()
						}, 10);
						return false;
					}

					//alert(JSON.stringify(response))
					if (!response.joints[0].unit.unit || !response.joints[0].unit.messages[0].payload.outputs || !response.joints[0].unit.witness_list_unit) {
						//alert('****************' + JSON.stringify(response))
						self.errTextList[0] = gettextCatalog.getString('You are too late,');
						self.errTextList[1] = gettextCatalog.getString('the T code has been claimed by other people');
						self.Redeeming = 0;
						self.showMask = 1;
						$timeout(function() {
							$scope.$apply()
						}, 10);
						return false;
					}

					// 判断 交易单元是否已经稳定
					for(var j = 0; j < response.unstable_mc_joints.length; j++){
						if(response.unstable_mc_joints[j].unit.unit == response.joints[0].unit.unit){
							self.errTextList[0] = gettextCatalog.getString('T Code is not stable, please try again later');
							self.Redeeming = 0;
							self.isAvailable = 1;
							self.showMask = 1;
							$timeout(function() {
								$scope.$apply()
							}, 10);
							return false;
						}
					}

					// 判断是不是第三方资产的 红包
					if(response.joints[0].unit.messages.length > 1){
						if(response.joints[0].unit.messages[1].payload.outputs == undefined){
							self.errTextList[0] = gettextCatalog.getString('You are too late,');
							self.errTextList[1] = gettextCatalog.getString('the T code has been claimed by other people');
							self.Redeeming = 0;
							self.showMask = 1;
							$timeout(function() {
								$scope.$apply()
							}, 10);
							return false;
						}
						var tempArr1 = response.joints[0].unit.messages[1].payload.outputs;
						var tempAsset = response.joints[0].unit.messages[1].payload.asset;
						for (var i = 0; i < tempArr1.length; i++) {
							if (tempAddress[0] == tempArr1[i].address) {  // tempAddress[0] 就是红包的 地址
								self.tmpAmount1 = tempArr1[i].amount;
								break;
							}
						}
						var output_index1 = i;

					}

					var inputUnit = response.joints[0].unit.unit;
					var tempArr = response.joints[0].unit.messages[0].payload.outputs;
					if (tempArr) {
						for (var i = 0; i < tempArr.length; i++) {
							if (tempAddress[0] == tempArr[i].address) {
								self.tmpAddr = tempArr[i].address;
								self.tmpAmount = tempArr[i].amount;
								break;
							}
						}
						var output_index = i;
					}
					//alert(self.tmpAddr)
					if(self.tmpAddr == undefined){
						self.errTextList[0] = gettextCatalog.getString('You are too late,');
						self.errTextList[1] = gettextCatalog.getString('the T code has been claimed by other people');
						self.Redeeming = 0;
						self.showMask = 1;
						$timeout(function() {
							$scope.$apply()
						}, 10);
						return false;
					}
					var witness_list_unit = response.joints[0].unit.witness_list_unit; // 公证人列表单元

					network.requestFromLightVendor('light/get_parents_and_last_ball_and_witness_list_unit', {witnesses: arrWitnesses}, function (ws, request, response) {
						if (response.error) {
							self.errTextList[0] = response.error;
							self.Redeeming = 0;
							self.showMask = 1;
							$timeout(function() {
								$scope.$apply()
							}, 10);
							return false;
						}
						if (!response.parent_units || !response.last_stable_mc_ball || !response.last_stable_mc_ball_unit || typeof response.last_stable_mc_ball_mci !== 'number') {
							self.errTextList[0] = gettextCatalog.getString('Incorrect T code, please re-enter');
							self.Redeeming = 0;
							self.showMask = 1;
							$timeout(function() {
								$scope.$apply()
							}, 10);
							return false;
						}
						self.parent_units = response.parent_units;
						self.last_ball = response.last_stable_mc_ball;
						self.last_ball_unit = response.last_stable_mc_ball_unit;


						// 获取到当前宿主钱包的地址
						addressService.getAddress(profileService.focusedClient.credentials.walletId, false, function (err, addr) {
							if (err) {
								self.errTextList[0] = gettextCatalog.getString('Error: my wallet address is not found');
								self.Redeeming = 0;
								return self.showMask = 1;
							} else {
								if (addr)
									self.to_address = addr;

								var msg = [
									{
										"app": "payment",
										"payload_location": "inline",
										"payload_hash": "-------------------------------------------=",
										"payload": {
											"outputs": [
												{
													"address": self.to_address,
													"amount": 0
												}
											],
											"inputs": [
												{
													"unit": inputUnit,
													"message_index": 0,
													"output_index": output_index
												}
											]
										}
									}
								];

								var objUnit = {
									"version": "1.0",
									"alt": "1",
									"messages": msg,
									"authors": [
										{
											"address": self.tmpAddr,
											"authentifiers": {"r": "----------------------------------------------------------------------------------------"},
											"definition": ["sig", {"pubkey": "--------------------------------------------"}]
										}
									],
									"parent_units": self.parent_units,
									"last_ball": self.last_ball,
									"last_ball_unit": self.last_ball_unit,
									"witness_list_unit": witness_list_unit,
									"headers_commission": 0,
									"payload_commission": 0
								};


								if(tempArr1){
									var msg1 = [
										{
											"app": "payment",
											"payload_location": "inline",
											"payload_hash": "-------------------------------------------=",
											"payload": {
												"outputs": [
													{
														"address": self.to_address,
														"amount": 0
													}
												],
												"inputs": [
													{
														"unit": inputUnit,
														"message_index": 0,
														"output_index": output_index
													}
												]
											}
										},

										{
											"app": "payment",
											"payload_location": "inline",
											"payload_hash": "-------------------------------------------=",
											"payload": {
												"asset": tempAsset,
												"outputs": [
													{
														"address": self.to_address,
														"amount": 0
													}
												],
												"inputs": [
													{
														"unit": inputUnit,
														"message_index": 1,
														"output_index": output_index1
													}
												]
											}
										}
									];

									objUnit.messages = msg1;
									var objectLength = require('idanode-common/object_length');
									var numHeadersCommission = objectLength.getHeadersSize(objUnit); // header佣金
									objUnit.headers_commission = numHeadersCommission;
									var numPayloadCommission = objectLength.getTotalPayloadSize(objUnit); // payload佣金
									objUnit.payload_commission = numPayloadCommission;

									objUnit.messages[0].payload.outputs[0].amount = self.tmpAmount - numPayloadCommission - numHeadersCommission; // 一共可以发送多少钱
									objUnit.messages[1].payload.outputs[0].amount = self.tmpAmount1;

									var payload_hash = objectHash.getBase64Hash(objUnit.messages[0].payload);
									objUnit.messages[0].payload_hash = payload_hash;

									var payload_hash1 = objectHash.getBase64Hash(objUnit.messages[1].payload);
									objUnit.messages[1].payload_hash = payload_hash1;
								}
								else{
									var objectLength = require('idanode-common/object_length');
									var numHeadersCommission = objectLength.getHeadersSize(objUnit); // header佣金
									objUnit.headers_commission = numHeadersCommission;
									var numPayloadCommission = objectLength.getTotalPayloadSize(objUnit); // payload佣金
									objUnit.payload_commission = numPayloadCommission;
									objUnit.messages[0].payload.outputs[0].amount = self.tmpAmount - numPayloadCommission - numHeadersCommission; // 一共可以发送多少钱

									var payload_hash = objectHash.getBase64Hash(objUnit.messages[0].payload);
									objUnit.messages[0].payload_hash = payload_hash;
								}



								if(objUnit.messages[0].payload.outputs[0].amount <= 0){
									self.errTextList[0] = gettextCatalog.getString('You are too late,');
									self.errTextList[1] = gettextCatalog.getString('the T code has been claimed by other people');
									self.Redeeming = 0;
									self.showMask = 1;
									$timeout(function() {
										$scope.$apply()
									}, 10);
									return false;
								}

								var walletxPubKey = Bitcore.HDPublicKey(xPrivKey.derive("m/44'/0'/0'"));
								var pubkey = walletxPubKey.derive("m/0/0").publicKey.toBuffer().toString("base64");
								objUnit.authors[0].definition[1].pubkey = pubkey;

								var text_to_sign = objectHash.getUnitHashToSign(objUnit);

								//签名信息
								var path = "m/44'/0'/0'/0/0";
								var privateKey = xPrivKey.derive(path).privateKey;
								var privKeyBuf = privateKey.bn.toBuffer({size: 32});
								self.signature = ecdsaSig.sign(text_to_sign, privKeyBuf);



								objUnit.authors[0].authentifiers.r = self.signature;
								objUnit.unit = objectHash.getUnitHash(objUnit);



								var obj = {unit: objUnit};
								obj.unit.timestamp = Math.round(Date.now() / 1000);

								// if (conf.bLight){ // light clients cannot save before receiving OK from light vendor

								//alert(JSON.stringify(obj))
								var network = require('idanode-common/network.js');
								network.postJointToLightVendor(obj, function (response) {
									if (response === 'accepted') {
										self.Redeeming = 0;
										self.successful = 1;
										self.mnemonicStr = '';
										self.isAvailable = 0;
										$timeout(function() {
											$scope.index.updateAll();
											$scope.index.updateHistoryFromNetwork();
											$scope.$apply()
										}, 10);
										$timeout(function () {
											self.successful = 0;
										}, 3000)
									} else {
										self.errTextList[0] = response.error;
										self.Redeeming = 0;
										return self.showMask = 1;
									}

								});
								// }
								// alert(JSON.stringify(objUnit))
							}
						});
					});
				})
			})
		},100)
	}
});

