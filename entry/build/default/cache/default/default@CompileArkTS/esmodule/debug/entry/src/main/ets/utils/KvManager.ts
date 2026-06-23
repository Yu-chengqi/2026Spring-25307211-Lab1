import distributedKVStore from "@ohos:data.distributedKVStore";
import type common from "@ohos:app.ability.common";
import type { AsyncCallback } from "@ohos:base";
import type { BusinessError } from "@ohos:base";
import type { Callback } from "@ohos:base";
import distributedDeviceManager from "@ohos:distributedDeviceManager";
import hilog from "@ohos:hilog";
import CommonConstants from "@bundle:com.example.distributedcontacts/entry/ets/common/CommonConstants";
const TAG: string = 'KvManager';
// Key value database management class.
export class KvManager {
    private kvManager: distributedKVStore.KVManager | undefined = undefined;
    private kvStore: distributedKVStore.SingleKVStore | undefined = undefined;
    private context: common.UIAbilityContext | undefined = undefined;
    constructor(context: common.UIAbilityContext) {
        this.context = context;
        this.createManager();
    }
    /**
     * Create a KVManager object instance for managing database objects
     */
    createManager(): void {
        if (typeof this.kvStore !== 'undefined') {
            return;
        }
        try {
            // Creates a KVManager object instance.
            this.kvManager = distributedKVStore.createKVManager({
                bundleName: CommonConstants.BUNDLE_NAME,
                context: this.context,
            });
            let options: distributedKVStore.Options = {
                createIfMissing: true,
                encrypt: false,
                backup: false,
                autoSync: false,
                kvStoreType: distributedKVStore.KVStoreType.SINGLE_VERSION,
                securityLevel: distributedKVStore.SecurityLevel.S1, // Setting the database security level.
            };
            // distributed key-value database.
            this.kvManager.getKVStore(CommonConstants.DB_STORE_ID, options, (err: BusinessError, store: distributedKVStore.SingleKVStore | undefined) => {
                if (err) {
                    hilog.error(0x0000, 'KvManager', `Failed to get KVStore, Code:${err.code},message: ${err.message}`);
                    return;
                }
                this.kvStore = store;
            });
        }
        catch (err) {
            hilog.error(0x0000, 'KvManager', `An unexpected error occurred, Code:${err.code},message: ${err.message}`);
        }
    }
    /**
     * Close the specified distributed key value database using the value of storeId
     */
    closeKVStore(): void {
        try {
            this.kvManager?.closeKVStore(CommonConstants.BUNDLE_NAME, CommonConstants.DB_STORE_ID, (err: BusinessError) => {
                if (err !== undefined) {
                    hilog.error(0x0000, 'KvManager', `Failed to close KVStore, Code:${err.code},message: ${err.message}`);
                    return;
                }
                hilog.info(0x0000, 'hilog', TAG, 'Succeeded in closing KVStore');
            });
        }
        catch (err) {
            hilog.error(0x0000, 'KvManager', `CloseKVStore an unexpected error occurred, Code:${err.code},message: ${err.message}`);
        }
    }
    /**
     * Subscribe to distributed data changes.
     * @param callback Callback function.
     */
    subscriptionKvStore(callback: Callback<distributedKVStore.ChangeNotification>): void {
        try {
            this.kvStore?.on('dataChange', distributedKVStore.SubscribeType.SUBSCRIBE_TYPE_REMOTE, callback);
        }
        catch (err) {
            hilog.error(0x0000, 'KvManager', `DataChange an unexpected error occured, Code:${err.code},message: ${err.message}`);
        }
    }
    /**
     * Remove the data change listener.
     */
    removeDataChangeListener(): void {
        if (this.kvStore === null) {
            return;
        }
        try {
            this.kvStore?.off('dataChange');
        }
        catch (error) {
            hilog.error(0x0000, 'KvManager', `have error, Code:${error.code},message: ${error.message}`);
        }
    }
    /**
     * Adds a key-value pair of a specified type to the database.
     * If the key value exists, modify the data. Otherwise, add data.
     * @param The Key Key of the data to be added.
     * @param The value of the data to be added.
     */
    addAndSave(key: string, value: string): void {
        this.kvStore?.put(key, value).catch((err: BusinessError) => {
            hilog.error(0x0000, 'KvManager', `Put an unexpected error occured, Code:${err.code},message: ${err.message}`);
        });
        this.syncRemote();
    }
    /**
     * Single deletion
     * Deletes data with a specified key value from the database.
     * @param key Key of the data to be deleted.
     * @param callback Callback function.
     */
    deleteOnce(key: string, callback: AsyncCallback<void>): void {
        try {
            this.kvStore?.delete(key, callback);
            this.syncRemote();
        }
        catch (err) {
            hilog.error(0x0000, 'KvManager', `An unexpected error occurred, Code:${err.code},message: ${err.message}`);
        }
    }
    /**
     * Batch Delete
     * Delete key-value pairs from the KVStore database in batches.
     * @param keys Indicates the key-value pairs to be deleted in batches.
     * @param callback Callback function.
     */
    deleteBatch(keys: string[], callback: AsyncCallback<void>): void {
        try {
            this.kvStore?.deleteBatch(keys, callback);
            this.syncRemote();
        }
        catch (err) {
            hilog.error(0x0000, 'KvManager', `DeleteKVStore an unexpected error occurred, Code:${err.code},message: ${err.message}`);
        }
    }
    /**
     * Get individual details
     * Gets the value of a specified key.
     * @param key Key of the data to be queried.
     * @param callback Callback function.
     */
    getDetails(key: string, callback: AsyncCallback<boolean | string | number | Uint8Array>): void {
        try {
            this.kvStore?.get(key, callback);
        }
        catch (err) {
            hilog.error(0x0000, 'KvManager', `Fail to get, Code:${err.code},message: ${err.message}`);
        }
    }
    /**
     * Obtains all key-value pairs that match the specified key prefix.
     * @param key Indicates the key prefix to be matched.
     * @param callback Callback function.
     */
    getEntries(key: string, callback: AsyncCallback<distributedKVStore.Entry[]>): void {
        try {
            this.kvStore?.getEntries(key, callback);
        }
        catch (err) {
            hilog.error(0x0000, 'KvManager', `An unexpected error occurred, Code:${err.code}, message: ${err.message}`);
        }
    }
    /**
     * 根据分组名称筛选联系人（重载方法）
     * Obtains all key-value pairs that match the specified key prefix and group name.
     * @param key Indicates the key prefix to be matched.
     * @param groupName Indicates the group name to filter (分组名称：家人、朋友、同事).
     * @param callback Callback function.
     */
    getEntriesByGroup(key: string, groupName: string, callback: AsyncCallback<distributedKVStore.Entry[]>): void {
        try {
            this.kvStore?.getEntries(key, (err: BusinessError, entries: distributedKVStore.Entry[]) => {
                if (err) {
                    hilog.error(0x0000, 'KvManager', `getEntriesByGroup failed, Code:${err.code}, message: ${err.message}`);
                    callback(err, []);
                    return;
                }
                // 根据分组名称过滤条目
                const filteredEntries: distributedKVStore.Entry[] = entries.filter((entry) => {
                    try {
                        const contactData = JSON.parse(entry.value.value as string) as Record<string, string>;
                        return contactData.groupName === groupName;
                    }
                    catch (parseErr) {
                        hilog.error(0x0000, 'KvManager', `Parse entry failed`);
                        return false;
                    }
                });
                // 成功时传递空的 BusinessError
                const successErr: BusinessError = { code: 0, name: '', message: '' };
                callback(successErr, filteredEntries);
            });
        }
        catch (err) {
            hilog.error(0x0000, 'KvManager', `getEntriesByGroup an unexpected error occurred, Code:${err.code}, message: ${err.message}`);
        }
    }
    /**
     * Remote synchronization of data
     */
    private syncRemote() {
        let devManager: distributedDeviceManager.DeviceManager;
        try {
            // create deviceManager.
            devManager = distributedDeviceManager.createDeviceManager(CommonConstants.BUNDLE_NAME);
            let deviceIds: string[] = [];
            if (devManager !== null) {
                let devices = devManager.getAvailableDeviceListSync();
                for (let i = 0; i < devices.length; i++) {
                    deviceIds[i] = devices[i].networkId as string;
                }
            }
            try {
                this.kvStore?.sync(deviceIds, distributedKVStore.SyncMode.PUSH_ONLY, 1000);
            }
            catch (err) {
                hilog.error(0x0000, 'KvManager', `sync failed, Code:${err.code}, message: ${err.message}`);
            }
        }
        catch (err) {
            hilog.error(0x0000, 'KvManager', `getAvailableDeviceListSync failed, Code:${err.code}, message: ${err.message}`);
        }
    }
}
