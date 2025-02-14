import { PowerAuthConfiguration } from './model/PowerAuthConfiguration';
import { PowerAuthClientConfiguration } from './model/PowerAuthClientConfiguration';
import { PowerAuthBiometryConfiguration } from './model/PowerAuthBiometryConfiguration';
import { PowerAuthKeychainConfiguration } from './model/PowerAuthKeychainConfiguration';
import { PowerAuthAuthorizationHttpHeader } from './model/PowerAuthAuthorizationHttpHeader';
import { PowerAuthActivationStatus } from './model/PowerAuthActivationStatus';
import { PowerAuthAuthentication } from './model/PowerAuthAuthentication';
import { PowerAuthCreateActivationResult } from './model/PowerAuthCreateActivationResult';
import { PowerAuthActivation } from './model/PowerAuthActivation';
import { PowerAuthBiometryInfo } from './model/PowerAuthBiometryInfo';
import { PowerAuthRecoveryActivationData } from './model/PowerAuthRecoveryActivationData';
import { PowerAuthConfirmRecoveryCodeDataResult } from './model/PowerAuthConfirmRecoveryCodeDataResult';
import { PowerAuthTokenStore } from "./PowerAuthTokenStore";
/**
 * Class used for the main interaction with the PowerAuth SDK components.
 */
