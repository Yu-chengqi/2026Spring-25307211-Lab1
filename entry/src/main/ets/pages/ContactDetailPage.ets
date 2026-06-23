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

import { hilog } from '@kit.PerformanceAnalysisKit';
import { BusinessError } from '@kit.BasicServicesKit';
import ContactDetailItem from '../components/ContactDetailItem';
import { ContactData } from '../viewmodel/ContactViewModel';
import { KvManager } from '../utils/KvManager';
import { ContactDeleteDialog } from '../components/ContactDeleteDialog';
import CommonConstants from '../common/CommonConstants';

@Entry
@Component
struct ContractDetailPage {
  @State uiContext: UIContext | undefined = AppStorage.get('uiContext');
  @State name: string = '';
  @State telephony: string = '';
  @State email: string = '';
  @State remarks: string = '';
  @State address: string = '';
  @State groupName: string = ''; // 分组名称
  @State birthday: string = ''; // 联系人生日
  kvManager = AppStorage.get('kvManager') as KvManager;
  dialogController: CustomDialogController = new CustomDialogController({
    builder: ContactDeleteDialog({
      cancel: () => {
        this.onCancel();
      },
      confirm: () => {
        this.onConfirm();
      },
      promptMessage: $r('app.string.tip_delete'),
    }),
    autoCancel: true,
    alignment: DialogAlignment.Center,
    customStyle: true
  });

  // Close the pop-up window.
  onCancel() {
    try {
      this.getUIContext().getPromptAction().showToast({
        message: $r('app.string.delete_cancel_text'),
        duration: CommonConstants.PROMPT_DURATION
      });
      this.dialogController.close();
    } catch (error) {
      hilog.error(0x0000, 'ContactDetailPage', `delete_cancel_text err: ${error.code}  msg:${error.message}`);
    }
  }

  // Confirm the cancellation of transcoding.
  onConfirm() {
    let contactsKey = CommonConstants.CONTACTS_DATABASE_KEY + this.name;
    this.kvManager.deleteOnce(contactsKey, () => {
      try {
        this.getUIContext().getPromptAction().showToast({
          message: $r('app.string.prompt_message_deleted'),
          duration: CommonConstants.PROMPT_DURATION
        });
      } catch (error) {
        hilog.error(0x0000, 'ContactDetailPage', `prompt_message_deleted err: ${error.code}  msg:${error.message}`);
      }
      this.getUIContext().getRouter().pushUrl({
        url: CommonConstants.LIST_PAGE_URL
      }).catch((err: BusinessError) => {
        hilog.error(0x0000, 'ContactDetailPage', `LIST_PAGE_URL err: ${err.code}  msg:${err.message}`);
      });
    });
    this.dialogController.close();
  }

  onPageShow(): void {
    let params = this.getUIContext().getRouter().getParams() as Record<string, Object>;
    if (params && params.key) {
      this.initializeData(params.key as string);
    }
  }

  /**
   * Initialize detail page data.
   */
  initializeData(key: string): void {
    // Get contact details.
    this.kvManager.getDetails(key, (err: BusinessError, data) => {
      if (err) {
        hilog.error(0x0000, 'ContactDetailPage', `DetailPage.ets Fail to get: ${err.code}  msg:${err.message}`);
        return;
      }
      let contactsData: ContactData = JSON.parse(data as string);
      this.name = contactsData.name as string;
      this.address = contactsData.address as string;
      this.telephony = contactsData.telephony as string;
      this.email = contactsData.email as string;
      this.remarks = contactsData.remarks as string;
      // 解析分组名称，兼容旧数据
      this.groupName = contactsData.groupName || '';
      // 解析生日信息，兼容旧数据
      this.birthday = contactsData.birthday || '';
    });
  }

  onBackPress() {
    this.uiContext?.getRouter().clear();
    try {
      this.uiContext?.getRouter().replaceUrl(
        { url: "pages/ContactHomePage" }
      ).catch((error: BusinessError) => {
        hilog.error(0x0000, 'ContactDetailPage', `have error .Code:${error.code},message: ${error.message}`);
      });
      return true;
    } catch (error) {
      hilog.error(0x0000, 'ContactDetailPage', `have error .Code:${error.code},message: ${error.message}`);
      return true;
    }
  }

