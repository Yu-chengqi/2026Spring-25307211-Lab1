# Implementing Contacts Based on the Distributed KV Store

## Overview

With Contacts as an example, learn to create a distributed key-value (KV) store and implement the functionalities of adding, deleting, updating, querying, and synchronizing data.
## Effect

|                               Add                                |                              Delete                              |                               Edit                                |                               Query                                |
|:----------------------------------------------------------------:|:----------------------------------------------------------------:|:-----------------------------------------------------------------:|:------------------------------------------------------------------:|
| <img src="./screenshots/devices/contactAdd.en.gif" width="300"/> | <img src="./screenshots/devices/contactDel.en.gif" width="300"/> | <img src="./screenshots/devices/contactEdit.en.gif" width="300"/> | <img src="./screenshots/devices/contactQuery.en.gif" width="150"/> |

## How to Use

1. On the application home page, tap the Add button in the upper-right corner to navigate to the Add Contact page.
2. On the application home page, tap the More button in the upper-right corner, then tap Batch Delete to navigate to the batch contact deletion page.
3. On the application home page, tap a contact in the list to navigate to the contact details page.
4. On the contact details page, tap the Edit button to edit the contact.
5. On the contact details page, tap the Delete button to delete the contact.
6. On the Add Contact page, enter the contact information and tap the Save button in the upper-right corner to add the contact. The page will then redirect to the application home page.
7. On the batch deletion page, tap Select All to select or deselect all contacts.
8. On the batch deletion page, select the contact to be deleted and tap the Delete button.
9. On the contact editing page, modify the contact information and tap the Save button in the upper-right corner to update the contact.

## Project Directory
```
├──entry/src/main/ets 
│  ├──common 
│  │  └──CommonConstants.ets           // Common constants 
│  ├──components 
│  │  ├──ContactBottomBar.ets          // Bottom tab component for the contact deletion page 
│  │  ├──ContactDeleteDialog.ets       // Contact deletion dialog component 
│  │  ├──ContactDetailItem.ets         // List item component for the contact details page 
│  │  ├──ContactDeviceDialog.ets       // Contact device dialog component 
│  │  └──ContactListItem.ets           // List item component for the contact list page 
│  ├──entryability 
│  │  └──EntryAbility.ets              // Entry ability 
│  ├──pages 
│  │  ├──ContactAddAndEditPage.ets     // Contact addition and editing page 
│  │  ├──ContactDeletePage.ets         // Contact deletion page 
│  │  ├──ContactDetailPage.ets         // Contact details page 
│  │  └──ContactHomePage.ets           // Contacts home page 
│  ├──utils 
│  │  ├──ContactDeviceManager.ets      // Contact device manager 
│  │  └──KvManager.ets                 // KV store manager 
│  └──viewmodel 
│     └──ContactViewModel.ets          // Contact ViewModel 
└──entry/src/main/resources            // Resource files
```

## How to Implement

1. Encapsulate the device management class by calling the device management capability [distributedDeviceManager.createDeviceManager()](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-distributeddevicemanager#distributeddevicemanagercreatedevicemanager) to create a device manager instance. This instance serves as the entry point for calling distributed device management methods, used to obtain information about trusted devices and local devices.
2. Register a device state callback through the [on('deviceStateChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-distributeddevicemanager#ondevicestatechange) event of the DeviceManager instance to promptly notify the application of changes in trusted devices within the device network. Register a device state change callback function and execute different methods to update the device list based on the returned data.action.
3. Register a device state callback through the [on('discoverSuccess')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-distributeddevicemanager#ondiscoversuccess) event of the DeviceManager instance to promptly notify the application of device changes within the network when devices are discovered. Call [startDiscovering()](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-distributeddevicemanager#startdiscovering) to discover surrounding devices.
4. If the discovered device is in the trusted device list, execute the [startAbility()](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-inner-application-uiabilitycontext#startability) method to launch the application on the connected device, passing the current device information as parameters. For untrusted devices, execute the [bindTarget()](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-distributeddevicemanager#bindtarget) method to initiate verification. This triggers a connection prompt on the target device. Upon user acceptance, the target device displays a PIN code, which must then be entered on the local device for successful verification and connection. Subsequent device selection (for example, after a user taps the device query button and picks a connected device) will also trigger startAbility() to launch the application on the selected device.
5. When the device selection dialog is closed, call [stopDiscovering()](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-distributeddevicemanager#stopdiscovering) to stop discovering surrounding devices, and unregister device listening tasks through the [off('deviceStateChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-distributeddevicemanager#offdevicestatechange) and [off('discoverSuccess')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-distributeddevicemanager#offdiscoversuccess) events of the DeviceManager instance.
6. Upon the application's first launch, dynamically request necessary authorization from the user by calling [requestPermissionsFromUser()](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-abilityaccessctrl#requestpermissionsfromuser9).
7. Call [distributedKVStore.createKVManager()](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-distributedkvstore#distributedkvstorecreatekvmanager) to create a KVManager instance for managing database objects. Then, call the [getKVStore()](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-distributedkvstore#getkvstore) method of the KVManager to create and obtain a distributed KV store.
8. Call the [on('dataChange')](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-distributedkvstore#ondatachange) API to subscribe to data changes on other devices within the network and register a data change callback function.
9. Encapsulate six methods for store operations: adding ([put()](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-distributedkvstore#put)), deleting ([delete()](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-distributedkvstore#delete)and [deleteBatch()](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-distributedkvstore#deletebatch)), updating ([put()](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-distributedkvstore#put)), and querying ([get()](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-distributedkvstore#get) and [getEntries()](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-distributedkvstore#getentries)).
10. Call the data synchronization API [sync()](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-distributedkvstore#sync) to push current device data changes to other devices within the network.
11. When data changes occur on other devices within the network, execute the callback function, use the custom getAllData() method to obtain all data from the device where the data changed, and update the local data.

## Required Permissions

To achieve the distributed capabilities involved in this codelab, you need to add the data exchange permission ohos.permission.DISTRIBUTED_DATASYNC to the module.json5 configuration file.

## Constraints

1. This sample is only supported on Huawei phones running standard systems.
2. The HarmonyOS version must be HarmonyOS 5.0.5 Release or later.
3. The DevEco Studio version must be DevEco Studio 6.0.2 Release or later.
4. The HarmonyOS SDK version must be HarmonyOS 6.0.2 Release SDK or later.
5. Both devices must be logged in with the same HUAWEI ID. You are advised to enable Find Device.
6. Wi-Fi and Bluetooth must be enabled on both devices. If possible, both devices should be connected to the same LAN.
7. Both devices must have the application installed.