/*
 * Copyright (c) 2025 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { distributedKVStore } from '@kit.ArkData';
import { common } from '@kit.AbilityKit';
import { AsyncCallback, BusinessError, Callback } from '@kit.BasicServicesKit';
import { distributedDeviceManager } from '@kit.DistributedServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import CommonConstants from '../common/CommonConstants';

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
        createIfMissing: true, // Indicates whether to create a database when the database file does not exist.
        encrypt: false, // Indicates whether to add database files.
        backup: false, // Indicates whether to back up database files.
        autoSync: false, // Indicates whether to automatically synchronize database files.
        kvStoreType: distributedKVStore.KVStoreType.SINGLE_VERSION, // Set the type of database to be created.
        securityLevel: distributedKVStore.SecurityLevel.S1, // Setting the database security level.
      };
      // distributed key-value database.
      this.kvManager.getKVStore(CommonConstants.DB_STORE_ID, options,
        (err: BusinessError, store: distributedKVStore.SingleKVStore | undefined) => {
          if (err) {
            hilog.error(0x0000, 'KvManager', `Failed to get KVStore, Code:${err.code},message: ${err.message}`);
            return;
          }
          this.kvStore = store;
        });
    } catch (err) {
      hilog.error(0x0000, 'KvManager', `An unexpected error occurred, Code:${err.code},message: ${err.message}`);
    }
  }

  /**
   * Close the specified distributed key value database using the value of storeId
   */
  closeKVStore(): void {
    try {
      this.kvManager?.closeKVStore(CommonConstants.BUNDLE_NAME, CommonConstants.DB_STORE_ID,
        (err: BusinessError) => {
          if (err !== undefined) {
            hilog.error(0x0000, 'KvManager', `Failed to close KVStore, Code:${err.code},message: ${err.message}`);
            return;
          }
          hilog.info(0x0000, 'hilog', TAG, 'Succeeded in closing KVStore');
        });
    } catch (err) {
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
    } catch (err) {
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
    } catch (error) {
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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
      hilog.error(0x0000, 'KvManager', `An unexpected error occurred, Code:${err.code}, message: ${err.message}`);
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
      } catch (err) {
        hilog.error(0x0000, 'KvManager', `sync failed, Code:${err.code}, message: ${err.message}`);
      }
    } catch (err) {
      hilog.error(0x0000, 'KvManager', `getAvailableDeviceListSync failed, Code:${err.code}, message: ${err.message}`);
    }
  }
}