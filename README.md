## IdaNode

IdaNode is an open source project that provides reliable and trusted public blockchain network services. The wallet created for the community is also named IdaNode. This project is supported by the IdaNode Foundation.

IdaNode wallet is safe, simple and easy to use, it supports transfer TRC20 Tokens, send private instant messaging, provide security solutions, etc.

We welcome everyone joins this open source community to build decentralized applications running on a fast, scalable, and truly decentralized blockchain powered by IdaNode.

Please visit IdaNode official site [idanode.org](https://idanode.org/) to get more information.

## Download

Official Site:
- [idanode.org](https://idanode.org/application.html)

Github release:
- [github.com](https://github.com/idanode/idanode-wallet/releases)


## Installation

We provide executable programs for multiple platforms. You can either start using the IdaNode wallet by clicking the download link above, or you can use the source code to compile into an executable program.

#### Dependences

**Choose the install package according to your operation system**

- git
- [Node.js v8.9.4](https://nodejs.org/dist/v8.9.4/)
- [NW.js v0.26.6](https://dl.nwjs.io/v0.26.6)
- bower
    - `npm install -g bower@1.8.2`
- grunt
    - `npm install -g grunt-cli`
- nw-gyp
    - `npm install -g nw-gyp`


##### Windows

**Option 1:**

- Open PowerShell by using administrator privileges, run `npm install --global --production windows-build-tools`
- Set environment variable `GYP_MSVS_VERSION = 2015`
- `npm config set msvs_version 2015`

Please refer to [windows-build-tools](https://github.com/felixrieseberg/windows-build-tools)


**Option 2:**

- Install [Visual Studio 2017](https://visualstudio.microsoft.com/zh-hans/thank-you-downloading-visual-studio/?sku=Community&rel=15)，with VC++ 2015 (v140) tools.
- Install [Python 2.7.14](https://www.python.org/downloads/release/python-2714/)
- Set environment variable, add the Python insall directory to `PATH`.
- Set environment variable `GYP_MSVS_VERSION = 2015`
- `npm config set msvs_version 2015`


#### Clone project code

```sh
git clone https://github.com/idanode/idanode-wallet.git
cd idanode-wallet
```

#### Compile

```sh
# ./idanode-wallet
# if you get a fatal error on g++ lib, then install the package:
# sudo apt-get install g++-multilib
# if you are building for 32-bit target, then --target_arch=ia32
bower install
npm install
npm rebuild sqlite3 --build-from-source --runtime=node-webkit --target_arch=x64 --target=0.26.6
grunt
```

if you encounter an error while building sqlite3 like:
gyp ERR! clean error
gyp ERR! stack Error: EACCES: permission denied, rmdir 'build'

Then, you can apply below work around to your home folder:
sudo chown -R $USER /home/ubuntu

#### Execute
After first run, you'll likely encounter runtime error complaining about node_sqlite3.node not being found, copy the file from the neighboring directory to where the program tries to find it, and run again (e.g. from idanode-wallet/node_modules/sqlite3/lib/binding/node-v47-darwin-x64 to idanode-wallet/node_modules/sqlite3/lib/binding/node-webkit-v0.14.7-darwin-x64). If that didn't work, copy node_sqlite3.node from node_modules folder, which is got installed with installer file from Byteball.org website.

Full path of nwjs
```sh
# ./idanode-wallet
./nwjs/nwjs .
```

#### Package

The release package will be generated under ../idanodebuilds

```
--|
  | idanode-wallet
  | idanodebuilds
```

##### Android
Install Cordova

Install Android SDK (from Android Studio)

- Install Android SDK （refer to https://developer.android.google.cn/studio/）

- Run `make android`

In case of could not find gradle wrapper within android sdk error, download Android SDK tools package v25:

http://dl-ssl.google.com/android/repository/tools_r25.2.5-macosx.zip

http://dl-ssl.google.com/android/repository/tools_r25.2.5-linux.zip

http://dl-ssl.google.com/android/repository/tools_r25.2.5-windows.zip

and extract to android_sdk_folder/ (should replace ./tools folder).

You can install Gradle from the following link: https://gradle.org/install/
export PATH=$PATH:/opt/gradle/gradle-4.10/bin
export ANDROID_HOME=$HOME/your_android_sdk_folder
export PATH=$PATH:$ANDROID_HOME/tools

You may need to install the build-tool, platform-tools if you encounter the error message like: "No installed build tools found. "

##### iOS

- Install Xcode 9 (or higher version)
- Install Cordova `npm install -g cordova`
- Install ios-deploy `npm install -g ios-deploy`
- Run `make ios`


##### macOS

- `make osx64`

##### Windows (may need to specify NWJS location in makefile)

- `make win64`

##### Linux

- `make linux64`


## Wallet Backup and Restore

Once the user starts to use IdaNode Wallet, cache files will be generated in the user directory to store data and user profiles, and to prevent personal data loss due to incorrect uninstallation, these caches files won’t be deleted after installation, all data will be recovered after reinstalling the software. If the user decides to delete these data, please follow the instructions below:

* macOS: `~/Library/Application Support/DND`
* Linux: `~/.config/DND`
* Windows: `%LOCALAPPDATA%\DND`

## File you may be interested in

* .\idanode-wallet\src\js\controllers\walletHome.js (line 1372)
* .\idanode-wallet\src\js\services\configService.js (line 75)
* .\idanode-wallet\public\idanode.js (line 2668, 2670, 18540)

if you are running wallet for testnet, make sure to change WS_PROTOCOL to "ws" in file idanode-wallet/node_modules/idanode-common/conf.js

[line 44:] exports.WS_PROTOCOL = "ws://"

## Issues and Questions

* [GitHub Issues](https://github.com/idanode/idanode-wallet/issues)
* [Email Support](mailto:foundation@idanode.org)

## Translation

## License

MIT

