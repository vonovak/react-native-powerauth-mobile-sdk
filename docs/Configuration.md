# Configuration

Before you call any method on the newly created `const powerAuth = new PowerAuth(instanceId)` object, you need to configure it first. Unconfigured instance will throw exceptions. Use `await powerAuth.isConfigured()` to check if configured.

## 1. Parameters

You will need the following parameters to prepare and configure a PowerAuth instance:

- **instanceId** - Identifier of the app - the aplication package name/identifier is recommended.  
- **appKey** - APPLICATION_KEY as defined in PowerAuth specification - a key identifying an application version.
- **appSecret** - APPLICATION_SECRET as defined in PowerAuth specification - a secret associated with an application version.  
- **masterServerPublicKey** - KEY\_SERVER\_MASTER_PUBLIC as defined in PowerAuth specification - a master server public key.  
- **baseEndpointUrl** - Base URL to the PowerAuth Standard RESTful API (the URL part before "/pa/...").  
- **enableUnsecureTraffic** - If HTTP or invalid HTTPS communication should be enabled (do not set `true` in production).

## 2. Configuration

### Basic configuration

To configure PowerAuth instance simply import it from the module and use the following snippet.

```javascript
import { PowerAuth } from 'react-native-powerauth-mobile-sdk';
import { Component } from 'react';

export default class AppMyApplication extends Component {

    private powerAuth = new PowerAuth("your-app-instance-id");
    
    async setupPowerAuth() {
        // already configured instance will throw an
        // exception when you'll try to configure it again
        const isConfigured = this.powerAuth.isConfigured();
        if (isConfigured) {
            console.log("PowerAuth was already configured.");
        } else {
            try {
                await this.powerAuth.configure("APPLICATION_KEY", "APPLICATION_SECRET", "KEY_SERVER_MASTER_PUBLIC", "https://your-powerauth-endpoint.com/", false);
                console.log("PowerAuth configuration successfull.");
            } catch(e) {
                console.log(`PowerAuth failed to configure: ${e.code}`);
            }
        }
    }
}
```

### Advanced configuration

In case that you need an advanced configuration, then you can import and use the following configuration classes:
- `PowerAuthConfiguration` - co configure instance of `PowerAuth` class. This configuration object contains almost the same parameters you provide to basic configuration.

- `PowerAuthClientConfiguration` - to configure internal HTTP client. You can alter the following parameters:
  - `enableUnsecureTraffic` - If HTTP or invalid HTTPS communication should be enabled (do not set `true` in production).
  - `connectionTimeout` - timeout in seconds. The default value is `20` seconds.
  - `readTimeout` - timeout in seconds, effective only on Androd platform. The default value is `20` seconds.

- `PowerAuthBiometryConfiguration` - to configure biometic authentication. You can alter the following parameters:
  - `linkItemsToCurrentSet` - set to `true` if the key protected with the biometry is invalidated if fingers are added or removed, or if the user re-enrolls for face. The default value depends on plafrom:
    - On Android is set to `true`
    - On iOS  is set to `false`
  - `fallbackToDevicePasscode` - iOS specific, If set to `true`, then the key protected with the biometry can be accessed also with a device passcode. If set, then `linkItemsToCurrentSet` option has no effect. The default is `false`, so fallback to device's passcode is not enabled.
  - `confirmBiometricAuthentication` - Android specific, if set to `true`, then the user's confirmation will be required after the successful biometric authentication. The default value is `false`.
  - `authenticateOnBiometricKeySetup` - Android specific, if set to `true`, then the biometric key setup always require a biometric authentication. See note<sup>1</sup> below. The default value is `true`.

- `PowerAuthKeychainConfiguration` to configure an internal secure data storage. You can alter the following parameters:
  - `accessGroupName` - iOS specific, defines access group name used by the `PowerAuth` keychain instances. This is useful in situations, when your application is sharing data with another application or application's extension from the same vendor. The default value is `null`. See note<sup>2</sup> below.
  - `userDefaultsSuiteName` - iOS specific, defines suite name used by the `UserDefaults` that check for Keychain data presence. This is useful in situations, when your application is sharing data with another application or application's extension from the same vendor. The default value is `null`. See note<sup>2</sup> below.
  - `minimalRequiredKeychainProtection` - Android specific, defines minimal required keychain protection level that must be supported on the current device. The default value is `PowerAuthKeychainProtection.NONE`. See note<sup>3</sup> below.

> Note 1: Setting `authenticateOnBiometricKeySetup` parameter to `true` leads to use symmetric AES cipher on the background so both configuration and usage of biometric key require the biometric authentication. If set to `false`, then RSA cipher is used and only the usage of biometric key require the biometric authentication. This is due to fact, that RSA cipher can encrypt data with using it's public key available immediate after the key-pair is created in Android KeyStore.

> Note 2: You're responsible to migrate the keychain and `UserDefaults` data from non-shared storage to the shared one, before you configure the first `PowerAuth` instance. This is quite difficult to do in JavaScript, so it's recommended to do not alter `PowerAuthKeychainConfiguration` once your application is already shipped in AppStore.

> Note 3: If you enforce the protection higher than `PowerAuthKeychainProtection.NONE`, then your application must target at least Android 6.0. Your application should also properly handle `"INSUFFICIENT_KEYCHAIN_PROTECTION"` error code reported when the device has insufficient capabilities to run your application. You should properly inform user about this situation.

The following code snipped shows usage of the advanced configuration:

```javascript
import { PowerAuth } from 'react-native-powerauth-mobile-sdk';
import { PowerAuthConfiguration } from 'react-native-powerauth-mobile-sdk';
import { PowerAuthClientConfiguration } from 'react-native-powerauth-mobile-sdk';
import { PowerAuthBiometryConfiguration } from 'react-native-powerauth-mobile-sdk';
import { PowerAuthKeychainConfiguration } from 'react-native-powerauth-mobile-sdk';
import { Component } from 'react';

export default class AppMyApplication extends Component {

    private powerAuth = new PowerAuth("your-app-instance-id");
    
    async setupPowerAuth() {
        // already configured instance will throw an
        // exception when you'll try to configure it again
        const isConfigured = this.powerAuth.isConfigured();
        if (isConfigured) {
            console.log("PowerAuth was already configured.");
        } else {
            try {
              let configuration = new PowerAuthConfiguration("appKey", "appSecret", "masterServerPublicKey", "https://your-powerauth-endpoint.com/")
              let clientConfiguration = new PowerAuthClientConfiguration()
              clientConfiguration.enableUnsecureTraffic = false
              let biometryConfiguration = new PowerAuthBiometryConfiguration()
              biometryConfiguration.linkItemsToCurrentSet = true
              let keychainConfiguration = new PowerAuthKeychainConfiguration()
              keychainConfiguration.minimalRequiredKeychainProtection = PowerAuthKeychainProtection.SOFTWARE
              await this.powerAuth.configure(configuration, clientConfiguration, biometryConfiguration, keychainConfiguration)
                console.log("PowerAuth configuration successfull.");
            } catch(e) {
                console.log(`PowerAuth failed to configure: ${e.code}`);
            }
        }
    }
}
```

## Read Next

- [Device Activation](./Device-Activation.md)

