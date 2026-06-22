# 基于分布式键值数据库实现通讯录功能

## 项目简介

本篇Codelab以通讯录为例，介绍分布式键值数据库的创建、数据的增加/删除/修改/查询/同步等操作方法。

## 效果预览

|                              新增                               |                              删除                               |                               编辑                               |                               查询                                |
|:-------------------------------------------------------------:|:-------------------------------------------------------------:|:--------------------------------------------------------------:|:---------------------------------------------------------------:|
| <img src="./screenshots/devices/contactAdd.gif" width="300"/> | <img src="./screenshots/devices/contactDel.gif" width="300"/> | <img src="./screenshots/devices/contactEdit.gif" width="300"/> | <img src="./screenshots/devices/contactQuery.gif" width="150"/> |

## 使用说明

1. 应用首页，点击右上角的“添加”按钮，进入新建联系人页面。
2. 应用首页，点击右上角的“更多”按钮，点击“批量删除”，进入联系人批量删除页面。
3. 应用首页，点击列表联系人，进入联系人详情页面。
4. 联系人详情页面，点击下方"编辑"按钮，进入联系人编辑页面。
5. 联系人详情页面，点击下方“删除”按钮，删除该联系人。
6. 新建联系人页面，输入联系人信息后，点击右上“保存”按钮，添加联系人，页面跳转到应用首页。
7. 联系人批量删除页面，点击下方全选，全部选中/不选中所有联系人。
8. 联系人批量删除页面，选中需要删除的联系人，下方点击“删除”按钮，删除选中的联系人。
9. 联系人编辑页面，编辑好联系人信息后，点击右上角的“保存”按钮，修改联系人信息。

## 工程目录
```
├──entry/src/main/ets
│  ├──common
│  │  └──CommonConstants.ets           // 常量集合
│  ├──components
│  │  ├──ContactBottomBar.ets          // 通讯录删除页面底部tab组件
│  │  ├──ContactDeleteDialog.ets       // 通讯录删除弹窗组件
│  │  ├──ContactDetailItem.ets         // 通讯录详情页列表项组件
│  │  ├──ContactDeviceDialog.ets       // 通讯录设备弹窗组件
│  │  └──ContactListItem.ets           // 通讯录列表页列表项组件
│  ├──entryability
│  │  └──EntryAbility.ets              // 入口文件
│  ├──pages
│  │  ├──ContactAddAndEditPage.ets     // 通讯录添加和编辑页面
│  │  ├──ContactDeletePage.ets         // 通讯录删除页面
│  │  ├──ContactDetailPage.ets         // 通讯录详情页面
│  │  └──ContactHomePage.ets           // 通讯录首页
│  ├──utils
│  │  ├──ContactDeviceManager.ets      // 通讯录设备管理类
│  │  └──KvManager.ets                 // 键值型数据库管理类
│  └──viewmodel
│     └──ContactViewModel.ets          // 通讯录model
└──entry/src/main/resources            // 资源文件
```

## 具体实现

1. 封装设备管理类，调用设备管理能力[distributedDeviceManager.createDeviceManager()](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/js-apis-distributeddevicemanager#distributeddevicemanagercreatedevicemanager)创建一个设备管理实例，设备管理实例是分布式设备管理方法的调用入口，用于获取可信设备和本地设备的相关信息。
2. 通过设备管理实例DeviceManager的[on('deviceStateChange')](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/js-apis-distributeddevicemanager#ondevicestatechange)事件注册设备状态回调，以便在设备状态发生变化时及时通知应用组网内可信设备的变化，并注册设备状态变化回调函数，根据返回的设备状态data.action执行不同方法更新设备列表。
3. 通过设备管理实例DeviceManager的[on('discoverSuccess')](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/js-apis-distributeddevicemanager#ondiscoversuccess)事件注册设备状态回调，以便在发现时及时通知应用组网内设备的变化，调用[startDiscovering()](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/js-apis-distributeddevicemanager#startdiscovering)发现周围设备。
4. 若设备在信任设备列表，执行[startAbility()](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/js-apis-inner-application-uiabilitycontext#startability)方法启动连接设备上的应用，将当前的设备信息作为参数发送至连接设备。若设备不是信任设备，执行[bindTarget()](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/js-apis-distributeddevicemanager#bindtarget)方法启动验证。此时连接设备提示是否接受，接收连接后连接设备展示PIN码，本地设备输入PIN码确认后连接成功。再次点击查询设备按钮，选择已连接设备，点击确认启动连接设备上的应用。
5. 关闭设备弹窗时，调用[stopDiscovering()](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/js-apis-distributeddevicemanager#stopdiscovering)停止发现周边设备，并通过设备管理实例DeviceManager的[off('deviceStateChange')](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/js-apis-distributeddevicemanager#offdevicestatechange)和[off('discoverSuccess')](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/js-apis-distributeddevicemanager#offdiscoversuccess)事件注销设备监听任务。
6. 应用首次启动时，调用[requestPermissionsFromUser()](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/js-apis-abilityaccessctrl#requestpermissionsfromuser9)方法动态弹窗获取授权。
7. 创建键值型数据库对象实例，调用[distributedKVStore.createKVManager()](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/js-apis-distributedkvstore#distributedkvstorecreatekvmanager)创建一个KVManager对象实例，用于管理数据库对象，调用KVManager的[getKVStore()](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/js-apis-distributedkvstore#getkvstore)方法，创建并获取分布式键值数据库。
8. 调用[on('dataChange')](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/js-apis-distributedkvstore#ondatachange)接口订阅组网内其他设备的数据变化，并注册数据变化回调函数。
9. 封装操作数据库的增([put()](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/js-apis-distributedkvstore#put))、删([delete()](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/js-apis-distributedkvstore#delete)、[deleteBatch()](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/js-apis-distributedkvstore#deletebatch))、改([put()](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/js-apis-distributedkvstore#put))、查([get()](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/js-apis-distributedkvstore#get)、[getEntries()](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/js-apis-distributedkvstore#getentries))六个方法。
10. 调用同步数据的接口[sync()](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/js-apis-distributedkvstore#sync)推送当前设备数据变化至组网内其他设备。
11. 当组网内其他设备数据发生变化时，执行回调函数，通过自定义getAllData()方法获取发生数据变化设备的全部数据，更新本地数据。

## 相关权限

本篇Codelab用到分布式的能力，需要在配置文件module.json5里添加不同设备间的数据交换权限：ohos.permission.DISTRIBUTED_DATASYNC。

## 约束与限制

1. 本示例仅支持标准系统上运行，支持设备：华为手机。
2. HarmonyOS系统：HarmonyOS 5.0.5 Release及以上。
3. DevEco Studio版本：DevEco Studio 6.0.2 Release及以上。
4. HarmonyOS SDK版本：HarmonyOS 6.0.2 Release SDK及以上。
5. 双端设备需要登录同一华为账号，建议打开查找设备功能。
6. 双端设备需要打开Wi-Fi和蓝牙开关，条件允许时，建议连接同一局域网。
7. 双端设备都需要有该应用。
