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
  // 分组筛选相关状态变量
  @State selectedGroupIndex: number = 0; // 当前选中的分组索引，0表示全部
  private groupOptions: string[] = ['全部', '家人', '朋友', '同事']; // 分组选项
  // Select 组件选项数据
  private selectOptions: Array<SelectOption> = [
    { value: '全部' },
    { value: '家人' },
    { value: '朋友' },
    { value: '同事' }
  ];
  // 生日提醒相关状态变量
  @State birthdayReminders: Array<ListItemData> = []; // 未来7天内过生日的联系人列表
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
    console.log('[BirthdayDebug] getAllData: 开始获取所有联系人数据...');
    this.kvManager.getEntries(CommonConstants.CONTACTS_DATABASE_KEY, (
      err: BusinessError,
      entries: distributedKVStore.Entry[]) => {
      hilog.info(0x0000, 'ContactHomePage', `getAllData entries: ${JSON.stringify(entries)}`);
      console.log(`[BirthdayDebug] getAllData回调: entries数量=${entries.length}, err=${err ? '有错误' : '无错误'}`);
      if (err) {
        hilog.error(0x0000, 'ContactHomePage', `Fail to get Entries: ${err.code}  msg:${err.message}`);
        return;
      }
      let listItems: Array<ListItemData> = [];
      entries.forEach((item, index) => {
        let itemInfo: ListItemData = new ListItemData();
        let contactData = JSON.parse(item.value.value as string) as Record<string, string>;
        itemInfo.name = contactData.name;
        // 解析分组名称字段，兼容旧数据（无groupName字段时默认为空）
        itemInfo.groupName = contactData.groupName || '';
        // 解析生日字段，兼容旧数据（无birthday字段时默认为空）
        itemInfo.birthday = contactData.birthday || '';
        itemInfo.id = index;
        listItems.push(itemInfo);
        // 打印每个联系人的生日信息
        if (itemInfo.birthday) {
          console.log(`[BirthdayDebug] 联系人: ${itemInfo.name}, 生日: ${itemInfo.birthday}`);
        }
      });
      this.initContactList = listItems;
      console.log(`[BirthdayDebug] initContactList已更新, 数量: ${this.initContactList.length}`);
      // 根据当前选中的分组进行过滤
      this.filterContactsByGroup();
      // 加载生日提醒数据（在联系人数据加载完成后调用）
      this.loadBirthdayReminders();
    });
  }

  /**
   * 加载未来7天内过生日的联系人列表
   * 在数据加载完成后调用，确保UI能正确刷新
   */
  loadBirthdayReminders(): void {
    console.log('[BirthdayDebug] loadBirthdayReminders: 开始加载生日提醒数据...');
    hilog.info(0x0000, 'ContactHomePage', `loadBirthdayReminders: start loading...`);
    this.kvManager.getUpcomingBirthdays(CommonConstants.CONTACTS_DATABASE_KEY, (
      err: BusinessError,
      entries: distributedKVStore.Entry[]) => {
      if (err) {
        console.error(`[BirthdayDebug] 获取生日数据失败: code=${err.code}, msg=${err.message}`);
        hilog.error(0x0000, 'ContactHomePage', `Fail to get upcoming birthdays: ${err.code}  msg:${err.message}`);
        return;
      }
      console.log(`[BirthdayDebug] 筛选返回的条目数量: ${entries.length}`);
      let reminders: Array<ListItemData> = [];
      entries.forEach((item, index) => {
        let itemInfo: ListItemData = new ListItemData();
        let contactData = JSON.parse(item.value.value as string) as Record<string, string>;
        itemInfo.name = contactData.name;
        itemInfo.groupName = contactData.groupName || '';
        itemInfo.birthday = contactData.birthday || '';
        itemInfo.id = index;
        reminders.push(itemInfo);
        console.log(`[BirthdayDebug] 添加生日提醒: name=${itemInfo.name}, birthday=${itemInfo.birthday}`);
      });
      // 更新状态数组，触发UI刷新
      this.birthdayReminders = reminders;
      // 控制台打印birthdayReminders数组长度，用于调试筛选逻辑是否生效
      console.log(`[BirthdayDebug] birthdayReminders数组长度: ${this.birthdayReminders.length}`);
      console.log(`[BirthdayDebug] birthdayReminders内容: [${this.birthdayReminders.map(r => `${r.name}(${r.birthday})`).join(', ')}]`);
      hilog.info(0x0000, 'ContactHomePage', `loadBirthdayReminders: birthdayReminders.length=${this.birthdayReminders.length}, names=[${this.birthdayReminders.map(r => r.name).join(', ')}]`);
    });
  }

  /**
   * 根据选中的分组过滤联系人列表
   */
  filterContactsByGroup(): void {
    if (this.selectedGroupIndex === 0) {
      // 选择"全部"时，显示所有联系人
      this.contactList = this.initContactList;
    } else {
      // 根据分组名称过滤
      const selectedGroup = this.groupOptions[this.selectedGroupIndex];
      this.contactList = this.initContactList.filter((item) => item.groupName === selectedGroup);
    }
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
    Column() {
      this.NavigationTitle();
      // 生日提醒横幅（仅当有近期生日时显示）
      // 渲染位置：在分组筛选上方，不会被列表遮挡
      if (this.birthdayReminders.length > 0) {
        this.BirthdayReminderBanner();
      }
      // 添加分组筛选 Picker 下拉选择器
      this.GroupPicker();
      this.ContactList();
    }
    .width('100%')
    .height('100%')
    .padding({ left: 16, right: 16 })
    .backgroundColor(Color.White)
    .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM])
  }

  /**
   * 分组筛选下拉选择器
   */
  @Builder
  GroupPicker() {
    Row() {
      Text('分组筛选：')
        .fontSize(14)
        .fontColor('rgba(0, 0, 0, 0.6)')
      Select(this.selectOptions)
        .selected(this.selectedGroupIndex)
        .value(this.groupOptions[this.selectedGroupIndex])
        .font({ size: 14 })
        .fontColor('rgba(0, 0, 0, 0.9)')
        .selectedOptionFont({ size: 14 })
        .optionFont({ size: 14 })
        .onSelect((index: number) => {
          this.selectedGroupIndex = index;
          // 切换分组时重新过滤联系人列表
          this.filterContactsByGroup();
        })
        .width(120)
        .height(40)
        .backgroundColor('rgba(0, 0, 0, 0.05)')
        .borderRadius(8)
    }
    .width('100%')
    .margin({ top: 8, bottom: 8 })
    .justifyContent(FlexAlign.Start)
  }

  /**
   * 生日提醒横幅组件
   * 显示未来7天内过生日的联系人，横向滚动展示
   */
  @Builder
  BirthdayReminderBanner() {
    Column() {
      Row() {
        SymbolGlyph($r('sys.symbol.cake_fill'))
          .fontSize(18)
          .fontColor(['#FF6B6B'])
        Text('生日提醒')
          .fontSize(14)
          .fontColor('#FF6B6B')
          .fontWeight(500)
          .margin({ left: 6 })
      }
      .width('100%')
      .margin({ bottom: 8 })

      // 横向滚动的生日提醒列表
      Scroll() {
        Row({ space: 12 }) {
          ForEach(this.birthdayReminders, (item: ListItemData) => {
            this.BirthdayReminderItem(item);
          }, (item: ListItemData) => item.name)
        }
        .padding({ right: 16 })
      }
      .scrollBar(BarState.Off)
      .layoutWeight(1) // 占满剩余宽度
    }
    .width('100%')
    .padding({ left: 16, top: 12, bottom: 12, right: 16 })
    .margin({ top: 8 })
    .backgroundColor('rgba(255, 107, 107, 0.08)')
    .borderRadius(12)
  }

  /**
   * 单个生日提醒项组件
   */
  @Builder
  BirthdayReminderItem(item: ListItemData) {
    Row() {
      SymbolGlyph($r('sys.symbol.person_crop_circle_fill'))
        .fontSize(32)
        .fontColor(['#FFB3B3'])
      Column() {
        Text(item.name)
          .fontSize(14)
          .fontColor('rgba(0, 0, 0, 0.9)')
          .fontWeight(500)
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
        if (item.birthday) {
          Text(this.formatBirthdayDisplay(item.birthday))
            .fontSize(12)
            .fontColor('#FF6B6B')
            .margin({ top: 2 })
        }
      }
      .alignItems(HorizontalAlign.Start)
      .margin({ left: 8 })
      .layoutWeight(1)
    }
    .padding({ left: 12, right: 12, top: 8, bottom: 8 })
    .backgroundColor(Color.White)
    .borderRadius(8)
    .shadow({ radius: 2, color: 'rgba(0, 0, 0, 0.1)', offsetX: 0, offsetY: 1 })
    .onClick(() => {
      const contactsKey = CommonConstants.CONTACTS_DATABASE_KEY + item.name;
      this.getUIContext().getRouter().pushUrl({
        url: 'pages/ContactDetailPage',
        params: {
          key: contactsKey,
        },
      }).catch((err: BusinessError) => {
        hilog.error(0x0000, 'ContactHomePage', `BirthdayReminderItem err: ${err.code}  msg:${err.message}`);
      });
    })
  }

  /**
   * 格式化生日显示文本（计算距离生日的天数）
   * 生日格式为 MM-DD，只对比月日，忽略年份
   */
  formatBirthdayDisplay(birthday: string): string {
    try {
      const today = new Date();
      const currentYear = today.getFullYear();
      // 解析生日（格式：MM-DD）
      const birthdayParts = birthday.split('-');
      if (birthdayParts.length !== 2) {
        return birthday;
      }
      const birthMonth = parseInt(birthdayParts[0]) - 1; // 月份从0开始
      const birthDay = parseInt(birthdayParts[1]);
      // 计算今年的生日日期
      let birthdayThisYear = new Date(currentYear, birthMonth, birthDay);
      // 如果今年的生日已过，计算明年的生日
      if (birthdayThisYear < today) {
        birthdayThisYear = new Date(currentYear + 1, birthMonth, birthDay);
      }
      const diffTime = birthdayThisYear.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 0) {
        return '今天生日';
      } else if (diffDays === 1) {
        return '明天生日';
      } else {
        return `${diffDays}天后生日`;
      }
    } catch (err) {
      return birthday;
    }
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