  build() {
    Column() {
      this.NavigationTitle();
      this.RankList();
    }
    .width('100%')
    .height('100%')
    .padding({ left: 16, right: 16 })
    .backgroundColor($r('app.color.detail_page_background'))
    .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM])
  }

  @Builder
  NavigationTitle() {
    Flex({ alignItems: ItemAlign.Center }) {
      Row() {
        SymbolGlyph($r('sys.symbol.chevron_backward'))
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
        this.getUIContext().getRouter().back();
      })

      Blank()
        .flexGrow(1)
      Row() {
        SymbolGlyph($r('sys.symbol.square_and_pencil'))
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
        let params = this.getUIContext().getRouter().getParams() as Record<string, Object>;
        this.getUIContext().getRouter().pushUrl({
          url: 'pages/ContactAddAndEditPage',
          params: {
            key: params.key as string,
            isEdit: true,
            name: this.name,
            address: this.address,
            telephony: this.telephony,
            email: this.email,
            remarks: this.remarks,
            groupName: this.groupName,
            birthday: this.birthday
          }
        }).catch((error: BusinessError) => {
          hilog.error(0x0000, 'ContactDetailPage', `have error .Code:${error.code},message: ${error.message}`);
        });
      })

      Row() {
        SymbolGlyph($r('sys.symbol.trash'))
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
        this.dialogController.open();
      })
    }
    .height(56)
  }

  @Builder
  RankList() {
    Column() {
      Row() {
        SymbolGlyph($r('sys.symbol.person_crop_circle_fill_1'))
          .fontSize(122)
          .fontColor(['#D1D1D6'])
      }
      .margin({ top: 32 })

      Text(this.name)
        .fontColor('rgba(0, 0, 0, 0.6)')
        .fontSize(38)
        .fontWeight(700)
        .margin({ top: 32 })

      // 显示分组标签
      if (this.groupName && this.groupName !== '') {
        Text(this.groupName)
          .fontSize(14)
          .fontColor('#0A59F7')
          .fontWeight(500)
          .margin({ top: 8 })
          .padding({ left: 12, right: 12, top: 4, bottom: 4 })
          .backgroundColor('rgba(10, 89, 247, 0.1)')
          .borderRadius(8)
      }

      // 显示生日信息
      if (this.birthday && this.birthday !== '') {
        Row() {
          SymbolGlyph($r('sys.symbol.cake'))
            .fontSize(16)
            .fontColor(['#FF6B6B'])
          Text(this.birthday)
            .fontSize(14)
            .fontColor('#FF6B6B')
            .fontWeight(500)
            .margin({ left: 6 })
        }
        .margin({ top: 8 })
        .padding({ left: 12, right: 12, top: 4, bottom: 4 })
        .backgroundColor('rgba(255, 107, 107, 0.1)')
        .borderRadius(8)
      }

      Row() {
        Row() {
          SymbolGlyph($r('sys.symbol.phone_fill'))
            .fontSize(26)
            .fontColor([Color.White])
        }
        .alignItems(VerticalAlign.Center)
        .justifyContent(FlexAlign.Center)
        .width(56)
        .height(56)
        .backgroundColor('#C4C4C4')
        .borderRadius('50%')

        Row() {
          SymbolGlyph($r('sys.symbol.message_fill'))
            .fontSize(26)
            .fontColor([Color.White])
        }
        .alignItems(VerticalAlign.Center)
        .justifyContent(FlexAlign.Center)
        .width(56)
        .height(56)
        .backgroundColor('#C4C4C4')
        .borderRadius('50%')
      }
      .width('100%')
      .margin({ top: 28 })
      .padding({ left: 84, right: 84 })
      .justifyContent(FlexAlign.SpaceBetween)

      Column() {
        ContactDetailItem({
          topContent: this.telephony,
          bottomContent: $r('app.string.edit_item_phone')
        })
        ContactDetailItem({
          topContent: this.email,
          bottomContent: $r('app.string.edit_item_email')
        })
        ContactDetailItem({
          topContent: this.remarks,
          bottomContent: $r('app.string.edit_item_note')
        })
      }
      .margin({ top: 28 })
      .width('100%')
    }
    .width('100%')
  }
}