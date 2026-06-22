import distributedDeviceManager from "@ohos:distributedDeviceManager";
import type { Callback } from "@ohos:base";
import hilog from "@ohos:hilog";
import JSON from "@ohos:util.json";
import type common from "@ohos:app.ability.common";
import type Want from "@ohos:app.ability.Want";
import type { BusinessError } from "@ohos:base";
import CommonConstants from "@bundle:com.example.distributedcontacts/entry/ets/common/CommonConstants";
const TAG: string = 'ContactDeviceManager';
// Address book device management.
export class ContactDeviceManager {
    private context: common.UIAbilityContext;
    private deviceManager: distributedDeviceManager.DeviceManager;
    callback: () => void = () => {
    };
    deviceList: Array<distributedDeviceManager.DeviceBasicInfo> = [];
    discoverList: Array<distributedDeviceManager.DeviceBasicInfo> = [];
    authCallback: () => void = () => {
    };
    constructor(context: common.UIAbilityContext) {
        this.context = context;
        this.deviceManager = distributedDeviceManager.createDeviceManager(CommonConstants.BUNDLE_NAME);
    }
    /**
     * The registered device status callback returns the device status and information.
     */
    private deviceStateChange: (data: DeviceManagerData) => void = (data: DeviceManagerData): void => {
        if (data) {
            switch (data.action) {
                // Physical devices go online.
                case distributedDeviceManager.DeviceStateChange.AVAILABLE:
                    this.changeState(data.device);
                    break;
                // Device availability status.
                case distributedDeviceManager.DeviceStateChange.UNKNOWN:
                    this.changeStateOnline(data.device);
                    break;
                // Physical offline of the device.
                case distributedDeviceManager.DeviceStateChange.UNAVAILABLE:
                    this.changeStateOffline(data.device);
                    break;
                default:
                    break;
            }
        }
    };
    /**
     * Discovering callback methods for devices
     */
    private discoverSuccess: (data: DeviceBasicInfo) => void = (data: DeviceBasicInfo): void => {
        if (data) {
            this.deviceFound(data.device);
        }
    };
    /**
     * Register device list callback function
     * @param callback
     */
    registerDeviceListCallback(callback: Callback<void>) {
        try {
            this.callback = callback;
            if (!this.deviceManager) {
                this.callback();
            }
            else {
                this.deviceList = this.deviceManager.getAvailableDeviceListSync();
                this.callback();
                // Register device status callback.
                this.deviceManager.on('deviceStateChange', this.deviceStateChange);
                // This interface is used to call back the listener when the device is successfully registered and discovered.
                this.deviceManager.on('discoverSuccess', this.discoverSuccess);
                this.startDeviceDiscovery();
            }
        }
        catch (err) {
            hilog.error(0x0000, 'ContactDeviceManager', `have error .Code:${err.code},message: ${err.message}`);
        }
    }
    /**
     * Cancel registration of device list
     */
    unregisterDeviceListCallback() {
        if (this.deviceManager) {
            try {
                this.deviceList = [];
                this.discoverList = [];
                this.deviceManager.stopDiscovering();
                // Device status cancellation callback.
                this.deviceManager.off('deviceStateChange', this.deviceStateChange);
                // Callback for successful deregistration of device discovery.
                this.deviceManager.off('discoverSuccess', this.discoverSuccess);
            }
            catch (error) {
                hilog.error(0x0000, 'ContactDeviceManager', `have error .Code:${error.code},message: ${error.message}`);
            }
        }
    }
    changeStateOnline(device: distributedDeviceManager.DeviceBasicInfo) {
        this.deviceList[this.deviceList.length] = device;
        hilog.info(0x0000, 'hilog', TAG, `online, device list= ${JSON.stringify(this.deviceList)}`);
        this.callback();
        this.authCallback();
        this.authCallback = () => {
        };
    }
    changeStateOffline(device: distributedDeviceManager.DeviceBasicInfo) {
        let list: Array<distributedDeviceManager.DeviceBasicInfo> = [];
        for (let j = 0; j < this.deviceList!.length; j++) {
            if (this.deviceList![j].deviceId !== device.deviceId) {
                list[j] = device;
            }
        }
        this.deviceList = list;
        hilog.info(0x0000, 'hilog', TAG, `offline, updated device list=${JSON.stringify(device)}`);
        this.callback();
    }
    changeState(device: distributedDeviceManager.DeviceBasicInfo) {
        try {
            let list: Array<distributedDeviceManager.DeviceBasicInfo> = new Array();
            for (let i = 0; i < this.deviceList!.length; i++) {
                if (this.deviceList![i].deviceId !== device.deviceId) {
                    list[i] = device;
                }
            }
            this.deviceList = list;
        }
        catch (error) {
            hilog.error(0x0000, 'ContactDeviceManager', `have error .Code:${error.code},message: ${error.message}`);
        }
        this.callback();
    }
    deviceFound(data: distributedDeviceManager.DeviceBasicInfo) {
        for (let i = 0; i < this.discoverList.length; i++) {
            if (this.discoverList[i].deviceId === data.deviceId) {
                hilog.info(0x0000, 'hilog', TAG, 'device founded ignored');
                return;
            }
        }
        this.discoverList.push(data);
        hilog.info(0x0000, 'hilog', TAG, `deviceFound self.discoverList= ${this.discoverList}`);
        this.callback();
    }
    /**
     * Searching for Devices on a Distributed Network by SUBSCRIBE_ID.
     */
    startDeviceDiscovery() {
        let discoverParam: Record<string, number> = {
            'discoverTargetType': 1
        };
        let filterOptions: Record<string, number> = {
            'availableStatus': 0
        };
        try {
            // Discover peripheral devices. The discovery status lasts for two minutes.
            // If the discovery status exceeds two minutes, the discovery stops. A maximum of 99 nodes can be discovered.
            this.deviceManager.startDiscovering(discoverParam, filterOptions);
        }
        catch (error) {
            hilog.error(0x0000, 'ContactDeviceManager', `have error .Code:${error.code},message: ${error.message}`);
        }
    }
    startAbility(deviceId: string | undefined) {
        hilog.info(0x0000, 'hilog', TAG, `startAbility deviceId: ${deviceId}`);
        let want: Want = {
            bundleName: CommonConstants.BUNDLE_NAME,
            abilityName: CommonConstants.ENTRY_ABILITY,
            deviceId: deviceId
        };
        this.context.startAbility(want).then((data) => {
            hilog.info(0x0000, 'hilog', TAG, `start ability finished: ${data}`);
        }).catch((err: BusinessError) => {
            hilog.error(0x0000, 'ContactDeviceManager', `startAbility error .Code:${err.code},message: ${err.message}`);
        });
    }
    authenticateDevice(device: distributedDeviceManager.DeviceBasicInfo, callBack: Callback<void>) {
        hilog.info(0x0000, 'hilog', TAG, `authenticateDevice ${JSON.stringify(device)}`);
        for (let i = 0; i < this.discoverList.length; i++) {
            if (this.discoverList[i].deviceId === device.deviceId) {
                this.deviceManager.bindTarget(device.deviceId, {
                    bindType: 1,
                    targetPkgName: CommonConstants.BUNDLE_NAME,
                    appName: CommonConstants.APP_NAME
                }, (err) => {
                    this.authCallback = err ? () => {
                    } : callBack;
                });
            }
        }
    }
}
class DeviceBasicInfo {
    device: distributedDeviceManager.DeviceBasicInfo = {
        deviceId: "",
        deviceName: "",
        deviceType: "",
        networkId: ""
    };
}
class DeviceManagerData {
    action: distributedDeviceManager.DeviceStateChange = 0;
    device: distributedDeviceManager.DeviceBasicInfo = {
        deviceId: "",
        deviceName: "",
        deviceType: "",
        networkId: ""
    };
}