export declare class PowerAuth {
    /**
     * Configuration used to configure this instance of class. Note that modifying this property has no effect, but the
     * stored object is useful for the debugging purposes.
     */
    configuration?: PowerAuthConfiguration;
    /**
     * Client configuration used to configure this instance of class. Note that modifying this property has no effect, but the
     * stored object is useful for the debugging purposes.
     */
    clientConfiguration?: PowerAuthClientConfiguration;
    /**
     * Biometry configuration used to configure this instance of class. Note that modifying this property has no effect, but the
     * stored object is useful for the debugging purposes.
     */
    biometryConfiguration?: PowerAuthBiometryConfiguration;
    /**
     * Keychain configuration used to configure this instance of class. Note that modifying this property has no effect, but the
     * stored object is useful for the debugging purposes.
     */
    keychainConfiguration?: PowerAuthKeychainConfiguration;
    /**
     * Object for managing access tokens.
     */
    tokenStore: PowerAuthTokenStore;
    /**
     * Prepares the PowerAuth instance.
     *
     * 2 instances with the same instanceId will be internaly the same object!
     *
     * @param instanceId Identifier of the PowerAuthSDK instance. The bundle identifier/packagename is recommended.
     */
    constructor(instanceId: string);
    /**
     * If this PowerAuth instance was configured.
     */
    isConfigured(): Promise<boolean>;
    /**
     * Prepares the PowerAuth instance with an advanced configuration. The method needs to be called before before any other method.
     *
     * @param configuration Configuration object with basic parameters for `PowerAuth` class.
     * @param clientConfiguration  Configuration for internal HTTP client. If `null` is provided, then `PowerAuthClientConfiguration.default()` is used.
     * @param biometryConfiguration Biometry configuration. If `null` is provided, then `PowerAuthBiometryConfiguration.default()` is used.
     * @param keychainConfiguration Configuration for internal keychain storage. If `null` is provided, then `PowerAuthKeychainConfiguration.default()` is used.
     */
    configure(configuration: PowerAuthConfiguration, clientConfiguration?: PowerAuthClientConfiguration, biometryConfiguration?: PowerAuthBiometryConfiguration, keychainConfiguration?: PowerAuthKeychainConfiguration): Promise<boolean>;
    /**
     * Prepares the PowerAuth instance with a basic configuration. The method needs to be called before before any other method.
     * If you have to tweak more configuration properties, then use method variant with the configuration objects as parameters.
     *
     * @param appKey APPLICATION_KEY as defined in PowerAuth specification - a key identifying an application version.
     * @param appSecret APPLICATION_SECRET as defined in PowerAuth specification - a secret associated with an application version.
     * @param masterServerPublicKey KEY_SERVER_MASTER_PUBLIC as defined in PowerAuth specification - a master server public key.
     * @param baseEndpointUrl Base URL to the PowerAuth Standard RESTful API (the URL part before "/pa/...").
     * @param enableUnsecureTraffic If HTTP and invalid HTTPS communication should be enabled
     * @returns Promise that with result of the configuration (can by rejected if already configured).
     */
    configure(appKey: string, appSecret: string, masterServerPublicKey: string, baseEndpointUrl: string, enableUnsecureTraffic: boolean): Promise<boolean>;
    /**
     * Deconfigures the instance
     */
    deconfigure(): Promise<boolean>;
    /**
     * Checks if there is a valid activation.
     *
     * @returns true if there is a valid activation, false otherwise.
     */
    hasValidActivation(): Promise<boolean>;
    /**
     * Check if it is possible to start an activation process.
     *
     * @return true if activation process can be started, false otherwise.
     */
    canStartActivation(): Promise<boolean>;
    /**
     * Checks if there is a pending activation (activation in progress).
     *
     * @return true if there is a pending activation, false otherwise.
     */
    hasPendingActivation(): Promise<boolean>;
    /**
     * Fetch the activation status for current activation.
     *
     * The following calls to PowerAuth Standard RESTful API endpoints are performed on the background:
     * - `/pa/activation/status` - to get the activation status
     * - `/pa/upgrade/start` - (optional) in case that protocol upgrade is required.
     * - `/pa/upgrade/commit` - (optional) in case that protocol upgrade is required.
     * - `/pa/signature/validate` - (optional) as a prevention to local counter desynchronization.
     *
     * @return A promise with activation status result - it contains status information in case of success and error in case of failure.
     */
    fetchActivationStatus(): Promise<PowerAuthActivationStatus>;
    /**
     * Create a new activation by calling a PowerAuth Standard RESTful API endpoint `/pa/activation/create`.
     *
     * @param activation A PowerAuthActivation object containg all information required for the activation creation.
     */
    createActivation(activation: PowerAuthActivation): Promise<PowerAuthCreateActivationResult>;
    /**
     * Commit activation that was created and store related data using provided authentication instance.
     *
     * @param authentication An authentication instance specifying what factors should be stored.
     */
    commitActivation(authentication: PowerAuthAuthentication): Promise<void>;
    /**
     * Activation identifier or null if object has no valid activation.
     */
    getActivationIdentifier(): Promise<string>;
    /**
     * Fingerprint calculated from device's public key or null if object has no valid activation.
     */
    getActivationFingerprint(): Promise<string>;
    /**
     * Remove current activation by calling a PowerAuth Standard RESTful API endpoint `/pa/activation/remove`. The user can authenticate with password
     * or with biometry, if biometric factor is configured in the current activation. In case of biometry, the system biometric authentication dialog
     * is displayed, so the operation may take an undefined amount of time to complete.
     *
     * @param authentication An authentication instance specifying what factors should be used to sign the request.
     */
    removeActivationWithAuthentication(authentication: PowerAuthAuthentication): Promise<void>;
    /**
     * This method removes the activation session state and biometry factor key. Cached possession related key remains intact.
     * Unlike the `removeActivationWithAuthentication()`, this method doesn't inform server about activation removal. In this case
     * user has to remove the activation by using another channel (typically internet banking, or similar web management console)
     */
    removeActivationLocal(): Promise<void>;
    /**
     * Compute the HTTP signature header for GET HTTP method, URI identifier and HTTP query parameters using provided authentication information.
     * Be aware that if `PowerAuthAuthentication.useBiometry` is true, then the system biometric authentication dialog is displayed, so the operation
     * may take an undefined amount of time to complete.
     *
     * @param authentication An authentication instance specifying what factors should be used to sign the request.
     * @param uriId URI identifier.
     * @param params HTTP query params.
     * @return HTTP header with PowerAuth authorization signature
     */
    requestGetSignature(authentication: PowerAuthAuthentication, uriId: string, params?: any): Promise<PowerAuthAuthorizationHttpHeader>;
    /**
     * Compute the HTTP signature header for given HTTP method, URI identifier and HTTP request body using provided authentication information.
     * Be aware that if `PowerAuthAuthentication.useBiometry` is true, then the system biometric authentication dialog is displayed, so the operation
     * may take an undefined amount of time to complete.
     *
     * @param authentication An authentication instance specifying what factors should be used to sign the request.
     * @param method HTTP method used for the signature computation.
     * @param uriId URI identifier.
     * @param body HTTP request body.
     * @return HTTP header with PowerAuth authorization signature.
     */
    requestSignature(authentication: PowerAuthAuthentication, method: string, uriId: string, body?: string): Promise<PowerAuthAuthorizationHttpHeader>;
    /**
     * Compute the offline signature for given HTTP method, URI identifier and HTTP request body using provided authentication information. Be aware that if
     * `PowerAuthAuthentication.useBiometry` is true, then the system biometric authentication dialog is displayed, so the operation may take an undefined
     * amount of time to complete.
     *
     * @param authentication An authentication instance specifying what factors should be used to sign the request. The possession and knowledge is recommended.
     * @param uriId URI identifier.
     * @param body HTTP request body.
     * @param nonce NONCE in Base64 format.
     * @return String representing a calculated signature for all involved factors.
     */
    offlineSignature(authentication: PowerAuthAuthentication, uriId: string, nonce: string, body?: string): Promise<string>;
    /**
     * Validates whether the data has been signed with master server private key or personalized server's private key.
     *
     * @param data An arbitrary data
     * @param signature A signature calculated for data, in Base64 format
     * @param masterKey If `true`, then master server public key is used for validation, otherwise personalized server's public key.
     */
    verifyServerSignedData(data: string, signature: string, masterKey: boolean): Promise<boolean>;
    /**
     * Change the password, validate old password by calling a PowerAuth Standard RESTful API endpoint `/pa/signature/validate`.
     *
     * @param oldPassword Old password, currently set to store the data.
     * @param newPassword New password, to be set in case authentication with old password passes.
     */
    changePassword(oldPassword: string, newPassword: string): Promise<void>;
    /**
     * Change the password using local re-encryption, do not validate old password by calling any endpoint.
     *
     * You are responsible for validating the old password against some server endpoint yourself before using it in this method.
     * If you do not validate the old password to make sure it is correct, calling this method will corrupt the local data, since
     * existing data will be decrypted using invalid PIN code and re-encrypted with a new one.
 
     @param oldPassword Old password, currently set to store the data.
     @param newPassword New password, to be set in case authentication with old password passes.
     @return Returns true in case password was changed without error, NO otherwise.
     */
    unsafeChangePassword(oldPassword: string, newPassword: string): Promise<boolean>;
    /**
     * Regenerate a biometry related factor key.
     * This method calls PowerAuth Standard RESTful API endpoint `/pa/vault/unlock` to obtain the vault encryption key used for original private key decryption.
     *
     * @param password Password used for authentication during vault unlocking call.
     * @param title (used only in Android) Title for biometry dialog
     * @param description (used only in Android) Description for biometry dialog
     */
    addBiometryFactor(password: string, title: string, description: string): Promise<void>;
    /**
     * Checks if a biometry related factor is present.
     * This method returns the information about the key value being present in keychain.
     */
    hasBiometryFactor(): Promise<boolean>;
    /**
     * Remove the biometry related factor key.
     *
     * @return true if the key was successfully removed, NO otherwise.
     */
    removeBiometryFactor(): Promise<boolean>;
    /**
     * Returns biometry info data.
     *
     * @returns object with information data about biometry
     */
    getBiometryInfo(): Promise<PowerAuthBiometryInfo>;
    /**
     * Generate a derived encryption key with given index. The key is returned in form of base64 encoded string.
     *
     * This method calls PowerAuth Standard RESTful API endpoint `/pa/vault/unlock` to obtain the vault encryption key used
     * for subsequent key derivation using given index.
     *
     * @param authentication Authentication used for vault unlocking call.
     * @param index Index of the derived key using KDF.
     */
    fetchEncryptionKey(authentication: PowerAuthAuthentication, index: number): Promise<string>;
    /**
     * Sign given data with the original device private key (asymetric signature).
     *
     * This method calls PowerAuth Standard RESTful API endpoint `/pa/vault/unlock` to obtain the vault encryption key
     * used for private key decryption. Data is then signed using ECDSA algorithm with this key and can be validated on the server side.
     *
     * @param authentication Authentication used for vault unlocking call.
     * @param data Data to be signed with the private key.
     */
    signDataWithDevicePrivateKey(authentication: PowerAuthAuthentication, data: string): Promise<string>;
    /**
     * Validate a user password.
     *
     * This method calls PowerAuth Standard RESTful API endpoint `/pa/signature/validate` to validate the signature value.
     *
     * @param password Password to be verified.
     */
    validatePassword(password: string): Promise<void>;
    /**
     * Returns YES if underlying session contains an activation recovery data.
     */
    hasActivationRecoveryData(): Promise<boolean>;
    /**
     * Get an activation recovery data.
     *
     * This method calls PowerAuth Standard RESTful API endpoint `/pa/vault/unlock` to obtain the vault encryption key used for private recovery data decryption.
     *
     * @param authentication Authentication used for vault unlocking call.
     */
    activationRecoveryData(authentication: PowerAuthAuthentication): Promise<PowerAuthRecoveryActivationData>;
    /**
     * Confirm given recovery code on the server by calling a PowerAuth Standard RESTful API endpoint `/pa/recovery/confirm`.
     *
     * The method is useful for situations when user receives a recovery information via OOB channel (for example via postcard).
     * Such recovery codes cannot be used without a proper confirmation on the server. To confirm codes, user has to authenticate himself
     * with a knowledge factor.
     *
     * Note that the provided recovery code can contain a `"R:"` prefix, if it's scanned from QR code.
     *
     * @param recoveryCode Recovery code to confirm
     * @param authentication Authentication used for recovery code confirmation
     *
     * @returns Result of the confirmation
     */
    confirmRecoveryCode(recoveryCode: string, authentication: PowerAuthAuthentication): Promise<PowerAuthConfirmRecoveryCodeDataResult>;
    /**
     * Helper method for grouping biometric authentications.
     *
     * With this method, you can use 1 biometric authentication (dialog) for several operations.
     * Just use the `reusableAuthentication` variable inside the `groupedAuthenticationCalls` callback.
     *
     * Be aware, that you must not execute the next HTTP request signed with the same credentials when the previous one
     * fails with the 401 HTTP status code. If you do, then you risk blocking the user's activation on the server.
     *
     * @param authentication authentication object
     * @param groupedAuthenticationCalls call that will use reusable authentication object
     */
    groupedBiometricAuthentication(authentication: PowerAuthAuthentication, groupedAuthenticationCalls: (reusableAuthentication: PowerAuthAuthentication) => Promise<void>): Promise<void>;
    private wrapper;
}
