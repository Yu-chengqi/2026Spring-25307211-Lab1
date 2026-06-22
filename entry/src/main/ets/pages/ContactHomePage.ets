/*
 *  Copyright (c) 2025 Huawei Device Co., Ltd.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { common } from '@kit.AbilityKit';
import { distributedDeviceManager } from '@kit.DistributedServiceKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { distributedKVStore } from '@kit.ArkData';
import CommonConstants from '../common/CommonConstants';
import { ListItemData } from '../viewmodel/ContactViewModel';
import { ContactListItem } from '../components/ContactListItem';
import { ContactDeviceManager } from '../utils/ContactDeviceManager';
import ContactDeviceDialog from '../components/ContactDeviceDialog';
import { KvManager } from '../utils/KvManager';

@Entry
@Component
struct ContactHomePage {
  @State uiContext: UIContext | undefined = AppStorage.get('uiContext');
  @State contactList: Array<ListItemData> = [];
  @State initContactList: Array<ListItemData> = [];
  @State isShowPopup: boolean = false;
  @State deviceList: Array<distributedDeviceManager.DeviceBasicInfo> = [];
  @State selectedDeviceIndex: number = 0;
  @State searchValue: string = '';
  private context: common.UIAbilityContext = this.getUIContext().getHostContext() as common.UIAbilityContext;
  private contactDeviceManager: ContactDeviceManager = new ContactDeviceManager(this.context);
  kvManager = AppStorage.get('kvManager') as KvManager;
  dialogController: CustomDialogController = new CustomDialogController({
    builder: ContactDeviceDialog({
      deviceList: $deviceList,
      selectedDeviceIndex: $selectedDeviceIndex,
      onSelectedIndexChange: (index: number): Promise<void> => this.onSelectedIndexChange(index)
    }),
    cancel: () => {
      this.onClose();
    },
    autoCancel: true
  });

  aboutToAppear(): void {
    this.kvManager.subscriptionKvStore(() => {
      this.getAllData();
    });
  }

  onPageShow(): void {
    this.getAllData();
  }

  onBackPress() {
    this.context.terminateSelf().catch((err: BusinessError) => {
      hilog.error(0x0000, 'ContactHomePage', `onBackPress err: ${err.code}  msg:${err.message}`);
    });
    return true;
  }

  getAllData() {
    this.kvManager.getEntries(CommonConstants.CONTACTS_DATABASE_KEY, (
      err: BusinessError,
      entries: distributedKVStore.Entry[]) => {
      hilog.info(0x0000, 'ContactHomePage', `getAllData entries: ${JSON.stringify(entries)}`);
      if (err) {
        hilog.error(0x0000, 'ContactHomePage', `Fail to get Entries: ${err.code}  msg:${err.message}`);
        return;
      }
      let listItems: Array<ListItemData> = [];
      entries.forEach((item, index) => {
        let itemInfo: ListItemData = new ListItemData();
        itemInfo.name = JSON.parse(item.value.value as string).name;
        itemInfo.id = index;
        listItems.push(itemInfo);
      });
      this.contactList = this.initContactList = listItems;
    });
  }

  async onSelectedIndexChange(index: number) {
    this.selectedDeviceIndex = index;
    if (index === 0) {
      this.onClose();
    } else {
      this.selectDevice();
    }
  };

  onClose(): void {
    this.deviceList = [];
    this.dialogController.close();
    this.contactDeviceManager.unregisterDeviceListCallback();
  }

  selectDevice(): void {
    if (this.contactDeviceManager.discoverList.length <= 0) {
      this.contactDeviceManager.startAbility(this.deviceList[this.selectedDeviceIndex].networkId);
    } else {
      this.contactDeviceManager.authenticateDevice(this.deviceList[this.selectedDeviceIndex], () => {
        for (let i = 0; i < this.contactDeviceManager.deviceList!.length; i++) {
          const result = this.contactDeviceManager.deviceList![i].deviceName ===
          this.deviceList[this.selectedDeviceIndex].deviceName;
          if (result) {
            this.contactDeviceManager.startAbility(this.contactDeviceManager.deviceList![i].networkId);
          }
        }
      });
    }
    this.onClose();
  }

  showDeviceDialog(): void {
    // Register a listening callback.
    // A dialog box is displayed when a device is discovered or an authenticated device is found.
    this.contactDeviceManager.registerDeviceListCallback(() => {
      this.deviceList = [];
      this.deviceList.push({
        deviceId: '0',
        deviceName: CommonConstants.LOCALHOST_NAME,
        deviceType: '0',
        networkId: ''
      });
      let deviceTempList = this.contactDeviceManager.discoverList.length > 0 ?
        this.contactDeviceManager.discoverList : this.contactDeviceManager.deviceList;
      if (deviceTempList.length) {
        deviceTempList.forEach((item) => {
          this.deviceList.push({
            deviceId: item.deviceId,
            deviceName: item.deviceName,
            deviceType: item.deviceType,
            networkId: item.networkId
          });
        });
      }
    });
    this.dialogController.open();
  }

  build() {
    Flex({ direction: FlexDirection.Column }) {
      this.NavigationTitle();
      this.ContactList();
    }
    .width('100%')
    .height('100%')
    .padding({ left: 16, right: 16 })
    .backgroundColor(Color.White)
    .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM])
  }

  @Builder
  NavigationTitle() {
    Flex({ alignItems: ItemAlign.Center }) {
      Text($r('app.string.page_title'))
        .fontSize(20)
        .fontWeight(700)
        .lineHeight(27)
        .fontColor('rgba(0, 0, 0, 0.9)')
        .flexGrow(1)

      Row() {
        SymbolGlyph($r('sys.symbol.plus'))
          .fontSize(24)
          .fontWeight(400)
      }
      .alignItems(VerticalAlign.Center)
      .justifyContent(FlexAlign.Center)
      .width(40)
      .height(40)
      .backgroundColor('rgba(0, 0, 0, 0.05)')
      .borderRadius(40)
      .margin({ right: 8 })
      .onClick(() => {
        this.getUIContext().getRouter().pushUrl({
          url: 'pages/ContactAddAndEditPage',
          params: {
            isEdit: false
          }
        }).catch((err: BusinessError) => {
          hilog.error(0x0000, 'ContactHomePage', `ContactAddAndEditPage err: ${err.code}  msg:${err.message}`);
        });
      })

      Row() {
        SymbolGlyph($r('sys.symbol.dot_grid_2x2'))
          .fontSize(24)
          .fontWeight(400)
      }
      .alignItems(VerticalAlign.Center)
      .justifyContent(FlexAlign.Center)
      .width(40)
      .height(40)
      .backgroundColor('rgba(0, 0, 0, 0.05)')
      .borderRadius(40)
      .margin({ right: 8 })
      .bindPopup(this.isShowPopup, {
        builder: this.popupBuilder,
        placement: Placement.BottomRight,
        popupColor: Color.White,
        enableArrow: false
      })
      .onClick(() => {
        this.isShowPopup = !this.isShowPopup;
      })
    }
    .height(56)
    .flexShrink(0)
  }

  @Builder
  ContactList() {
    if (!this.contactList.length) {
      this.emptyView();
    } else {
      this.dataView();
    }
  }

  @Builder
  emptyView() {
    Column() {
      Image($r('app.media.ic_empty'))
        .width($r('app.float.contact_picture_size'))
        .height($r('app.float.contact_picture_size'))
      Text($r('app.string.contacts_empty'))
        .fontSize($r('app.float.contacts_empty_size'))
        .fontColor($r('app.color.empty_font_color'))
    }
    .flexGrow(1)
    .width('100%')
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
  }

  @Builder
  dataView() {
    Flex({ direction: FlexDirection.Column }) {
      Search({ value: $$this.searchValue, placeholder: Object($r('app.string.search_contact')) })
        .width('100%')
        .height(40)
        .flexShrink(0)
        .borderRadius(24)
        .placeholderColor('rgba(0, 0, 0, 0.6)')
        .placeholderFont({
          size: 16,
          weight: 400,
        })
        .textFont({ size: 16 })
        .padding({
          top: 9,
          right: 12,
          bottom: 9,
          left: 12
        })
        .onChange((searchValue: string) => {
          if (searchValue === '') {
            this.contactList = this.initContactList;
          }
        })
        .onSubmit((searchValue: string) => {
          const filterArr = this.contactList.filter((item) => item.name === searchValue);
          if (filterArr.length > 0) {
            this.contactList = filterArr;
          } else {
            try {
              this.uiContext!.getPromptAction().showToast({
                message: $r('app.string.no_matching_data'),
                duration: CommonConstants.PROMPT_DURATION,
              });
            } catch (error) {
              hilog.error(0x0000, 'ContactHomePage', `have error .Code:${error.code},message: ${error.message}`);
            }
          }
        })
      Column() {
        List() {
          ForEach(this.contactList, (item: ListItemData) => {
            ListItem() {
              ContactListItem({ itemInfo: item })
            }
            .onClick(() => {
              const contactsKey = CommonConstants.CONTACTS_DATABASE_KEY + item.name;
              this.getUIContext().getRouter().pushUrl({
                url: 'pages/ContactDetailPage',
                params: {
                  key: contactsKey,
                },
              }).catch((err: BusinessError) => {
                hilog.error(0x0000, 'ContactHomePage', `ContactAddAndEditPage err: ${err.code}  msg:${err.message}`);
              });
            })
          }, (item: ListItemData) => JSON.stringify(item))
        }
        .scrollBar(BarState.Off)
        .width('100%')
        .height('100%')
        .margin({ bottom: $r('app.float.list_area_height') })
      }
      .width('100%')
      .flexGrow(1)
    }
    .width('100%')
    .flexGrow(1)
    .margin({ top: 8 })
  }

  @Builder
  popupBuilder() {
    Column() {
      Text($r('app.string.delete_batch'))
        .fontSize($r('app.float.popup_font_size'))
        .padding({
          top: $r('app.float.delete_padding_vertical'),
          bottom: $r('app.float.delete_padding_vertical'),
          left: $r('app.float.delete_padding_left')
        })
        .width('100%')
        .onClick(() => {
          this.getUIContext().getRouter().pushUrl({
            url: 'pages/ContactDeletePage'
          }).catch((err: BusinessError) => {
            hilog.error(0x0000, 'ContactHomePage', `ContactAddAndEditPage err: ${err.code}  msg:${err.message}`);
          });
        })
      Divider()
        .height($r('app.float.divider_height'))
        .backgroundColor($r('app.color.list_divider'))
        .margin({
          left: $r('app.float.delete_padding_left'),
          right: $r('app.float.delete_padding_left')
        })
      Text($r('app.string.connection_device'))
        .width('100%')
        .fontSize($r('app.float.popup_font_size'))
        .padding({
          top: $r('app.float.delete_padding_vertical'),
          bottom: $r('app.float.delete_padding_vertical'),
          left: $r('app.float.delete_padding_left')
        })
        .onClick(() => {
          this.isShowPopup = !this.isShowPopup;
          this.showDeviceDialog();
        })
    }
    .width($r('app.float.popup_width'))
    .height($r('app.float.popup_height'))
    .alignItems(HorizontalAlign.Start)
  }
}